import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as THREE from 'three';
import * as d3 from 'd3';
import './style.css';

function Amostra() {
  const { id } = useParams();
  const [amostra, setAmostra] = useState(null);
  const canvasRef = useRef();
  const chartRef = useRef();

  const nucleotideoColors = {
    A: 0xff6347, 
    T: 0x4682b4,  
    C: 0x32cd32,  
    G: 0xffd700   
  };

  useEffect(() => {
    fetch(`https://bioinfoapi-production.up.railway.app/api/fasta/${id}`)
      .then(response => response.json())
      .then(data => setAmostra(data))
      .catch(error => console.error('Erro ao carregar amostra:', error));
  }, [id]);

  useEffect(() => {
    if (amostra) {
      // Código da Animação de DNA
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      const canvasContainer = canvasRef.current;

      renderer.setSize(300, 300);
      canvasContainer.appendChild(renderer.domElement);
      camera.position.z = 5;

      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);

      const dnaGroup = new THREE.Group();
      const helix1 = new THREE.Group();
      const helix2 = new THREE.Group();

      const radius = 0.35;
      const spacing = 0.3;
      const twistAngle = Math.PI / 6;

      const sequence = amostra.fastaContent.slice(0, 20); // Usando os primeiros 20 nucleotídeos

      const spheres1 = [];
      for (let i = 0; i < sequence.length; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshStandardMaterial({
          color: nucleotideoColors[sequence[i]],
        });
        const sphere = new THREE.Mesh(geometry, material);

        const angle = i * twistAngle;
        const x = radius * Math.cos(angle);
        const y = i * spacing - (20 * spacing) / 2;
        const z = radius * Math.sin(angle);

        sphere.position.set(x, y, z);
        helix1.add(sphere);
        spheres1.push(sphere.position);
      }

      const spheres2 = [];
      for (let i = 0; i < sequence.length; i++) {
        const geometry = new THREE.SphereGeometry(0.05, 16, 16);
        const material = new THREE.MeshStandardMaterial({
          color: nucleotideoColors[sequence[i]],
        });
        const sphere = new THREE.Mesh(geometry, material);

        const angle = i * twistAngle + Math.PI;
        const x = radius * Math.cos(angle);
        const y = i * spacing - (20 * spacing) / 2;
        const z = radius * Math.sin(angle);

        sphere.position.set(x, y, z);
        helix2.add(sphere);
        spheres2.push(sphere.position);
      }

      for (let i = 0; i < sequence.length; i++) {
        const geometry = new THREE.CylinderGeometry(0.015, 0.015, spheres1[i].distanceTo(spheres2[i]), 8);
        const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
        const connector = new THREE.Mesh(geometry, material);

        connector.position.copy(spheres1[i].clone().lerp(spheres2[i], 0.5));
        connector.lookAt(spheres2[i]);
        connector.rotateX(Math.PI / 2);

        dnaGroup.add(connector);
      }

      dnaGroup.add(helix1);
      dnaGroup.add(helix2);
      scene.add(dnaGroup);

      const animate = () => {
        requestAnimationFrame(animate);
        dnaGroup.rotation.y += 0.005;
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        renderer.dispose();
        canvasContainer.removeChild(renderer.domElement);
      };
    }
  }, [amostra]);

  useEffect(() => {
    if (amostra) {
      // Código do Gráfico D3
      d3.select(chartRef.current).selectAll('*').remove();

      const counts = { A: 0, T: 0, C: 0, G: 0 };
      for (let char of amostra.fastaContent) {
        if (counts[char] !== undefined) {
          counts[char]++;
        }
      }

      const data = Object.entries(counts).map(([key, value]) => ({ nucleotideo: key, count: value }));

      const width = 400;
      const height = 300;
      const margin = { top: 20, right: 30, bottom: 40, left: 40 };

      const svg = d3.select(chartRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3.scaleBand()
        .domain(data.map(d => d.nucleotideo))
        .range([0, width - margin.left - margin.right])
        .padding(0.1);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

      svg.append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.nucleotideo))
        .attr('y', d => y(d.count))
        .attr('height', d => y(0) - y(d.count))
        .attr('width', x.bandwidth())
        .attr('fill', d => `#${nucleotideoColors[d.nucleotideo].toString(16)}`); // Convertendo a cor para string hexadecimal

      svg.append('g')
        .call(d3.axisLeft(y));

      svg.append('g')
        .attr('transform', `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x));
    }
  }, [amostra]);

  if (!amostra) {
    return <p>Carregando amostra...</p>;
  }

  return (
    <div className='container'>
      <h1>{amostra.nome}</h1>
      <div ref={canvasRef} className="canvas"></div>
      <svg ref={chartRef}></svg>
    </div>
  );
}

export default Amostra;
