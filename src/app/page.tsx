import AToAGraph from '@/components/AToAGraph';
import GalaxyGraph from '@/components/GalaxyGraph';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* <h1 className="py-4 text-3xl font-black">D3.js with Next.js</h1> */}
      {/* <NetworkGraph /> */}
      {/* <GalaxyGraph /> */}
      <AToAGraph />
      {/* <BarChart data={data} /> */}
    </div>
  );
}
