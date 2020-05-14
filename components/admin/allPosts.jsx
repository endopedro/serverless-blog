import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const AllPosts = () => {
  useEffect(() => {
    getPosts()
  }, [])

  const [posts, setPosts] = useState([])

  const getPosts = async () => {
    const res = await fetch('/api/posts')
    const json = await res.json()
    setPosts(json)
    console.log(json)
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
  ];

  return (
    <div className="admin-content-element">
       <DataTable
        title="Todos os Posts"
        // noTableHead={true}
        columns={columns}
        data={posts}
        keyField="_id"
        striped={true}
        highlightOnHover={true}
        pointerOnHover={true}
        dense={true}
      />
    </div>
  )
}

export default AllPosts
