'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

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

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 700;
    const height = 700;

    const nodes: Node[] = [
      {
        id: 1,
        company: 'Peak',
        key_executive: '권태욱',
        industry: 'AI∙데이터분석',
        address: '서울특별시 서초구 효령로 391',
        homepage: 'https://www.peak.ceo/',
        email: 'david@goodai.kr',
        phone_number: '정보 없음',
        sales: '정보 없음',
        total_funding: '정보 없음',
      },
      {
        id: 2,
        company: '시어스랩',
        key_executive: '정진욱',
        industry: '콘텐츠∙이미지/영상',
        address: '서울특별시 서초구 강남대로315, 2층(서초동, 파이낸셜뉴스빌딩)',
        homepage: 'seerslab.com',
        email: 'business@seerslab.com',
        phone_number: '정보 없음',
        sales: '정보 없음',
        total_funding: '정보 없음',
        logo_url:
          'https://logo-resources.thevc.kr/organizations/200x200/678245ee35a4ecef2fcc086b3518ac10ed8550b42c78384728c7ec7cdb1dea29_1484801033496907.jpg',
      },
      {
        id: 3,
        company: '티피씨메카트로닉스',
        key_executive: '엄재윤∙엄주섭',
        industry: '제조/3D프린터∙기계',
        address: '인천광역시 서구 갑문2로 39(오류동, 단해창도클러스터)',
        homepage: 'www.tpcpage.com',
        email: '정보 없음',
        phone_number: '정보 없음',
        sales: '정보 없음',
        total_funding: '5억',
        logo_url:
          'https://logo-resources.thevc.kr/organizations/200x200/b8abe29ad3544dcb8e717273be81370133b6fcf5e62bdfa28b31af767cc5c067_1639500082136829.jpg',
      },
    ];

    const links: Link[] = [
      { source: nodes[0], target: nodes[1] },
      { source: nodes[0], target: nodes[2] },
      // { source: nodes[0], target: nodes[3] },
      // { source: nodes[0], target: nodes[4] },
      // { source: nodes[0], target: nodes[5] },
      // { source: nodes[0], target: nodes[6] },
      // { source: nodes[0], target: nodes[7] },
      // { source: nodes[0], target: nodes[8] },
      // { source: nodes[0], target: nodes[9] },
      // { source: nodes[0], target: nodes[10] },
      // { source: nodes[0], target: nodes[11] },
      // { source: nodes[0], target: nodes[12] },
      // { source: nodes[0], target: nodes[13] },
      // { source: nodes[0], target: nodes[14] },
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
          .distance(150)
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
      .attr('r', (d) => {
        const total_funding = Number(d.total_funding.split('억')[0]);

        return !isNaN(total_funding) ? Math.sqrt(total_funding) * 1.7 + 30 : 30;
      })
      .attr('stroke', '#efe0ff')
      .attr('stroke-width', 1)
      .attr('fill', (d) => (d.id === 1 ? '#420c7c' : '#fff'));

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
      .attr('r', 20) // 클립 크기 (반지름)
      .attr('cx', 0)
      .attr('cy', 0);

    node
      .append('image')
      .attr('xlink:href', (d) => d.logo_url || '')
      .attr('width', 40)
      .attr('height', 40)
      .attr('x', -20)
      .attr('y', -20)
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
    <>
      <svg ref={svgRef}></svg>
      <p>- network graph -</p>
    </>
  );
};

export default NetworkGraph;
