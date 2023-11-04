import {useState} from 'react'

export default function index() {

const [array, setArray] = useState(["abdullah", "amjad", "adam"])

  const test = (e) => {
    console.log(array)
    array.splice(0, 1, "Ahmed");
    console.log(array)

  }

  return (
    <>
      <div className="flex justify-center my-24">
        <h1 className='w-fit m-auto text-2xl font-bold'>This page is under construction navigate to :</h1>
        {/* <a className='w-fit mx-auto my-3' href="https://anc-pr-1.vercel.app/output">https://anc-pr-1.vercel.app/output</a> */}
      </div>

      <button onClick={(e) => test(e)} className='btn'>Test</button>
    </>
  )
}
