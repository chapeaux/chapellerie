let setDroppable = index => {
    let child = this.children.item(index);
    if (child.nodeName != 'STYLE' && child.getAttribute('cpx-drop')) {
        child.addEventListener('dragover', this.dragover_handler);
        child.setAttribute('cpx-drop', 'true');
    }
};

export default class CPXPorte extends HTMLElement {
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
            Array.from({length: this.children.length}, setDroppable);
        } else {
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
        console.log('Drop of',data,' Started on', ev.target);
        ev.target.innerHTML += data;
        this.setAttribute('style','');
        Array.from({length: this.children.length}, (_,index) => {
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
        this.setAttribute('style','border-color:#FF8833');
    }
    drop_handler(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text/html");
        console.log('Drop of',data,' Started on', ev.target);
        ev.target.innerHTML += data;
    }
}

window.customElements.define('cpx-porte', CPXPorte);
