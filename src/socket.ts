import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { jwtVerification } from '../security/jwt/decodeJwt';
declare global {
  var connectedUsers: Map<string, string>;
}
global.connectedUsers = new Map<string, string>();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});
function startSocket() {
  server.listen(process.env.SOCKET_PORT);
  io.on('connection', async (socket) => {
    try {
      if (!socket.handshake.query.token) throw 'notAllowed';

      let decodedJwt = await jwtVerification(
        (socket.handshake.query.token as string).split(' ')[1],
        process.env.REFRESH_TOKEN_SECRET!
      );
      let userId = decodedJwt._id;
      console.log('AddedAUser');

      global.connectedUsers.set(userId, socket.id);
      io.to(global.connectedUsers.get(userId)!).emit('userId', userId);
      console.log(global.connectedUsers);
      socket.on('disconnect', async (token) => {
        try {
          if (!token) throw 'notAllowed';
          decodedJwt = await jwtVerification(
            (socket.handshake.query.token as string).split(' ')[1],
            process.env.REFRESH_TOKEN_SECRET!
          );
          userId = decodedJwt._id;

          global.connectedUsers.delete(userId);
          console.log('deletedAUser');
          console.log(global.connectedUsers);
        } catch (err) {
          console.log(err);
        }
      });
    } catch (err) {
      console.log('err!!!!!!!!!!!!!!');
    }
  });
}
export { startSocket, io };
