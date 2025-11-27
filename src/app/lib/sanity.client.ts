import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'bgx5fxe4', // Kendi ID'niz
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})