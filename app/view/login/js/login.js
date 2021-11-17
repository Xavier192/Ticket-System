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

    validateFormulary(form) {
        let formType = this.signUpForm; 
        let counter = 1;

        if(form === 'login'){
            formType = this.loginForm;
        }

        for(const key in formType){
            if(!formType[key]){
                return counter;
            }

            counter++;
        }

        return -1;
    }

    emptyInput(input){
        if(input.value === ''){
            return true;
        }

        return false;
    }

    getLoginForm(){
        return this.loginForm;
    }
}

class LoginView {
    constructor() {
        this.user = document.querySelector('.user');
        this.password = document.querySelector('.password');
        this.form = document.querySelector('#form');
        this.formElements = Array.from(this.form.children);
    }

    validInput(input){
        input.parentNode.classList.remove('error');
    }

    invalidInput(validation){
        this.clearErrors();
        this.formElements[validation -1].classList.add('error');
        this.formElements[validation -1].getElementsByTagName('input')[0].focus();
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
       this.formElements.forEach(formElement => formElement.classList.remove('error'));
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

        if (validation > 0) {
            this.view.invalidInput(validation);
            return false;
        } 

        return true;
    }

    checkInput(input){
        return this.model.emptyInput(input);
    }

    getValidationNumber() {
        return this.model.validateFormulary('login');
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



