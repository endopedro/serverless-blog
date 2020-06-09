import React, { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle, faPenSquare } from '@fortawesome/free-solid-svg-icons'
import ReactLoading from 'react-loading'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { BlogContext } from '@contexts/blogContext'

const Pages = () => {
  const [state, dispatch] = useContext(BlogContext)
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [state.pages])

  const getPageFromId = id => state.pages.find(page => page._id == id)

  const editPage = (pageId) => router.push(`/admin?editPage=${getPageFromId(pageId).slug}`)

  const removePage = (id) =>
    dispatch({ type: 'REMOVE_PAGE', payload: id })

  const deletePage = async (id) => {
    const page = getPageFromId(id)
    const res = await fetch(`/api/posts?page=true&_id=${page._id}&thumb=${page.thumb}`, {method: 'DELETE'})
    if (res.status === 201) {
      console.log(`Página ${page.title} deletada com sucesso!`)
      removePage(id)
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
      name: 'Ações',
      ignoreRowClick: true,
      cell: row =><h5 className="delete-element" onClick={()=>deletePage(row._id)}><FontAwesomeIcon icon={faTimesCircle} /></h5>
    }
  ];

  return (
    <div className="admin-content-element">
      <Link href="/admin?newPage=true" passHref>
        <Button variant="info" size="sm" className="mb-3">
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2"/>
          Nova Página
        </Button>
      </Link>

       <DataTable
        title="Todas as Páginas"
        columns={columns}
        data={state.pages}
        keyField="_id"
        pointerOnHover
        striped
        highlightOnHover
        dense
        progressPending={loading}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        noDataComponent="Não há dados para exibir"
        onRowClicked={row => editPage(row._id)}
      />
    </div>
  )
}

export default Pages
