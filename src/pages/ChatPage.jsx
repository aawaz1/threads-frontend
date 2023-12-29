import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";

const ChatPage = () => {
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversation, setLoadingConversation] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
  const currrentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const {socket, onlineUsers} = useSocket();
    useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch(`/api/messages/conversations `);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversation(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);
  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
        
      }
      const messagingYourself = searchedUser._id === currrentUser._id 
      if(messagingYourself){
        showToast("Error" ,"you cannot message yourself" , "error");
        return;
      }

      // if user is already in conversation with the searched user
      const conversationAlreadyExist = conversations.find(conversation => conversation.participants[0]._id === searchedUser._id)
      if(conversationAlreadyExist){
        setSelectedConversation({
          _id : conversationAlreadyExist._id,
          userId : searchedUser._id,
          userProfilePic : searchedUser.profilePic,
          username : searchedUser.username,

        });
        return;

      }

      const mockConversation = {
        mock : true,
        lastMessage : {
          text : "",
          sender : "",

        },
        _id : Date.now(),
        participants : [
          {
            _id : searchedUser._id,
            username : searchedUser.username,
            profilePic : searchedUser.profilePic,


          }
        ]
      }
      setConversations((prevConvos => [...prevConvos , mockConversation]))
    } catch (error) {
      showToast("Error", error.message, "error");
      console.log(error);
    } finally {
      setSearchingUser(false);
    }
  };
  return (
    <Box
      position={"absolute"}
      left={"-10%"}
      w={{ base: "100%", md: "80%", lg: "750px" }}
      transform={"transalteX(-50%)"}
    >
      <Flex
        gap={4}
        flexDirection={{ base: "column", md: "row" }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{ sm: "250px", md: "full" }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversations
          </Text>
          <form onSubmit={handleConversationSearch}>
            <Flex alignItems={"center"} gap={2}>
              <Input
                placeholder="Search for a User"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
              <Button
                size={"sm"}
                onClick={handleConversationSearch}
                isLoading={searchingUser}
              >
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loadingConversation &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
              >
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90px"} />
                </Flex>
              </Flex>
            ))}
          {!loadingConversation &&
            conversations.map((conversation) => (
              <Conversation
                isOnline = {onlineUsers.includes(conversation.participants[0]._id)}
                key={conversation?._id}
                conversation={conversation}
              />
            ))}
        </Flex>
        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            h={"400px"}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a Conversation to start Texting</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;
