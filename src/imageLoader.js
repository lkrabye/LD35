export default function load(url, name) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({url, name, img})
    img.src = url
  })
}
