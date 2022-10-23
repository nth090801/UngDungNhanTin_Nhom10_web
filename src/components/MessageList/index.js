import React, { useEffect, useState } from "react";
import Compose from "../Compose";
import Toolbar from "../Toolbar";
import ToolbarButton from "../ToolbarButton";
import Message from "../Message";
import moment from "moment";
import chatData from "../../assets/dummy-data/Chats.js";
import "./MessageList.css";

const MY_USER_ID = "apple";

export default function MessageList(props) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = () => {
    var tempMessages = [
      {
        id: 1,
        author: "apple",
        message:
          "Messenger[11] is a proprietary instant messaging app and platform developed by Meta Platforms. Originally developed as Facebook Chat in 2008, the company revamped its messaging service in 2010, released standalone iOS and Android apps in 2011, and released standalone Facebook Portal hardware for Messenger calling in 2018. In April 2015, Facebook launched a dedicated website interface, Messenger.com, and separated the messaging functionality from the main Facebook app, allowing users to use the web interface or download one of the standalone apps. In April 2020, Facebook released a Messenger desktop app for Windows and macOS.",
        timestamp: new Date().getTime(),
      },
      {
        id: 2,
        author: "orange",
        message:
          "Messenger is used to send messages and exchange photos, videos, stickers, audio, and files, and also react to other users' messages and interact with bots. The service also supports voice and video calling. The standalone apps support using multiple accounts, conversations with optional end-to-end encryption, and playing games.",
        timestamp: new Date().getTime(),
      },
      {
        id: 3,
        author: "orange",
        message: "Hello",
        timestamp: new Date().getTime(),
      },
      {
        id: 4,
        author: "apple",
        message: "Hello world! Hello world! Hello world!",
        timestamp: new Date().getTime(),
      },
      {
        id: 5,
        author: "apple",
        message: "Hello world! Hello world! Hello world!",
        timestamp: new Date().getTime(),
      },
      {
        id: 6,
        author: "apple",
        message: "Hello world! Hello world! Hello world!",
        timestamp: new Date().getTime(),
      },
      {
        id: 7,
        author: "orange",
        message: "Hello world! Hello world! Hello world!",
        timestamp: new Date().getTime(),
      },
      {
        id: 8,
        author: "orange",
        message: "Hello world! Hello world! Hello world!",
        timestamp: new Date().getTime(),
      },
      {
        id: 9,
        author: "apple",
        message: "Hello world! Hello world! Hello world!",
        timestamp: new Date().getTime(),
      },
      {
        id: 10,
        author: "orange",
        message: "Hello world! Hello world! Hello world!",
        timestamp: new Date().getTime(),
      },
    ];
    setMessages([...messages, ...tempMessages]);
  };

  const renderMessages = () => {
    let i = 0;
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.author === MY_USER_ID;
      let currentMoment = moment(current.timestamp);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp);
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment)
        );
        prevBySameAuthor = previous.author === current.author;

        if (prevBySameAuthor && previousDuration.as("hours") < 1) {
          startsSequence = false;
        }

        if (previousDuration.as("hours") < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.author === current.author;

        if (nextBySameAuthor && nextDuration.as("hours") < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  };

  return (
    <div className="message-list">
      <Toolbar
        title="Chat"
        rightItems={[
          <ToolbarButton
            key="info"
            icon="ion-ios-information-circle-outline"
          />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />,
        ]}
      />
      <div className="message-list-container"> {renderMessages()} </div>
      <Compose
        leftItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />,
        ]}
        rightItems={[<ToolbarButton key="photo" icon="ion-ios-send" />]}
      />
    </div>
  );
}
