import io from 'socket.io-client';

const socket = io("http://kaboom.rksv.net/watch");
socket.on('error', function (evData) {
    console.error('Connection Error:', evData);
});

function subscribeToStock(cb) {
    const CLIENT_ACKNOWLEDGEMENT = 1
    socket.emit('sub', {state: true})
    socket.on('data', (data, ack) =>{ 
        cb(null, data)
        ack(CLIENT_ACKNOWLEDGEMENT)
    })
}

function unSubscribeToStock() {
    const CLIENT_ACKNOWLEDGEMENT = 1
    socket.emit('unsub', {state: false})
}
export { subscribeToStock , unSubscribeToStock};