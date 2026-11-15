import { useEffect, useState } from 'react'

const isBrowser = typeof window !== 'undefined'

const useViewPort = () => {
  const [width, setWidth] = useState(isBrowser ? window.innerWidth : 1200)
  const [height, setHeight] = useState(isBrowser ? window.innerHeight : 800)

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])
  return { width, height }
}

export default useViewPort
