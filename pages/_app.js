import '../styles/globals.css'
import { TableProvider } from '../components/context/TableContext.js'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

function MyApp({ Component, pageProps }) {

  

  return (
    <TableProvider>
      <Component {...pageProps} />
    </TableProvider>
  )
}

export default MyApp
