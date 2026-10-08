import { useCallback, useEffect, useState } from 'react'

// Runs an async loader and tracks its loading / error state, with a retry
function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, error: null, isLoading: true })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let isCancelled = false

    loader()
      .then((data) => {
        if (!isCancelled) setState({ data, error: null, isLoading: false })
      })
      .catch((error) => {
        if (!isCancelled) setState({ data: null, error, isLoading: false })
      })

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt])

  const retry = useCallback(() => {
    setState((current) => ({ ...current, error: null, isLoading: true }))
    setAttempt((count) => count + 1)
  }, [])

  return { ...state, retry }
}

export default useAsync
