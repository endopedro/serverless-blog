import React, { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle, faPenSquare } from '@fortawesome/free-solid-svg-icons'
import ReactLoading from 'react-loading'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { BlogContext } from '@contexts/blogContext'

const AllPosts = (props) => {
  const [state, dispatch] = useContext(BlogContext)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setLoadingPosts(false)
  }, [state.posts])

  const getPostFromId = id => state.posts.find(post => post._id == id)

  const editPost = (postId) => router.push(`/admin?editPost=${getPostFromId(postId).slug}`)

  const removePost = (id) =>
    dispatch({ type: 'REMOVE_POST', payload: id })

  const deletePost = async (id) => {
    const post = getPostFromId(id)
    const res = await fetch(`/api/posts?_id=${post._id}&thumb=${post.thumb}`, {method: 'DELETE'})
    if (res.status === 201) {
      console.log(`Post ${post.title} deletado com sucesso!`)
      removePost(id)
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
      cell: row =><h5 className="delete-element" onClick={()=>deletePost(row._id)}><FontAwesomeIcon icon={faTimesCircle} /></h5>
    }
  ];

  return (
    <div className="admin-content-element">
      <Link href="/admin?newPost=true" passHref>
        <Button variant="info" size="sm" className="mb-3">
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2"/>
          Novo Post
        </Button>
      </Link>

      <DataTable
        title="Todos os Posts"
        columns={columns}
        data={state.posts}
        keyField="_id"
        pointerOnHover
        striped
        highlightOnHover
        dense
        progressPending={loadingPosts}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        noDataComponent="Não há dados para exibir"
        onRowClicked={row => editPost(row._id)}
      />
    </div>
  )
}

export default AllPosts
