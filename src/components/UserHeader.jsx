import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout"
import { Avatar, Button, Menu, MenuButton, MenuItem, MenuList, Portal, useToast } from "@chakra-ui/react"
import {BsInstagram} from 'react-icons/bs'
import {CgMoreO} from "react-icons/cg"
import '../index.css'
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import {Link as RouterLink} from "react-router-dom";
import { useState } from "react"
import useShowToast from "../hooks/useShowToast"


function UserHeader({user}) {
    
    const toast = useToast();
    const [updating,setUpdating] = useState(false);
    const showToast = useShowToast();
    const currentUser = useRecoilValue(userAtom);
    const [following,setFollowing] = useState(user.followers.includes(currentUser?._id));
    
    const copyUrl = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: 'Account created.',
                description: "Profile Link Copied to URL",
                status: 'success',
                duration: 3000,
                isClosable: true,
              })
        })

    }

    const handleFollowUnfollow = async () => {
        if(!currentUser){
            showToast("Error","please login to follow", "error");
            return;
        }
        if(updating) return;
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method : "POST",
                headers: {
					"Content-Type": "application/json",
				},
				
            })
            const data = await res.json();
            if(data.error){
                showToast("Error", error, "error");
                return;

            }
            if(following){
                showToast("Success", `unfollowed ${user.name}`, "success");
                user.followers.pop();
            }else{
                showToast("Success", `followed ${user.name}`, "success");
                user.followers.push(currentUser?._id);
            }
            setFollowing(!following);
           
            
        } catch (error) {
            showToast("Error", error, "error");
            
        } finally {
            setUpdating(false);
        }
    }

   
  return (
    <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                   {user.name}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={"gray.900"} color={'gray.light'} p={1} borderRadius={'full'}>chitchat.in</Text>
                        
                    </Flex>
            </Box>
            <Box>
               {
                user.profilePic && ( <Avatar name={user.name}
                src={user.profilePic} 
                size={{
                    base: "md",
                    md :"xl" ,
                }}/> )
                
               }
               {
                !user.profilePic && ( <Avatar name={user.name}
                src="https://bit.ly/broken-link"
                size={{
                    base: "md",
                    md :"xl" ,
                }}/> )
                
               }
                
            </Box>

        </Flex>
        <Text>
            {user.bio}
        </Text>
        {currentUser?._id === user._id && (
            <Link as={RouterLink}
            to='/update'
            >
            <Button
            size={"sm"}
            >Update Profile

            </Button>
            </Link>
        )
        }
         {currentUser?._id !== user._id && (
            
            <Button
            size={"sm"}
            onClick={handleFollowUnfollow}
            isLoading={updating}
            > {
                following ? "Unfollow" : "Follow"
            }

            </Button>
           
        )
        }
        <Flex w={"full"} justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"}>{user.followers.length} Followers</Text>
                <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"}>instagram.com</Link>
            </Flex>
            <Flex >
                
                <Box className="icon-container">
                    <BsInstagram  size={24} cursor={"pointer"}/>
                </Box>
                <Box className="icon-container">
                    <Menu><MenuButton>
                    <CgMoreO  size={24} cursor={"pointer"}/>
                    </MenuButton>
                    <Portal>
                    <MenuList>
    <MenuItem bg={"gray.dark"} onClick={copyUrl}>Copy Link</MenuItem>
   
  </MenuList>
                        
                        </Portal></Menu>
                    
                    
                </Box>
            </Flex>

        </Flex>
        <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb="3"  cursor={"pointer"}>
                <Text fontWeight={"bold"}> threads</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} color={"gray.light"} justifyContent={"center"} pb="3"  cursor={"pointer"}>
                <Text fontWeight={"bold"}> replies</Text>
            </Flex>
            </Flex>
       
    </VStack>
  )
}

export default UserHeader