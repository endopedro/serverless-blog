import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Form, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'
import { getCategories } from '@lib/crud-helpers'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryInput, setCategoryInput] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: categoryInput }),
    })
    if (res.status === 201) {
      const newCat = await res.json()
      console.log(newCat.name+' cadastrada com sucesso')
      handleFetchCategories()
    } else {
      console.log(await res.text())
    }
  }

  const deleteCat = async (id) => {
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    })
    if (res.status === 201) {
      const delCat = await res.json()
      console.log(delCat.name+' deletada com sucesso')
      handleFetchCategories()
    } else {
      console.log(await res.text())
    }
  }

  useEffect(() => {
    handleFetchCategories()
  }, [])

  const handleFetchCategories = async () => {
    setLoading(true)
    setCategories(await getCategories())
    setLoading(false)
  }

  const columns = [
    {
      name: 'Categoria',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Excluir',
      ignoreRowClick: true,
      cell: row => <h5 className="delete-element" onClick={()=>deleteCat(row._id)}><FontAwesomeIcon icon={faTimesCircle} /></h5>,
    }
  ];

  return (
    <div className="admin-content-element">
      <Form inline onSubmit={handleSubmit}>
        <Form.Control
          className="mb-2 mr-sm-2"
          id="inlineFormInputName2"
          placeholder="Adicionar categoria"
          size="sm"
          value={categoryInput}
          onChange={e => setCategoryInput(e.target.value)}
        />
        <Button type="submit" className="mb-2" size="sm" variant="info">
          <FontAwesomeIcon icon={faPlusCircle} className="mr-2"/>
          Adicionar
        </Button>
      </Form>

       <DataTable
        title="Todas as categorias"
        // noTableHead={true}
        columns={columns}
        data={categories}
        keyField="_id"
        striped={true}
        highlightOnHover={true}
        pointerOnHover
        dense={true}
        progressPending={loading}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        onRowClicked={row => editPage(row._id)}
        noDataComponent="Não há dados para exibir."
      />
    </div>
  )
}

export default Categories
