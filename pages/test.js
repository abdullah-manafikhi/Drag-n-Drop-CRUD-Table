// import TestVirtual from "../components/testVirtual";
import dynamic from 'next/dynamic'

function test() {

const TestVirtual = dynamic(() => import('../components/TestVirtual'), {
    ssr: false,
  })

  return (
    <div className='w-screen'>
      <h2>hello</h2>
      <TestVirtual />
    </div>
  );
}

export default test;
