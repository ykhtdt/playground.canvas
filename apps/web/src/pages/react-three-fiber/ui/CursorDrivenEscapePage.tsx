"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface ParticlesProps {
  count?: number;
  avoidRadius?: number;
  paritclesBounds: {
    width: number;
    height: number;
  };
}

interface CameraControllerProps {
  cameraBounds: {
    width: number;
    height: number;
  };
}

const Particles = ({
  count = 1000,
  avoidRadius = 25,
  paritclesBounds,
}: ParticlesProps) => {
  const particlesRef = useRef<THREE.BufferGeometry>(null)
  const { camera, pointer } = useThree()

  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // useEffect(() => {
  //   const handleMouseMove = (event: MouseEvent) => {
  //     const width = window.innerWidth
  //     const height = window.innerHeight

  //     const x = (event.clientX / width) * 2 - 1
  //     const y = -(event.clientY / height) * 2 + 1

  //     setMousePosition({ x, y })
  //   }

  //   window.addEventListener("mousemove", handleMouseMove)
  //   return () => {
  //     window.removeEventListener("mousemove", handleMouseMove)
  //   }
  // }, [])

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * paritclesBounds.width
      positions[i * 3 + 1] = (Math.random() - 0.5) * paritclesBounds.height
      positions[i * 3 + 2] = 0

      velocities[i * 3] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1
      velocities[i * 3 + 2] = 0
    }

    return {
      positions,
      velocities,
    }
  }, [count, paritclesBounds])

  useFrame(() => {
    const { positions, velocities } = particles

    if (count > 0) {
      // const mousePosWorld = new THREE.Vector3(mousePosition.x, mousePosition.y, 0.5)
      const mousePosWorld = new THREE.Vector3(pointer.x, pointer.y, 0.5)
      mousePosWorld.unproject(camera)

      for (let i = 0; i < count; i++) {
        const x = positions[i * 3] as number
        const y = positions[i * 3 + 1] as number

        let velocityX = velocities[i * 3] as number
        let velocityY = velocities[i * 3 + 1] as number

        const dx = x - mousePosWorld.x
        const dy = y - mousePosWorld.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < avoidRadius) {
          const angle = Math.atan2(dy, dx)
          const avoidX = Math.cos(angle) * avoidRadius + mousePosWorld.x
          const avoidY = Math.sin(angle) * avoidRadius + mousePosWorld.y

          const newX = x + (avoidX - x) * 0.1
          const newY = y + (avoidY - y) * 0.1

          positions[i * 3] = newX
          positions[i * 3 + 1] = newY
        } else {
          positions[i * 3] = x + velocityX
          positions[i * 3 + 1] = y + velocityY
        }

        if (x > paritclesBounds.width / 2) {
          velocityX *= -1
          positions[i * 3] = paritclesBounds.width / 2 - 0.1
        }

        if (x < -paritclesBounds.width / 2) {
          velocityX *= -1
          positions[i * 3] = -paritclesBounds.width / 2 + 0.1
        }

        if (y > paritclesBounds.height / 2) {
          velocityY *= -1
          positions[i * 3 + 1] = paritclesBounds.height / 2 - 0.1
        }

        if (y < -paritclesBounds.height / 2) {
          velocityY *= -1
          positions[i * 3 + 1] = -paritclesBounds.height / 2 + 0.1
        }

        velocities[i * 3] = velocityX
        velocities[i * 3 + 1] = velocityY
      }
    }

    if (particlesRef.current && particlesRef.current.attributes.position) {
      particlesRef.current.attributes.position.needsUpdate = true
    }
  })

  return (
    <points>
      <bufferGeometry ref={particlesRef}>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={1.5} color="#e4e4e7" opacity={0.75} transparent />
    </points>
  )
}

const CameraController = ({
  cameraBounds,
}: CameraControllerProps) => {
  const { camera } = useThree()
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 })

  const lerpSpeed = 0.0125

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      const width = window.innerWidth
      const height = window.innerHeight

      const x = (clientX / width) * 2 - 1
      const y = -(clientY / height) * 2 + 1

      setTargetPosition({
        x: x * cameraBounds.width / 2,
        y: y * cameraBounds.height / 2,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [cameraBounds])

  useFrame(() => {
    camera.position.x = camera.position.x + (targetPosition.x - camera.position.x) * lerpSpeed
    camera.position.y = camera.position.y + (targetPosition.y - camera.position.y) * lerpSpeed
    camera.updateProjectionMatrix()
  })

  return null
}

export const CursorDrivenEscapePage = () => {
  const cameraBounds = { width: 25, height: 50 }
  const paritclesBounds = { width: 500, height: 250 }

  return (
    <Canvas
      orthographic
      camera={{
        zoom: 5,
        position: [0, 0, 5],
        near: 0.1,
        far: 100,
      }}
      style={{
        background: "#000000",
        width: "100%",
        height: "100dvh"
      }}
    >
      <CameraController cameraBounds={cameraBounds} />
      <Particles paritclesBounds={paritclesBounds} />
    </Canvas>
  )
}
