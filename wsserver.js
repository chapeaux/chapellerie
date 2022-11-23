const wsURL = 'ws://localhost:3000'
class User {
    constructor(socket) {
        this.socket = socket;
      this.id = crypto.getRandomValues(new Uint8Array(8)).reduce((a,c) => a+c.toString(16),'');
      addEventListener('update', (e) => {
          if (e.detail && socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify(e.detail));
          }
      });
    }
    id;
    socket;
    onOpen = () => {
        users.set(this.id, this);
        this.socket.send(JSON.stringify({id: this.id, message:"You're connected, enter your twitter handle or name to enter."}));
    };
    onMessage = (e) => {
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
  }
  
  const users = new Map()
  
  const listener = await Deno.listen({ port: 3000 });
  for await(const conn of listener) {
    dispatchConnection(conn);
  }
  
  function wsHandler(request) {}
  function postHandler(request) {}
  
  async function dispatchConnection(conn) {
    for await(const { request, respondWith } of Deno.serveHttp(conn)) {
      const url = new URL(request.url);
      switch (request.method) {
          case 'HEAD':
              respondWith(new Response(null, {
                  status: 200
              }));
          break;
          case 'POST':
  
          break;
          case 'GET':
              if (request.headers.get('upgrade') === 'websocket') {
                  const { socket, response } = Deno.upgradeWebSocket(request);
                  const newUser = new User(socket);
                  users.set(newUser.id,newUser);
                  socket.onopen = newUser.onOpen;
                  socket.onmessage = newUser.onMessage;
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
                        <style>
                        body { background-color: #eec; text-align:center; }
                        form { margin-bottom: 1em; }
                        input:focus { border: 3px solid #369; }
                        ul { margin:0;padding:0;display: grid;
                            grid-template-columns: 60%;
                            justify-content: center;}
                        li { list-style: none; }
                        li:nth-child(even) { background: white; }
                        li:nth-child(odd) { background: #9cf; }
                        li:first-child { font-weight: bold; }
                        </style>
                    </head>  
                    <body>
                    <h1>Who Wants to Win A Prize?!</h1>
                    <form id="frmMessage"><label>Twitter Handle/Name: <input id="message"></label>
                    <button id="send">Send</button></form>
                    <ul id="list"></ul>
                    <script>
                    let userID = '';
                    function createWebSocket(url) { 
                        const ws = new WebSocket(url);  
                        ws.onmessage = (e) => { 
                            try { 
                                const li = document.createElement('li');
                                const data = e.data;
                                const [ id, msg ] = Object.values(JSON.parse(data));
                                console.log('ID:',id,'Message:',msg);
                                li.innerHTML = msg || '';
                                li.id = id;
                                document.getElementById('list').appendChild(li);
                            } catch { 
                                console.log('TEXT:',e.data);
                            }
                        }; 
                        ws.onclose = e => location.reload(); 
                        return ws;
                    }
                    const conn = createWebSocket('${wsURL}');
                    document.getElementById('frmMessage').addEventListener('submit', e => {
                      e.preventDefault();
                      const msg = document.getElementById('message').value;
                      const id = document.querySelector('li:first-child').id;
                      conn.send(JSON.stringify({id:id, message:msg}));
                      document.body.removeChild(document.getElementById('frmMessage'));
                      return false;
                    },{once:true});
                    </script>
                    </body>
                    </html>`, {
                    headers: { 'content-type': 'text/html' }
                  }));
                }
          break;
          case 'CPX':
              const userList = [...users.keys()];
              console.log(userList);
              respondWith(new Response(JSON.stringify(userList), {
                  status: 200,
                  headers: {
                      'content-type': 'application/json'
                  }
              }));

          break;
          default:
              console.log('METHOD:',request.method);
              respondWith(new Response('Request Method Not Implemented', {
                  status: 501
              }));
      }    
    }
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