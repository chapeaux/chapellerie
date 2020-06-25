// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register("cpx-lever", [], function (exports_1, context_1) {
    "use strict";
    var CPXLever;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            CPXLever = class CPXLever extends HTMLElement {
                constructor() {
                    super();
                    this.setDraggable = this.setDraggable.bind(this);
                }
                connectedCallback() {
                    console.log("Lever Connected");
                    Array.from({ length: this.children.length }, this.setDraggable);
                    this.addEventListener('dragstart', this.dragstart_handler);
                    this.addEventListener('touchmove', this.touchmove_handler);
                    this.addEventListener('touchend', this.touchend_handler);
                }
                static get observedAttributes() {
                    return [];
                }
                attributeChangedCallback(name, oldVal, newVal) {
                    this[name] = newVal;
                }
                setDraggable(_, index) {
                    this.children.item(index).setAttribute('draggable', 'true');
                }
                dragstart_handler(ev) {
                    console.log('Drag Started');
                    // let img = new Image(); 
                    // img.src = 'https://picsum.photos/20'; 
                    // ev.dataTransfer.setDragImage(img, 20, 20);
                    ev.dataTransfer.setData('text/html', ev.target.outerHTML);
                    ev.dataTransfer.dropEffect = "copy";
                }
                touchmove_handler(ev) {
                    ev.preventDefault();
                    console.log('Touch moved');
                }
                touchend_handler(ev) {
                    ev.preventDefault();
                    console.log('Touch End', ev.target);
                }
            };
            exports_1("default", CPXLever);
            window.customElements.define('cpx-lever', CPXLever);
        }
    };
});

const __exp = __instantiate("cpx-lever");
export default __exp["default"];
