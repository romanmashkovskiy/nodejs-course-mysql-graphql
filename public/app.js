new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        return {
            show: true,
            todoTitle: '',
            todos: []
        }
    },
    created() {
        this.$vuetify.theme.dark = true;

        const query = `
            query {
              getTodos {
                id title done createdAt updatedAt
              }
            }
        `;

        fetch('/graphql', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({query})
        })
            .then(res => res.json())
            .then(({data: {getTodos}}) => {
                this.todos = getTodos;
            })
            .catch(e => console.log(e))
    },
    methods: {
        addTodo() {
            const title = this.todoTitle.trim();
            if (!title) return;

            const query = `
                mutation {
                  createTodo(todo: {title: "${title}"}) {
                    title
                    id
                    done
                    createdAt
                    updatedAt
                  }
                }
            `;

            fetch('/graphql', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({query})
            })
                .then(res => res.json())
                .then(({data: {createTodo}}) => {
                    this.todos.push(createTodo);
                    this.todoTitle = '';
                })
                .catch(e => console.log(e))
        },
        removeTodo(id) {
            const query = `
                mutation {
                  deleteTodo(id: ${id})
                }
            `;

            fetch('/graphql', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({query})
            })
                .then(() => {
                    this.todos = this.todos.filter((t) => t.id !== id);
                })
                .catch(e => console.log(e))
        },
        completeTodo(id) {
            const query = `
                mutation {
                  completeTodo(id: ${id}) {
                    updatedAt
                  }
                }
            `;

            fetch('/graphql', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({query})
            })
                .then(res => res.json())
                .then(({data: {completeTodo}}) => {
                    this.todos = this.todos.map(t => t.id !== id
                        ? t
                        : {...t, done: true, updatedAt: completeTodo.updatedAt})
                })
                .catch(e => console.log(e))
        }
    },
    filters: {
        capitalize(value) {
            return value.toString().charAt(0).toUpperCase() + value.slice(1);
        },
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            };

            if (withTime) {
                options.hour = '2-digit';
                options.minute = '2-digit';
                options.second = '2-digit';
            }

            return new Intl.DateTimeFormat('en-En', options).format(new Date(+value));
        }
    },
});