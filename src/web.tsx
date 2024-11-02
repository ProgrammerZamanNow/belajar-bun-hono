import {Hono} from "hono";

export const web = new Hono().basePath('/web')

web.get('/a', (c) => {
    const html =
        <html>
        <head>
            <title>Ini kode HTML</title>
        </head>
        <body>
        <h1>Ini Title</h1>
        </body>
        </html>

    return c.html(html)
})
