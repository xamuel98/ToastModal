class Toast {
    constructor (options) {

        if ( !options.message ) {
            throw new Error('ToastModal.js - You need to set a message to display');
            return;
        }
    
        // if ( !options.text ) {
        //     throw new Error('ToastModal.js - You need to set a text to display');
        //     return;
        // }
    
        if ( !options.icon ) {
            throw new Error('ToastModal.js - You need to set an icon to display');
            return;
        }
    
        this.options = options;
        this.options.timer = options.timer || 3000;
        this.options.alwaysOn = options.alwaysOn || false;
        this.options.type = options.type || 'default';
        this.options.showConfirmButton = options.showConfirmButton;
        this.options.confirmButtonText = options.confirmButtonText || 'Close';
    
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
    
        /* Check if timer is valid integer */
        this.ms = parseInt(this.options.timer);
        if(isNaN(this.ms) || this.ms < 1) {
            this.ms = 2000;
        };
    
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
            ['modal-header', 'border-0', 'toastmodal-header'].map((v) => {
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
        if(document.querySelector('.modal__close--button')) {
            document.querySelector('.modal__close--button').addEventListener('click', () => {
                this._close();
            })
        }

        // CLick overlay to close modal
        if(document.querySelector('.gd-modal-backdrop')) {
            document.querySelector('.gd-modal-backdrop').addEventListener('click', (e) => {
                // this._close();
                e.stopPropagation();
            })
        }
    
        if ( this.options.customButtons ) {
            const customButtonsElArray = Array.prototype.slice.call( document.querySelectorAll('.toast-btn--custom') );
            customButtonsElArray.map( (el, index) => {
                el.addEventListener('click', (event) => this.options.customButtons[index].onClick(event) );
            });
        }

        if (document.querySelector('.modal-dialog')) {
            document.querySelector('.modal-dialog').addEventListener('click', (e) => {
                e.stopPropagation();
            })
        }
    
    };

    _timer() {
        if(!this.options.alwaysOn) {
            /* Auto expire the Toast after the specified ms */
            return new Promise((resolve, reject) => {
            
                setTimeout(() => {
                    this._close()
    
                    resolve();
                }, this.ms); 
            });
        }
    }
    
    _close() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
    
                this.modalIconInnerEl.innerHTML = '';
                this.modalIconInnerEl.classList.remove('default', 'success', 'warning', 'danger');
    
                if ( this.focusedElBeforeOpen ) {
                    this.focusedElBeforeOpen.focus();
                }
    
                resolve();
    
            }, 100); 
            this.modalContainerEl.remove();
        });     
    };
    
    _open() {
    
        this.modalIconInnerEl.classList.add(this.options.type);
        this.modalEl.style.display = 'block';
    
        let customButtons = '';
        if ( this.options.customButtons ) {
            customButtons = this.options.customButtons.map((customButton, index) => {
                return `<button type="button" class="btn btn-block ${this.options.type} ${customButton.btnClass} toast-btn--custom">${customButton.text}</button>`
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
        } else if(this.options.icon.toLowerCase() === 'default') {
            this.modalIconInnerEl.innerHTML = `
                <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.7167 10.1561C25.884 10.3227 26.0831 10.4549 26.3024 10.5451C26.5217 10.6354 26.7569 10.6818 26.9945 10.6818C27.2321 10.6818 27.4673 10.6354 27.6866 10.5451C27.9059 10.4549 28.1049 10.3227 28.2722 10.1561L35.4707 3.04658C35.8096 2.7119 36 2.25796 36 1.78465C36 1.31133 35.8096 0.857397 35.4707 0.522711C35.1319 0.188025 34.6722 0 34.193 0C33.7138 0 33.2541 0.188025 32.9153 0.522711L26.9945 6.38804L24.673 4.07746C24.5052 3.91174 24.306 3.78028 24.0867 3.6906C23.8675 3.60091 23.6325 3.55475 23.3952 3.55475C22.916 3.55475 22.4564 3.74277 22.1175 4.07746C21.9497 4.24318 21.8166 4.43992 21.7258 4.65644C21.635 4.87296 21.5882 5.10503 21.5882 5.33939C21.5882 5.81271 21.7786 6.26664 22.1175 6.60133L25.7167 10.1561ZM34.193 8.89414C33.7157 8.89414 33.258 9.0814 32.9205 9.41472C32.583 9.74804 32.3934 10.2001 32.3934 10.6715V26.6679C32.3934 27.1393 32.2038 27.5914 31.8663 27.9247C31.5288 28.258 31.071 28.4453 30.5937 28.4453H5.3989C4.9216 28.4453 4.46386 28.258 4.12636 27.9247C3.78887 27.5914 3.59926 27.1393 3.59926 26.6679V9.62286L14.1811 20.0916C15.1911 21.081 16.5557 21.6367 17.9783 21.6379C19.4367 21.6305 20.8333 21.0558 21.8655 20.0383L24.9609 16.9812C25.2998 16.6465 25.4901 16.1926 25.4901 15.7193C25.4901 15.2459 25.2998 14.792 24.9609 14.4573C24.622 14.1226 24.1624 13.9346 23.6832 13.9346C23.2039 13.9346 22.7443 14.1226 22.4054 14.4573L19.2561 17.5677C18.9197 17.8934 18.4674 18.0758 17.9963 18.0758C17.5253 18.0758 17.073 17.8934 16.7366 17.5677L6.13674 7.11677H16.1967C16.674 7.11677 17.1317 6.92951 17.4692 6.59619C17.8067 6.26286 17.9963 5.81078 17.9963 5.33939C17.9963 4.86801 17.8067 4.41592 17.4692 4.0826C17.1317 3.74928 16.674 3.56202 16.1967 3.56202H5.3989C3.96702 3.56202 2.59379 4.1238 1.5813 5.12376C0.568811 6.12373 0 7.47997 0 8.89414V26.6679C0 28.082 0.568811 29.4383 1.5813 30.4383C2.59379 31.4382 3.96702 32 5.3989 32H30.5937C32.0256 32 33.3988 31.4382 34.4113 30.4383C35.4238 29.4383 35.9926 28.082 35.9926 26.6679V10.6715C35.9926 10.2001 35.803 9.74804 35.4655 9.41472C35.128 9.0814 34.6703 8.89414 34.193 8.89414Z" fill="#0B8EF9"/>
                </svg>
            `;
        }
    
        this.modalHeaderEl.innerHTML = `
            <h1 class="${this.options.type} modal_header--title">${this.options.message}</h1>
        `;

        let customErrors = '';
        if ( this.options.customErrors ) {
            customErrors = this.options.customErrors.map( (customError, index) => {
                console.log(customError);
                return `
                    <div class="${customError.type} comono__modal--message error-message--custom bg--">
                        <p class="text-center">
                            ${customError.text}
                        </p>
                    </div>
                `;
            })
            customErrors = customErrors.join('');
        }

        if(this.options.text) {
            this.modalBodyEl.innerHTML = `
                <div class="${this.options.type} comono__modal--message bg--">
                    <p class="text-center">
                        ${this.options.text}
                    </p>
                </div>
            `;
        }

        this.modalBodyEl.innerHTML += `
            ${customErrors}
            ${customButtons}
        `;
        
        if(this.options.showConfirmButton === false) {
            this.modalBodyEl.innerHTML += ``;
        } else {
            this.modalBodyEl.innerHTML += `
                <button type="button" class="btn btn-block modal__close--button ${this.options.type}">${this.options.confirmButtonText}</button>
            `;
        }
        // this.modalBodyEl.innerHTML += this.options.showConfirmButton === true ? `
        //     <button type="button" class="btn btn-block modal__close--button ${this.options.type}">${this.options.confirmButtonText}</button>
        // ` : ``;
    
        this.focusedElBeforeOpen = document.activeElement;
        if(document.querySelector('.modal__close--button')) {
            document.querySelector('.modal__close--button').focus();
        }
        
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
            this._timer();
        })
    };
}

export default Toast
// module.exports = Toast
