/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code'
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link'
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list'
import { INSERT_EMBED_COMMAND } from '@lexical/react/LexicalAutoEmbedPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode'
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode'
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, $isQuoteNode, HeadingTagType } from '@lexical/rich-text'
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from '@lexical/selection'
import { $isTableNode } from '@lexical/table'
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils'
import {
  Button,
  ButtonGroup,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  useDisclosure,
} from '@nextui-org/react'
import {
  $INTERNAL_isPointSelection,
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  LexicalEditor,
  NodeKey,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from 'lexical'
import { Dispatch, useCallback, useEffect, useState } from 'react'
import * as React from 'react'
import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuCheckSquare,
  LuChevronDown,
  LuCode,
  LuColumns,
  LuDiff,
  LuFileImage,
  LuFlipVertical,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuImage,
  LuIndent,
  LuItalic,
  LuLink,
  LuList,
  LuListOrdered,
  LuOutdent,
  LuPlus,
  LuQuote,
  LuRedo,
  LuStrikethrough,
  LuSubscript,
  LuSuperscript,
  LuTrash,
  LuUnderline,
  LuUndo,
} from 'react-icons/lu'

import { IS_APPLE } from '../../utils/environment'
import { getSelectedNode } from '../../utils/getSelectedNode'
import { sanitizeUrl } from '../../utils/url'

import useModal from '../../hooks/useModal'

import { EmbedConfigs } from '../AutoEmbedPlugin'
import { InsertEquationDialog } from '../EquationsPlugin'
import { INSERT_IMAGE_COMMAND, InsertImageDialog, InsertImagePayload } from '../ImagesPlugin'
import InsertLayoutDialog from '../LayoutPlugin/InsertLayoutDialog'

const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
}

const blockTypeToIcon = {
  code: <LuCode aria-hidden />,
  h1: <LuHeading1 aria-hidden />,
  h2: <LuHeading2 aria-hidden />,
  h3: <LuHeading3 aria-hidden />,
  h4: <LuHeading4 aria-hidden />,
  h5: <LuHeading5 aria-hidden />,
  h6: <LuHeading6 aria-hidden />,
  number: <LuListOrdered aria-hidden />,
  bullet: <LuList aria-hidden />,
  check: <LuCheckSquare aria-hidden />,
  paragraph: <LuAlignLeft aria-hidden />,
  quote: <LuQuote aria-hidden />,
}

const rootTypeToRootName = {
  root: 'Root',
  table: 'Table',
}

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = []

  for (const [lang, friendlyName] of Object.entries(CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
    options.push([lang, friendlyName])
  }

  return options
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions()

const FONT_FAMILY_OPTIONS: [string, string][] = [
  ['Arial', 'Arial'],
  ['Courier New', 'Courier New'],
  ['Georgia', 'Georgia'],
  ['Times New Roman', 'Times New Roman'],
  ['Trebuchet MS', 'Trebuchet MS'],
  ['Verdana', 'Verdana'],
]

const FONT_SIZE_OPTIONS: [string, string][] = [
  ['10px', '10px'],
  ['11px', '11px'],
  ['12px', '12px'],
  ['13px', '13px'],
  ['14px', '14px'],
  ['15px', '15px'],
  ['16px', '16px'],
  ['17px', '17px'],
  ['18px', '18px'],
  ['19px', '19px'],
  ['20px', '20px'],
]

function BlockFormatDropdown({
  editor,
  blockType,
  rootType,
  disabled = false,
}: {
  blockType: keyof typeof blockTypeToBlockName
  rootType: keyof typeof rootTypeToRootName
  editor: LexicalEditor
  disabled?: boolean
}): JSX.Element {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection()
      if ($INTERNAL_isPointSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode())
      }
    })
  }

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection()
        if ($INTERNAL_isPointSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize))
        }
      })
    }
  }

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
    }
  }

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection()
        if ($INTERNAL_isPointSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode())
        }
      })
    }
  }

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection()

        if ($INTERNAL_isPointSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode())
          } else {
            const textContent = selection.getTextContent()
            const codeNode = $createCodeNode()
            selection.insertNodes([codeNode])
            selection = $getSelection()
            if ($isRangeSelection(selection)) selection.insertRawText(textContent)
          }
        }
      })
    }
  }

  return (
    <Dropdown isDisabled={disabled}>
      <DropdownTrigger>
        <Button className="">
          <span className="flex items-center gap-x-1 break-words">
            {blockTypeToIcon[blockType]} {blockTypeToBlockName[blockType]}
          </span>
          <LuChevronDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="paragraph" onClick={formatParagraph}>
          <span className="flex items-center gap-x-2">
            {blockTypeToIcon['paragraph']} {blockTypeToBlockName['paragraph']}
          </span>
        </DropdownItem>
        <DropdownItem key="h1" onClick={() => formatHeading('h1')}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['h1']} Heading 1</span>
        </DropdownItem>
        <DropdownItem key="h2" onClick={() => formatHeading('h2')}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['h2']} Heading 2</span>
        </DropdownItem>
        <DropdownItem key="h2" onClick={() => formatHeading('h3')}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['h2']} Heading 3</span>
        </DropdownItem>
        <DropdownItem key="ul" onClick={formatBulletList}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['bullet']} Bulleted List</span>
        </DropdownItem>
        <DropdownItem key="ol" onClick={formatNumberedList}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['number']} Numbered List</span>
        </DropdownItem>
        <DropdownItem key="cl" onClick={formatCheckList}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['check']} Check List</span>
        </DropdownItem>
        <DropdownItem key="quote" onClick={formatQuote}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['quote']} Quote</span>
        </DropdownItem>
        <DropdownItem key="quote" onClick={formatCode}>
          <span className="flex items-center gap-x-2">{blockTypeToIcon['code']} Code</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

