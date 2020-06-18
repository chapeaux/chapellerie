export default class CPXLever extends HTMLElement {
    constructor() {
        super();

        this.setDraggable = this.setDraggable.bind(this);
    }

    connectedCallback() {
        Array.from({length: this.children.length}, this.setDraggable);
        this.addEventListener('dragstart', this.dragstart_handler);
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        this[name] = newVal;
    }

    setDraggable(_,index) {
        this.children.item(index).setAttribute('draggable','true');
    }

    dragstart_handler(ev) {
        console.log('Drag Started');
        let img = new Image(); 
        img.src = 'https://picsum.photos/20'; 
        ev.dataTransfer.setDragImage(img, 20, 20);
        ev.dataTransfer.setData('text/html', ev.target.outerHTML);
        ev.dataTransfer.dropEffect = "copy";
    }
}

window.customElements.define('cpx-lever', CPXLever);
