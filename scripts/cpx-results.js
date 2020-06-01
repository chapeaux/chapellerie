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

//import {PFElement} from '../../@pfelements/pfelement.umd.js';
//import PFElement from '@patternfly/pfelement/pfelement.umd';
//import CPXResult from './cpx-result.js';
System.register("cpx-results", [], function (exports_1, context_1) {
  "use strict";
  var CPXResults;
  var __moduleName = context_1 && context_1.id;
  return {
    setters: [],
    execute: function () { //import {PFElement} from '../../@pfelements/pfelement.umd.js';
      //import PFElement from '@patternfly/pfelement/pfelement.umd';
      //import CPXResult from './cpx-result.js';
      CPXResults = /** @class */ (() => {
        class CPXResults extends HTMLElement {
          constructor() {
            super();
            this._resultLayout =
              `<div><a href="{{url}}">{{description}}</a><div>`;
            this._more = false;
            this._last = 0;
            this._valid = true;
            this.template = document.createElement("template");
            this.attachShadow({ mode: "open" });
            this._renderResults = this._renderResults.bind(this);
            this._setLoading = this._setLoading.bind(this);
            this._checkValid = this._checkValid.bind(this);
            this._clearResults = this._clearResults.bind(this);
          }
          get html() {
            return `
        <style>
            :host {
                display: flex;
                flex-direction: column;
            }

            [data-hide] {
                display: none;
            }

            h4 { 
                font-size: 27px;
                font-weight: 600;
                color: #242424;
                line-height: 1.5;
                margin-bottom: 16px;
                margin-top: 16px;
            }

            p {
                font-size: 16px;
                line-height: 1.5;
                text-align: center;
            }

            div.moreBtn {
                text-align: center;
            }

            a.moreBtn {
                background-color: #fff;
                border: 1px solid #06c;
                color: #06c;
                display: block;
                font-weight: 600;
                line-height: 1.44;
                margin: 0 auto;
                max-width: 165px;
                padding: 8px 35px;
                text-transform: uppercase;
                cursor: pointer;
                text-decoration: none;
            }
            a.moreBtn:hover {
                background-color: #06c;
                color: #fff;
            }

            .loading {
                background: url(https://developers.redhat.com/images/icons/ajax-loader.gif) center 80px no-repeat;
                min-height: 250px;
            }
        </style>
        <slot></slot>
        <div class="loading" data-hide></div>
        <div class="moreBtn" data-hide><a class="moreBtn" href="#">Load More</a></div>
        <p class="end-of-results" data-hide>- End of Results -</p>
        <div class="invalidMsg" data-hide>
        <h4>Well, this is awkward. No search term was entered yet, so this page is a little empty right now.</h4>
        <p>After you enter a search term in the box above, you will see the results displayed here. 
        You can also use the filters to select a content type, product or topic to see some results too. 
        Try it out!</p>
        </div>`;
          }
          get results() {
            return this._results;
          }
          set results(val) {
            if (this._results === val) {
              return;
            }
            this._results = val;
            this._renderResults(false);
          }
          get more() {
            return this._more;
          }
          set more(val) {
            if (this._more === val) {
              return;
            }
            this._more = val;
          }
          get last() {
            return this._last;
          }
          set last(val) {
            if (this._last === val) {
              return;
            }
            this._last = val ? val : 0;
            this.setAttribute("last", val.toString());
          }
          get valid() {
            return this._valid;
          }
          set valid(val) {
            if (this._valid === val) {
              return;
            }
            this._valid = val;
          }
          get resultLayout() {
            return this._resultLayout;
          }
          set resultLayout(val) {
            if (this._resultLayout === val) {
              return;
            }
            this._resultLayout = val;
          }
          render() {
            this.shadowRoot.innerHTML = "";
            this.template.innerHTML = this.html;
            if (window["ShadyCSS"]) {
              window["ShadyCSS"].prepareTemplate(this.template, CPXResults.tag);
            }
            this.shadowRoot.appendChild(this.template.content.cloneNode(true));
          }
          connectedCallback() {
            if (this.querySelector("template")) {
              this.resultLayout = this.querySelector("template").innerHTML;
            }
            this.render();
            this.shadowRoot.querySelector("div.moreBtn").addEventListener(
              "click",
              (e) => {
                e.preventDefault();
                this.more = true;
                let evt = {
                  detail: {
                    from: this.last,
                  },
                  bubbles: true,
                  composed: true,
                };
                this.dispatchEvent(new CustomEvent("load-more", evt));
              },
            );
            top.addEventListener("search-complete", this._renderResults);
            top.addEventListener("search-start", this._setLoading);
            top.addEventListener("params-ready", this._checkValid);
            top.addEventListener("popstate", this._clearResults);
          }
          addResult(result) {
            var item = document.createElement("cpx-result");
            item["result"] = result;
            item["layout"] = this.resultLayout;
            this.appendChild(item);
          }
          _setLoading(e) {
            this.shadowRoot.querySelector("div.moreBtn").setAttribute(
              "data-hide",
              "",
            );
            this.shadowRoot.querySelector(".invalidMsg").setAttribute(
              "data-hide",
              "",
            );
            if (!this.more) {
              this.last = 0;
              while (this.firstChild) {
                this.removeChild(this.firstChild);
              }
            } else {
              this.more = false;
            }
            this.shadowRoot.querySelector(".loading").removeAttribute(
              "data-hide",
            );
          }
          _renderResults(e) {
            if (this.shadowRoot.querySelector(".loading")) {
              this.shadowRoot.querySelector(".loading").setAttribute(
                "data-hide",
                "",
              );
            }
            if (
              e.detail && typeof e.detail.results !== "undefined" &&
              typeof e.detail.invalid === "undefined"
            ) {
              this.addResults(e.detail.results);
            } else {
              while (this.firstChild) {
                this.removeChild(this.firstChild);
              }
              this.shadowRoot.querySelector(".end-of-results").setAttribute(
                "data-hide",
                "",
              );
              this.shadowRoot.querySelector("div.moreBtn").setAttribute(
                "data-hide",
                "",
              );
              this.shadowRoot.querySelector(".invalidMsg").removeAttribute(
                "data-hide",
              );
            }
            let evt = {
              detail: { results: this.results },
              bubbles: true,
              composed: true,
            };
            this.dispatchEvent(new CustomEvent("results-loaded", evt));
          }
          _clearResults(e) {
            this.results = undefined;
          }
          _checkValid(e) {
            let obj = e.detail;
            this.valid = Object.keys(obj.filters).length > 0 ||
              (obj.term !== null && obj.term !== "" &&
                typeof obj.term !== "undefined");
            if (!this.valid) {
              this.shadowRoot.querySelector(".invalidMsg").removeAttribute(
                "data-hide",
              );
            } else {
              if (this.shadowRoot.querySelector(".invalidMsg")) {
                this.shadowRoot.querySelector(".invalidMsg").setAttribute(
                  "data-hide",
                  "",
                );
              }
            }
          }
          addResults(results) {
            if (results) {
              let l = results.length;
              for (let i = 0; i < l; i++) {
                this.addResult(results[i]);
              }
              this.last = this.last + l;
              if (this.last >= results.length) {
                this.shadowRoot.querySelector(".end-of-results")
                  .removeAttribute("data-hide");
              }
              if (l > 0 && this.last < results.length) {
                this.shadowRoot.querySelector(".invalidMsg").setAttribute(
                  "data-hide",
                  "",
                );
                this.shadowRoot.querySelector(".end-of-results").setAttribute(
                  "data-hide",
                  "",
                );
                this.shadowRoot.querySelector("div.moreBtn").removeAttribute(
                  "data-hide",
                );
              } else {
                this.shadowRoot.querySelector("div.moreBtn").setAttribute(
                  "data-hide",
                  "",
                );
                this.shadowRoot.querySelector(".end-of-results")
                  .removeAttribute("data-hide");
              }
            }
          }
        }
        CPXResults.tag = "cpx-results";
        return CPXResults;
      })();
      exports_1("default", CPXResults);
      window.customElements.define("cpx-results", CPXResults);
    },
  };
});

const __exp = __instantiate("cpx-results");
export default __exp["default"];
