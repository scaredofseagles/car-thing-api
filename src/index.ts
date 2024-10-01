import { Hono } from 'hono';

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/hello', (c) => {
  return c.text('Hello World!')
})

app.get('/test', (c) => {
  return c.text('this is a test')
})

export default app
