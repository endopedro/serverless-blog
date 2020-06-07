import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'

import { getCategories, getPosts } from '@lib/crud-helpers'
import NewPost from '@components/admin/newPost'

const AllPosts = (props) => {
  useEffect(() => {
    fetchCategories()
    fetchPosts()
  }, [])

  const actions = ['new', 'edit']

  const getPostFromId = id => {
    return posts.find(post => post._id == id)
  }

  const getCategoryFromId = id => {
    return categories.find(category => category._id == id)
  }

  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [action, setAction] = useState(actions.includes(props.action) ? props.action : null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [categories, setCategories] = useState([])

  const fetchCategories = async () => {
    setCategories(await getCategories)
  }

  const fetchPosts = async () => {
    setLoadingPosts(true)
    setPosts(await getPosts())
    setLoadingPosts(false)
  }

  const editPost = id => {
    setAction('edit')
    setSelectedPost(getPostFromId(id))
  }

  const goToPosts = () => {
    props.setTitle('Posts')
    setAction(null)
  }

  const deletePost = async (id) => {
    const post = getPostFromId(id)
    console.log("deletando: ", post.title)
    const res = await fetch(`/api/posts?_id=${post._id}&thumb=${post.thumb}`, {method: 'DELETE'})
    if (res.status === 201) {
      console.log(`Post ${post.title} deletado com sucesso!`)
      fetchPosts()
    } else {
      console.log("erro: " + await res.text())
    }
  }

  const columns = [
    {
      name: 'Título',
      selector: 'title',
      sortable: true,
    },
    {
      name: 'Categoria',
      selector: 'category',
      sortable: true,
    },
    {
      name: 'Autor',
      selector: 'author.name',
      sortable: true,
    },
    {
      name: 'Visualizações',
      selector: 'clicks',
      sortable: true,
    },
    {
      name: 'Excluir',
      ignoreRowClick: true,
      cell: row => <h5 className="delete-element" onClick={()=>deletePost(row._id)}><FontAwesomeIcon icon={faTimesCircle} /></h5>,
    }
  ];

  if(action == 'edit' && selectedPost) {
    props.setTitle('Editar Post')
    return <NewPost goToPosts={goToPosts} selectedPost={selectedPost} />
  }

  if(action == 'new') {
    props.setTitle('Novo Post')
    return <NewPost goToPosts={goToPosts} />
  }

  return (
    <div className="admin-content-element">
      <Button
        variant="info"
        size="sm"
        className="mb-3"
        onClick={() => setAction('new')}
      >
        <FontAwesomeIcon icon={faPlusCircle} className="mr-2"/>
        Novo Post
      </Button>

       <DataTable
        title="Todos os Posts"
        // noTableHead={true}
        columns={columns}
        data={posts}
        keyField="_id"
        striped={true}
        highlightOnHover={true}
        pointerOnHover
        dense={true}
        progressPending={loadingPosts}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        onRowClicked={row => editPost(row._id)}
        noDataComponent="Não há dados para exibir"
      />
    </div>
  )
}

export default AllPosts
