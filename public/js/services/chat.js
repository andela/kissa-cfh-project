angular.module('mean.system')
  .factory('chat', function () {
    /**
    * Class to implement chat functionality
    */
    class Chat {
      /**
      * Constructor to create a new instance of this class
      */
      constructor() {
        // declare fire base reference with link to our firebase database
        this.firebase = new Firebase('https://kissa-chat.firebaseio.com/');
        this.messageArray = [];
        this.enableListener = true;
        this.chatAvatar = null;
        this.isHidden = false;
        this.unreadMessageCount = 0;
      }

      /**
      * Method to set the chat group to post
      * our messages to.
      * @param{String} group - Name of the group
      * @return
      */
      setChatGroup(group) {
        this.chatGroup = group;
      }
      /**
      * Method to set the avatar of the user
      * @param {image} avatar - avatar of the user
      * @return
      */
      setChatAvatar(avatar) {
        this.chatAvatar = avatar;
      }
      /**
      * Method to set the current chat user name
      * @param{String} name - name of the user
      * @return
      */
      setChatUsername(name) {
        this.userName = name;
      }
      /**
      * Method to post user message to firebase
      * database.
      * @param{String} messageText - message
      * @return{undefined}
      */
      postGroupMessage(messageText) {
        const date = new Date();
        const messageTime = date.toTimeString().substr(0, 8);
        // We do not want to send empty messages
        if (messageText !== undefined && messageText.trim().length > 0) {
          // Push message to group thread on firebase
          const messageObject = {
            senderName: this.userName,
            textContent: messageText,
            time: messageTime,
            avatar: this.chatAvatar
          };
          this.firebase.child(this.chatGroup)
            .push(messageObject);
        }
      }
      /**
      * Method to setup  eventlistener
      * for firebase
      * @return
      */
      listenForMessages() {
        if (!this.enableListener) {
          return;
        }
        this.firebase.child(this.chatGroup).off();
        this.enableListener = false;
        this.firebase.child(this.chatGroup).on('child_added', (snapshot) => {
          const message = snapshot.val();
          this.messageArray.push(message);
          this.unreadMessage();
        });
      }
      showHide() {
      // If DIV is hidden it will be visible and vice versa.
      if(!this.isHidden){
        this.unreadMessageCount = 0;
        this.isHidden = true;       
      } else {
        this.isHidden = false;
      }
    }
    unreadMessage() {
      if(!this.isHidden) {
        this.unreadMessageCount += 1;
      }
      return this.unreadMessageCount;
    }

    }
    const chat = new Chat();
    return chat;
  });
