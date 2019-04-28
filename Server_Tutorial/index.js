/* eslint-disable no-restricted-syntax */
const io = require('socket.io')(process.env.PORT || 52300);

// Custom classes
const Player = require('./Classes/Player');

console.log('Server has started on port', process.env.PORT || 52300);

const players = [];
const sockets = [];

io.on('connection', (socket) => {
  console.log('Connection Made');

  const player = new Player();
  const thisPlayerID = player.id;

  players[thisPlayerID] = player;
  sockets[thisPlayerID] = socket;

  // Tell the client that this is out id for the server
  socket.emit('register', { id: thisPlayerID });
  socket.emit('spawn', player); // Tell myself I have spawned
  socket.broadcast.emit('spawn', player); // broadcast - tell every users who connected to io exept myself

  // Tell myself about everyone else in the game
  for (const playerID in players) {
    if (playerID !== thisPlayerID) {
      socket.emit('spawn', players[playerID]);
    }
  }

  // Positional Data from Client
  socket.on('updatePosition', (data) => {
    // console.log("Data position:", data.position);
    player.position.x = data.position.x;
    player.position.y = data.position.y;
    // player.position.x = parseFloat(data.position.x.replace(',', '.'));
    // player.position.y = parseFloat(data.position.y.replace(',', '.'));
    console.log("Player position:", player.position);

    socket.broadcast.emit('updatePosition', player);
  });

  socket.on('disconnect', () => {
    console.log('A player has disconnected');
    delete players[thisPlayerID];
    delete sockets[thisPlayerID];
    socket.broadcast.emit('disconnected', player);
  });
});
