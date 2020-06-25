export default class CPXUser extends HTMLElement {
    _id;
    _username;
    _evals;
    _for = '';
    _data = '';

    get id() {
        return this._id;
    }

    set id(val) {
        if (this._id === val) return;
        this._id = val;
        this.setAttribute('id', val.toString());
    }

    constructor() {
        super();

    }

    connectedCallback() {
        // Do stuff here
    }

    static get observedAttributes() {
        return ['id', 'username', 'data', 'for'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }

    search() {
        let evt = { bubbles: true, composed: true };
        this.dispatchEvent(new CustomEvent('search-start', evt));
        if (this.url && ((this.activeFilters && this.activeFilters.size > 0) || (this.term !== null && this.term !== '' && typeof this.term !== 'undefined')) || this.auto) {

            let qURL = new URL(this.url);
            // qURL.searchParams.set('tags_or_logic', 'true');
            // qURL.searchParams.set('filter_out_excluded', 'true');
            qURL.searchParams.set('start', this.from.toString());
            // TODO: figure out the sorting
            // if (this.sort === 'most-recent') {
            //     qURL.searchParams.set('newFirst', 'true');
            // }
            qURL.searchParams.set('q', this.term || '');
            qURL.searchParams.set('hl', 'true');
            qURL.searchParams.set('hl.fl', 'description');
            qURL.searchParams.set('size', this.limit.toString());
            // qURL.searchParams.set('start', (this.from + this.limit).toString());

            this.activeFilters.forEach((filters, group) => {
                qURL.searchParams.set(group, Array.from(filters).join(','));
            });
            // Object.keys(this.filters.facets).forEach(group => {
            //     this.filters.facets[group].forEach(facet => {
            //          facetQuery[group] = top.document.querySelector(`dp-search-filter-item[group=${group}][key=${facet}]`).getAttribute('type').replace(',', ' OR ')
            //     });
            // });
            // console.log(this.activeFilters);
            // qURL.searchParams.set('fq', facetQuery.);
            //facetQuery // map reduce??
            let method = { 
                post: {
                    url: this.url, 
                    options: {
                        method:'POST',
                        headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                        },
			body:JSON.stringify({query:`{${this.fx}(term:"${this.term || '*'}"){title created author url description}}`})
                    }
                },
                get: {
                    url: `${this.url}?query={${this.fx}(term:"${this.term || '*'}"){title author created url description}}`, 
                    options: {
                        method:'GET'
                    }
                }
            };
            fetch(method[this.method].url, method[this.method].options)
                .then((resp) => resp.json())
                .then(resdata => {
                    this.results = resdata.data[this.fx];
            });
            //fetch(qURL.toString()) //this.urlTemplate`${this.url}${this.term}${this.from}${this.limit}${this.sort}${this.filters}`)
        } else {
            let evt = { detail: { invalid: true }, bubbles: true, composed: true };
            this.dispatchEvent(new CustomEvent('search-complete', evt));
        }
    }
}

window.customElements.define('cpx-user', CPXUser);
