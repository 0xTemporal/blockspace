import { Avatar, AvatarGroup, Button, Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react'
import { useCallback, useState } from 'react'

export const MintableBlock = (props) => {
  const [minting, setMinting] = useState(false)

  const handleMint = useCallback(async () => {
    setMinting(true)

    setTimeout(() => {
      setMinting(false)
    }, 3000)
  }, [])

  return (
    <Popover placement="bottom-end" triggerScaleOnOpen={false} classNames={{ trigger: '' }}>
      <PopoverTrigger>
        <p
          className="my-1 cursor-pointer rounded-lg p-3 transition-all hover:shadow-lg aria-expanded:shadow-lg dark:shadow-primary/40"
          {...props}
        >
          {props.children}
        </p>
      </PopoverTrigger>
      <PopoverContent className="-mt-16">
        <div className="flex gap-x-2 py-2">
          <AvatarGroup size="sm" max={3} total={10}>
            <Avatar src="https://pbs.twimg.com/profile_images/1725585714182488064/Wk_VhVyM_400x400.jpg" />
            <Avatar src="https://pbs.twimg.com/profile_images/1727823323407511552/rrzPAb2l_400x400.jpg" />
            <Avatar src="https://pbs.twimg.com/profile_images/1725588229808889859/L6bOXam6_400x400.jpg" />
          </AvatarGroup>
          <Button size="sm" radius="full" color="primary" onClick={handleMint} isLoading={minting}>
            Collect
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
