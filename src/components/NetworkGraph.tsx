'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { testData } from '@/utils/testData';
import Link from 'next/link';

// interface Node extends d3.SimulationNodeDatum {
//   id: number;
//   name: string;
//   group: number;
//   link?: string;
//   total_funding?: number;
// }

interface Node extends d3.SimulationNodeDatum {
  id: number;
  company: string;
  key_executive: string;
  industry: string;
  address: string;
  homepage: string;
  email: string;
  phone_number: string;
  sales: string;
  total_funding: string;
  logo_url?: string;
}

interface Link {
  source: Node;
  target: Node;
}

const NetworkGraph = () => {
  const svgRef = useRef(null);
  const width = 700;
  const height = 700;
  const [selectedCompany, setSelectedCompany] = useState(testData[0]);

  useEffect(() => {
    if (!svgRef.current) return;

    const nodes = testData;
    const nodeSize = 30;
    const nodeSpacing = 35;

    // 두 번째 노드부터 마지막 노드까지 첫 노드와 연결
    const links: Link[] = [
      ...nodes.slice(1, nodes.length).map((_, i) => ({
        source: nodes[0],
        target: nodes[i + 1],
      })),
    ];

    const convertingNodeSize = (d: Node, number: number) => {
      const total_funding = Number(d.total_funding.split('억')[0]);

      return !isNaN(total_funding)
        ? Math.sqrt(total_funding) * 1.7 + number
        : number;
    };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => (d as Node).id)
          .distance(200)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collid',
        d3.forceCollide((d) => convertingNodeSize(d, nodeSpacing))
      );

    const link = svg
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'var(--peak-200)')
      .attr('stroke-width', 1);

    const node = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, Node, Node>()
          .on('start', dragstart)
          .on('drag', dragged)
          .on('end', dragend)
      )
      .on('click', (_, d) => {
        setSelectedCompany(d);
        // let homepage = d.homepage;

        // if (!homepage.startsWith('https://')) {
        //   if (homepage.startsWith('www')) {
        //     homepage = `https://${homepage}`;
        //   } else {
        //     homepage = `https://www.${homepage}`;
        //   }
        // }
        // console.log(homepage);
        // window.open(homepage, '_blank');
      });

    // 원 추가
    node
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d) => convertingNodeSize(d, nodeSize))
      .attr('stroke', 'var(--peak-200)')
      .attr('stroke-width', 1)
      .attr('fill', (d) => (d.id === 1 ? 'var(--peak-900)' : '#fff'));

    // 로고 추가
    const clipPath = svg
      .append('defs')
      .selectAll('clipPath')
      .data(nodes)
      .enter()
      .append('clipPath')
      .attr('id', (d) => `clip-${d.id}`);

    clipPath
      .append('circle')
      .attr('r', (d) => convertingNodeSize(d, nodeSpacing))
      .attr('cx', 0)
      .attr('cy', 0);

    node
      .append('image')
      .attr('xlink:href', (d) => d.logo_url || '')
      .attr('width', (d) => convertingNodeSize(d, nodeSpacing))
      .attr('height', (d) => convertingNodeSize(d, nodeSpacing))
      .attr('x', (d) => {
        const size = convertingNodeSize(d, nodeSpacing);
        return -size / 2;
      })
      .attr('y', (d) => {
        const size = convertingNodeSize(d, nodeSpacing);
        return -size / 2;
      })
      .attr('clip-path', (d) => `url(#clip-${d.id})`);

    // 텍스트 추가
    node
      .filter((d) => d.id === 1)
      .append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text((d) => d.company);

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as any).x)
        .attr('y1', (d) => (d.source as any).y)
        .attr('x2', (d) => (d.target as any).x)
        .attr('y2', (d) => (d.target as any).y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    function dragstart(event: { active: any }, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: Node, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragend(event: { active: any }, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, []);

  return (
    <main className="flex items-center justify-center gap-12">
      <svg ref={svgRef}></svg>
      {/* <p>- network graph -</p> */}
      <section className="flex flex-col gap-10">
        <h2 className="text-4xl font-semibold leading-snug text-center text-peak-900">
          {testData[0].company}
          <br />✕<br />
          {selectedCompany.company}
        </h2>
        <article className="w-[450px] px-6 py-7 bg-gray-100 rounded-3xl flex flex-col justify-between gap-6 items-start">
          <h2 className="text-lg font-black">
            {selectedCompany.company} 기업 정보
          </h2>
          <section className="grid grid-cols-6 gap-2">
            <p className="font-bold">대표자</p>
            <p>{selectedCompany.key_executive}</p>
            <p className="font-bold">분야</p>
            <p className="col-span-3">{selectedCompany.industry}</p>
            <p className="font-bold">주소</p>
            <p className="col-span-5">{selectedCompany.address}</p>
            <p className="font-bold">이메일</p>
            <p className="col-span-5">{selectedCompany.email}</p>
            <p className="font-bold">전화번호</p>
            <p className="col-span-5">{selectedCompany.phone_number}</p>
            <p className="font-bold">투자금액</p>
            <p className="col-span-5">{selectedCompany.total_funding}</p>
          </section>
          <Link
            href={selectedCompany.homepage}
            target="_blank"
            className="w-full py-3 font-bold tracking-widest text-center text-white rounded-lg bg-peak-500"
          >
            홈페이지
          </Link>
        </article>
      </section>
    </main>
  );
};

export default NetworkGraph;
