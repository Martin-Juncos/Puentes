const ELEMENT_NODE = 1
const TEXT_NODE = 3

const blockedTags = new Set(['script', 'style', 'iframe', 'object', 'embed', 'meta', 'link'])
const allowedTags = new Set(['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'])
const normalizedTags = {
  b: 'strong',
  div: 'p',
  i: 'em',
}

const appendSanitizedChildren = (sourceNode, targetNode, targetDocument) => {
  Array.from(sourceNode.childNodes).forEach((childNode) => {
    const sanitizedChild = sanitizeNode(childNode, targetDocument)

    if (sanitizedChild) {
      targetNode.appendChild(sanitizedChild)
    }
  })
}

const sanitizeNode = (node, targetDocument) => {
  if (node.nodeType === TEXT_NODE) {
    return targetDocument.createTextNode(node.textContent ?? '')
  }

  if (node.nodeType !== ELEMENT_NODE) {
    return null
  }

  const originalTag = node.tagName.toLowerCase()
  const tagName = normalizedTags[originalTag] ?? originalTag

  if (blockedTags.has(originalTag)) {
    return targetDocument.createTextNode(node.textContent ?? '')
  }

  if (!allowedTags.has(tagName)) {
    const fragment = targetDocument.createDocumentFragment()
    appendSanitizedChildren(node, fragment, targetDocument)
    return fragment
  }

  const element = targetDocument.createElement(tagName)
  appendSanitizedChildren(node, element, targetDocument)

  return element
}

const normalizeSpacing = (value) => value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim()

export const sanitizeRichText = (value = '') => {
  if (!value || typeof DOMParser === 'undefined') {
    return value
  }

  const parser = new DOMParser()
  const sourceDocument = parser.parseFromString(`<body>${value}</body>`, 'text/html')
  const targetDocument = parser.parseFromString('<body></body>', 'text/html')

  Array.from(sourceDocument.body.childNodes).forEach((childNode) => {
    const sanitizedChild = sanitizeNode(childNode, targetDocument)

    if (sanitizedChild) {
      targetDocument.body.appendChild(sanitizedChild)
    }
  })

  return targetDocument.body.innerHTML.trim()
}

export const getRichTextPlainText = (value = '') => {
  if (!value) {
    return ''
  }

  if (typeof DOMParser === 'undefined') {
    return normalizeSpacing(value.replace(/<[^>]+>/g, ' '))
  }

  const parser = new DOMParser()
  const document = parser.parseFromString(`<body>${value}</body>`, 'text/html')
  return normalizeSpacing(document.body.textContent ?? '')
}

export const getRichTextPreview = (value = '', maxLength = 180) => {
  const plainText = getRichTextPlainText(value)

  if (plainText.length <= maxLength) {
    return plainText
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`
}
