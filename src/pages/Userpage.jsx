import React , {useState, useEffect} from 'react'
import UserHeader from '../components/UserHeader'
import UserPost from '../components/UserPost'
import { useParams } from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from '@chakra-ui/react'
import Post from '../components/Post'
import useGetUserProfile from '../hooks/useGetUserProfile'
import { useRecoilState } from 'recoil'
import postsAtom from '../atoms/postsAtom'

function Userpage() {
  
		
  const {user,loading} = useGetUserProfile();
  const showToast = useShowToast()
  const {username} = useParams()
 
 const [posts, setPosts] = useRecoilState(postsAtom);
  
  const [fetchingPosts , setFetchingPosts] = useState(true);

  useEffect(() => {
    

    const getPosts = async (e) => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        
        setPosts(data);
        console.log(data);
        
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([])
        
      }finally {
        setFetchingPosts(false);
      }

    }
    

    
    getPosts();
 

  }, [username , showToast ,setPosts ]
  );
  
  console.log(posts);
  if(!user && loading) {
    return (
      <Flex justifyContent={'center'}>
        <Spinner size='xl'/>

      </Flex>
    )
  } 

  if(!user && !loading) return <h1> User not Found.</h1>
  
  
  
  
   
  ;

  return (
    <>
    <UserHeader user={user}/>
    {!fetchingPosts && posts?.length ===0 && <h1>Users has no Posts</h1> }
    {fetchingPosts && (
      <Flex justifyContent={'center'} my={12}>
        <Spinner size={'xl'}/>

      </Flex>
    )}
    {posts?.map((post) => (
      <Post key={post._id} post={post} postedBy={post.postedBy}/>
    ))}

   
    </>
  )

}

  


export default Userpage