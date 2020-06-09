import React, { useEffect, useState, useContext } from 'react'
import DataTable from 'react-data-table-component'
import { Button, Form, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'
import ReactLoading from 'react-loading'
import { getCategories } from '@lib/crud-helpers'

import { BlogContext } from '@contexts/blogContext'

const Categories = () => {
  const [state, dispatch] = useContext(BlogContext)
  // const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryInput, setCategoryInput] = useState('')

  useEffect(() => {
    setLoading(false)
  }, [state.categories])

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
      insertCat(newCat)
    } else {
      console.log(await res.text())
    }
  }

  const insertCat = (cat) =>
    dispatch({ type: 'INSERT_CATEGORY', payload: cat })

  const deleteCat = async (id) => {
    const res = await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    })
    if (res.status === 201) {
      const delCat = await res.json()
      console.log(id+' deletada com sucesso')
      removeCat(id)
    } else {
      console.log(await res.text())
    }
  }

  const removeCat = (id) =>
    dispatch({ type: 'REMOVE_CATEGORY', payload: id })

  // useEffect(() => {
  //   handleFetchCategories()
  // }, [])

  // const handleFetchCategories = async () => {
  //   setLoading(true)
  //   setCategories(await getCategories())
  //   setLoading(false)
  // }

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
        data={state.categories}
        keyField="_id"
        pointerOnHover
        striped
        highlightOnHover
        dense
        progressPending={loading}
        progressComponent={<ReactLoading type="spin" color="#0D7EA6" className="my-5"/>}
        noDataComponent="Não há dados para exibir."
      />
    </div>
  )
}

export default Categories
