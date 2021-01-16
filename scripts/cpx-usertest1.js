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

System.register("cpx-usertest1", [], function (exports_1, context_1) {
    "use strict";
    var CPXUserTest1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            CPXUserTest1 = class CPXUserTest1 extends HTMLElement {
                constructor() {
                    super();
                    this._method = 'post';
                    this._for = '';
                    this._data = '/graphql';
                    this._fx = 'getUserById';
                    this.template = document.createElement("template");
                    this.attachShadow({ mode: "open" });
                }
                get user() {
                    return this._user;
                }
                set user(val) {
                    if (this._user === val)
                        return;
                    this._user = val;
                    this.render();
                    // top.document.querySelectorAll(`.user${this.id} [data-user]`).forEach(ele => {
                    //     ele.innerHTML = `
                    //         ${val[ele.getAttribute('data-user')]}
                    //     `
                    // });
                    // top.document.querySelectorAll(`.user${this.id} [data-eval]`).forEach(ele => {
                    //     let evals = val['evals'].filter(e => e['product']['id'] == ele.getAttribute('data-eval')).pop();
                    //     ele.innerHTML = evals['product']['name']+' - '+evals['days_remaining'];
                    // });
                    console.log(`ID ${this.id} done`, performance.now() - this._timer);
                }
                get id() {
                    return this._id;
                }
                set id(val) {
                    if (this._id == val)
                        return;
                    this._id = Number.parseInt(val);
                    this.setAttribute('id', val.toString());
                    this.search();
                }
                get data() {
                    return this._data;
                }
                set data(val) {
                    if (this._data === val)
                        return;
                    this._data = val;
                    this.setAttribute('data', val);
                }
                get fx() {
                    return this._fx;
                }
                set fx(val) {
                    if (this._fx === val)
                        return;
                    this._fx = val;
                    this.setAttribute('fx', val);
                }
                get method() {
                    return this._method;
                }
                set method(val) {
                    if (this._method === val)
                        return;
                    this._method = val;
                    this.setAttribute('method', val);
                }
                connectedCallback() {
                    // Do stuff here
                    // this.search();
                }
                static get observedAttributes() {
                    return ['id', 'username', 'data', 'for', 'method'];
                }
                attributeChangedCallback(name, oldVal, newVal) {
                    this[name] = newVal;
                }
                render() {
                    this.shadowRoot.innerHTML = "";
                    this.template.innerHTML = this.querySelector('template').innerHTML;
                    if (window['ShadyCSS']) {
                        window['ShadyCSS'].prepareTemplate(this.template, 'cpx-usertest1');
                    }
                    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
                }
                search() {
                    let evt = { bubbles: true, composed: true };
                    this.dispatchEvent(new CustomEvent('user-start', evt));
                    //let qURL = new URL(this.data);
                    // qURL.searchParams.set('start', this.from.toString());
                    // qURL.searchParams.set('q', this.term || '');
                    // qURL.searchParams.set('hl', 'true');
                    // qURL.searchParams.set('hl.fl', 'description');
                    // qURL.searchParams.set('size', this.limit.toString());
                    let method = {
                        post: {
                            url: this.data,
                            options: {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                },
                                body: JSON.stringify({ query: `{${this.fx}(id:${this.id}){username evals { product { id name } days_remaining }}}` })
                            }
                        },
                        get: {
                            url: `${this.data}?query={${this.fx}(id:"${this.id}"){title author created url description}}`,
                            options: {
                                method: 'GET'
                            }
                        }
                    };
                    fetch(method[this.method].url, method[this.method].options)
                        .then((resp) => resp.json())
                        .then(resdata => {
                        this._timer = performance.now();
                        this.user = resdata.data[this.fx];
                    });
                    //fetch(qURL.toString()) //this.urlTemplate`${this.url}${this.term}${this.from}${this.limit}${this.sort}${this.filters}`)
                }
            };
            exports_1("default", CPXUserTest1);
            window.customElements.define('cpx-usertest1', CPXUserTest1);
        }
    };
});

const __exp = __instantiate("cpx-usertest1");
export default __exp["default"];