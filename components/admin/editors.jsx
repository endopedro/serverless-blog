import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'

import NewPost from '@components/admin/newPost'

const Users = (props) => {
  useEffect(() => {
    getUsers()
  }, [])

  const actions = ['new', 'edit']

  const getUserFromId = id => {
    return users.find(user => user._id == id)
  }

  // const router = useRouter()
  const [users, setUsers] = useState([])
  const [action, setAction] = useState(actions.includes(props.action) ? props.action : null)
  // const [selectedPost, setSelectedPost] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/users?all=true')
    const json = await res.json()
    console.log('USERS',json)
    setUsers(json.users)
    setLoading(false)
  }

  // const editPost = id => {
  //   setAction('edit')
  //   setSelectedPost(getPostFromId(id))
  // }

  // const goToPosts = () => {
  //   props.setTitle('Posts')
  //   setAction(null)
  // }

  const deleteUser = async (id) => {
    // const post = getPostFromId(id)
    console.log("deletando: ", user.name)
    // const res = await fetch(`/api/posts?_id=${post._id}&thumb=${post.thumb}`, {method: 'DELETE'})
    // if (res.status === 201) {
    //   console.log(`Post ${post.title} deletado com sucesso!`)
    //   getPosts()
    // } else {
    //   console.log("erro: " + await res.text())
    // }
  }

  const columns = [
    {
      name: 'Nome',
      selector: 'name',
      sortable: true,
    },
    {
      email: 'Email',
      selector: 'email',
      sortable: true,
    },
    {
      name: 'Excluir',
      ignoreRowClick: true,
      cell: row => getUserFromId(row._id).role == 'admin' ? '' : <h5 className="delete-element" onClick={()=>deleteUser(row._id)}><FontAwesomeIcon icon={faTimesCircle} /></h5>,
    }
  ];

  // if(action == 'edit' && selectedPost) {
  //   props.setTitle('Editar Post')
  //   return <NewPost goToPosts={goToPosts} selectedPost={selectedPost} />
  // }

  // if(action == 'new') {
  //   props.setTitle('Novo Post')
  //   return <NewPost goToPosts={goToPosts} />
  // }

  return (
    <div className="admin-content-element">
      <Button
        variant="info"
        size="sm"
        className="mb-3"
        onClick={() => setAction('new')}
      >
        <FontAwesomeIcon icon={faPlusCircle} className="mr-2"/>
        Adicionar editor
      </Button>

       <DataTable
        title="Todos os Usuários"
        // noTableHead={true}
        columns={columns}
        data={users}
        keyField="_id"
        striped={true}
        highlightOnHover={true}
        pointerOnHover
        dense={true}
        progressPending={loading}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        onRowClicked={row => editPost(row._id)}
      />
    </div>
  )
}

export default Users
