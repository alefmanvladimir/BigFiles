import { useEffect, useState, useRef } from "react";

export interface UseRealtimeRemoteStateOptions<T> {
  fetchFn: () => Promise<T>,
  isEqualFn?: (oldData: T | null, newData: T) => boolean,
  retryInterval?: number;
  deps?: any[]
}

export function useRealtimeRemoteState<T = any>({
  fetchFn,
  isEqualFn = (oldData, newData) => oldData === newData,
  retryInterval = 3000,
  deps = []
}: UseRealtimeRemoteStateOptions<T>) {
  const [data, setData] = useState<T | null>(null)
  const dataRef = useRef<T | null>(null)

  function updateData(newData: T | null) {
    setData(newData)
    dataRef.current = newData
  }

  useEffect(() => {
    fetchFn()
      .then(newData => updateData(newData))

    function createInterval() {
      return setInterval(() => {
        fetchFn()
          .then(newData => {
            if (!isEqualFn(dataRef.current, newData)) {
              updateData(newData)
            }
          })
      }, retryInterval)
    }

    let interval = createInterval()

    return () => {
      clearInterval(interval)
    }
  }, deps)

  return data
}
