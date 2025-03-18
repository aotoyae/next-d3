import AToAGraph from '@/components/AToAGraph';
import GalaxyGraph from '@/components/GalaxyGraph';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="py-4 text-3xl font-black">A2A Network Graph View</h1>
      <AToAGraph />
    </div>
  );
}
