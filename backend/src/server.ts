import Fastify from 'fastify'
import { createTodoApp, TodoAdd, TodoUpdate } from './app'
import { createStore } from './store'

const todoApp = createTodoApp({store: createStore()});

const fastify = Fastify({
  logger: true
})

// GET / for list
fastify.get('/', (_request, reply) => {
  reply.send(todoApp.list())
})

// POST / for create
fastify.post('/', async (request, reply) => {
  const todo = todoApp.add(request.body as TodoAdd);
  reply.send(todo)
})

// POST /id for update 
fastify.post<{Params: {id: string}}>('/:id', async (request, reply) => {
  try {
    const todo = todoApp.update(request.params.id, request.body as TodoUpdate);
    reply.send(todo);
  } catch (e) {
    const statusCode = e instanceof Error && e.name === 'ClientError' ? 400 : 500;
    reply.status(statusCode);
    reply.send({error: String(e)})
  }
})

// DELETE /id 
fastify.delete<{Params: {id: string}}>('/:id', async (request, reply) => {
  todoApp.remove(request.params.id);
})

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})

export {fastify};

