class Toast {
    constructor (options) {

        if ( !options.message ) {
            throw new Error('ToastModal.js - You need to set a message to display');
            return;
        }
    
        if ( !options.text ) {
            throw new Error('ToastModal.js - You need to set a text to display');
            return;
        }
    
        if ( !options.icon ) {
            throw new Error('ToastModal.js - You need to set an icon to display');
            return;
        }
    
        this.options = options;
        this.options.type = options.type || 'default';
    
        this.modalContainerEl = document.querySelector('.gd-modal-backdrop');
        this.modalEl = document.querySelector('.modal');
        this.modalDialogEl = document.querySelector('.modal-dialog');
        this.modalContentEl = document.querySelector('.modal-content');
        this.modalIconWrapperEl = document.querySelector('modal__icon--wrapper');
        this.modalWrapperInnerEl = document.querySelector('wrapper-inner');
        this.modalBubbleEl = document.querySelector('buble');
        this.modalIconInnerEl = document.querySelector('icon__inner');
        this.modalHeaderEl = document.querySelector('modal-header');
        this.modalBodyEl = document.querySelector('modal-body');
    
    
        this._init();
    };

    _createElements() {
        return new Promise((resolve, reject) => {
            // Modal backdrop
            this.modalContainerEl = document.createElement('div');
            this.modalContainerEl.classList.add('gd-modal-backdrop');
    
            // Modal
            this.modalEl = document.createElement('div');
            ['modal', 'fade', 'show', 'overflow-auto'].map((v) => {
                this.modalEl.classList.add(v);
            });
            this.modalEl.style.display = 'block';
            this.modalEl.setAttribute('role', 'dialog');
            this.modalEl.setAttribute('aria-labelledby', "modalTitle"); 
            this.modalEl.setAttribute('aria-describedby', "modalDescription"); 
    
            // Modal Dialog
              this.modalDialogEl = document.createElement('div');
              ['modal-dialog', 'gd-modal-dialog-centered'].map((v) => {
                this.modalDialogEl.classList.add(v);
            });
            this.modalDialogEl.style.cursor = 'default';
            this.modalDialogEl.style.height = '100vh';
            this.modalDialogEl.setAttribute('role', 'document');
    
            // Modal content
            this.modalContentEl = document.createElement('div');
            this.modalContentEl.classList.add('modal-content');
    
    
            // Modal Icon Wrapper
            this.modalIconWrapperEl = document.createElement('div');
            this.modalIconWrapperEl.classList.add('modal__icon--wrapper');
    
            // Modal Wrapper Inner
            this.modalWrapperInnerEl = document.createElement('div');
            this.modalWrapperInnerEl.classList.add('wrapper-inner');
    
            // Modal Bubble
            this.modalBubbleEl = document.createElement('div');
            this.modalBubbleEl.classList.add('buble');
    
            // Modal Icon Inner
            this.modalIconInnerEl = document.createElement('div');
            this.modalIconInnerEl.classList.add('icon__inner');
    
            // Modal Header
            this.modalHeaderEl = document.createElement('div');
            ['modal-header', 'border-0'].map((v) => {
                this.modalHeaderEl.classList.add(v);
            }); 
    
            // Modal Body
            this.modalBodyEl = document.createElement('div');
            this.modalBodyEl.classList.add('modal-body');
    
    
    
            this.modalBubbleEl.appendChild(this.modalIconInnerEl);
            this.modalWrapperInnerEl.appendChild(this.modalBubbleEl);
            this.modalIconWrapperEl.appendChild(this.modalWrapperInnerEl);
            this.modalContentEl.appendChild(this.modalIconWrapperEl);
            this.modalContentEl.appendChild(this.modalHeaderEl);
            this.modalContentEl.appendChild(this.modalBodyEl);
    
            this.modalDialogEl.appendChild(this.modalContentEl);
            this.modalEl.appendChild(this.modalDialogEl);
            this.modalContainerEl.appendChild(this.modalEl);
            document.body.appendChild(this.modalContainerEl);
    
            setTimeout(() => resolve(), 500);
        })
    };
    
    _addEventListeners() {
    
        document.querySelector('.modal__close--button').addEventListener('click', () => {
            this._close();
        })
    
        if ( this.options.customButtons ) {
            const customButtonsElArray = Array.prototype.slice.call( document.querySelectorAll('.toastjs-btn--custom') );
            customButtonsElArray.map( (el, index) => {
                el.addEventListener('click', (event) => this.options.customButtons[index].onClick(event) );
            });
        }
    
    };
    
    _close() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
    
                this.modalIconInnerEl.innerHTML = '';
                this.modalIconInnerEl.classList.remove('default', 'success', 'warning', 'danger');
    
                if ( this.focusedElBeforeOpen ) {
                    this.focusedElBeforeOpen.focus();
                }
    
                resolve();
    
            }, 1000); 
            this.modalContainerEl.remove();
        });     
    };
    
    _open() {
    
        this.modalIconInnerEl.classList.add(this.options.type);
        this.modalEl.style.display = 'block';
    
        let customButtons = '';
        if ( this.options.customButtons ) {
            customButtons = this.options.customButtons.map((customButton, index) => {
                return `<button type="button" class="toastjs-btn toastjs-btn--custom">${customButton.text}</button>`
            })
            customButtons = customButtons.join('');
        }
    
        this.modalIconInnerEl.innerHTML = `
            <img src="${this.options.icon.toLowerCase()}.svg" alt="">
        `;
    
        this.modalHeaderEl.innerHTML = `
            <h1 class="${this.options.type} modal_header--title">${this.options.message}</h1>
        `;
    
        this.modalBodyEl.innerHTML = `
            <div class="${this.options.type} comono__modal--message bg--">
                <p class="text-center">
                    ${this.options.text}
                </p>
            </div>
        `;
    
        this.modalBodyEl.innerHTML += `
            <button type="button" class="btn btn-block btn-primary modal__close--button ${this.options.type}">Close</button>
        `;
    
        this.focusedElBeforeOpen = document.activeElement;
        document.querySelector('.modal__close--button').focus();
    };
    
    _init() {
        Promise.resolve()
        .then(() => {
            if ( this.modalContainerEl ) { 
                return Promise.resolve();
            }
            return this._createElements();
        })
        .then(() => {
            // if ( this.modalContainerEl.getAttribute('aria-hidden') == 'false'  ) {
            //     return this._close();
            // }
            return Promise.resolve();
        })
        .then(() => {
            this._open();
            this._addEventListeners();
        })
    };
}

export default Toast
