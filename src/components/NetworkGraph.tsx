'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node extends d3.SimulationNodeDatum {
  id: number;
  name: string;
  group: number;
  link?: string;
  total_funding?: number;
}

interface Link {
  source: Node;
  target: Node;
}

const NetworkGraph = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 700;
    const height = 700;

    const nodes: Node[] = [
      { id: 1, name: 'Peak', group: 1 },
      {
        id: 2,
        name: 'Samsunng',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 1,
      },
      {
        id: 3,
        name: 'TheSunHan',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 2,
      },
      {
        id: 4,
        name: 'LG',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 1,
      },
      {
        id: 5,
        name: 'Starbucks',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 10,
      },
      {
        id: 6,
        name: 'toss',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 130,
      },
      {
        id: 7,
        name: 'RIDI',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 1,
      },
      {
        id: 8,
        name: 'TMON',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 240,
      },
      {
        id: 9,
        name: 'yanolja',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 300,
      },
      {
        id: 10,
        name: 'Airbnb',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 1,
      },
      {
        id: 11,
        name: 'WATCHA',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 60,
      },
      {
        id: 12,
        name: 'NETPLIX',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 200,
      },
      {
        id: 13,
        name: 'CGV',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 12,
      },
      {
        id: 14,
        name: 'SANDBOX',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 80,
      },
      {
        id: 15,
        name: 'wadiz',
        group: 2,
        link: 'https://www.peak.ceo/',
        total_funding: 0,
      },
    ];

    const links: Link[] = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      { source: nodes[0], target: nodes[3] },
      { source: nodes[0], target: nodes[4] },
      { source: nodes[0], target: nodes[5] },
      { source: nodes[0], target: nodes[6] },
      { source: nodes[0], target: nodes[7] },
      { source: nodes[0], target: nodes[8] },
      { source: nodes[0], target: nodes[9] },
      { source: nodes[0], target: nodes[10] },
      { source: nodes[0], target: nodes[11] },
      { source: nodes[0], target: nodes[12] },
      { source: nodes[0], target: nodes[13] },
      { source: nodes[0], target: nodes[14] },
      // { source: nodes[1], target: nodes[2] },
      // { source: nodes[2], target: nodes[3] },
      // { source: nodes[3], target: nodes[4] },
      // { source: nodes[4], target: nodes[5] },
      // { source: nodes[5], target: nodes[6] },
      // { source: nodes[6], target: nodes[7] },
      // { source: nodes[7], target: nodes[8] },
      // { source: nodes[8], target: nodes[9] },
      // { source: nodes[9], target: nodes[10] },
      // { source: nodes[10], target: nodes[11] },
      // { source: nodes[11], target: nodes[12] },
      // { source: nodes[12], target: nodes[13] },
      // { source: nodes[13], target: nodes[14] },
    ];

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('border', '1px solid #340b60');

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d) => (d as Node).id)
          .distance(250)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#cfa7fa')
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
      .on('click', (event, d) => {
        if (d.link) {
          window.open(d.link, '_blank');
        }
      });

    // 원 추가
    node
      .append('circle')
      .attr('class', 'node')
      .attr('r', (d) =>
        d.total_funding ? Math.sqrt(d.total_funding) * 1.7 + 25 : 25
      )
      .attr('stroke', '#efe0ff')
      .attr('stroke-width', 1)
      .attr('fill', (d) => (d.group === 1 ? '#420c7c' : '#a24bff'));

    // 텍스트 추가
    node
      .append('text')
      .attr('dy', 4)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .text((d) => d.name);

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
    <>
      <svg ref={svgRef}></svg>
      <p>- network graph -</p>
    </>
  );
};

export default NetworkGraph;
