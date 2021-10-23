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
    
        if (this.options.icon.toLowerCase() === 'danger') {
            this.modalIconInnerEl.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" id="icon" viewBox="0 0 32 32" fill="none"><defs><style/></defs><title>error</title><g id="Icon-2" data-name="Icon"><path d="M2,16H2A14,14,0,1,0,16,2,14,14,0,0,0,2,16Zm23.15,7.75L8.25,6.85a12,12,0,0,1,16.9,16.9ZM8.24,25.16A12,12,0,0,1,6.84,8.27L23.73,25.16a12,12,0,0,1-15.49,0Z" transform="translate(0)" fill="#fb4040"/></g><g id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;"><rect class="cls-1" width="32" height="32"/></g></svg>
            `;
        } else if(this.options.icon.toLowerCase() === 'success') {
        	this.modalIconInnerEl.innerHTML = `
        		<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M30.6665 18.3128L21.729 27.2712L18.2915 23.8337C18.1047 23.6156 17.8749 23.4384 17.6165 23.3134C17.358 23.1883 17.0765 23.1181 16.7895 23.107C16.5026 23.0959 16.2165 23.1443 15.9492 23.249C15.6818 23.3537 15.439 23.5126 15.236 23.7156C15.033 23.9187 14.8741 24.1615 14.7694 24.4288C14.6646 24.6962 14.6163 24.9823 14.6274 25.2692C14.6384 25.5561 14.7087 25.8376 14.8338 26.0961C14.9588 26.3546 15.1359 26.5844 15.354 26.7712L20.2498 31.6878C20.4445 31.8809 20.6754 32.0337 20.9292 32.1373C21.183 32.241 21.4548 32.2936 21.729 32.292C22.2756 32.2897 22.7993 32.0727 23.1873 31.6878L33.604 21.2712C33.7993 21.0775 33.9543 20.8471 34.06 20.5932C34.1658 20.3393 34.2203 20.067 34.2203 19.792C34.2203 19.517 34.1658 19.2447 34.06 18.9908C33.9543 18.7369 33.7993 18.5065 33.604 18.3128C33.2137 17.9248 32.6857 17.707 32.1353 17.707C31.5849 17.707 31.0569 17.9248 30.6665 18.3128ZM24.9998 4.16699C20.8794 4.16699 16.8515 5.38885 13.4255 7.67804C9.99944 9.96724 7.32918 13.221 5.75236 17.0278C4.17553 20.8345 3.76296 25.0234 4.56682 29.0647C5.37068 33.106 7.35486 36.8181 10.2685 39.7317C13.182 42.6453 16.8942 44.6295 20.9355 45.4334C24.9767 46.2372 29.1656 45.8246 32.9724 44.2478C36.7792 42.671 40.0329 40.0007 42.3221 36.5747C44.6113 33.1487 45.8332 29.1208 45.8332 25.0003C45.8332 22.2645 45.2943 19.5554 44.2473 17.0278C43.2004 14.5001 41.6658 12.2035 39.7312 10.2689C37.7967 8.33438 35.5 6.79981 32.9724 5.75284C30.4448 4.70586 27.7357 4.16699 24.9998 4.16699ZM24.9998 41.667C21.7035 41.667 18.4812 40.6895 15.7403 38.8582C12.9995 37.0268 10.8633 34.4238 9.60186 31.3784C8.34039 28.3329 8.01034 24.9818 8.65343 21.7488C9.29651 18.5158 10.8839 15.5461 13.2147 13.2152C15.5456 10.8843 18.5153 9.29699 21.7483 8.6539C24.9814 8.01082 28.3325 8.34087 31.3779 9.60233C34.4233 10.8638 37.0263 13 38.8577 15.7408C40.689 18.4816 41.6665 21.704 41.6665 25.0003C41.6665 29.4206 39.9106 33.6598 36.785 36.7854C33.6594 39.911 29.4201 41.667 24.9998 41.667Z" fill="#0B8EF9"/>
</svg>
        	`;
        } 


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
// module.exports = Toast
