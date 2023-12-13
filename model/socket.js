const socketIO = require("socket.io")
const { updataUserPresence, checkUserPresence } = require("./userModel")
const userSockets = new Map()
const user = new Array()
module.exports = {
    Server: (Server) => {
        const io = socketIO(Server);
        
        function notification(data){
            console.log("send");
            io.emit("notfication",data)
         }
        io.on('connection', async (socket) => {
            console.log('A user connected.');
            socket.on("userId", async (res) => {
                console.log(res);
                const userId = res
                userSockets.set(userId, socket)
                user.push({ userId, socketId: socket.id })
                await updataUserPresence(userId, "online")
                io.emit("UStatus", { userId,Status:"online"})

            })
             
            socket.on("message",data=>{
                console.log(socket.id);
                io.emit("Message",{socketId:socket.id,data})
            })
            socket.on('disconnect', async() => {
                // console.log();
                const userId = user.filter(data => data.socketId === socket.id)
                conset = await updataUserPresence(userId[0]?.userId, socket.handshake.time)
                setTimeout(async()=>{
                    if (userId.length) {
                        const User = await checkUserPresence(userId[0].userId)
                        console.log("------------r--------------");
                        console.log(User);
                        console.log("-----------r---------------");
                        if(!User){ 
                            io.emit("UStatus", {userId:userId[0].userId,Status:socket.handshake.time})
                            console.log('disconnected.');
                        }
                    }
                },3500)
                console.log('A user disconnected.');
            });
        });

        return {io,notification};
    }, userSockets,
}
