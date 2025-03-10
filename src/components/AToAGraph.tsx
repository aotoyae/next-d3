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

const AToAGraph = () => {
  const svgRef = useRef(null);
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    if (!svgRef.current) return;

    const nodes = totalData.splice(1);
    const nodeSize = 15;
    const nodeSpacing = 20;
    const columns = 4; // 열 개수
    const rows = 2; // 행 개수
    const spacingX = 350; // X 간격
    const spacingY = 300; // Y 간격
    const startX = (width - (columns - 1) * spacingX) / 2; // 중앙 정렬 시작 X
    const startY = (height - (rows - 1) * spacingY) / 2; // 중앙 정렬 시작 Y

    const centerNodes = nodes.slice(0, 8); // 상위 8개 노드를 중심으로 지정
    const otherNodes = nodes.slice(8); // 나머지 노드들

    centerNodes.forEach((node, index) => {
      node.fx = startX + (index % columns) * spacingX;
      node.fy = startY + Math.floor(index / columns) * spacingY;
    });

    const links: Link[] = otherNodes.map((node) => ({
      source: centerNodes[Math.floor(Math.random() * centerNodes.length)],
      target: node,
    }));

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
          .distance(80)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force(
        'x',
        d3.forceX((d) =>
          centerNodes.includes(d as Node) ? d.fx ?? width / 2 : width / 2
        )
      )
      .force(
        'y',
        d3.forceY((d) =>
          centerNodes.includes(d as Node) ? d.fy ?? height / 2 : height / 2
        )
      )

      .force('collid', d3.forceCollide(nodeSpacing));

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
      .attr('r', nodeSize)
      .attr('stroke', (d) =>
        centerNodes.includes(d) ? 'var(--peak-700)' : 'var(--peak-200)'
      )
      .attr('stroke-width', (d) => (centerNodes.includes(d) ? 2 : 1))
      .attr('fill', '#fff');

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
      .attr('r', nodeSpacing)
      .attr('cx', 0)
      .attr('cy', 0);

    node
      .append('image')
      .attr('xlink:href', (d) => d.logo_url || '')
      .attr('width', nodeSpacing)
      .attr('height', nodeSpacing)
      .attr('x', () => {
        const size = nodeSpacing;
        return -size / 2;
      })
      .attr('y', () => {
        const size = nodeSpacing;
        return -size / 2;
      })
      .attr('clip-path', (d) => `url(#clip-${d.id})`);

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

export default AToAGraph;
