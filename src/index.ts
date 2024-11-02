import {Hono} from 'hono'

const app = new Hono()

app
    .get('/hello/:name', (c) => {
        const name = c.req.param('name')
        return c.text(`Hello ${name}`)
    })
    .post('/post', (c) => {
        return c.text("Post Hello")
    })
    .get('/products/:id{[0-9]+}', async (c) => {
        const id = c.req.param("id")
        return c.text(`Product ${id}`)
    })
    .get('/', (c) => {
        return c.text('Hello Programmer Zaman Now!')
    })

const book = new Hono().basePath('/api');
book.get('/book', (c) => {
    return c.text("Book")
})
book.get('/book/a', (c) => {
    return c.text("Book A")
})
book.get('/book/:id', (c) => {
    return c.text("Book Id")
})


app.route('/', book)

app.get('/context', async (c) => {
    c.header('Content-Type', 'application/json');
    c.status(200);

    return c.body(JSON.stringify({
        "first_name" : "eko",
        "last_name" : "khannedy"
    }))
})

app.get('/context.json', async (c) => {
    return c.json({
        "first_name" : "eko",
        "last_name" : "khannedy"
    })
})

app.post('/users', async (c) => {
    const json = await c.req.json()
    return c.json({
        hello: `Hello ${json.name}`
    })
})

app.get('/users', async (c) => {
    const page = c.req.query('page')
    const size = c.req.query('size')

    return c.text(`Users with page ${page} and size ${size}`)
})

app.get('/response/text', (c) => {
    return c.text("Hello Hono")
})

app.get('/response/json', (c) => {
    c.status(201)
    c.header('X-Author', 'Eko Kurniawan')
    return c.json({
        data: "Hello Hono"
    })
})

app.get('/response/html', (c) => {
    return c.html("<html><body><h1>Hello Hono</h1></body></html>>")
})

export default app
