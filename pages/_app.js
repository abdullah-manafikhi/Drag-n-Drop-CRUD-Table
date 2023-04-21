import '../styles/globals.css'
import { TableProvider } from '../components/context/TableContext.js'
import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  
  return (
    <TableProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </TableProvider>
  )
}

export default MyApp
