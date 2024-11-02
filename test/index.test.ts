import {describe, it, expect} from "bun:test"
import app from "../src";

describe('Application', () => {
    it('GET /hello/:name', async () => {

        const response = await app.request("/hello/eko", {
            method: "GET"
        })

        expect(response.status).toBe(200)
        expect(await response.text()).toBe("Hello eko")

    });
});
