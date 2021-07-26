class CPXTabStream extends HTMLElement {
    static get tag() {
        return 'cpx-tab-stream';
    }
    static get html() {
        return `\n<style>\n        :host {\n            width: 100vw;\n            height: 100vh;\n            background: #ccc;\n        }\n        video {\n            width: 100%;\n        }\n</style>\n<video id="streambox"></video>`;
    }
    constructor(){
        super();
        this.attachShadow({
            mode: 'open'
        });
        this.shadowRoot.innerHTML = CPXTabStream.html;
        this.video = this.shadowRoot.querySelector('video');
        this.media = new MediaStream();
    }
    connectedCallback() {
        navigator.getUserMedia({
            video: true,
            audio: false
        }, (stream)=>{
            this.video.srcObject = stream;
            this.video.play();
        }, (error)=>{
            console.warn('Error! Error! Error!', error);
        });
    }
    video;
    media;
}
window.customElements.define(CPXTabStream.tag, CPXTabStream);
