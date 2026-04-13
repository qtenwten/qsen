function parseMarkdown(content = '') {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let paragraphLines = []
  let listItems = []
  let orderedListItems = []
  let codeLines = []
  let codeLanguage = ''
  let inCodeBlock = false

  const flushParagraph = () => {
    if (!paragraphLines.length) {
      return
    }

    blocks.push({
      type: 'paragraph',
      text: paragraphLines.join(' ').trim(),
    })
    paragraphLines = []
  }

  const flushList = () => {
    if (!listItems.length) {
      return
    }

    blocks.push({
      type: 'list',
      ordered: false,
      items: listItems,
    })
    listItems = []
  }

  const flushOrderedList = () => {
    if (!orderedListItems.length) {
      return
    }

    blocks.push({
      type: 'list',
      ordered: true,
      items: orderedListItems,
    })
    orderedListItems = []
  }

  const flushCodeBlock = () => {
    if (!codeLines.length && !codeLanguage) {
      return
    }

    blocks.push({
      type: 'code',
      language: codeLanguage,
      code: codeLines.join('\n'),
    })
    codeLines = []
    codeLanguage = ''
  }

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock()
        inCodeBlock = false
      } else {
        flushParagraph()
        flushList()
        flushOrderedList()
        codeLanguage = line.slice(3).trim()
        inCodeBlock = true
      }
      return
    }

    if (inCodeBlock) {
      codeLines.push(line)
      return
    }

    const trimmedLine = line.trim()

    if (!trimmedLine) {
      flushParagraph()
      flushList()
      flushOrderedList()
      return
    }

    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      flushParagraph()
      flushList()
      flushOrderedList()
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      })
      return
    }

    const unorderedListMatch = trimmedLine.match(/^[-*]\s+(.*)$/)
    if (unorderedListMatch) {
      flushParagraph()
      flushOrderedList()
      listItems.push(unorderedListMatch[1].trim())
      return
    }

    const orderedListMatch = trimmedLine.match(/^\d+\.\s+(.*)$/)
    if (orderedListMatch) {
      flushParagraph()
      flushList()
      orderedListItems.push(orderedListMatch[1].trim())
      return
    }

    if (listItems.length) {
      listItems[listItems.length - 1] = `${listItems[listItems.length - 1]} ${trimmedLine}`
      return
    }

    if (orderedListItems.length) {
      orderedListItems[orderedListItems.length - 1] = `${orderedListItems[orderedListItems.length - 1]} ${trimmedLine}`
      return
    }

    paragraphLines.push(trimmedLine)
  })

  flushParagraph()
  flushList()
  flushOrderedList()

  if (inCodeBlock) {
    flushCodeBlock()
  }

  return blocks
}

function isSafeHref(href) {
  if (typeof href !== 'string') return false
  return href.startsWith('http://') || href.startsWith('https://')
}

function getSingleMarkdownLink(text = '') {
  const trimmedText = text.trim()
  const markdownLinkMatch = trimmedText.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/)

  if (!markdownLinkMatch) {
    return null
  }

  const [, label, href] = markdownLinkMatch
  if (!isSafeHref(href)) {
    return null
  }

  return { label, href }
}

function renderInline(text = '') {
  // Preserve inline code first, then parse links in the remaining text.
  const segments = text.split(/(`[^`]+`)/g).filter(Boolean)

  return segments.map((segment, index) => {
    if (segment.startsWith('`') && segment.endsWith('`')) {
      return <code key={`${segment}-${index}`}>{segment.slice(1, -1)}</code>
    }

    const parts = []
    let remaining = segment
    const linkRe = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
    let match
    let lastIndex = 0

    while ((match = linkRe.exec(segment)) !== null) {
      const [full, label, href] = match
      const start = match.index
      const end = start + full.length

      if (start > lastIndex) {
        parts.push(segment.slice(lastIndex, start))
      }

      if (isSafeHref(href)) {
        parts.push(
          <a key={`link-${index}-${start}`} href={href} target="_blank" rel="noreferrer">
            {label}
          </a>
        )
      } else {
        parts.push(full)
      }

      lastIndex = end
    }

    if (lastIndex < segment.length) {
      parts.push(segment.slice(lastIndex))
    }

    // Also auto-linkify bare https:// URLs for convenience.
    const autoParts = []
    const urlRe = /(https?:\/\/[^\s]+)(?![^<]*>)/g
    parts.forEach((item, partIndex) => {
      if (typeof item !== 'string') {
        autoParts.push(item)
        return
      }

      let cursor = 0
      let urlMatch
      while ((urlMatch = urlRe.exec(item)) !== null) {
        const href = urlMatch[1]
        const start = urlMatch.index
        const end = start + href.length

        if (start > cursor) {
          autoParts.push(item.slice(cursor, start))
        }

        if (isSafeHref(href)) {
          autoParts.push(
            <a key={`autolink-${index}-${partIndex}-${start}`} href={href} target="_blank" rel="noreferrer">
              {href}
            </a>
          )
        } else {
          autoParts.push(href)
        }

        cursor = end
      }

      if (cursor < item.length) {
        autoParts.push(item.slice(cursor))
      }
    })

    return <span key={`${segment}-${index}`}>{autoParts}</span>
  })
}

function ArticleMarkdown({ content }) {
  const blocks = parseMarkdown(content)

  return (
    <div className="article-markdown">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level === 1) {
            return <h1 key={`heading-${index}`}>{block.text}</h1>
          }

          if (block.level === 2) {
            return <h2 key={`heading-${index}`}>{block.text}</h2>
          }

          if (block.level === 3) {
            return <h3 key={`heading-${index}`}>{block.text}</h3>
          }

          return <h4 key={`heading-${index}`}>{block.text}</h4>
        }

        if (block.type === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul'
          return (
            <ListTag key={`list-${index}`}>
              {block.items.map((item, itemIndex) => (
                <li key={`item-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ListTag>
          )
        }

        if (block.type === 'code') {
          return (
            <pre key={`code-${index}`} className="article-code-block">
              <code>{block.code}</code>
            </pre>
          )
        }

        const ctaLink = getSingleMarkdownLink(block.text)
        if (ctaLink) {
          return (
            <div key={`cta-${index}`} className="article-cta-row">
              <a href={ctaLink.href} target="_blank" rel="noreferrer" className="article-cta-button">
                {ctaLink.label}
              </a>
            </div>
          )
        }

        return <p key={`paragraph-${index}`}>{renderInline(block.text)}</p>
      })}
    </div>
  )
}

export default ArticleMarkdown
