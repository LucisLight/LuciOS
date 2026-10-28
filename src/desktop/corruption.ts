const corruptionGlyphs = ['#', '/', '0', 'X', '?']

export function corruptLabel(label: string) {
  return [...label.toUpperCase()].map((character, index) => {
    if (character === ' ') return ' '
    return index % 3 === 1 ? corruptionGlyphs[(character.charCodeAt(0) + index) % corruptionGlyphs.length] : character
  }).join('')
}
