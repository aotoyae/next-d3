import BarChart from '@/components/BarChart';
import NetworkGraph from '@/components/NetworkGraph';

export default function Home() {
  const data = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
  const test = '정보 없음';

  console.log(!isNaN(Number(test.split('억')[0])));

  return (
    <div className="flex flex-col items-center">
      {/* <h1 className="py-4 text-3xl font-black">D3.js with Next.js</h1> */}
      <NetworkGraph />
      {/* <BarChart data={data} /> */}
    </div>
  );
}
