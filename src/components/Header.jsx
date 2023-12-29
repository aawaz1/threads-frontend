import {  Button, Flex, Image, Link, LinkOverlay, useColorMode } from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import {AiFillHome} from 'react-icons/ai';
import {RxAvatar} from 'react-icons/rx';
import {FiLogOut} from 'react-icons/fi';
import {BsFillChatQuoteFill} from 'react-icons/bs';
import { Link as routerLink} from 'react-router-dom';
import useLogOut from "../hooks/useLogOut";
import authScreenAtom from "../atoms/authAtom";



const Header = () => {
    const user = useRecoilValue(userAtom);
    const {colorMode, toggleColorMode} = useColorMode();
    const logout = useLogOut();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    return (
        <Flex justifyContent={'space-between'} mt={6} mb={12}>
            {user &&(
                <Link as={routerLink}
                to='/'
                >
                  <AiFillHome  size={24}/>
                </Link>
            )}
             {!user &&(
                <Link as={routerLink}
                      to={'/auth'}
                onClick={ () => setAuthScreen('login')}
                > login
                  <AiFillHome  size={24}/>
                </Link>
            )}
               
           <Image 
           cursor={"pointer"}
           alt="logo"
           w={6}
           src={colorMode === "dark"  ? "/light-logo.svg" : "/dark-logo.svg"}
           onClick={toggleColorMode}
           />

{user && (  

                <Flex alignItems={"center"} gap={4}>
                <Link as={routerLink}
                to={`/${user.username}`}
                >
                  <RxAvatar  size={24}/>
                </Link>
                <Link as={routerLink}
                to={"/chat"}
                >
                  <BsFillChatQuoteFill  size={24}/>
                </Link>
                <Button size={'xs'}
                onClick={logout}
                        
    
    >
       <FiLogOut size={20}/>
        </Button>
                </Flex>
            )}
            {!user &&(
                <Link as={routerLink}
                      to={'/auth'}
                      onClick={() => setAuthScreen('signup')}
                > Sign Up
                  <AiFillHome  size={24}/>
                </Link>
            )}
        </Flex>
    )

}
// const Header = () => {
// 	const { colorMode, toggleColorMode } = useColorMode();
// 	const user = useRecoilValue(userAtom);
// 	// const logout = useLogout();
// 	// const setAuthScreen = useSetRecoilState(authScreenAtom);

// 	return (
// 		<Flex justifyContent={"space-between"} mt={6} mb='12'>
// 			{user && (
// 				<Link as={routerLink} to='/'>
// 					<AiFillHome size={24} />
// 				</Link>
// 			)}
// 			{/* {!user && (
// 				<Link as={routerLink} to={"/auth"} onClick={() => setAuthScreen("login")}>
// 					Login
// 				</Link>
// 			)} */}

// 			<Image
// 				cursor={"pointer"}
                
// 				alt='logo'
// 				w={6}
// 				src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
// 				onClick={toggleColorMode}
// 			/>

// 			{user && (
// 				<Flex alignItems={"center"} gap={4}>
// 					<Link as={routerLink} to={`/${user.username}`}>
// 						<RxAvatar size={24} />
// 					</Link>
// 					<Link as={routerLink} to={`/chat`}>
// 						<BsFillChatQuoteFill size={20} />
// 					</Link>
// 					<Link as={routerLink} to={`/settings`}>
// 						<MdOutlineSettings size={20} />
// 					</Link>
// 					<Button size={"xs"} onClick={logout}>
// 						<FiLogOut size={20} />
// 					</Button>
// 				</Flex>
// 			)}

// 			{!user && (
// 				<Link as={routerLink} to={"/auth"} onClick={() => setAuthScreen("signup")}>
// 					Sign up
// 				</Link>
// 			)}
// 		</Flex>
// 	);
// };

export default Header;