import React, { useEffect, useState, useContext, useRef } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import Message from "../Message";
import moment from "moment";
import chatData from "../../assets/dummy-data/Chats.js";

import "./MessageList.css";
import { AppContext } from "../../context/AppProvider";
import { Alert } from "antd";
import { ChatRoom, Message as MessageModel, ChatRoomUser } from "../../models";
import { DataStore, SortDirection, Auth } from "aws-amplify";
import { InfoCircleTwoTone } from "@ant-design/icons";
import InfoGroup from "../Modals/InfoGroup";
import EmojiPicker from "emoji-picker-react";

const MY_USER_ID = "apple";

function MessageListSelected() {
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [render, setRender] = useState(false);
  const { selectedRoomId, setIsModalOpenGroup , isEmojiPickerOpen } = useContext(AppContext);
  const [messageEmoji, setMessageEmoji] = useState("");
  const bottomRef = useRef(null);

  const fetchUsers = async () => {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter((chatRoomUser) => chatRoomUser.chatRoom.id === selectedRoomId)
      .map((chatRoomUser) => chatRoomUser.user);

    setAllUsers(fetchedUsers);

    const authUser = await Auth.currentAuthenticatedUser();
    setUser(
      fetchedUsers.find((user) => user.id !== authUser.attributes.sub) || null
    );
  };

  useEffect(() => {
    fetchChatRoom();
    fetchUsers();
  }, [selectedRoomId]);

  useEffect(() => {
    fetchMessages();
  }, [chatRoom]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      const currentUser = await Auth.currentAuthenticatedUser();
      const chatRoom = (await DataStore.query(ChatRoomUser))
        .filter(
          (chatRoomUser) => chatRoomUser.user.id === currentUser.attributes.sub
        )
        .map((chatRoomUser) => chatRoomUser.chatRoom);
      setChatRoom(chatRoom);
    };
    setChatRoom(chatRoom);
    fetchChatRooms();
  }, []);
  useEffect(() => {
    const subscription = DataStore.observe(MessageModel).subscribe((msg) => {
      console.log(msg.model, msg.opType, msg.element);
      if (msg.model === MessageModel && msg.opType === "INSERT") {
        //apend new message to existing messages
        setMessages((existingMessages) => [msg.element, ...existingMessages]);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fetchChatRoom = async () => {
    if (!selectedRoomId) {
      console.warn("No chatroom id received");
      return;
    }
    const chatRooms = await DataStore.query(ChatRoom, selectedRoomId);

    if (!chatRooms) {
      console.error("No chatroom found with this id");
    } else {
      setChatRoom(chatRooms);
      console.log(chatRooms);
    }
  };

  const fetchMessages = async () => {
    if (!chatRoom) {
      return;
    }
    const fetchedMessages = await DataStore.query(
      MessageModel,
      (message) => message.chatroomID("eq", chatRoom?.id),
      {
        sort: (message) => message.createdAt(SortDirection.DESCENDING),
      }
    );
    console.log(fetchedMessages);
    setMessages(fetchedMessages);
  };
  console.log(selectedRoomId);
  // console.log(messages);
  // console.log(chatRoom);
  const pickEmoji = (emojiData: EmojiClickData, event: MouseEvent) => {
    setMessageEmoji(currentMessage => currentMessage + emojiData.emoji)
    
  } 
  return (
    <div className="message-list">
      <Toolbar
        title={chatRoom?.name || user?.name}
        rightItems={[
          // <ToolbarButton
          //   key="info"
          //   icon="ion-ios-information-circle-outline"

          // />,
          <InfoCircleTwoTone
            key="info"
            onClick={() => {
              setIsModalOpenGroup(true);
            }}
            style={{
              fontSize: 24,
              alignItems: "center",

              display: "flex",
              marginLeft: 11,
            }}
          />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />,
        ]}
      />
      <div className="message-list-container" ref={bottomRef}>
        {messages.map((messItem) => (
          <Message key={messItem.id} data={messItem}></Message>
        ))}
      </div>

      <Compose
        chatRoom={chatRoom}
        messageEmoji={messageEmoji}
        leftItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />,
       
        ]}
        rightItems={[<ToolbarButton key="photo" icon="ion-ios-send" />]}
      ></Compose>
      { isEmojiPickerOpen && (
         <div style={{marginBottom: 120}}>
                  <EmojiPicker 
     autoFocusSearch={false}
     width="30%"
     onEmojiClick={pickEmoji}
      />
          </div>      
    )}        
      <InfoGroup />
    </div>
  );
}

export default MessageListSelected;
