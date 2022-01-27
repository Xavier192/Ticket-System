window.addEventListener('load', (e) => {
    const mainLayoutController = new MainLayoutController(new MainLayoutView(), new MainLayoutModel());
    mainLayoutController.renderView();
});

class Event {
    constructor() {
        this.listeners = [];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    trigger(params) {
        this.listeners.forEach(listener => { listener(params) });
    }

}

class MainLayoutModel{
    constructor(){
        this.navbar = {scroll:false};
        this.aside =  {displayed:false}
        this.scrollZeroEvent = new Event();
        this.scrollEvent = new Event();
        this.widthEvent = new Event();
    }

    checkScroll(yOffset){
        if(yOffset > 0){
            this.navbar.scroll = true;
            this.scrollEvent.trigger();

        }else{
            this.navbar.scroll = false;
            this.scrollZeroEvent.trigger();
        }
        
    }

    checkWidth(width){
        if(width > 1000){
            this.widthEvent.trigger();
        }
    }

}

class MainLayoutView{
    constructor(){
        this.header = document.querySelector('.header');
        this.sidebar = document.querySelector('.aside');
        this.sidebarToggler = document.querySelector('.navbar__toggler');
        this.closeSidebar = document.querySelector('.aside__close');
        this.scrollEvent = new Event();
        this.resizeEvent = new Event();
    }

    init(){
        window.addEventListener('scroll', (e) => {
            this.scrollEvent.trigger(window.pageYOffset);   
        });

        this.sidebarToggler.addEventListener('click', (e) => {
            this.sidebar.classList.add('show-sidebar');
        });

        this.closeSidebar.addEventListener('click', (e) => {
            this.sidebar.classList.remove('show-sidebar');
        });

        window.addEventListener('resize', (e) => {
            this.stopAnimations();
            this.resizeEvent.trigger(document.body.clientWidth);           
        });
    }

    setNavbarNormal(){
        this.header.classList.remove('grey');
    }

    setNavbarScroll(){
        this.header.classList.add('grey');   
    }

    removeShowSidebar(){
        this.sidebar.classList.remove('show-sidebar');
    }

    stopAnimations(){
        document.body.id = 'stop-animations';
        setTimeout((e) => document.body.id='', 400);
    }
}

class MainLayoutController{
    constructor(view, model){
        this.view = view;
        this.model = model;

        this.view.scrollEvent.addListener((data) => this.model.checkScroll(data));
        this.view.resizeEvent.addListener((data) => this.model.checkWidth(data));
        this.model.widthEvent.addListener((data) => this.view.removeShowSidebar());
        this.model.scrollZeroEvent.addListener((data) => this.view.setNavbarNormal());
        this.model.scrollEvent.addListener((data) => this.view.setNavbarScroll());
    }

    renderView(){
        this.view.init();
    }
}