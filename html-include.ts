/** Fetches text from path.
 *
 * Returns Promise<null> on failure.
 */
async function fetchText (path: string): Promise<string | null> {
  const response = await fetch(path)
  return response.ok ? response.text() : null
}

/** Turns html string into document fragment. */
function template (html: string): DocumentFragment {
  const t = document.createElement('template')
  t.innerHTML = html
  return t.content
}

class HTMLInclude extends HTMLElement {
  constructor () {
    super()
    this.include()
  }

  /** Replaces html-include with fetched text or fallback value in document. */
  private async include () {
    const src = this.getAttribute('src')
    if (src == null) {
      return this.renderFallback()
    }

    const text = await fetchText(src)
    if (text == null) {
      return this.renderFallback()
    }
    this.replaceWith(template(text))
  }

  /** Renders fallback HTML (child nodes of html-include). */
  private renderFallback () {
    const children = Array.from(this.childNodes)
    this.replaceWith(...children)
  }
}

customElements.define('html-include', HTMLInclude)