const ELEMENT_FORMAT_OPTIONS: {
  [key in Exclude<ElementFormatType, ''>]: {
    icon: React.ReactElement
    iconRTL: React.ReactElement
    name: string
  }
} = {
  center: {
    icon: <LuAlignCenter aria-hidden />,
    iconRTL: <LuAlignCenter aria-hidden />,
    name: 'Center Align',
  },
  end: {
    icon: <LuAlignRight aria-hidden />,
    iconRTL: <LuAlignLeft aria-hidden />,
    name: 'End Align',
  },
  justify: {
    icon: <LuAlignJustify aria-hidden />,
    iconRTL: <LuAlignJustify aria-hidden />,
    name: 'Justify Align',
  },
  left: {
    icon: <LuAlignLeft aria-hidden />,
    iconRTL: <LuAlignRight aria-hidden />,
    name: 'Left Align',
  },
  right: {
    icon: <LuAlignRight aria-hidden />,
    iconRTL: <LuAlignLeft aria-hidden />,
    name: 'Right Align',
  },
  start: {
    icon: <LuAlignLeft aria-hidden />,
    iconRTL: <LuAlignRight aria-hidden />,
    name: 'Start Align',
  },
}

function ElementFormatDropdown({
  editor,
  value,
  isRTL,
  disabled = false,
}: {
  editor: LexicalEditor
  value: ElementFormatType
  isRTL: boolean
  disabled: boolean
}) {
  const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left']

  return (
    <Dropdown isDisabled={disabled}>
      <DropdownTrigger>
        <Button aria-label="Formatting options for text alignment">
          <span className="flex items-center gap-x-1 break-words">
            {formatOption.icon} {formatOption.name}
          </span>
          <LuChevronDown />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
          }}
        >
          <span className="flex items-center gap-x-1 break-words">
            {isRTL ? ELEMENT_FORMAT_OPTIONS.left.iconRTL : ELEMENT_FORMAT_OPTIONS.left.icon}
            {ELEMENT_FORMAT_OPTIONS.left.name}
          </span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }}
        >
          <span className="flex items-center gap-x-1 break-words">
            {ELEMENT_FORMAT_OPTIONS.center.icon}
            {ELEMENT_FORMAT_OPTIONS.center.name}
          </span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }}
        >
          <span className="flex items-center gap-x-1 break-words">
            {isRTL ? ELEMENT_FORMAT_OPTIONS.right.iconRTL : ELEMENT_FORMAT_OPTIONS.right.icon}
            {ELEMENT_FORMAT_OPTIONS.right.name}
          </span>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }}
        >
          <span className="flex items-center gap-x-1 break-words">
            {ELEMENT_FORMAT_OPTIONS.justify.icon}
            {ELEMENT_FORMAT_OPTIONS.justify.name}
          </span>
        </DropdownItem>
        <DropdownSection>
          <DropdownItem
            onClick={() => {
              editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
            }}
          >
            <span className="flex items-center gap-x-1 break-words">
              <LuOutdent aria-hidden />
              Outdent
            </span>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
            }}
          >
            <span className="flex items-center gap-x-1 break-words">
              <LuIndent aria-hidden />
              Indent
            </span>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}

