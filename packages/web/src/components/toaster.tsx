import { Card, CardBody } from '@nextui-org/react'
import { useToaster } from 'react-hot-toast/headless'

export const Toaster = () => {
  const { toasts, handlers } = useToaster()
  const { startPause, endPause, calculateOffset, updateHeight } = handlers

  return (
    <div className="fixed bottom-16 left-4 z-50" onMouseEnter={startPause} onMouseLeave={endPause}>
      {toasts.map((toast) => {
        const offset = calculateOffset(toast, {
          reverseOrder: true,
          gutter: 8,
        })

        const ref = (el) => {
          if (el && typeof toast.height !== 'number') {
            const height = el.getBoundingClientRect().height
            updateHeight(toast.id, height)
          }
        }
        return (
          <Card
            key={toast.id}
            ref={ref}
            shadow="lg"
            className="absolute w-[360px] transition-all duration-400"
            style={{
              opacity: toast.visible ? 1 : 0,
              transform: `translateY(${-offset}px)`,
            }}
            {...toast.ariaProps}
          >
            <CardBody className="flex-row items-center gap-x-4">
              {toast.icon}
              {toast.message ?? ''}
            </CardBody>
          </Card>
        )
      })}
    </div>
  )
}
