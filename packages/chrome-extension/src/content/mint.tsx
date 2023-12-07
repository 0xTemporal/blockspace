import { Canvas, useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { useSpring, a } from '@react-spring/three'

import './mint.css'
import { Html, Plane } from '@react-three/drei'
import { useEffect, useState } from 'react'

function Polaroid() {
  const [url, setUrl] = useState('')
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  const [spring, set] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1, friction: 40, tension: 800 },
  }))
  const bind = useDrag(({ movement: [x, y], down, elapsedTime }) => {
    if (elapsedTime > 1000) {
      chrome.storage.sync.get({ url }).then((result) => {
        setUrl(result.url)
      })
    }

    return set({
      config: { mass: down ? 1 : 2, tension: down ? 5000 : 800 },
      position: down ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
    })
  })

  return (
    <a.mesh {...spring} {...bind()} castShadow>
      <Plane args={[3, 4]} />

      <Html className="ext-w-[420px] -ext-mt-[24vh] -ext-ml-[210px] ext-bg-black ext-h-[40vh] ext-absolute">
        <img className="ext-h-full ext-object-contain" src={url} />
      </Html>
    </a.mesh>
  )
}

export const MintUI = () => {
  return (
    <div className="ext-bg-slate-800/50 ext-absolute ext-z-20 ext-w-full ext-h-screen">
      <div className="ext-w-[100vw] ext-h-[100vh]">
        <Canvas shadows camera={{ position: [0, 0, 5] }}>
          <Polaroid />
        </Canvas>
      </div>
    </div>
  )
}
