import React, { useEffect, useRef, useState } from 'react';
import MyButton from '../UI/button/MyButton';
import PostForm from '../components/PostForm';
import PostFilter from '../components/PostFilter';
import Postlist from '../components/Postlist';
import MyModal from '../UI/MyModal/MyModal';
import { usePosts } from '../hooks/usePosts';
import PostService from '../API/PostService';
import Loader from '../UI/Loader/Loader';
import { useFetching } from '../hooks/useFetching';
import { getPagesCount } from '../utils/pages';
import Pagination from '../UI/pagination/Pagination';
import { useObserver } from '../hooks/useObserver';
import MySelect from '../UI/select/MySelect';



function Posts() {
    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({ sort: '', query: ''})
    const [modal, setModal] = useState(false)
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(5);
    const [page, setPage] = useState(1);
    const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    const lastElement = useRef()
    
    const [fetchPosts, isPostsLoading, postError] = useFetching (async (limit, page) => {
        const response = await PostService.getAll(limit, page);
        setPosts([...posts, ...response.data])
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPagesCount(totalCount, limit));
    })

    useObserver(lastElement, page < totalPages, isPostsLoading,() => {
        setPage(page +1);
    })
 

    useEffect(() => {
      fetchPosts(limit, page)
    }, [page, limit])

    const createPost = (newPost) => {
      setPosts( [...posts, newPost])
      setModal(false)
    }


    const removePost = (post) => {
        setPosts(posts.filter(p => p.id !== post.id))
    }

    const changePage = (page) => {
        setPage(page)
    }

  return (
    <div className="App">
        <button onClick={fetchPosts}>GET POSTS</button>
        <MyButton style={{marginTop:30}} onClick={() => setModal(true)}>
            ?????????????? ????????
        </MyButton>
        <MyModal visible={modal} setVisible={setModal}>
          <PostForm create={createPost}/>
        </MyModal>

        <hr style={{margin: '15px 0'}}/>
        <PostFilter 
            filter={filter} 
            setFilter={setFilter}
        />
        <MySelect
            value={limit}
            onChange={value => setLimit(value)}
            defaulValue='??????-???? ?????????????????? ???? ????????????????'
            options={[
                {value: 5, name: '5'},
                {value: 10, name: '10'},
                {value: 25, name: '25'},
                {value: -1, name: '???????????????? ??????'}
            ]}/>
        {postError &&
            <h1>?????????????????? ???????????? ${postError}</h1>  
        }
        {isPostsLoading &&
          <div style={{display: 'flex', justifyContent:'center', marginTop:50}}><Loader/></div>
        }  
        <Postlist remove={removePost} posts={sortedAndSearchedPosts} title = '?????????? ?????? JS'/>
        <div ref={lastElement} style={{height: 28, background:'red'}}/>
        <Pagination 
            page={page} 
            changePage={changePage} 
            totalPages={totalPages}
        />
    </div>
  );
}



export default Posts;
