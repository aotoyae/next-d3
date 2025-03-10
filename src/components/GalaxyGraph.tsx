'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { totalData } from '@/utils/totalData';
import Link from 'next/link';

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

const GalaxyGraph = () => {
  const svgRef = useRef(null);
  const width = 1200;
  const height = 1000;

  useEffect(() => {
    if (!svgRef.current) return;

    const nodes = totalData;
    const nodeSize = 10;
    const nodeSpacing = 12;

    // 두 번째 노드부터 마지막 노드까지 첫 노드와 연결
    const links: Link[] = [
      ...nodes.slice(1, nodes.length).map((_, i) => ({
        source: nodes[0],
        target: nodes[i + 1],
      })),
    ];

    const convertingNodeSize = (d: Node, number: number) => {
      const total_funding = Number(d.total_funding.split('억')[0]);

      if (d.id == 1) {
        return 30;
      }

      return !isNaN(total_funding)
        ? Math.sqrt(total_funding) * 1.5 + number
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
        let homepage = d.homepage;

        if (!homepage.startsWith('https://')) {
          if (homepage.startsWith('www')) {
            homepage = `https://${homepage}`;
          } else {
            homepage = `https://www.${homepage}`;
          }
        }
        console.log(homepage);
        window.open(homepage, '_blank');
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
    <main className="flex flex-col gap-20 pb-10">
      <svg ref={svgRef}></svg>
    </main>
  );
};

export default GalaxyGraph;
