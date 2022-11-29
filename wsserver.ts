class User {
  constructor(socket:WebSocket) {
    this.id = crypto.getRandomValues(new Uint8Array(8));
    addEventListener('update', ((e:CustomEvent) => {
        if (<CustomEvent>e.detail && socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify(e.detail));
        }
    }) as EventListener);
  }
  id:Uint8Array;
}

const users = new Map<Uint8Array, User>()


async function dispatchConnection(conn: Deno.Conn) {
  for await(const { request, respondWith } of Deno.serveHttp(conn)) {
    if (request.headers.get('upgrade') === 'websocket') {
      const { socket, response } = Deno.upgradeWebSocket(request);
      socket.onopen = () => {
        const newUser = new User(socket);
        users.set(newUser.id, newUser);
        socket.send(`Hello New User! Your ID: ${newUser.id}`);
      };
      socket.onmessage = (e) => {
        try {
            dispatchEvent(new CustomEvent('update', {
                detail: JSON.parse(e.data)
            }));
        } catch {
            dispatchEvent(new CustomEvent('update', {
                detail: e.data
            }));
        }
      };
      respondWith(response);
    } else {

        respondWith(new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>Chapellerie</title>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>  
        <body>
        <h1>WOO!</h1>
        <label>Message: <input id="message"></label>
        <button id="send">Send</button>
        <ul id="list">
        </ul>
        <script>
        function createWebSocket(url) { 
            const ws = new WebSocket(url); 
            ws.onopen = e => console.log('OPENED',e.data); 
            ws.onmessage = (e) => { 
                try { 
                    const li = document.createElement('li');
                    li.innerHTML = e.data;
                    document.getElementById('list').appendChild(li);
                } catch { 
                    console.log('TEXT:',e.data);
                }
            }; 
            ws.onclose = e => console.log('Socket closed'); 
            return ws;
        }
        const conn = createWebSocket('ws://localhost:3000');
        document.getElementById('send').addEventListener('click', e => {
            const msg = document.getElementById('message').value;
            conn.send(msg);
        });
        </script>
        </body>
        </html>`, {
        headers: { 'content-type': 'text/html' }
      }));
    }
    
  }
}


const listener = await Deno.listen({ port: 3000 });
for await(const conn of listener) {
  dispatchConnection(conn);
}

/*
function createWebSocket(url) { 
    const ws = new WebSocket(url); 
    ws.onopen = e => console.log('OPENED',e.data); 
    ws.onmessage = (e) => { 
        try { 
            console.log('JSON MESSAGE:',JSON.parse(e.data));
        } catch { 
            console.log('TEXT:',e.data);
        }
    }; 
    ws.onclose = e => console.log('Socket closed'); 
    return ws;
}
*/