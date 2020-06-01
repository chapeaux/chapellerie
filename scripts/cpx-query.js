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

System.register("cpx-query", [], function (exports_1, context_1) {
  "use strict";
  var CPXQuery;
  var __moduleName = context_1 && context_1.id;
  return {
    setters: [],
    execute: function () {
      CPXQuery = class CPXQuery extends HTMLElement {
        constructor() {
          super();
          this._filters = { term: "", facets: {} };
          this._activeFilters = new Map();
          this._limit = 10;
          this._from = 0;
          this._sort = "relevance";
          this._valid = true;
          this._auto = false;
          this.urlTemplate = (
            strings,
            url,
            term,
            from,
            limit,
            sort,
            types,
            tags,
            sys_types,
          ) => {
            var order = "";
            if (sort === "most-recent") {
              order = "&newFirst=true";
            }
            return `${url}?start=${from}&q=${term}&hl=true&hl.fl=description&rows=${limit}&${types}&${tags}&${sys_types}`;
          };
          this._changeAttr = this._changeAttr.bind(this);
        }
        get auto() {
          return this._auto;
        }
        set auto(val) {
          this._auto = val !== null;
        }
        get filters() {
          return this._filters;
        }
        set filters(val) {
          if (this._filters === val) {
            return;
          }
          this._filters = val;
        }
        get activeFilters() {
          return this._activeFilters;
        }
        set activeFilters(val) {
          if (this._activeFilters === val) {
            return;
          }
          this._activeFilters = val;
          this.filters.facets = this._activeFilters;
        }
        get from() {
          return this._from;
        }
        set from(val) {
          if (this._from === val) {
            return;
          }
          this._from = val;
          this.setAttribute("from", val.toString());
        }
        get limit() {
          return this._limit;
        }
        set limit(val) {
          if (this._limit === val) {
            return;
          }
          this._limit = val;
          this.setAttribute("limit", val.toString());
        }
        get sort() {
          return this._sort;
        }
        set sort(val) {
          if (this._sort === val) {
            return;
          }
          this._sort = val;
          this.setAttribute("sort", val);
        }
        get fx() {
          return this._fx;
        }
        set fx(val) {
          if (this._fx === val) {
            return;
          }
          this._fx = val;
          this.setAttribute("fx", val);
        }
        get results() {
          return this._results;
        }
        set results(val) {
          if (this._results === val) {
            return;
          }
          this._results = val;
          this.from =
            this.results && this.results.response &&
            typeof this.results.response.docs !== "undefined"
              ? this.from + this.results.response.docs.length
              : 0;
          let evt = {
            detail: {
              term: this.term,
              filters: this.activeFilters,
              //facets: this.results.facet_counts || {},
              sort: this.sort,
              limit: this.limit,
              from: this.from,
              results: this.results,
            },
            bubbles: true,
            composed: true,
          };
          this.dispatchEvent(new CustomEvent("search-complete", evt));
        }
        get term() {
          return this._term;
        }
        set term(val) {
          if (this._term === val) {
            return;
          }
          this._term = val;
          this.filters.term = this._term;
          this.setAttribute("term", val.toString());
        }
        get url() {
          return this._url;
        }
        set url(val) {
          if (this._url === val) {
            return;
          }
          this._url = val;
          this.setAttribute("url", val.toString());
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
        filterString(facets) {
          var len = facets.length, filterArr = [];
          for (let i = 0; i < len; i++) {
            for (let j = 0; j < facets[i].items.length; j++) {
              if (facets[i].items[j].active) {
                let idx = 0;
                while (idx < facets[i].items[j].value.length) {
                  filterArr.push(facets[i].items[j].value[idx]);
                  idx = idx + 1;
                }
              }
            }
          }
          return filterArr.join(", ");
        }
        connectedCallback() {
          //super.connectedCallback();
          top.addEventListener("params-ready", this._changeAttr);
          top.addEventListener("term-change", this._changeAttr);
          top.addEventListener("filter-item-change", this._changeAttr);
          top.addEventListener("sort-change", this._changeAttr);
          top.addEventListener("clear-filters", this._changeAttr);
          //top.window.addEventListener('popstate', e => { this.results = undefined; });
          top.addEventListener("load-more", this._changeAttr);
          if (this.auto) {
            this.search();
          }
        }
        static get observedAttributes() {
          return ["term", "sort", "limit", "results", "url", "auto", "fx"];
        }
        attributeChangedCallback(name, oldVal, newVal) {
          this[name] = newVal;
        }
        _setFilters(item) {
          let add = item.active;
          if (add) {
            if (this.activeFilters.has(item.group)) {
              this.activeFilters.get(item.group).add(item.key);
            } else {
              this.activeFilters.set(item.group, new Set([item.key]));
            }
            // this.activeFilters[item.group] = this.activeFilters[item.group] || [];
            // this.activeFilters[item.group].push(item.key);
          } else {
            if (this.activeFilters.has(item.group)) {
              this.activeFilters.get(item.group).delete(item.key);
              if (this.activeFilters.get(item.group).size === 0) {
                this.activeFilters.delete(item.group);
              }
            }
            // Object.keys(this.activeFilters).forEach(group => {
            //     if (group === item.group) {
            //         let idx = this.activeFilters[group].indexOf(item.key);
            //         if (idx >= 0) {
            //             this.activeFilters[group].splice(idx, 1);
            //             if (this.activeFilters[group].length === 0) {
            //                 delete this.activeFilters[group];
            //             }
            //         }
            //     }
            // });
          }
        }
        _changeAttr(e) {
          // console.log(e);
          switch (e.type) {
            case "term-change":
              if (e.detail && e.detail.term && e.detail.term.length > 0) {
                this.term = e.detail.term;
              } else {
                this.term = "";
              }
              this.from = 0;
              this.search();
              break;
            case "filter-item-change": //detail.facet
              if (e.detail && e.detail.facet) {
                this._setFilters(e.detail.facet);
              }
              this.from = 0;
              this.search();
              // Wait for params-ready event
              break;
            case "sort-change": // detail.sort
              if (e.detail && e.detail.sort) {
                this.sort = e.detail.sort;
              }
              this.from = 0;
              this.search();
              break;
            case "load-more": // detail.qty
              this.search();
              break;
            case "clear-filters":
              this.activeFilters.clear();
              this.search();
              break;
            case "params-ready":
              if (e.detail && e.detail.term) {
                this.term = e.detail.term;
              }
              if (e.detail && e.detail.sort) {
                this.sort = e.detail.sort;
              }
              if (e.detail && e.detail.filters) {
                this.activeFilters = e.detail.filters;
              }
              this.from = 0;
              if (
                this.activeFilters.size > 0 || e.detail.term !== null ||
                e.detail.sort !== null || e.detail.qty !== null
              ) {
                this.search();
              }
              break;
          }
        }
        search() {
          let evt = { bubbles: true, composed: true };
          this.dispatchEvent(new CustomEvent("search-start", evt));
          if (
            this.url &&
              ((this.activeFilters && this.activeFilters.size > 0) ||
                (this.term !== null && this.term !== "" &&
                  typeof this.term !== "undefined")) || this.auto
          ) {
            let qURL = new URL(this.url);
            // qURL.searchParams.set('tags_or_logic', 'true');
            // qURL.searchParams.set('filter_out_excluded', 'true');
            qURL.searchParams.set("start", this.from.toString());
            // TODO: figure out the sorting
            // if (this.sort === 'most-recent') {
            //     qURL.searchParams.set('newFirst', 'true');
            // }
            qURL.searchParams.set("q", this.term || "");
            qURL.searchParams.set("hl", "true");
            qURL.searchParams.set("hl.fl", "description");
            qURL.searchParams.set("size", this.limit.toString());
            // qURL.searchParams.set('start', (this.from + this.limit).toString());
            this.activeFilters.forEach((filters, group) => {
              qURL.searchParams.set(group, Array.from(filters).join(","));
            });
            // Object.keys(this.filters.facets).forEach(group => {
            //     this.filters.facets[group].forEach(facet => {
            //          facetQuery[group] = top.document.querySelector(`dp-search-filter-item[group=${group}][key=${facet}]`).getAttribute('type').replace(',', ' OR ')
            //     });
            // });
            // console.log(this.activeFilters);
            // qURL.searchParams.set('fq', facetQuery.);
            //facetQuery // map reduce??
            let post = {
              url: this.url,
              options: {
                method: "POST",
                headers: {
                  "Content-Type": "application/graphql",
                  "Accept": "application/json",
                },
                mode: "cors",
                body: `{${this.fx}(term:"${this.term ||
                  "*"}")(first{title id author url description}}`,
              },
            };
            let get = {
              url: `${this.url}?query={${this.fx}(term:"${this.term ||
                "*"}"){title author created url description}}`,
              options: {
                method: "GET",
              },
            };
            fetch(get.url, get.options)
              .then((resp) => resp.json())
              .then((resdata) => {
                this.results = resdata.data[this.fx];
              });
            //fetch(qURL.toString()) //this.urlTemplate`${this.url}${this.term}${this.from}${this.limit}${this.sort}${this.filters}`)
          } else {
            let evt = {
              detail: { invalid: true },
              bubbles: true,
              composed: true,
            };
            this.dispatchEvent(new CustomEvent("search-complete", evt));
          }
        }
      };
      exports_1("default", CPXQuery);
      window.customElements.define("cpx-query", CPXQuery);
    },
  };
});

const __exp = __instantiate("cpx-query");
export default __exp["default"];
