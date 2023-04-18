import Head from "next/head";
import Table from "../components/Table";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import dynamic from 'next/dynamic'

function output() {
  // const DndUI = dynamic(() => import('../components/DndUI'), {
  //     ssr: false,
  // })

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Table</title>
        <meta
          name="description"
          content="Checkout the best service in the film industry field "
        />
      </Head>
      <div className="container m-auto justify-center align-center flex-col">
        <>
          {/*  <!-- Add a button to trigger the PDF export --> */}

          <Table />
          {/* <DndUI /> */}
        </>
      </div>
    </>
  );
}

export default output;
