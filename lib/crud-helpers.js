import fetch from 'isomorphic-unfetch'

export async function getPosts() {
    const res = await fetch('/api/posts', {method: 'GET'})
    const json = await res.json()
    return json
}

export async function getPost(slug) {
  const res = await fetch(`${process.env.WEB_URI}/api/posts?slug=${slug}`, {method: 'GET'})
  const json = await res.json()
  return json
}

export async function getPage(slug) {
  const res = await fetch(`${process.env.WEB_URI}/api/posts?page=${slug}`, {method: 'GET'})
  const json = await res.json()
  return json
}

export async function getPages() {
  const res = await fetch(`${process.env.WEB_URI}/api/posts?pages=true`, {method: 'GET'})
  const json = await res.json()
  return json
}

export async function getUser(id) {
  const res = await fetch(`${process.env.WEB_URI}/api/users?id=${id}`, {method: 'GET'})
  const json = await res.json()
  return json
}

export async function getCategories() {
  const res = await fetch(`${process.env.WEB_URI}/api/categories`, {method: 'GET'})
  const json = await res.json()
  return json
}

export async function getUsers() {
  const res = await fetch(`${process.env.WEB_URI}/api/users?all=true`, {method: 'GET'})
  const json = await res.json()
  return json
}

export function incPostView(slug) {
  fetch(`${process.env.WEB_URI}/api/posts?incView=${slug}`, {method: 'GET'})
  return
}