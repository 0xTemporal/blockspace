'use client';

import code from '@code-wallet/elements';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LuMoreHorizontal } from 'react-icons/lu';

import { useDarkMode } from '../lib/hooks';

export type PostDropdownProps = {
  author?: string;
  avatar?: string;
  children?: React.ReactNode;
};

export const PostDropdown = ({ avatar, author, children }: PostDropdownProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [donationAmount, setDonationAmount] = useState(0.05);
  const { isDarkMode } = useDarkMode();

  const el = useRef<HTMLDivElement>(null);

  const codeCard = useMemo(() => {
    const { card } = code.elements.create('card', {
      currency: 'usd',
      destination: 'E8otxw1CVX9bfyddKu3ZB3BVLa4VVF9J7CTPdnUwT9jR',
      amount: donationAmount,
      appearance: isDarkMode ? 'dark' : 'light',
    });

    card?.on(
      'cancel',
      (args) =>
        new Promise(() => {
          console.log(args, 'SDLFKHSDKLFH');
          card.unmount();
          el.current?.parentNode?.removeChild(el.current);
        }),
    );
    return card;
  }, []);

  useEffect(() => {
    codeCard?.update({
      amount: donationAmount,
    });
  }, [donationAmount]);

  const onClickPayWithCode = () => {
    codeCard?.mount(el.current!);
  };

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          {children ?? (
            <Button isIconOnly variant="ghost" radius="full">
              <LuMoreHorizontal />
            </Button>
          )}
        </DropdownTrigger>
        <DropdownMenu aria-label="Article actions">
          <DropdownItem key="mint">Mint collectible</DropdownItem>
          <DropdownItem key="mint">Message author</DropdownItem>
          <DropdownItem key="verification">Verification details</DropdownItem>
          <DropdownItem key="donate" onClick={onOpen}>
            Donate
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Donate</ModalHeader>
          <ModalBody>
            <Input
              label="Donation amount"
              type="number"
              endContent={'SOL'}
              value={`${donationAmount}`}
              onChange={(e) => setDonationAmount(+e.target.value)}
            />
            <span className="absolute" ref={el} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClickPayWithCode}>Pay with Code</Button>
            <Button color="primary">Pay with SOL</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
