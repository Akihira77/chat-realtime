import { PORT, WS_PORT } from "./config/env.js";
import { startSocket } from "./uws.js";
import startHonoApp from "./hono-app.js";
import { serve } from "@hono/node-server";
import { us_listen_socket } from "uWebSockets.js";

// HONO APP
const honoApp = await startHonoApp();

serve(
    {
        fetch: honoApp.fetch,
        port: Number(PORT)
    },
    () => {
        console.log(`Listening on http://localhost:${PORT}`);
        startSocket().listen(
            Number(WS_PORT),
            (listenSocket: us_listen_socket) => {
                if (listenSocket) {
                    console.log(`Socket run on ws://localhost:${WS_PORT}`);
                }
            }
        );
    }
);
