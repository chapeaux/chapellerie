const svcURL = 'https://api.developers.stage.redhat.com/search/v1/graphql';
const svcFx = 'latestFusionBlogs';
//const svcURL = 'http://localhost:8080/vertx-graphql';

class WCTestTmpl extends HTMLElement {
    get value() {
      return this._value;
    }
    set value(val) {
      if (this._value === val) return;
      this._value = val;
      this.setAttribute('value',this._value);
    }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.value = "WCTestTmpl Value";
      //console.log('Constructor:',Date.now())
    }
    
    connectedCallback() {
      //console.log('Connected Start:',Date.now())
      let tmpl = this.querySelector('template');
      this.shadowRoot.innerHTML = "";
      tmpl.innerHTML = this.injectData(tmpl.innerHTML);
      this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
      //console.log('Connected End:',Date.now())
    }
    
    static get observedAttributes() {
          return ['value'];
      }
  
    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }
    
    injectData(layout) {
      let re = /(\{\{\w+\}\})/gm
      let br = /[\{\}]+/g
      let fill = (match, p1, offset, string) => {
          return this[match.replace(br,'')] ? this[match.replace(br,'')] : '';
      }
      return layout.replace(re, fill);
    }
  }
  
  class CPXQuery extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({mode:'open'});
    }
    connectedCallback() {
      let tmpl = document.createElement('template');
      tmpl.innerHTML = '<slot></slot><ul id="list"></ul>';
      this.shadowRoot.appendChild(tmpl.content.cloneNode(true));
      this.addEventListener('click', (e) => {
        let d = document.createElement('li');
        d.innerHTML = 'Woo';
        this.shadowRoot.querySelector('#list').appendChild(d);
        return false;
      });
      this.getData();
    }
    
    async getData() {
      let post = {url: svcURL, options: {
            method:'POST',
            headers: { 
            'Content-Type': 'application/graphql',
            'Accept': 'application/json'
            },
            mode: 'cors',
            body:`{${svcFx}(term:"${this.term || '*'}")(first{title id author url description}}`
        }
      };
      let get = {url: `${svcURL}?query={${svcFx}(term:"${this.term || '*'}"){title author created url description}}`, options: {
            method:'GET'
        }
      };
      await fetch(get.url, get.options)
        .then(res => res.json())
        .then(resdata => {
          resdata.data[svcFx].map(blog => {
          let d = document.createElement('li');
          d.innerHTML = `<a href="${blog.url}">${blog.title}</a><p>${blog.author} - ${blog.description}</p>`;
          this.shadowRoot.querySelector('#list').appendChild(d);
        });
      });
    }
  }
  
  //console.log('Tmpl Define:',Date.now())
  window.customElements.define('cpx-query', CPXQuery);
    
    /*
    <wc-test-tmpl>
        <template>
          <li>{{value}}</li>
        </template>
      </wc-test-tmpl>
      <wc-test-set>
      </wc-test-set>
      */