const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

// إعداد خادم HTTP
const server = http.createServer(app);

// إعداد WebSocket
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinRoom', ({ placeId }) => {
    socket.join(placeId);
    console.log(`User joined room for place ${placeId}`);
  });

  socket.on('sendMessage', ({ placeId, message }) => {
    io.to(placeId).emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// بدء الخادم
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const cors = require('cors');
app.use(cors());
