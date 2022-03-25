(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // html-include.ts
  function fetchText(path) {
    return __async(this, null, function* () {
      const response = yield fetch(path);
      return response.ok ? response.text() : null;
    });
  }
  function template(html) {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content;
  }
  var HTMLInclude = class extends HTMLElement {
    constructor() {
      super();
      this.include();
    }
    include() {
      return __async(this, null, function* () {
        const src = this.getAttribute("src");
        if (src == null) {
          return this.renderFallback();
        }
        const text = yield fetchText(src);
        if (text == null) {
          return this.renderFallback();
        }
        this.replaceWith(template(text));
      });
    }
    renderFallback() {
      const children = Array.from(this.childNodes);
      this.replaceWith(...children);
    }
  };
  customElements.define("html-include", HTMLInclude);
})();
