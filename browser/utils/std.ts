export function range(start: number, stop: number, step = 1) {
  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
    return []
  }

  const result = []
  for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
    result.push(i)
  }

  return result
}

export function fetchBytes(url: string) {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((data) => new Uint8Array(data))
}
