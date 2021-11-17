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
        this.loginForm = {};
        this.signUpForm = {};
    }

    addLogin(user, password) {
        this.loginForm['user'] = user;
        this.loginForm['password'] = password;
    }

    validateFormulary() {
        if (!this.loginForm.user) {
            return 1;
        } else if (!this.loginForm.password) {
            return 2;
        }

        return -1;
    }

    emptyInput(input){
        if(input.value === ''){
            return true;
        }

        return false;
    }
}

class LoginView {
    constructor() {
        this.controller = null;
        this.user = document.querySelector('.user');
        this.password = document.querySelector('.password');
        this.form = document.querySelector('#form');
    }

    validInput(input){
        input.parentNode.classList.remove('error');
    }

    invalidInput(input){
        this.clearErrors();
        input.parentNode.classList.add('error');
        input.focus();
    }

    getUser() {
        return this.user;
    }

    getPassword() {
        return this.password;
    }

    getForm() {
        return this.form;
    }

    clearErrors(){
       const formElements = Array.from(this.form.children);
       formElements.forEach(formElement => formElement.classList.remove('error'));
    }

}

class LoginController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }

    login() {
        this.model.addLogin(this.view.getUser().value, this.view.getPassword().value);
        this.validate();
    }

    validate() {

        if (this.checkFilledInputs()) {
            this.httpRequest();
        }

    }

    httpRequest(){
        const xhr = new XMLHttpRequest();

        xhr.open('POST','../app/controller/ajax_controller.php',true);

        xhr.onload = function(){
            if(this.status === 200){
                console.log(this.responseText);
            }
        }

        xhr.send();
    }

    checkFilledInputs() {
        const validation = this.getValidationNumber();
        const user = this.view.getUser();
        const pass = this.view.getPassword();

        if (validation === 1) {
            this.view.invalidInput(user);

            return false;
        } else if (validation === 2) {
            this.view.invalidInput(pass);
            
            return false;
        }

        return true;
    }

    checkInput(input){
        return this.model.emptyInput(input);
    }

    getValidationNumber() {
        return this.model.validateFormulary();
    }

    getForm(){
        return this.view.getForm();
    }

}


const EventControl = function(){
    const controller = new LoginController(new LoginView(this), new LoginModel());


    controller.getForm().onsubmit = function(e){
        e.preventDefault();
        controller.login();
    }


    controller.getForm().onkeyup = function(e){
        if(!controller.checkInput(e.target)){
            e.target.parentNode.classList.remove('error');
        }
    }
}();



