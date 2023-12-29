import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  const {socket} = useSocket();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if(selectedConversation._id === message.conversationId){
        setMessages((prev) => [...prev , message]);
      }

      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if(conversation._id === message.conversationId){
            return {
              ...conversation,
              lastMessage :{
                text : message.text,
                sender : message.sender,

              }
            }

          }
          return conversation
        })
         return updatedConversations
      })
    })
    return () => socket.off("newMessage");
       
  }, [socket]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behaviour : "smooth"});
  }, [messages]);

  useEffect(() => {
    setLoadingMessages(true);
    setMessages([]);
    const getMessages = async () => {
      try {
        if(selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data =  await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        
        
        setMessages(data);
      } catch (error) {
        console.log(error);
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId]);

  return (
    <Flex
      flex="70"
      bg={useColorModeValue("gray.200", "gray.dark")}
      borderRadius={"md"}
      flexDirection={"column"}
      p={2}
    >
      {/* Message Header */}
      <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
        <Avatar src={selectedConversation?.userProfilePic} size={"sm"} />
        <Text display={"flex"} alignItems={"center"}>
          {selectedConversation?.username} <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      <Flex
        flexDir={"column"}
        my={4}
        gap={4}
        p={2}
        height={"400px"}
        overflowY={"auto"}
      >
        {" "}
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={10} />}
              <Flex flexDir={"column"} gap={4}>
                <Skeleton h={8} w={"250px"} />
                <Skeleton h={8} w={"250px"} />
                <Skeleton h={8} w={"250px"} />
              </Flex>
              {i % 2 === 0 && <SkeletonCircle size={10} />}
            </Flex>
          ))}
        {!loadingMessages &&
          messages.map((message) => (
           <Flex key={message._id}
           direction={"column"}
           ref={messages.length -1 === messages.indexOf(message) ? messageEndRef : null }>
             <Message
              key={message._id}
              message={message}
              ownMessage={currentUser._id === message.sender}
            />
           </Flex>

          ))}
      </Flex>
      <MessageInput setMessages={setMessages}/>
    </Flex>
  );
};

export default MessageContainer;
