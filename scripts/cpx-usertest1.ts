export default class CPXUserTest1 extends HTMLElement {
    _id;
    _username;
    _evals;
    _method = 'post';
    _for = '';
    _data = '/graphql';
    _fx = 'getUserById';
    _user;
    _timer;
    template;

    get user() {
        return this._user;
    }
    set user(val) {
        if (this._user === val) return;
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
        console.log(`ID ${this.id} done`, performance.now()-this._timer);
    }

    get id() {
        return this._id;
    }

    set id(val) {
        if (this._id == val) return;
        this._id = Number.parseInt(val);
        this.setAttribute('id', val.toString());
        this.search();
    }

    get data() {
        return this._data;
    }
    set data(val) {
        if (this._data === val) return;
        this._data = val;
        this.setAttribute('data', val);
    }

    get fx() {
        return this._fx;
    }
    set fx(val) {
        if (this._fx === val) return;
        this._fx = val;
        this.setAttribute('fx', val);
    }

    get method() {
        return this._method;
    }
    set method(val) {
        if (this._method === val) return;
        this._method = val;
        this.setAttribute('method', val);
    }

    constructor() {
        super();
        this.template = document.createElement("template");
        this.attachShadow({ mode: "open" });
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
        let txt = 
        this.template.innerHTML = String.raw({ raw: 'test' }, 0, 1, 2); String.raw(this.querySelector('template').innerHTML, this);

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
                    method:'POST',
                    headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    },
        body:JSON.stringify({query:`{${this.fx}(id:${this.id}){username evals { product { id name } days_remaining }}}`})
                }
            },
            get: {
                url: `${this.data}?query={${this.fx}(id:"${this.id}"){title author created url description}}`, 
                options: {
                    method:'GET'
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
}

window.customElements.define('cpx-usertest1', CPXUserTest1);
