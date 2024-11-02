import {Hono} from 'hono'
import {HTTPException} from "hono/http-exception";
import {basicAuth} from "hono/basic-auth";
import {requestId} from 'hono/request-id'
import {
    getCookie,
    getSignedCookie,
    setCookie,
    setSignedCookie,
    deleteCookie,
} from 'hono/cookie'
import {web} from "./web";
import {z} from 'zod';
import {zValidator} from "@hono/zod-validator";
import {admin} from "./admin";
import {operation} from "./operation";
import {serveStatic} from "hono/bun";

class MyException extends Error {

}

const app = new Hono()

app.onError(async (err, c) => {
    if (err instanceof HTTPException) {
        return err.getResponse();
    }

    if (err instanceof MyException) {
        c.status(401)
        return c.json({
            error: "Ups"
        })
    }

    c.status(500)
    return c.text("Ups");
})

app.get('/ups', (c) => {
    throw new MyException();
})

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

app.get('/say-hello', async (c) => {
    const name = c.req.query('name')
    if (!name) {
        throw new HTTPException(400, {
            res: new Response(
                JSON.stringify({
                    error: "Name param must not empty"
                }),
                {
                    status: 400,
                    headers: {
                        "Author": "Eko",
                        "Content-Type": "application/json"
                    }
                }
            )
        })
    }

    return c.text(`Hello ${name}`)
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
        "first_name": "eko",
        "last_name": "khannedy"
    }))
})

app.get('/context.json', async (c) => {
    return c.json({
        "first_name": "eko",
        "last_name": "khannedy"
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

app.route('/', admin)
app.route('/', operation)

app.get('/cookie/set', (c) => {
    const value = c.req.query('value') as string
    setCookie(c, 'Hono-Cookie', value, {path: '/'})
    return c.text(`Success set cookie ${value}`)
})

app.get('/cookie/get', (c) => {
    const cookie = getCookie(c)
    return c.text(`Cookie value : ${cookie['Hono-Cookie']}`)
})

app.route('/', web)

app.post('/login',
    zValidator('json', z.object({
        username: z.string().min(3).max(10),
        password: z.string().min(3).max(10)
    })),
    async (c) => {
        const body = await c.req.json();
        return c.json({
            data: `Hello ${body.username}`
        })
    }
)

app.use("/public/*", serveStatic({root: "./"}))

export default app
