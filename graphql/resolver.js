const Todo = require('../models/todo');

module.exports = {
    getTodos: async () => {
        try {
            return await Todo.findAll({raw: true});
        } catch (e) {
            throw new Error('fetch todos failed');
        }
    },
    createTodo: async ({todo: {title}}) => {
        try {
            return await Todo.create({
                title,
                done: false
            });
        } catch (e) {
            throw new Error('create todo failed');
        }
    },
    completeTodo: async ({id}) => {
        try {
            const todo = await Todo.findByPk(id);
            todo.done = true;
            await todo.save();
            return todo;
        } catch (e) {
            throw new Error('update todo failed');
        }
    },
    deleteTodo: async ({id}) => {
        try {
            await Todo.destroy({
                where: {
                    id
                }
            })
            return true;
        } catch (e) {
            throw new Error('delete todo failed');
        }
    }
};