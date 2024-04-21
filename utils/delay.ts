export default function delay(inSeconds: number) {
  return new Promise((r) => setTimeout(r, inSeconds * 1000));
}
