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


class LoginModel {
    constructor() {
        this.loginForm = { 'user': '', 'password': '' };
        this.signUpForm = { 'user': '', 'email': '', 'password': '', 'repeatedPassword': '', 'rolCode': '' };
    }

    addForm(formType, params) {
        let form = this.decideForm(formType);
        let counter = 0;

        for (const key in form) {
            form[key] = params[counter].value;
            counter++;
        }
    }

    decideForm(form) {
        if (form === 'login') {
            return this.loginForm;
        }

        return this.signUpForm;
    }

    validateFormulary(form) {
        let formType = this.decideForm(form);
        let counter = 1;

        for (const key in formType) {
            if (!formType[key]) {
                return counter;
            }
            counter++;
        }

        return -1;
    }

    convertObjectToParams(formType){
        let form = this.decideForm(formType);
        let convertedString = '';

        for(const key in form){
            convertedString +=key+'='+form[key]+'&'; 
        }

        
        return convertedString.substring(0, convertedString.length - 1);
    }

    emptyInput(input) {
        if (input.value === '') {
            return true;
        }

        return false;
    }

    getLoginForm() {
        return this.loginForm;
    }

    getSignUpForm() {
        return this.signUpForm;
    }
}

class LoginView {
    constructor() {
        this.loginForm = document.querySelector('#form');
        this.loginFormElements = Array.from(this.loginForm.children);

        this.signUpForm = document.querySelector('#login__register');
        this.signUpFormElements = Array.from(this.signUpForm.children);
    }

    validInput(input) {
        input.parentNode.classList.remove('error');
    }

    invalidInput(validation, target) {
        let form = this.targetForm(target);
        this.clearErrors(form);
        this.setError(form[validation - 1]);
        this.focusInput(form[validation - 1].getElementsByTagName('input')[0]);
    }

    focusInput(input) {
        input.focus();
    }

    setError(element) {
        element.classList.add('error');
    }

    targetForm(form) {
        if (form === 'signup') {
            return this.signUpFormElements;
        }

        return this.loginFormElements;
    }

    getLoginForm() {
        return this.loginForm;
    }

    getSignUpForm() {
        return this.signUpForm;
    }

    clearErrors(targetForm) {
        targetForm.forEach(formElement => formElement.classList.remove('error'));
    }

    getSignUpInputs() {
        return this.signUpForm.getElementsByTagName('input');
    }

    getLoginInputs() {
        return this.loginForm.getElementsByTagName('input');
    }

}

class LoginController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    login() {
        this.model.addForm('login', this.view.getLoginInputs());
        this.validateLogin();
    }

    signUp() {
        this.model.addForm('signup', this.view.getSignUpInputs());
        this.validateSignUp();
    }

    validateSignUp() {
        if (this.checkFilledInputs('signup')) {
            console.log('Hola');
        }
    }

    validateLogin() {
        let params = this.model.convertObjectToParams('login');
        params+= '&type=login';

        if (this.checkFilledInputs('login')) {
            this.httpRequest('../app/controller/ajax_controller.php', params);
        }

    }

    httpRequest(url, params = '') {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.onload = function () {
            if (this.status === 200) {
                console.log(this.responseText);
            }
        }

        xhr.send(params);
    }

    checkFilledInputs(target) {
        const validation = this.getValidationNumber(target);

        if (validation > 0) {
            this.view.invalidInput(validation, target);
            return false;
        }

        return true;
    }

    checkInput(input) {
        if(!this.model.emptyInput(input)){
            this.view.validInput(input);
        }
    }

    getValidationNumber(target) {
        return this.model.validateFormulary(target);
    }

    getLoginForm() {
        return this.view.getLoginForm();
    }

    getSignUpForm() {
        return this.view.getSignUpForm();
    }

}

const EventControl = function () {
    const controller = new LoginController(new LoginView(), new LoginModel());

    /*LOGIN FORM VALIDATION AND SUBMIT*/

    controller.getLoginForm().onsubmit = function (e) {
        e.preventDefault();
        controller.login();
    }

    controller.getLoginForm().onkeyup = function (e) {
        controller.checkInput(e.target);
    }

    /*SIGN UP FORM VALIDATION AND SUBMIT*/

    controller.getSignUpForm().onsubmit = function (e) {
        e.preventDefault();
        controller.signUp();
    }

    controller.getSignUpForm().onkeyup = function (e) {
        controller.checkInput(e.target);
    }

}();



