import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";



export default function Comment({ reply ,lastReply }) {
   
  return (
    <>
    <Flex py={2} my={2} gap={4} w={"full"}  >
        <Avatar 
        src={reply.userProfilePic}
        size={"sm"}
        />
        <Flex gap={1} flexDirection={"column"} w={"full"}>
            <Flex w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}>
                <Text fontSize={"sm"}
                fontWeight={"bold"}
                >{reply?.username}


                </Text>
                

            </Flex>
            <Text>
                {reply?.text}
            </Text>
           
          
            
        </Flex>
        </Flex>
       { !lastReply ? <Divider /> : null}
        </>
  )
}
