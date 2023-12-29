import {  Flex ,Spinner} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import useShowToast from '../hooks/useShowToast'
import Post from './Post';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';

function Homepage() {
  const [posts,setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(false)
  const showToast = useShowToast();

  useEffect(() => {
    setLoading(true);
    setPosts([]);
    
    const getFeedPosts = async () => {

      
      try {
        const res = await fetch("api/posts/feed")
        const data = await res.json();
        if(data.error){
          showToast("Error" ,data.error,"error");
          return;
        }
       setPosts(data);        
      } catch (error) {
        showToast("Error", error.message, "error");
        
      } finally {
        setLoading(false);

      }
      
    }
    getFeedPosts();

  },[showToast , setPosts]);
  return (
  <>
  {!loading && posts.length === 0 && <h1>follow some user to see the posts</h1>  }
  {
    loading && (
      <Flex justify='center'>
        <Spinner size='xl'/>
      </Flex>
    )}
    {posts.map((post) => (
      <Post key={post._id} post={post}  postedBy={post.postedBy} />
    ))}
  </>
  )
}


export default Homepage;

