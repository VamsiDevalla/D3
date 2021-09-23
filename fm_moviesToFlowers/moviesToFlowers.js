import movies from './movies.js';
import { petalPaths, petalColors } from './petalsAndColors.js';

const svgHeight = Math.max(
  document.documentElement.clientHeight || 0,
  window.innerHeight || 0
);
const svgWidth = Math.max(
  document.documentElement.clientWidth || 0,
  window.innerWidth || 0
);
const flowerWidth = 150;
const flowersPerRow = Math.floor(svgWidth / flowerWidth);

// movie genre → `color` (color of petals)
const colorScale = d3
  .scaleOrdinal()
  .domain(['Action', 'Comedy', 'Animation', 'Drama'])
  .range(['#ffc8f0', '#cbf2bd', '#afe9ff', '#ffb09e'])
  .unknown(petalColors.Other);

// `rated` → `path` (type of flower petal)
const sensorCategories = movies
  .map((movie) => movie.rated)
  .filter((rating, i, arr) => arr.indexOf(rating) === i);
const pathScale = d3.scaleOrdinal().domain(sensorCategories).range(petalPaths);

// `rating` → `scale` (size of petals)
const ratingRange = d3.extent(movies, (d) => d.rating);
const sizeScale = d3.scaleLinear().domain(ratingRange).range([0.2, 0.75]);

// `votes` → `numPetals` (number of petals)
const votesRange = d3.extent(movies, (d) => d.votes);
const petalsScale = d3.scaleQuantize().domain(votesRange).range(_.range(4, 10));

const flowers = _.map(movies, (d, i) => {
  return {
    title: d.title,
    translate: calculateGridPos(i),
    path: pathScale(d.rated),
    color: colorScale(d.genres[0]),
    size: sizeScale(d.rating),
    petals: petalsScale(d.votes),
  };
});

const svgContainer = d3
  .select('body')
  .append('div')
  .style('max-height', svgWidth / 2)
  .attr('overflow-y', 'scroll')
  .attr('overflow-x', 'hidden');

const svg = svgContainer
  .append('svg')
  .attr('height', svgHeight)
  .attr('width', svgWidth);

const groups = svg
  .selectAll('g')
  .data(flowers)
  .enter()
  .append('g')
  .attr('transform', (d, i) => `translate(${d.translate})`);

const path = groups
  .selectAll('path')
  .data((d) => {
    return _.times(d.petals, (i) => {
      // create a copy of the parent data, and add in calculated rotation
      return Object.assign({}, d, { rotate: i * (360 / d.petals) });
    });
  })
  .enter()
  .append('path');

const text = groups.append('text');

text
  .attr('text-anchor', 'middle')
  .attr('dy', '.35em')
  .style('font-size', '.75em')
  .style('font-style', 'italic')
  .text((d) => _.truncate(d.title, { length: 20 }));

path
  .attr('transform', (d) => `rotate(${d.rotate})scale(${d.size})`)
  .attr('d', (d) => d.path)
  .attr('fill', (d) => d.color)
  .attr('fill-opacity', 0.5)
  .attr('stroke', (d) => d.color);

function calculateGridPos(i) {
  return [
    ((i % flowersPerRow) + 0.5) * flowerWidth,
    (Math.floor(i / flowersPerRow) + 0.7) * flowerWidth,
  ];
}
