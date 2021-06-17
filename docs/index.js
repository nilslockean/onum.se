const externalFonts = ['M PLUS Rounded 1c'] // Array of CSS font-name properties
const maxFontLoadTime = 2000
let fontLoadTimeout = null

const checkFont = fontName => {
  return new Promise(resolve => {
    let checks = 0
    let interval = null
    let hasLoaded = false

    const done = () => {
      if (interval !== null) {
        clearInterval(interval)
      }
      if (hasLoaded) {
        document.body.classList.add(
          fontName.toLowerCase().replaceAll(' ', '-') + '--loaded'
        )
      }
      resolve(hasLoaded)
    }

    const check = () => {
      checks++

      if (checks >= 20) return done()

      try {
        hasLoaded = document.fonts.check('1rem "' + fontName + '"')
      } catch (_error) {
        return done()
      }

      if (hasLoaded) {
        done()
      }
    }

    interval = setInterval(check, 100)
  })
}

const handleFontsLoaded = () => {
  clearTimeout(fontLoadTimeout)
  const allLoaded = externalFonts.every(fontName =>
    document.fonts.check('1rem "' + fontName + '"')
  )
  if (allLoaded) {
    console.log('All fonts were loaded successfully', externalFonts)
  } else {
    console.log(
      `Stopped waiting for fonts to load after ${
        maxFontLoadTime / 1000
      } seconds`
    )
  }
}

const onLoad = () => {
  document.body.classList.remove('no-js')

  if (externalFonts.length) {
    const fontChecks = externalFonts.map(fontName => checkFont(fontName))
    fontLoadTimeout = setTimeout(handleFontsLoaded, maxFontLoadTime)
    Promise.all(fontChecks).then(handleFontsLoaded)
  }
}

document.addEventListener('DOMContentLoaded', onLoad)
