"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form')
    const inputs = document.querySelectorAll('input')
    const selects = document.querySelectorAll('select')
    const body = document.querySelector('body')

    const modals = document.querySelectorAll('[data-modal]')
    const backdropModal = document.querySelector('.modal__backdrop')

    modals.forEach(modal => {
        modal.addEventListener('click', toggleModal)
    })

    document.addEventListener('click', closeModal)

    toggleFocusLabel(inputs, 'input')
    toggleClearItem(inputs, 'input')
    toggleFocusLabel(selects, 'change')

    form.addEventListener('submit', formSend)
    form.addEventListener('input', formValidate)

    function toggleFocusLabel(arr, event) {
        arr.forEach(item => {
            item.addEventListener(event, () => {
                item.value !== '' ? item.nextElementSibling.classList.add('__focus') : item.nextElementSibling.classList.remove('__focus')
            })
        })
    }

    function toggleClearItem(arr, event) {
        arr.forEach(item => {
            if (item.getAttribute('type') === 'checkbox') return false

            const clearItem = document.createElement('div')
            clearItem.classList.add('form__item-clear')

            item.addEventListener(event, function () {
                this.value.length ? this.parentElement.append(clearItem) : clearItem.remove()

                clearItem.addEventListener('click', () => {
                        item.value = ''
                        item.nextElementSibling.classList.remove('__focus')
                        clearItem.remove()
                    }
                )
            })

        })
    }

    async function formSend(e) {
        e.preventDefault()

        const error = formValidate(form)
        const formData = new FormData(form)

        if (error === 0) {
            form.classList.add('_sending')

            const response = await fetch('/', {
                method: 'POST',
                body: formData
            })

            if (response.ok) {
                const result = await response.json()

                alert(result.message)
                form.reset()
                form.classList.remove('_sending')
            } else {
                alert('Ошибка')
                form.classList.remove('_sending')
            }
        } else {
            alert('Заполните обязательные поля')
        }
    }

    function formValidate() {
        let error = 0
        const formReq = document.querySelectorAll('.__req')

        formReq.forEach(input => {
            formRemoveError(input)

            if (input.classList.contains('_email')) {
                if (!emailTest(input)) {
                    formAddError(input)
                    error++
                }
            } else if (input.classList.contains('__name')) {
                if (!nameTest(input)) {
                    formAddError(input)
                    error++
                }
            } else if (input.getAttribute('type') === 'checkbox' && input.checked === false) {
                formAddError(input)
                error++
            } else {
                if (input.value === '') {
                    formAddError(input)
                    error++
                }
            }
        })

        return error
    }

    function formAddError(input) {
        if (input.getAttribute('type') !== 'checkbox') {
            input.parentElement.insertAdjacentHTML('beforeend', `<div class="incorrect">${input.nextElementSibling.textContent.replace('your', 'correct')}</div>`)
        }

        input.parentElement.classList.add('_error')
        input.classList.add('_error')
    }

    function formRemoveError(input) {
        const incorrect = input.parentElement.querySelector('.incorrect')

        if (incorrect !== null) {
            incorrect.remove()
        }

        input.parentElement.classList.remove('_error')
        input.classList.remove('_error')
    }

    function nameTest(input) {
        return /^([А-Яа-я-]+$|[A-Za-z-]|([А-Яа-я ]+$|[A-Za-z ]))+$/.test(input.value)
    }

    function emailTest(input) {
        return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input.value)
    }

    function toggleModal() {
        const idModal = this.getAttribute('data-modal')

        openModal(idModal)
    }

    function closeModal(e) {
        const modalWrap = document.querySelector('.modal__wrap')

        if (e.target.getAttribute('aria-label') === 'Accept' || e.target.getAttribute('aria-label') === 'Cancel' || e.target.classList.contains('modal__close') || e.target === modalWrap) {

            const modal = e.target === modalWrap ? e.target : e.target.offsetParent

            modal.style.opacity = 0
            backdropModal.style.opacity = 0

            setTimeout(() => {
                backdropModal.style.zIndex = -10
                backdropModal.style.visibility = 'hidden'
                modal.style.display = 'none'
                body.classList.remove('fixed')
            }, 800)
        }
    }

    function openModal(id) {
        const modal = document.querySelector(`#${id}`)

        backdropModal.style.opacity = 1
        backdropModal.style.zIndex = 10
        backdropModal.style.visibility = 'visible'
        body.classList.add('fixed')

        modal.style.display = 'flex'
        modal.style.opacity = 1
    }

})