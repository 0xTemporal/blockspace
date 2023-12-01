import { useChat } from '@/src/state/chat';

export const SignedIn = () => {
  const { sdk } = useChat();

  console.log(sdk);
  return <div>Signed in</div>;
};
