const externalFonts = [] // Array of CSS font-name properties
const maxFontLoadTime = 2000
let fontLoadTimeout = null

const checkFont = (fontName) => {
  return new Promise(resolve => {
    let checks = 0
    let interval = null
    let hasLoaded = false
    
    const onSuccess = () => {
      if ( interval !== null ) {
        clearInterval(interval)
      }
      document.body.classList.add(fontName.toLowerCase().replaceAll(' ', '-') + '--loaded')
      resolve(hasLoaded)
    }
    
    const check = () => {
      checks++

      if ( checks >= 20 ) return onSuccess()

      try {
        hasLoaded = document.fonts.check('1rem "' + fontName + '"')
      } catch (_error) {
        return onSuccess()
      }
      
      if ( hasLoaded ) {
        onSuccess()
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
  if ( allLoaded ) {
    console.log('All fonts were loaded successfully')
  } else {
    console.log(`Stopped waiting for fonts to load after ${maxFontLoadTime / 1000} seconds`)
  }
}

const onLoad = () => {
  document.body.classList.remove('no-js')

  if ( externalFonts.length ) {
    const fontChecks = externalFonts.map(fontName => checkFont(fontName))
    fontLoadTimeout = setTimeout(handleFontsLoaded, maxFontLoadTime)
    Promise.all(fontChecks).then(handleFontsLoaded)
  }
}

document.addEventListener('DOMContentLoaded', onLoad)
