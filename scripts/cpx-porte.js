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

System.register("cpx-porte", [], function (exports_1, context_1) {
    "use strict";
    var setDroppable, CPXPorte;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            setDroppable = index => {
                let child = this.children.item(index);
                if (child.nodeName != 'STYLE' && child.getAttribute('cpx-drop')) {
                    child.addEventListener('dragover', this.dragover_handler);
                    child.setAttribute('cpx-drop', 'true');
                }
            };
            CPXPorte = class CPXPorte extends HTMLElement {
                constructor() {
                    super();
                    this.attachShadow({ mode: "open" });
                    this.shadowRoot.innerHTML = "<style>:host { width: 100%; display:block; border: 3px dashed #151515;}</style><slot></slot>";
                    this.self_drop_handler = this.self_drop_handler.bind(this);
                    this.dragover_handler = this.dragover_handler.bind(this);
                }
                connectedCallback() {
                    console.log("Porte Connected");
                    if (this.children.length > 1) {
                        Array.from({ length: this.children.length }, setDroppable);
                    }
                    else {
                        this.addEventListener('dragover', this.dragover_handler);
                    }
                    this.addEventListener('drop', this.self_drop_handler);
                }
                static get observedAttributes() {
                    return [];
                }
                attributeChangedCallback(name, oldVal, newVal) {
                    this[name] = newVal;
                }
                self_drop_handler(ev) {
                    ev.preventDefault();
                    const data = ev.dataTransfer.getData("text/html");
                    console.log('Drop of', data, ' Started on', ev.target);
                    ev.target.innerHTML += data;
                    this.setAttribute('style', '');
                    Array.from({ length: this.children.length }, (_, index) => {
                        let child = this.children.item(index);
                        //console.log(index, child.nodeName, child);
                        if (child.nodeName != 'STYLE' && !child.getAttribute('cpx-drop')) {
                            child.addEventListener('dragover', this.dragover_handler);
                            child.setAttribute('cpx-drop', '');
                        }
                    });
                    //this.removeEventListener('dragover', this.dragover_handler);
                }
                dragover_handler(ev) {
                    ev.preventDefault();
                    ev.dataTransfer.dropEffect = "copy";
                    this.setAttribute('style', 'border-color:#FF8833');
                }
                drop_handler(ev) {
                    ev.preventDefault();
                    const data = ev.dataTransfer.getData("text/html");
                    //console.log('Drop of',data,' Started on', ev.target);
                    ev.target.innerHTML += data;
                }
            };
            exports_1("default", CPXPorte);
            window.customElements.define('cpx-porte', CPXPorte);
        }
    };
});

const __exp = __instantiate("cpx-porte");
export default __exp["default"];
