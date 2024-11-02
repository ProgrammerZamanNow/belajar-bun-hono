import {Hono} from "hono";
import {HTTPException} from "hono/dist/types/http-exception";

export const admin = new Hono().basePath("/admin")

admin.use(async (c, next) => {
    const token = c.req.header("Authorization")

    if (!token) {
        throw new HTTPException(401)
    }

    // lanjutkan request kalo ada
    await next()
})
admin.get('/a', (c) => c.text("Admin A"))
admin.get('/b', (c) => c.text("Admin B"))
admin.get('/c', (c) => c.text("Admin C"))
