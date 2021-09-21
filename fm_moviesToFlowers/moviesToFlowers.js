import movies from './movies.js';

const svgHeight = 100;
const svgWidth = 100;

const svg = d3.select('body').append('svg');

svg.attr('height', svgHeight).attr('width', svgWidth);

const flowers = _.times(movies.length, (i) => {
  return {
    index: i,
  };
});

