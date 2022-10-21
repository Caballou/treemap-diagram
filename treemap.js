async function gamesMain () { /*Fetch y gráficado de página 'Video Games Sales'*/
  const gamesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
  const response = await fetch(gamesURL)
  const games = await response.json();
  graph(games)
}

async function moviesMain() { /*Fetch y gráficado de página 'Movies Sales'*/
  const moviesURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json';
  const response = await fetch(moviesURL)
  const movies = await response.json();
  graph(movies)
}

async function kickstarterMain() { /*Fetch y gráficado de página 'Kickstarter Pledges'*/
  const kickstarterURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json';
  const response = await fetch(kickstarterURL)
  const kickstarter = await response.json();
  graph(kickstarter)
}

const graph = (data) => { /*Función de graficado*/
  
  /*Ancho y alto del SVG y Legend*/
  const w = 960;
  const h = 570;
  const legendW = 500;
  const legendH = 160;

  /*Jerarquía de info ordenada*/
  const root = d3.hierarchy(data).sum((d) => d.value)
  .sort((a, b) => b.value - a.value);

  /*Leaves para el agregado de propiedades (x0, x1, y0, y1, children, parent, etc)*/
  const leaves = root.leaves();
  console.log(leaves)
  
  /*Colors y escala de colores*/
  const colors = ["#4e79a7","#f28e2c","#e15759","#76b7b2",
    "#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]

  const colorScale = d3.scaleOrdinal()
    .range(colors)

  /*Treemap*/
  d3.treemap().size([w, h])(root)

  /*Tooltip*/
  const tooltip = d3.select('.grafico')
    .append('div')
    .attr('id','tooltip')
    .style("position", "absolute")
    .style("visibility", "hidden")

  /*SVG*/
  const svg = d3.select('.grafico')
  .append('svg')
  .attr('width', w)
  .attr('height', h)

  /*Ubicación de bloques*/
  const blocks = svg.selectAll('g')
    .data(leaves)
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`)

  /*Bloques, tamaño y relleno y aparición de Tooltip*/
  blocks.append('rect')
    .attr('class', 'tile')
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('fill', d => colorScale(d.data.category))
    .attr('stroke', 'white')
    .attr('stroke-width', '0.3')
    .on('mouseover', d => {
      tooltip.attr('data-value', d.target.__data__.data.value)
        .style('visibility', 'visible')
        .html(`<p>Name: <b>${d.target.__data__.data.name}</b> <br>
        Category: ${d.target.__data__.data.category} <br>
        Value: ${d.target.__data__.data.value}`)
    })
    .on("mousemove", (d) => {
      tooltip.style("top", (d.pageY-70)+"px").style("left",(d.pageX+10)+"px");
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
  });

  /*Títulos de bloques, con salto de linea por letras mayúsculas*/
  blocks.append('text')
    .attr('class', 'tile-text')
    .selectAll('tspan')
    .data(d => d.data.name.split(/\s(?=[A-Z])/))
    .join('tspan')
    .attr('x', 4)
    .attr('y', (d, i) => 14 + i * 12)
    .text(d => d)

  /*Legend*/
  const legend = d3.select('.grafico')
  .append('svg')
  .attr('id','legend')
  .attr('width', legendW)
  .attr('height', legendH)
  .append('g')
  .attr('transform', `translate(${legendW/6},10)`)

  const categories = [...new Set(
    leaves.map(d => d.data.category)
      )] /*Categorías sin repetir*/

  legend.selectAll('g')
    .data(categories) 
    .join('g')
    .attr('transform', (d,i) => `translate(${((i+1) % 3 === 0 ? 300 : (i+2) % 3 === 0 ? 150 : 0)},${( i % 3 === 0 ? 25*i/3 : (i-1) % 3 === 0 ? 25 * (i-1)/3 : (i-2) % 3 === 0 ? 25 * (i-2)/3 : 0)})`)
    .append('rect')
    .attr('class','legend-item')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', d => colorScale(d))
 
  legend.selectAll('g')
    .append('text')
    .attr('class', 'legend-text')
    .attr('x', 18)
    .attr('y', 13)
    .text(d => d)
} 