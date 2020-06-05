import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'

import NewPage from '@components/admin/newPage'

const Pages = (props) => {
  useEffect(() => {
    getPages()
  }, [])

  const actions = ['new', 'edit']

  const getPageFromId = id => {
    return pages.find(page => page._id == id)
  }

  // const router = useRouter()
  const [pages, setPages] = useState([])
  const [action, setAction] = useState(actions.includes(props.action) ? props.action : null)
  const [selectedPage, setSelectedPage] = useState(null)
  const [loading, setLoading] = useState(true)

  const getPages = async () => {
    setLoading(true)
    const res = await fetch('/api/posts?pages=true')
    const json = await res.json()
    setPages(json)
    setLoading(false)
  }

  const editPage = id => {
    setAction('edit')
    setSelectedPage(getPageFromId(id))
  }

  const goToPages = () => {
    props.setTitle('Páginas')
    setAction(null)
  }

  const deletePage = async (id) => {
    const page = getPageFromId(id)
    console.log("deletando: ", page.title)
    const res = await fetch(`/api/posts?page=true&_id=${page._id}&thumb=${page.thumb}`, {method: 'DELETE'})
    if (res.status === 201) {
      console.log(`Página ${page.title} deletado com sucesso!`)
      getPages()
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
      name: 'Excluir',
      ignoreRowClick: true,
      cell: row => <h5 className="delete-element" onClick={()=>deletePage(row._id)}><FontAwesomeIcon icon={faTimesCircle} /></h5>,
    }
  ];

  if(action == 'edit' && selectedPage) {
    props.setTitle('Editar Page')
    return <NewPage goToPages={goToPages} selectedPage={selectedPage} />
  }

  if(action == 'new') {
    props.setTitle('Nova Página')
    return <NewPage goToPages={goToPages} />
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
        Nova Página
      </Button>

       <DataTable
        title="Todas as Páginas"
        // noTableHead={true}
        columns={columns}
        data={pages}
        keyField="_id"
        striped={true}
        highlightOnHover={true}
        pointerOnHover
        dense={true}
        progressPending={loading}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        onRowClicked={row => editPage(row._id)}
        noDataComponent="Não há dados para exibir"
      />
    </div>
  )
}

export default Pages
