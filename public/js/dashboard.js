window.onload = function(){
    const controller = new DashboardController(new DashboardView(), new DashboardModel());
    controller.renderView();
}

class DashboardModel {
    constructor() {
        this.priorityChart = null;
        this.typeChart = null;
        this.stateChart = null;
    }

    createPriorityChart(ctx) {
        this.priorityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Alta', 'Media', 'Baja'],
                datasets: [{
                    label: ' nº Tickets',
                    data: [100, 600, 1200],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        stacked: true,
                        grid: {
                            display: true,
                            color: "rgba(255,99,132,0.2)"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createStateChart(ctx){
        this.stateChart = new Chart(ctx, {
            type:'bar',
            data: {
                labels:['Nuevo', 'Abierto', 'Asignado', 'Resuelto'],
                datasets: [{
                    label: 'nº de Tickets',
                    data: [12,4,4,2],
                    backgroundColor: [
                        'rgba(53, 96, 235,.3)',
                        'rgba(114, 215, 226, .3)',
                        'rgba(242, 221, 36, .3)',
                        'rgba(115, 230, 115, .3)'
                    ],
                    borderColor: [
                        'rgba(53, 96, 235,1)',
                        'rgba(114, 215, 226, 1)',
                        'rgba(242, 221, 36, 1)',
                        'rgba(115, 230, 115, 1)' 
                    ],
                    borderWidth:2
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        stacked: true,
                        grid: {
                            display: true,
                            color: "rgba(255,99,132,0.2)"
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createTypeChart(ctx){
        this.typeChart = new Chart(ctx, {
            type:'polarArea',
            
            data: {
                labels : ['Error crítico', 'Error estructural', 'Error de funcionalidad', 'Nueva funcionalidad'],
                datasets: [{
                    label: 'nº de Errores',
                    data: [18,5,22,12],
                    backgroundColor: [
                        'rgba(255,99,132,.3)',
                        'rgba(53, 96, 235,.3)',
                        'rgba(255,206,86,.3)',
                        'rgba(75,192,192,.3)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(53, 96, 235,1)',
                        'rgba(255,206,86,1)',
                        'rgba(75,192,192,1)'
                    ],
                    borderWidth:1
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display:false
                    }
                }
            }
        });
    }
}

class DashboardView {
    constructor() {
        this.typeChartContext = document.getElementById('typeChart').getContext('2d');
        this.priorityChartContext = document.getElementById('myChart').getContext('2d');
        this.stateChartContext = document.getElementById("stateChart").getContext('2d');
        
        this.priorityEvent = new Event();
        this.typeChartEvent = new Event();
        this.stateChartEvent = new Event();
    }

    init(){
        this.priorityEvent.trigger(this.priorityChartContext);
        this.typeChartEvent.trigger(this.typeChartContext);
        this.stateChartEvent.trigger(this.stateChartContext);
    }
}

class DashboardController {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        this.view.priorityEvent.addListener((data) => this.model.createPriorityChart(data));
        this.view.typeChartEvent.addListener((data) => this.model.createTypeChart(data));
        this.view.stateChartEvent.addListener((data) => this.model.createStateChart(data));
    }

    renderView(){
        this.view.init();
    }

}