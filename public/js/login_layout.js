window.onload = function () {
    const slider = new Slider();
    slider.init();

    const controller = new LoginController(new LoginView(), new LoginModel());
    controller.renderView();
}

/*====================SLIDER CLASS - CONTROLS THE SLIDER BETWEEN THE LOGIN AND SIGN UP============================*/

class Slider {
    constructor() {
        this.slideContainer = document.querySelector('.login__slider');
        this.signUpButton = document.querySelector('.login__signup');
        this.cancelButton = document.querySelector('.btn-cancel');
        
        /*====================Clean inputs=====================*/
        this.deleteFields();
        this.signUp = false;
    }

    /*=========================Slider Listeners========================*/
    init() {
        document.body.onresize = (e) => { this.resizeBody(); }
        this.signUpButton.addEventListener('click', (e) => { this.translateX(this.getWidth()); this.deleteFields();});
        this.cancelButton.addEventListener('click', (e) => { this.translateX(0); this.deleteFields();});
    }

    /*=====================DOM Modification methods==================*/

    resizeBody() {
        if (this.signUp) {
            this.slideContainer.style.transform = 'translateX(' + (-this.getWidth()) + 'px)';
        }
    }

    translateX(amount) {
        this.slideContainer.style.transform = 'translateX(' + (-amount) + 'px)';
        const loginForm = document.querySelector('.login__form');

        if (amount > 0) {
            this.signUp = true;
            loginForm.classList.add('signup');
        } else {
            this.signUp = false;
            loginForm.classList.remove('signup');
        }
    }

    deleteFields(){
        document.querySelectorAll('.text').forEach((input) => {input.value=''});
        document.querySelectorAll('.login__element').forEach(loginElement => loginElement.classList.remove('error'));
    }

    getWidth(){
        return this.slideContainer.getBoundingClientRect().width;
    }

    
}

/*============================CLASS MADE TO STORE EVENTS==============================*/

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

/*==============================CONTROLLER CLASS - CONTROLS THE COMUNICATION BETWEEN THE VIEW AND THE MODEL=======================*/

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

/*============================MODEL CLASS - CONNECTION TO BACKEND (AJAX). STORES A MODEL OF THE VIEW=============================*/

class LoginModel {

    constructor() {
        this.loginValidation = new Event();
        this.loginSubmit = new Event();

        this.validationMessages = {
            loginForm: { 'user': '', 'password': '' },
            signupForm: { 'user': '', 'email': '', 'password': '', 'repeatedPassword': '', 'rolCode': '' }
        };
    }

    validate(form, formType) {
        this.resetValidation();
        
        if (formType === 'signup') {
            this.validateSignUp(form);
            return;
        }

        this.validateLogin(form);
    }

    resetValidation() {
        for (const key in this.validationMessages.loginForm) {
            this.validationMessages.loginForm[key] = '';
        }

        for(const key in this.validationMessages.signupForm){
            this.validationMessages.signupForm[key] = '';
        }
    }

    validateLogin(form) {
        if (!this.validateLoginForm(form, this.validationMessages.loginForm)) {
            this.loginValidation.trigger(this.validationMessages.loginForm);
            return;
        }

        this.sendForm('login?action=login', 'user=' + form.user + '&password=' + form.password, this.setLoginValidation.bind(this));
    }

    validateSignUp(form) {
        if (!this.validateSignUpForm(form, this.validationMessages.signupForm)) {
            this.loginValidation.trigger(this.validationMessages.signupForm);
            return;
        }
        
        this.sendForm('?page=login&action=signup', 'code=' + form.rolCode + '&user=' + form.user + '&email=' + form.email + '&password=' + form.password, this.setSignUpValidation.bind(this));
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
            formValidation.password = 'La contraseña debe contener 8 carácteres mínimo';
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

    sendForm(page, params, callback){
        const xhr = new XMLHttpRequest();

        xhr.open('POST', page, true);
        xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');

        xhr.onload = function(){
            callback(this.responseText);
        }

        xhr.send(params);
    }

    setLoginValidation(data) {
        if (!data) {
            this.loginSubmit.trigger();

        } else {
            window.location.replace('dashboard');
        }
    }

    setSignUpValidation(data) {
     
        if(data === "1"){
            window.location.replace('?page=home');
        }else{
            if(data === "Código no válido"){
                this.validationMessages.signupForm.rolCode = data;
            }else{
                this.validationMessages.signupForm.user = data;
            }

            this.loginValidation.trigger(this.validationMessages.signupForm);
        }

    }

}

/*==========================VIEW CLASS - GETS DOM ELEMENTS AND MODIFY THEM==========================*/

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
        document.querySelector('#failed-login').classList.remove('d-none');
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