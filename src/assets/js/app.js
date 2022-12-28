const pomodoro = Vue.createApp({
    data() {
        const pomodoroTempo = 25 * 60;
        const pausaCurta = 5 * 60;
        const pausaLonga = 15 * 60;

        return {
            pomodoroTempo,
            pausaCurta,
            pausaLonga,
            tempoAtual: pomodoroTempo,
            textoBotao: "Começar!",
            intervalo: null,
            contagemPomodoros: 0,

            tarefas: [],
            novoTextoTarefa: '',
            IdTarefa: 1
        }
    },
    methods: {
        tempoDePomodoro() {
            clearInterval(this.intervalo)
            this.tempoAtual = this.pomodoroTempo
            this.textoBotao = "Começar!"
        },
        tempoDePausaCurta() {
            clearInterval(this.intervalo)
            this.tempoAtual = this.pausaCurta
            this.textoBotao = "Começar!"
        },
        tempoDePausaLonga() {
            clearInterval(this.intervalo)
            this.tempoAtual = this.pausaLonga
            this.textoBotao = "Começar!"
        },
        cronometrar() {
            if (this.textoBotao === "Começar!" || this.textoBotao === "Recomeçar") {
                this.reducaoDoTempo()
                this.textoBotao = "Pausa"
            } else if (this.textoBotao === "Pausa") {
                this.paradaDoTempo()
                this.textoBotao = "Recomeçar"
            }
        },
        reducaoDoTempo() {
            this.intervalo = setInterval(() => {
                if (this.tempoAtual > 0) {
                    this.tempoAtual -= 1;
                }
            }, 1000)
        },
        paradaDoTempo() {
            clearInterval(this.intervalo)
        },
        concluido() {
            if (this.tempoAtual <= 0) {
                // Clear interval
                clearInterval(this.intervalo);

                if (this.contagemPomodoros >= 4){
                    this.tempoAtual = this.pausaLonga
                    this.contagemPomodoros = 0
                } else {
                    this.tempoAtual = this.pausaCurta
                    this.contagemPomodoros++
                }
                    

                // Immediately disable button and set state
                this.textoBotao = "Começar!";
            }
        },
        adicionarTarefa() {
            if(this.novoTextoTarefa != ''){
                this.tarefas.push({
                    id: this.IdTarefa++,
                    title: this.novoTextoTarefa
                })
                this.novoTextoTarefa = ''
            } else 
                alert('O campo não pode estar vazio.')

        }
    },
    computed: {
        relogio() {
            const minutos = String(parseInt(this.tempoAtual / 60));
            const segundos = String(parseInt(this.tempoAtual % 60));
            const minutosRestantes = ("0" + minutos).slice(-2);
            const segundosRestantes = ("0" + segundos).slice(-2);

            if (minutosRestantes <= 0 && segundosRestantes <= 0)
                this.concluido()

            return `${minutosRestantes}:${segundosRestantes}`
        }
    }
})

pomodoro.component('item-tarefa', {
    props: ['title'],
    emits: ['remove'],
    template: `
    <li>
        {{ title }}
        <button class="btn btn-danger" @click="$emit('remove')">Remover</button>
    </li>
    `
})

pomodoro.mount('#app')