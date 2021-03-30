// adding new chat documents
// setting up a real-time listener to get new chat
// updating the username
//updating room


class Chatroom{
    constructor(room,username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    async addChat(message){
        // format a chat
        const now = new Date();
        const chat  = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        const response = await this.chats.add(chat);
        return response;
    }
    getChats(callback){
        this.unsub = this.chats
        .where('room','==',this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot=>{
            snapshot.docChanges().forEach(change =>{
                if(change.type === 'added'){
                    // update ui
                    callback(change.doc.data());
                }
            });
        });
    }
    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
        
    }
    updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
            this.unsub();
        }
    }
}



//TESTS
// const chatroom = new Chatroom('general','shaun');
// chatroom.getChats((data)=>{
//     console.log(data);
// });


// setTimeout(()=>{
//     chatroom.updateRoom('music');
//     chatroom.updateName('ANETKA');
//     chatroom.getChats((data)=>{
//         console.log(data);
//     });
//     chatroom.addChat('hello');
// },3000)

//END TEST

