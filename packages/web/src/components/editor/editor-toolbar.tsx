import { $createImageNode, ImageNode, ImagePayload } from './nodes/image-node';
import { $createCodeNode, $isCodeNode, getCodeLanguages, getDefaultCodeLanguage } from '@lexical/code';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
import { $isAtNodeEnd, $isParentElementRTL, $wrapNodes } from '@lexical/selection';
import { $getNearestNodeOfType, $wrapNodeInElement, mergeRegister } from '@lexical/utils';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Select,
  SelectItem,
} from '@nextui-org/react';
import {
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_EDITOR,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalCommand,
  PASTE_COMMAND,
  PasteCommandType,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  createCommand,
} from 'lexical';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuChevronDown,
  LuCode,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuQuote,
  LuRedo,
  LuStrikethrough,
  LuUnderline,
  LuUndo,
} from 'react-icons/lu';

const LowPriority = 1;

const supportedBlockTypes = new Set(['paragraph', 'quote', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol']);

const blockTypeToBlockName = {
  code: 'Code Block',
  h1: 'Large Heading',
  h2: 'Small Heading',
  h3: 'Heading',
  h4: 'Heading',
  h5: 'Heading',
  ol: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
  ul: 'Bulleted List',
};

const blockTypeToIcon = {
  code: <LuCode aria-hidden />,
  h1: <LuHeading1 aria-hidden />,
  h2: <LuHeading2 aria-hidden />,
  h3: <LuHeading3 aria-hidden />,
  h4: <LuHeading4 aria-hidden />,
  h5: <LuHeading5 aria-hidden />,
  ol: <LuListOrdered aria-hidden />,
  ul: <LuList aria-hidden />,
  paragraph: <LuAlignLeft aria-hidden />,
  quote: <LuQuote aria-hidden />,
};

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> = createCommand('INSERT_IMAGE_COMMAND');

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.position = 'absolute';
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.scrollY + 10}px`;
    editor.style.left = `${rect.left - editor.offsetWidth / 2 + rect.width / 2}px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <Card ref={editorRef} className="z-20">
      <CardBody>
        {isEditMode ? (
          <Input
            ref={inputRef}
            value={linkUrl}
            size="sm"
            onChange={(event) => {
              setLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (lastSelection !== null) {
                  if (linkUrl !== '') {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                  }
                  setEditMode(false);
                }
              } else if (event.key === 'Escape') {
                event.preventDefault();
                setEditMode(false);
              }
            }}
          />
        ) : (
          <>
            <div className="flex items-center space-x-4">
              <Link href={linkUrl} target="_blank" rel="noopener noreferrer">
                {linkUrl}
              </Link>
              <Button
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setEditMode(true);
                }}
              >
                Edit
              </Button>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({ editor, blockType, toolbarRef, setShowBlockOptionsDropDown }) {
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h1'));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode('h2'));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatUnorderedList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatOrderedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <DropdownMenu>
      <DropdownItem key="paragraph" onClick={formatParagraph}>
        <span className="flex items-center gap-x-2">{blockTypeToIcon['paragraph']} Paragraph</span>
      </DropdownItem>
      <DropdownItem key="h1" onClick={formatLargeHeading}>
        <span className="flex items-center gap-x-2">{blockTypeToIcon['h1']} Large Heading</span>
      </DropdownItem>
      <DropdownItem key="h2" onClick={formatSmallHeading}>
        <span className="flex items-center gap-x-2">{blockTypeToIcon['h2']} Small Heading</span>
      </DropdownItem>
      <DropdownItem key="ul" onClick={formatUnorderedList}>
        <span className="flex items-center gap-x-2">{blockTypeToIcon['ul']} Unordered List</span>
      </DropdownItem>
      <DropdownItem key="ol" onClick={formatOrderedList}>
        <span className="flex items-center gap-x-2">{blockTypeToIcon['ol']} Unordered List</span>
      </DropdownItem>
      <DropdownItem key="quote" onClick={formatQuote}>
        <span className="flex items-center gap-x-2">{blockTypeToIcon['quote']} Quote</span>
      </DropdownItem>
      {/* <DropdownItem key="code" onClick={formatCode}>
        <span className="flex items-center gap-x-2">{blockTypeToIcon['code']} Code Block</span>
      </DropdownItem> */}
    </DropdownMenu>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const codeLanguages = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  // editor.registerCommand<PasteCommandType>(
  //   PASTE_COMMAND,
  //   (event) => {
  //     console.log(event);
  //     const pasted = (event as ClipboardEvent)?.clipboardData?.getData('text/plain');
  //     if (pasted) {
  //       editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src: pasted, altText: 'alt' });
  //       return true;
  //     }

  //     return false;
  //   },
  //   1,
  // );

  // useEffect(() => {
  //   if (!editor.hasNodes([ImageNode])) {
  //     throw new Error('ImagesPlugin: ImageNode not registered on editor');
  //   }

  //   return mergeRegister(
  //     editor.registerCommand<InsertImagePayload>(
  //       INSERT_IMAGE_COMMAND,
  //       (payload) => {
  //         const imageNode = $createImageNode(payload);
  //         $insertNodes([imageNode]);
  //         if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
  //           $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
  //         }

  //         return true;
  //       },
  //       COMMAND_PRIORITY_EDITOR,
  //     ),
  //   );
  // }, [editor]);

  return (
    <div
      className="sticky top-0 z-10  bg-gradient-to-b from-background via-background to-transparent py-16"
      ref={toolbarRef}
    >
      <span className="flex items-center justify-between opacity-50 transition-opacity hover:opacity-100">
        <ButtonGroup>
          <Button
            isDisabled={!canUndo}
            onClick={() => {
              editor.dispatchCommand(UNDO_COMMAND, undefined);
            }}
            isIconOnly
          >
            <LuUndo aria-label="Undo" />
          </Button>
          <Button
            isDisabled={!canRedo}
            onClick={() => {
              editor.dispatchCommand(REDO_COMMAND, undefined);
            }}
            aria-label="Redo"
            isIconOnly
          >
            <LuRedo />
          </Button>
        </ButtonGroup>

        {supportedBlockTypes.has(blockType) && (
          <span className="w-[170px]">
            <Dropdown>
              <DropdownTrigger>
                <Button
                  onClick={() => setShowBlockOptionsDropDown(!showBlockOptionsDropDown)}
                  aria-label="Formatting Options"
                  fullWidth
                  className="flex justify-between"
                >
                  <span className="flex items-center gap-x-1 break-words">
                    {blockTypeToIcon[blockType]} {blockTypeToBlockName[blockType]}
                  </span>
                  <LuChevronDown />
                </Button>
              </DropdownTrigger>

              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />
            </Dropdown>
          </span>
        )}
        {blockType === 'code' ? (
          // <Dropdown onChange={onCodeLanguageSelect}>
          //   <DropdownTrigger>
          //     <Button>Language</Button>
          //   </DropdownTrigger>
          //   <DropdownMenu items={codeLanguages}>
          //     {(language) => <DropdownItem key={language} value={language}>{language</DropdownItem>}
          //   </DropdownMenu>
          // </Dropdown>
          <Select value={codeLanguage} onChange={onCodeLanguageSelect} label="Language" size="sm">
            {codeLanguages.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </Select>
        ) : (
          <>
            <ButtonGroup>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                aria-label="Format Bold"
                color={isBold ? 'primary' : 'default'}
                isIconOnly
              >
                <LuBold />
              </Button>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                aria-label="Format Italics"
                color={isItalic ? 'primary' : 'default'}
                isIconOnly
              >
                <LuItalic />
              </Button>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                aria-label="Format Underline"
                color={isUnderline ? 'primary' : 'default'}
                isIconOnly
              >
                <LuUnderline />
              </Button>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                aria-label="Format Strikethrough"
                color={isStrikethrough ? 'primary' : 'default'}
                isIconOnly
              >
                <LuStrikethrough />
              </Button>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
                }}
                aria-label="Insert Code"
                color={isCode ? 'primary' : 'default'}
                isIconOnly
              >
                <LuCode />
              </Button>
              <Button onClick={insertLink} aria-label="Insert Link" color={isLink ? 'primary' : 'default'} isIconOnly>
                <LuLink />
              </Button>
            </ButtonGroup>
            {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
            <ButtonGroup>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                aria-label="Left Align"
                isIconOnly
              >
                <LuAlignLeft />
              </Button>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                aria-label="Center Align"
                isIconOnly
              >
                <LuAlignCenter />
              </Button>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
                aria-label="Right Align"
                isIconOnly
              >
                <LuAlignRight />
              </Button>
              <Button
                onClick={() => {
                  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }}
                aria-label="Justify Align"
                isIconOnly
              >
                <LuAlignJustify />
              </Button>
            </ButtonGroup>
          </>
        )}
      </span>
    </div>
  );
}
