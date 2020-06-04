import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'

import NewEditor from '@components/admin/newEditor'

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
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const getUsers = async () => {
    setLoading(true)
    const res = await fetch('/api/users?all=true')
    const json = await res.json()
    setUsers(json.users.filter(user => (user.role!='admin')))
    setLoading(false)
  }

  const editUser = id => {
    setAction('edit')
    setSelectedUser(getUserFromId(id))
  }

  const goToEditors = () => {
    props.setTitle('Editores')
    setAction(null)
  }

  const deleteUser = async (id) => {
    const user = getUserFromId(id)
    console.log("deletando: ", user.name)
    const res = await fetch(`/api/users`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({editor: user}),
    })
    if (res.status === 201) {
      console.log(`Editor ${user.name} deletado com sucesso!`)
      getUsers()
    } else {
      console.log("erro: " + await res.text())
    }
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

  if(action == 'edit' && selectedUser) {
    props.setTitle('Editar Editor')
    return <NewEditor goToEditors={goToEditors} selectedEditor={selectedUser} />
  }

  if(action == 'new') {
    props.setTitle('Cadastrar editor')
    return <NewEditor goToEditors={goToEditors} />
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
        Adicionar editor
      </Button>

       <DataTable
        title="Todos os editores"
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
        onRowClicked={row => editUser(row._id)}
        noDataComponent="Não há dados para exibir"
      />
    </div>
  )
}

export default Users
