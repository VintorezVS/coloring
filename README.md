To fix error in `svgdom` replace function on line `node_modules/svgdom/main-require.cjs:4558` with following

```
const pointAtLength = function (d, len) {
  const segs = pathParser(d)

  const segLengths = segs.map(el => el.length())

  const length = segLengths.reduce((l, c) => l + c, 0)

  let i = 0

  let t = len / length

  // FIXME: Pop Move before using shortcut?
  // shortcut for trivial cases
  if (t >= 1) {
    // Check if there is a p2. If not, use p1
    if (segs[segs.length - 1].p2) {
      return segs[segs.length - 1].p2.native()
    } else {
      return segs[segs.length - 1].p1.native()
    }
  }

  if (t <= 0) return segs[0].p1.native()

  // remove move commands at the very end of the path
  while (segs[segs.length - 1] instanceof Move) segs.pop()

  let segEnd = 0

  for (let il = segLengths.length; i < il; ++i) {
    const k = segLengths[i] / length
    segEnd += k

    if (segEnd > t) {
      break
    }
  }

  if (segLengths.length === i) {
    if (segs[segs.length - 1].p2) {
      return segs[segs.length - 1].p2.native()
    } else {
      return segs[segs.length - 1].p1.native()
    }
  }

  const ratio = length / segLengths[i]
  t = ratio * (t - segEnd) + 1

  return segs[i].pointAt(t).native()
}
```