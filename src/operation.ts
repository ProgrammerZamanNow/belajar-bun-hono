import {Hono} from "hono";
import {basicAuth} from "hono/dist/types/middleware/basic-auth";
import {requestId} from "hono/dist/types/middleware/request-id";

export const operation = new Hono().basePath("/operation")
operation.use(basicAuth({
    username: "admin",
    password: "admin"
}))
operation.use(requestId())

operation.get('/a', (c) => c.text(`operation A : ${c.get('requestId')}`))
operation.get('/b', (c) => c.text(`operation B : ${c.get('requestId')}`))
operation.get('/c', (c) => c.text(`operation C : ${c.get('requestId')}`))
