import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from '@chakra-ui/react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import useShowToast from '../hooks/useShowToast'
import { useNavigate, useParams } from 'react-router-dom'
import useGetUserProfile from '../hooks/useGetUserProfile'
import {formatDistanceToNow} from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'
import { DeleteIcon } from "@chakra-ui/icons"
import postsAtom from '../atoms/postsAtom'
export default function Postpage() {
  const {user,loading} = useGetUserProfile();
  const [post,setPost] = useState(null);
  const [posts,setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const {pid} = useParams();
  const navigate = useNavigate();
  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async() => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`)
        const data = await res.json();
        if(data.error){
          showToast('Error', data.error, "error");
          return;

        }
        console.log(data);
        setPosts([data]);
      } catch (error) {
        showToast('Error', error.message, "error");
        
      }

    }

    getPost();

  },[showToast,pid ,setPosts])

  const handleDeletePost = async () => {
    try {
      
      if(!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}` , {
          method : 'DELETE'
      })
      const data = await res.json();
      if(data.error){
          showToast("Error" , data.error, "error");
      }
      showToast("Success" , "Post Deleted" , "success");
      navigate(`/${user.username}`)
      
  } catch (error) {
      showToast("Error", error.message , "error");
      
  }
  }

  if(!user && loading){
    return (
      <Flex justifyContent={'center'}>
        <Spinner size={'xl'}/>

      </Flex>
    )
  }

  if(!currentPost) return null;
  
  return (
    <>
    <Flex>
      <Flex w={'full'}
      alignItems={'center'} 
      gap={3}>
        <Avatar src={user?.profilePic}
        name='zaman ali'
        size={'md'}
        />
        <Flex>
        <Text
        fontSize={'sm'}
        fontWeight={'bold'}>
         {user?.name}

        </Text>
        <Image src='/verified.png'
                w="4"
                h={4}
                ml={4}

        />
        </Flex>

      </Flex>
      <Flex alignItems={"center"}
                    gap={4}>
                        <Text fontSize={"xm"} width={36} textAlign={"right"}
                        color={"gray.light"}>{formatDistanceToNow(new Date(currentPost.createdAt))} ago</Text>
                        {
                            currentUser?._id === user._id &&  <DeleteIcon cursor={'pointer'} size={20} onClick={handleDeletePost}/>
                        }
                        
                    </Flex>
    </Flex>
    <Text my={3}
    >
      {currentPost?.text}

    </Text>
    { currentPost?.img && (
       <Box borderRadius={6}
       overflow={"hidden"}
       border={"1px solid "}
       borderColor={"gray.light"}
   
       
   >
      <Image src={currentPost?.img}
      w={"full"}
       />
   
   
   </Box>
    )
   }

   <Flex gap={3} my={3}>
    <Actions post={currentPost}/>

   </Flex>
               
               <Divider my={4}/>

               <Flex justifyContent={"space-between"}>
                <Flex gap={2}
                alignItems={'center'}>
                  <Text fontSize={"2xl"}>
                    🙋‍♂️

                  </Text>
                  <Text color={'gray.light'}>
                  Get the App to Like ,Reply and Posts.

                  </Text>


                </Flex>
                <Button>
                  Get
                </Button>
                

               </Flex>
               <Divider my={4}/>
               {currentPost?.replies.map((reply) => (
                <Comment 
                key={reply._id}
                reply={reply}
                lastReply = {reply._id === currentPost?.replies[currentPost?.replies.length -1]._id}/>
               )) 
                
                
     }
              
    
    
    </>
  )
}
