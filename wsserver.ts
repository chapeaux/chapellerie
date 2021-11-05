class User {
  constructor() {
    this.id = crypto.getRandomValues(new Uint8Array(8));
    addEventListener('update', e => console.log(this.id, 'heard', JSON.stringify(e)));
  }
  id;
}

const listener = await Deno.listen({ port: 3000 });
for await(const conn of listener) {
  dispatchConnection(conn);
}

async function dispatchConnection(conn: Deno.Conn) {
  for await(const { request, respondWith } of Deno.serveHttp(conn)) {
    if (request.headers.get('upgrade') === 'websocket') {
      const { socket, response } = Deno.upgradeWebSocket(request);
      socket.onopen = () => {

        socket.send("Hello World!");
      };
      socket.onmessage = (e) => {
        console.log(e.data);
        socket.send(`Got: ${e.data}`);
      };
      socket.onclose = () => console.log("WebSocket has been closed.");
      socket.onerror = (e) => console.error("WebSocket error:", e);
      respondWith(response);
    } else {

      respondWith(new Response('<h1>WOO!</h1>', {
        headers: { 'content-type': 'text/html' }
      }));
    }
    
  }
}

// const httpConn = Deno.serveHttp(await conn.accept());

// const e = await httpConn.nextRequest();

// if (e) {
//   console.log(JSON.stringify(e.request));
//   const { socket, response } = Deno.upgradeWebSocket(e.request);
//   
//   e.respondWith(response);
// }

