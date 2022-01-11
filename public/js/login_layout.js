window.onload = function () {
    const slider = new Slider();
    slider.init();

    const controller = new LoginController(new LoginView(), new LoginModel());
    controller.renderView();
}

class Slider {
    constructor() {
        this.slideContainer = document.querySelector('.login__slider');
        this.buttons = document.querySelectorAll('.btn');
        this.width = this.slideContainer.getBoundingClientRect().width;
        this.register = false;
    }

    init() {
        document.body.onresize = (e) => { this.resizeBody(); }
        this.buttons[1].addEventListener('click', (e) => { this.translateX(this.width) });
        this.buttons[3].addEventListener('click', (e) => { this.translateX(0) });
    }

    translateX(amount) {
        this.slideContainer.style.transform = 'translateX(' + (-amount) + 'px)';
        const loginForm = document.querySelector('.login__form');

        if (amount > 0) {
            this.register = true;
            loginForm.classList.add('signup');
        } else {
            this.register = false;
            loginForm.classList.remove('signup');
        }
    }

    resizeBody() {
        this.width = this.slideContainer.getBoundingClientRect().width;

        if (this.register) {
            this.slideContainer.style.transform = 'translateX(' + (-this.width) + 'px)';
        }
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

class LoginController {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        this.view.loginSubmitEvent.addListener((data, formType) => { this.model.validate(data, formType) });
        this.model.loginValidation.addListener(data => { this.view.updateValidation(data) });
        this.model.loginSubmit.addListener(data => { this.view.setLoginError() });
    }

    renderView() {
        this.view.init();
    }

}

class LoginModel {
    constructor() {
        this.validationMessages = {
            loginForm: { 'user': '', 'password': '' },
            signupForm: { 'user': '', 'email': '', 'password': '', 'repeatedPassword': '', 'rolCode': '' }
        };

        this.loginValidation = new Event();
        this.loginSubmit = new Event();
    }

    validate(form, formType) {

        if (formType === 'signup') {
            this.validateSignUp(form);
            return;
        }

        this.validateLogin(form);
    }

    resetValidation(formValidation) {
        for (const key in formValidation) {
            formValidation[key] = '';
        }
    }

    validateLogin(form) {
        this.resetValidation(this.validationMessages.loginForm);

        if (!this.validateLoginForm(form, this.validationMessages.loginForm)) {
            this.loginValidation.trigger(this.validationMessages.loginForm);
            return;
        }

        this.sendLogin('user=' + form.user + '&password=' + form.password,this.setLoginValidation.bind(this));
    }

    validateSignUp(form) {
        this.resetValidation(this.validationMessages.signupForm);

        if (!this.validateSignUpForm(form, this.validationMessages.signupForm)) {
            this.loginValidation.trigger(this.validationMessages.signupForm);
            return;
        }

        this.sendSignUp('code=' + form.rolCode + '&user=' + form.user + '&email=' + form.email + '&password=' + form.password, this.setError.bind(this));
    }

    validateLoginForm(form, formValidation) {
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

    validateSignUpForm(form, formValidation) {
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

    sendSignUp(params, callback) {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', '?page=login&action=signup', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.onload = function () {
            callback(this.responseText);
        }

        xhr.send(params);
    }

    sendLogin(params, callback) {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', '?page=login&action=login', true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.onload = function () {
            callback(this.responseText);
        }

        xhr.send(params);
    }

    setError(data) {

        if (data === "-2") {
            this.validationMessages.signupForm.rolCode = 'Cógido no válido';
        } if (data === "-1") {
            this.validationMessages.signupForm.user = 'Usuario no válido';
        }
        if (data != "1") {
            this.loginValidation.trigger(this.validationMessages.signupForm);
        }
        if (data === "1") {
            window.location.replace('?page=home');
        }

    }

    setLoginValidation(data) {
        if (!data) {
            this.loginSubmit.trigger();

        } else {
            window.location.replace('?page=home');
        }
    }

    getFormDataToSend(object) {
        const formData = new FormData();

        for (const key in object) {
            formData.append(key, object[key]);
        }

        return formData;
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

    setLoginError() {
        let loginError = this.loginForm.querySelector('#failed-login');

        loginError.classList.remove('d-none');
    }

    removeError(e) {
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
        let login = this.decideForm(formValidation);
        let counter = 0;

        login.forEach(error => { error.parentNode.classList.remove('error') });

        counter = this.addTextError(formValidation, login);

        login[counter].parentNode.classList.add('error');
        login[counter].parentNode.querySelector('input').focus();
    }

    decideForm(formValidation) {
        let login = this.loginForm.querySelectorAll('.error_box');

        if (Object.keys(formValidation).length > 2) {
            login = this.signUpForm.querySelectorAll('.error_box');
        }

        return login;
    }

    addTextError(formValidation, login) {
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