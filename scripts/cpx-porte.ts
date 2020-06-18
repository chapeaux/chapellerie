export default class CPXPorte extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener('ondragover', this.dragover_handler);
        this.addEventListener('ondrop', this.drop_handler);
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }

    dragover_handler(ev) {
        ev.preventDefault();
        console.log("DragOver")
        ev.dataTransfer.dropEffect = "copy";
    }
    drop_handler(ev) {
        ev.preventDefault();
        console.log('Drop Started');
        const data = ev.dataTransfer.getData("text/html");
        console.log(data);
        //ev.target.appendChild(document.getElementById)
    }
}

window.customElements.define('cpx-porte', CPXPorte);