export default function ToolbarPlugin({ setIsLinkEditMode }: { setIsLinkEditMode: Dispatch<boolean> }): JSX.Element {
  const [editor] = useLexicalComposerContext()
  const [activeEditor, setActiveEditor] = useState(editor)
  const [blockType, setBlockType] = useState<keyof typeof blockTypeToBlockName>('paragraph')
  const [rootType, setRootType] = useState<keyof typeof rootTypeToRootName>('root')
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(null)
  const [fontColor, setFontColor] = useState<string>('#000')
  const [bgColor, setBgColor] = useState<string>('#fff')
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left')
  const [isLink, setIsLink] = useState(false)
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isSubscript, setIsSubscript] = useState(false)
  const [isSuperscript, setIsSuperscript] = useState(false)
  const [isCode, setIsCode] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)
  const [modal, showModal] = useModal()
  const [isRTL, setIsRTL] = useState(false)
  const [codeLanguage, setCodeLanguage] = useState<string>('')
  const [isEditable, setIsEditable] = useState(() => editor.isEditable())

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode()
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent()
              return parent !== null && $isRootOrShadowRoot(parent)
            })

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow()
      }

      const elementKey = element.getKey()
      const elementDOM = activeEditor.getElementByKey(elementKey)

      // Update text format
      setIsBold(selection.hasFormat('bold'))
      setIsItalic(selection.hasFormat('italic'))
      setIsUnderline(selection.hasFormat('underline'))
      setIsStrikethrough(selection.hasFormat('strikethrough'))
      setIsSubscript(selection.hasFormat('subscript'))
      setIsSuperscript(selection.hasFormat('superscript'))
      setIsCode(selection.hasFormat('code'))
      setIsRTL($isParentElementRTL(selection))

      // Update links
      const node = getSelectedNode(selection)
      const parent = node.getParent()
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true)
      } else {
        setIsLink(false)
      }

      const tableNode = $findMatchingParent(node, $isTableNode)
      if ($isTableNode(tableNode)) {
        setRootType('table')
      } else {
        setRootType('root')
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey)
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode)
          const type = parentList ? parentList.getListType() : element.getListType()
          setBlockType(type)
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType()
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName)
          }
          if ($isCodeNode(element)) {
            const language = element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP
            setCodeLanguage(language ? CODE_LANGUAGE_MAP[language] || language : '')
            return
          }
        }
      }
      // Handle buttons
      setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000'))
      setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#fff'))
      let matchingParent
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(node, (parentNode) => $isElementNode(parentNode) && !parentNode.isInline())
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left',
      )
    }
  }, [activeEditor])

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar()
        setActiveEditor(newEditor)
        return false
      },
      COMMAND_PRIORITY_CRITICAL,
    )
  }, [editor, $updateToolbar])

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable)
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar()
        })
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload)
          return false
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    )
  }, [$updateToolbar, activeEditor, editor])

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload
        const { code, ctrlKey, metaKey } = event

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault()
          let url: string | null
          if (!isLink) {
            setIsLinkEditMode(true)
            url = sanitizeUrl('https://')
          } else {
            setIsLinkEditMode(false)
            url = null
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
        }
        return false
      },
      COMMAND_PRIORITY_NORMAL,
    )
  }, [activeEditor, isLink, setIsLinkEditMode])

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      activeEditor.update(() => {
        const selection = $getSelection()
        if ($INTERNAL_isPointSelection(selection)) {
          $patchStyleText(selection, styles)
        }
      })
    },
    [activeEditor],
  )

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor
        const focus = selection.focus
        const nodes = selection.getNodes()

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return
        }

        nodes.forEach((node, idx) => {
          // We split the first and last node by the selection
          // So that we don't format unselected text inside those nodes
          if ($isTextNode(node)) {
            // Use a separate variable to ensure TS does not lose the refinement
            let textNode = node
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode
            }

            if (textNode.__style !== '') {
              textNode.setStyle('')
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0)
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat('')
            }
            node = textNode
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true)
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat('')
          }
        })
      }
    })
  }, [activeEditor])

  const onFontColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ color: value })
    },
    [applyStyleText],
  )

  const onBgColorSelect = useCallback(
    (value: string) => {
      applyStyleText({ 'background-color': value })
    },
    [applyStyleText],
  )

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'))
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    }
  }, [editor, isLink])

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey)
          if ($isCodeNode(node)) {
            node.setLanguage(value)
          }
        }
      })
    },
    [activeEditor, selectedElementKey],
  )
  const insertGifOnClick = (payload: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <div className="sticky top-0 z-10 bg-gradient-to-b from-background via-background to-transparent py-16">
      <span className="flex items-center w-fit justify-between opacity-50 transition-all hover:opacity-100 mx-auto">
        <ButtonGroup>
          <Button
            isDisabled={!canUndo || !isEditable}
            isIconOnly
            onClick={() => {
              activeEditor.dispatchCommand(UNDO_COMMAND, undefined)
            }}
            title={IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)'}
          >
            <LuUndo aria-label="Undo" />
          </Button>
          <Button
            isDisabled={!canRedo || !isEditable}
            isIconOnly
            onClick={() => {
              activeEditor.dispatchCommand(REDO_COMMAND, undefined)
            }}
            title={IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)'}
          >
            <LuRedo aria-label="Redo" />
          </Button>
          <Divider orientation="vertical" />
          {blockType in blockTypeToBlockName && activeEditor === editor && (
            <>
              <BlockFormatDropdown disabled={!isEditable} blockType={blockType} rootType={rootType} editor={editor} />
              <Divider orientation="vertical" />
            </>
          )}
          {blockType === 'code' ? (
            <Dropdown isDisabled={!isEditable}>
              <DropdownTrigger>
                <Button>
                  {getLanguageFriendlyName(codeLanguage)} <LuChevronDown />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                {CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
                  return (
                    <DropdownItem onClick={() => onCodeLanguageSelect(value)} key={value}>
                      <span className="text">{name}</span>
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </Dropdown>
          ) : (
            <>
              <Button
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                }}
                color={isBold ? 'primary' : undefined}
                isIconOnly
                title={IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)'}
                aria-label={`Format text as bold. Shortcut: ${IS_APPLE ? '⌘B' : 'Ctrl+B'}`}
              >
                <LuBold />
              </Button>
              <Button
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
                }}
                color={isItalic ? 'primary' : undefined}
                isIconOnly
                title={IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)'}
                aria-label={`Format text as italics. Shortcut: ${IS_APPLE ? '⌘I' : 'Ctrl+I'}`}
              >
                <LuItalic />
              </Button>
              <Button
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
                }}
                color={isUnderline ? 'primary' : undefined}
                isIconOnly
                title={IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)'}
                aria-label={`Format text to underlined. Shortcut: ${IS_APPLE ? '⌘U' : 'Ctrl+U'}`}
              >
                <LuUnderline />
              </Button>
              <Button
                disabled={!isEditable}
                onClick={() => {
                  activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')
                }}
                color={isCode ? 'primary' : undefined}
                isIconOnly
                aria-label="Insert code block"
              >
                <LuCode />
              </Button>
              <Button disabled={!isEditable} onClick={insertLink} color={isLink ? 'primary' : undefined} isIconOnly>
                <LuLink />
              </Button>
              <Dropdown isDisabled={!isEditable}>
                <DropdownTrigger>
                  <Button isIconOnly aria-label="Formatting options for additional text styles">
                    <LuChevronDown aria-hidden />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
                    }}
                    aria-label="Format text with a strikethrough"
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuStrikethrough />
                      Strikethrough
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')
                    }}
                    aria-label="Format text with a subscript"
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuSubscript aria-hidden />
                      Subscript
                    </span>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => {
                      activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')
                    }}
                    aria-label="Format text with a superscript"
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuSuperscript aria-hidden />
                      Superscript
                    </span>
                  </DropdownItem>
                  <DropdownItem onClick={clearFormatting} className="item" aria-label="Clear all text formatting">
                    <span className="flex items-center gap-x-1 break-words">
                      <LuTrash aria-hidden />
                      Clear Formatting
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Divider orientation="vertical" />
              <Dropdown isDisabled={!isEditable}>
                <DropdownTrigger>
                  <Button>
                    <LuPlus aria-hidden />
                    Insert
                    <LuChevronDown aria-hidden />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      showModal('Insert Image', (onClose) => (
                        <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
                      ))
                    }}
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuImage aria-hidden />
                      Image
                    </span>
                  </DropdownItem>
                  {/* <DropdownItem
                    onClick={() =>
                      insertGifOnClick({
                        altText: 'Cat typing on a laptop',
                        src: catTypingGif,
                      })
                    }
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuFileVideo2 /> GIF
                    </span>
                  </DropdownItem> */}
                  {EmbedConfigs.map((embedConfig) => (
                    <DropdownItem
                      key={embedConfig.type}
                      onClick={() => {
                        activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type)
                      }}
                    >
                      <span className="flex items-center gap-x-1 break-words">
                        {embedConfig.icon}
                        {embedConfig.contentName}
                      </span>
                    </DropdownItem>
                  ))}
                  {/* <DropdownItem
                    onClick={() => {
                      activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
                    }}
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuFlipVertical aria-hidden />
                      Horizontal Rule
                    </span>
                  </DropdownItem> */}

                  {/* <DropdownItem
                    onClick={() => {
                      showModal('Insert Columns Layout', (onClose) => (
                        <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
                      ))
                    }}
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuColumns aria-hidden />
                      Columns Layout
                    </span>
                  </DropdownItem>

                  <DropdownItem
                    onClick={() => {
                      showModal('Insert Equation', (onClose) => (
                        <InsertEquationDialog activeEditor={activeEditor} onClose={onClose} />
                      ))
                    }}
                  >
                    <span className="flex items-center gap-x-1 break-words">
                      <LuDiff aria-hidden />
                      Equation
                    </span>
                  </DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
            </>
          )}
          <Divider orientation="vertical" />
          <ElementFormatDropdown disabled={!isEditable} value={elementFormat} editor={editor} isRTL={isRTL} />
        </ButtonGroup>
      </span>
    </div>
  )
}
