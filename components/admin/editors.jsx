import React, { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'
import Link from 'next/link'

import { BlogContext } from '@contexts/blogContext'
import { useUser } from '@lib/hooks'

const Users = () => {
  const [user, { mutate }] = useUser()
  const [state, dispatch] = useContext(BlogContext)
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user.role!='admin') router.push(`/admin`)
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [state.users])

  const getUserFromId = id => state.users.find(user => user._id == id)

  const editUser = id => router.push(`/admin?editEditor=${getUserFromId(id)._id}`)

  const removeUser = (id) =>
    dispatch({ type: 'REMOVE_USER', payload: id })

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
      removeUser(id)
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

  return (
    <div className="admin-content-element">
      <Link href="/admin?newEditor=true" passHref>
        <Button variant="info" size="sm" className="mb-3">
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2"/>
          Adicionar editor
        </Button>
      </Link>

       <DataTable
        title="Todos os editores"
        columns={columns}
        data={state.users}
        keyField="_id"
        pointerOnHover
        striped
        highlightOnHover
        dense
        progressPending={loading}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        onRowClicked={row => editUser(row._id)}
        noDataComponent="Não há dados para exibir"
        paginationPerPage={10}
        pagination={state.users.length > 10}
      />
    </div>
  )
}

export default Users
