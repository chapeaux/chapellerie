const conn = await Deno.listen({ port: 8888 });
const httpConn = Deno.serveHttp(await conn.accept());
const e = await httpConn.nextRequest();

if (e) {
  const { socket, response } = Deno.upgradeWebSocket(e.request);
  if (socket) {
    socket.onopen = () => {
        socket.send("Hello World!");
    };
    socket.onmessage = (e) => {
        console.log(JSON.parse(e.data));
        //socket.close();
        socket.send(`Got: ${e.data}`);
    };
    socket.onclose = () => console.log("WebSocket has been closed.");
    socket.onerror = (e) => console.error("WebSocket error:", e);
  }
  e.respondWith(response);
}

