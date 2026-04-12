import { useState, useEffect, useRef } from 'react'

interface TypingState {
  displayed: string
  isDone:    boolean
}

/**
 * Animates text appearing letter by letter.
 * `onComplete` fires once from inside the interval when the last character appears —
 * never from a render, so there are no stale-state race conditions.
 */
export function useTypingAnimation(
  text:        string,
  speedMs    = 60,
  onComplete?: () => void,
): TypingState {
  const [displayed, setDisplayed] = useState('')
  const [isDone, setIsDone]       = useState(false)
  const indexRef      = useRef(0)
  const timerRef      = useRef<ReturnType<typeof setInterval> | null>(null)
  // Always holds the latest onComplete without re-triggering the effect
  const onCompleteRef = useRef(onComplete)

  useEffect(() => { onCompleteRef.current = onComplete })

  useEffect(() => {
    setDisplayed('')
    setIsDone(false)
    indexRef.current = 0

    if (!text) return

    timerRef.current = setInterval(() => {
      const next = indexRef.current + 1
      setDisplayed(text.slice(0, next))
      indexRef.current = next

      if (next >= text.length) {
        clearInterval(timerRef.current!)
        timerRef.current = null
        setIsDone(true)
        // Fire callback outside React's render cycle — no stale-state risk
        onCompleteRef.current?.()
      }
    }, speedMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [text, speedMs])

  return { displayed, isDone }
}
