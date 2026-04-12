import { useState, useEffect, useRef } from 'react'

interface TypingState {
  displayed: string
  isDone:    boolean
}

/**
 * Animates text appearing letter by letter.
 * Returns the currently-displayed portion and whether the full text is shown.
 */
export function useTypingAnimation(text: string, speedMs = 60): TypingState {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone]       = useState(false)
  const indexRef  = useRef(0)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Reset when text changes
    setDisplayed('')
    setIsDone(false)
    indexRef.current = 0

    timerRef.current = setInterval(() => {
      const next = indexRef.current + 1
      setDisplayed(text.slice(0, next))
      indexRef.current = next

      if (next >= text.length) {
        clearInterval(timerRef.current!)
        timerRef.current = null
        setIsDone(true)
      }
    }, speedMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [text, speedMs])

  return { displayed, isDone }
}
