import { assert } from 'chai'
import 'mocha/mocha.js'
import 'mocha/mocha.css'

import './html-include.ts'

mocha.setup('bdd')
mocha.checkLeaks()

const example = document.body.appendChild(document.createElement('div'))
example.style.display = 'none'

function setExample (html: string) {
  beforeEach(() => {
    example.innerHTML = html
  })

  afterEach(() => {
    example.innerHTML = ''
  })
}

async function sleep (milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/** Wait for html-includes in example to be rendered. */
async function whenRendered (): Promise<boolean> {
  for (;;) {
    const includes = example.querySelectorAll('html-include')
    if (includes.length === 0) {
      return true
    }
    await sleep(25)
  }
}

function isRendered (): boolean {
  const includes = example.querySelectorAll('html-include')
  return includes.length === 0
}

describe('html-include without src', () => {
  setExample('<html-include><p>pass</p></html-include>')

  it('renders fallback value', async function () {
    await whenRendered()
    assert.strictEqual(example.textContent, 'pass')
  })

  it('gets removed from the document', async function () {
    await whenRendered()
    assert(isRendered())
  })
})

describe('html-include with non-existent resource in src', () => {
  setExample('<html-include src="/does-not-exist.html"><p>pass</p></html-include>')

  it('renders fallback value', async function () {
    await whenRendered()
    assert.strictEqual(example.textContent, 'pass')
  })

  it('gets removed from the document', async function () {
    await whenRendered()
    assert(isRendered())
  })
})

describe('html-include with src', () => {
  setExample('<html-include src="/test/test.html"><p>fail</p></html-include>')

  it('renders fetched text instead of fallback value', async function () {
    await whenRendered()
    assert.strictEqual(example.textContent!.trim(), 'pass')
  })

  it('gets removed from the document', async function () {
    await whenRendered()
    assert(isRendered())
  })
})

describe('html-include with src that contains hash', () => {
  setExample('<html-include src="/test/test.html#test"><p>fail</p></html-include>')

  it("renders fetched text as if the hash weren't there", async function () {
    await whenRendered()
    assert.strictEqual(example.textContent!.trim(), 'pass')
  })

  it('gets removed from the document', async function () {
    await whenRendered()
    assert(isRendered())
  })
})

mocha.run()
