import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle, faPenSquare } from '@fortawesome/free-solid-svg-icons'
import ReactLoading from 'react-loading'
import Link from 'next/link'

import { getPages } from '@lib/crud-helpers'

const Pages = () => {
  useEffect(() => {
    loadPages()
  }, [])

  const getPageFromId = id => {
    return pages.find(page => page._id == id)
  }

  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPages = async () => {
    setLoading(true)
    setPages(await getPages())
    setLoading(false)
  }

  const deletePage = async (id) => {
    const page = getPageFromId(id)
    const res = await fetch(`/api/posts?page=true&_id=${page._id}&thumb=${page.thumb}`, {method: 'DELETE'})
    if (res.status === 201) {
      console.log(`Página ${page.title} deletada com sucesso!`)
      loadPages()
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
      cell: row => (
        <>
          <h5 className="delete-element" onClick={()=>deletePage(row._id)}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </h5>
          <Link href={`/admin?editPage=${getPageFromId(row._id).slug}`} passHref>
            <h5 className="edit-element">
              <FontAwesomeIcon icon={faPenSquare} />
            </h5>
          </Link>
        </>
      )
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
        data={pages}
        keyField="_id"
        striped={true}
        highlightOnHover={true}
        dense={true}
        progressPending={loading}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        noDataComponent="Não há dados para exibir"
      />
    </div>
  )
}

export default Pages
