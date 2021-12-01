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

LoginModel = function (formPar, formValidationPar) {
    let form = formPar;
    let formValidation = formValidationPar;

    this.observers = [];

    this.addObserver = function (observer) {
        this.observers.push(observer);
    }

    this.removeObserver = function (observer) {
        oberverIndex = this.observers.indexOf(observer);
        this.observers.slice(observerIndex, 1);
    }

    this.notifyAll = function () {
        let observerLength = this.observers.length;
        for (let observer = 0; observer < observerLength; observer++) {
            this.observers[observer].update(this.copy());
        }
    }

    Object.defineProperty(this, "form", {
        get: function () {
            return form;
        },
        set: function (newForm) {
            form = newForm;
            this.notifyAll();
        }
    });

    Object.defineProperty(this, "formValidation", {
        get: function(){
            return formValidation;
        },
        set: function(newFormValidation){
            formValidation = newFormValidation;
            this.notifyAll();
        }
    });
}

LoginModel.prototype.copy = function(){
    return {
        form: this.form,
        formValidation: this.formValidation
    }
}

LoginView = function(){
    this.loginForm = document.querySelector('#form');
    this.signUpForm = document.querySelector('#login__register');

    this.getLoginForm = function(){
        return this.loginForm;
    }

    this.getSignUpForm = function(){
        return this.signUpForm;
    }
}

LoginView.prototype.updateLogin = function(model){
   
}

LoginView.prototype.updateSignUp = function(model){

}

LoginView.init = function(){
    
}

LoginController = function(viewPar, modelPar){
    let view = viewPar;
    let model = modelPar;

    model.addObserver(view);

    view.getLoginForm().onsubmit = function(){
        model.form[0].user = 
    }

    this.updateModelForm = function(){
        model.form[0].user = view.getLoginForm().
    }

    Object.defineProperty(this,"view", {
        get: function(){
            return view;
        }
    });

    Object.defineProperty(this, "model", {  
        get: function(){
            return model.copy();
        }
    });
}

const form = [
    {user: '', password: ''},
    {user: '', email:'', password: '', repeatedPassword:'', rolCode: ''}
];

const formValidation = [
    {user: '', password: ''},
    {user: '', email:'', password: '', repeatedPassword:'', rolCode: ''}
];

const loginController = new LoginController(new LoginView(), new LoginModel(form, formValidation));


