'use client'
import { useEffect, useState } from 'react'

/** Returns `value` once it has stopped changing for `delay` ms (e.g. a search box driving a query). */
const useDebouncedValue = <T>(value: T, delay = 400): T => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

export default useDebouncedValue
