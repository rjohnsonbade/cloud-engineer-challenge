import Fastify from 'fastify'
import { createTodoApp, createStore, TodoAdd, TodoUpdate } from './app'

const todoApp = createTodoApp({store: createStore()});

const fastify = Fastify({
  logger: { level: 'error' }
})

// GET / for list
fastify.get('/', (request, reply) => {
  if(request.headers['x-detonator'] === 'armed') {
    throw new Error('Boom!');
  }
  reply.send(todoApp.list());
})

// POST / for create
fastify.post('/', {
  schema: {
    body: {
      type: 'object',
      required: ['summary', 'done'],
      properties: {
        summary: { type: 'string' },
        done: { type: 'boolean' },
      }
    }
  }
},async (request, reply) => {
  const todo = todoApp.add(request.body as TodoAdd);
  reply.send(todo)
})

// POST /id for update 
fastify.post<{Params: {id: string}}>('/:id', {
  schema: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
      }
    },
    body: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        done: { type: 'boolean' },
      }
    }
  }
},async (request, reply) => {
  try {
    const todo = todoApp.update(request.params.id, request.body as TodoUpdate);
    reply.send(todo);
  } catch (e) {
    if(e instanceof Error && e.name === 'ClientError') {
      reply.status(400);
    }
    throw (e)
  }
})

// DELETE /id 
fastify.delete<{Params: {id: string}}>('/:id', {
  schema: {
    params: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
      }
    },
  }
},async (request, reply) => {
  todoApp.remove(request.params.id);
})

fastify.listen({ port: 3000 }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

export {fastify};

