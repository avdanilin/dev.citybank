"use strict"

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form')
    const inputs = document.querySelectorAll('input')
    const selects = document.querySelectorAll('select')

    toggleFocusLabel(inputs, 'keyup')
    toggleFocusLabel(selects, 'change')

    form.addEventListener('submit', formSend)

    function toggleFocusLabel(arr, event) {
        arr.forEach(item => {
            item.addEventListener(event, () => {
                item.value !== '' ? item.nextElementSibling.classList.add('__focus') : item.nextElementSibling.classList.remove('__focus')
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

})