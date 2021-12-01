window.onload = function () {
    const slideContainer = document.querySelector('.login__form-container');
    const signUpSlide = document.querySelector('.login__form-signup');
    const btnCancel = document.querySelector('.btn-cancel');
    const singUpButton = document.querySelector('.login__signup');
    const width = slideContainer.getBoundingClientRect().width;


    /*MANAGE SLIDES*/

    signUpSlide.style.left = width + 'px';

    singUpButton.onclick = function () {
        slideContainer.style.transform = 'translateX(' + (-width) + 'px)';
    }

    btnCancel.onclick = function () {
        slideContainer.style.transform = 'translateX(0)';
    }
}

class Event {
    constructor() {
        this.listeners = [];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    trigger(params, formType) {
        this.listeners.forEach(listener => { listener(params, formType) });
    }
}

class LoginModel {
    constructor() {
        this.validationMessages = {
            loginForm: { 'user': '', 'password': '' },
            signupForm: { 'user': '', 'email': '', 'password': '', 'repeatedPassword': '', 'rolCode': '' }
        };

        this.loginValidation = new Event();
    }

    validate(form, formType) {

        if (formType === 'signup') {
            this.resetValidation(this.validationMessages.signupForm);

            if (!this.validateSignUp(form, this.validationMessages.signupForm)) {
                this.loginValidation.trigger(this.validationMessages.signupForm);
            }

        } else {
            this.resetValidation(this.validationMessages.loginForm);

            if (!this.validateLogin(form, this.validationMessages.loginForm)) {
                this.loginValidation.trigger(this.validationMessages.loginForm);
            }
        }

    }

    resetValidation(formValidation) {
        for (const key in formValidation) {
            formValidation[key] = '';
        }
    }

    validateLogin(form, formValidation) {
        const userValidation = new RegExp("^[a-zA-Z0-9]+$");

        if (!this.validateEmptyInputs(form, formValidation)) {
            return false;
        }

        if (!userValidation.test(form.user)) {
            formValidation.user = 'Nombre de usuario no válido (a-z, 0-9)';
            return false;
        }

        return true;
    }

    validateSignUp(form, formValidation) {
        const passwordValidation = new RegExp("(?=.{8,})");
        const userValidation = new RegExp("^[a-zA-Z0-9]+$");

        if (!this.validateEmptyInputs(form, formValidation)) {
            return false;
        }

        if (!userValidation.test(form.user)) {
            formValidation.user = 'Nombre de usuario no válido (a-z, 0-9)';
            return false;
        }

        if (form.password != form.repeatedPassword) {
            formValidation.password = 'Las contraseñas no coinciden';
            return false;
        }

        if (!passwordValidation.test(form.password)) {
            formValidation.password = 'La contraseña debe tener 8 carácteres mínimo';
            return false;
        }

        return true;
    }

    validateEmptyInputs(form, formValidation) {

        for (const key in form) {
            if (form[key] === "") {
                formValidation[key] = "Rellene este campo";
                return false;
            }
        }

        return true;
    }
}

class LoginView {
    constructor() {
        this.loginForm = document.querySelector('#form');
        this.signUpForm = document.querySelector('#login__register');

        this.loginSubmitEvent = new Event();
    }

    init() {

        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginSubmitEvent.trigger(this.getLoginObject(), 'login');
        });

        this.signUpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginSubmitEvent.trigger(this.getSignUpObject(), 'signup');
        });

        this.loginForm.addEventListener('keyup', (e) => {
            this.removeError(e);
        });


        this.signUpForm.addEventListener('keyup', (e) => {
            this.removeError(e);
        });

    }

    removeError(e){
        if (e.target.value) {
            e.target.parentNode.classList.remove('error');
        }
    }

    getLoginObject() {
        const loginValues = Array.from(this.loginForm.querySelectorAll('input'));

        return { user: loginValues[0].value, password: loginValues[1].value };
    }

    getSignUpObject() {
        const signUpValues = Array.from(this.signUpForm.querySelectorAll('input'));

        return {
            user: signUpValues[0].value, email: signUpValues[1].value,
            password: signUpValues[2].value, repeatedPassword: signUpValues[3].value,
            rolCode: signUpValues[4].value
        };

    }

    updateValidation(formValidation) {
        let login = this.loginForm.querySelectorAll('.error_box');
        let counter = 0;

        if (Object.keys(formValidation).length > 2) {
            login = this.signUpForm.querySelectorAll('.error_box');
        }

        login.forEach(error => { error.parentNode.classList.remove('error') });

        counter = this.addTextError(formValidation, login);

        login[counter].parentNode.classList.add('error');
        login[counter].parentNode.querySelector('input').focus();
    }

    addTextError(formValidation,login) {
        let counter = 0;

        for (const key in formValidation) {
            if (formValidation[key]) {
                login[counter].innerHTML = formValidation[key];
                return counter;
            }

            counter++;
        }
    }

}

class LoginController {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        this.view.loginSubmitEvent.addListener((data, formType) => { this.model.validate(data, formType) });
        this.model.loginValidation.addListener(data => {this.view.updateValidation(data)});
    }

    renderView() {
        this.view.init();
    }

}

const controller = new LoginController(new LoginView(), new LoginModel());

controller.renderView();





