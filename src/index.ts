import { Hono } from 'hono';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello/:name', (c) => {
  const name = c.req.param('name');
  return c.text(`Hello, ${name} 🔥🔥!`)
})

app.get('/test', (c) => {
  return c.text('this is a test')
})

export default app
