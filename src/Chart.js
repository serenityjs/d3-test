import * as d3 from 'd3';
import Axes from './Axes.js';

export default class Chart {
    constructor(id, data = []) {
        this.startDate = 1490178420000;
        this.data = data;
        this.margin = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
        };
        this.width = Math.min(window.outerWidth, 1000);
        this.height = 420;

        this.svg = d3.select(id)
            .append('svg')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .style('margin-left', `${this.margin.left}px`);

        this.container = this.svg
            .append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        this.axes = new Axes(this, this.container);

        this.areaFunc = d3.area()
            .x(d => this.axes.x(d.date))
            .y0(d => this.axes.y(d.close))
            .y1(this.height - this.margin.top - this.margin.bottom);

        this.lineFunc = this.areaFunc.lineY0();

        this.node = this.container
            .append('g');

        this.line = this.node
            .append('path')
            .datum(this.data.slice())
            .attr('d', this.lineFunc)
            .attr('class', 'line')
            .attr('transform', `translate(0, ${this.margin.top})`)
            .attr('stroke-linejoin', 'round')
            .attr('stroke', '#02a6f2')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.area = this.node
            .insert('path', '.line')
            .datum(this.data.slice())
            .attr('d', this.areaFunc)
            .attr('class', 'area')
            .attr('transform', `translate(0, ${this.margin.top})`)
            .attr('fill', '#02a6f2')
            .attr('fill-opacity', 0.1);

        const rangeValue = [0, this.width - this.margin.right];
        setInterval(() => {
            this.line.attr('d', this.getLineData.bind(this));
            this.area.attr('d', this.getAreaData.bind(this));
            this.axes.x = d3.scaleTime()
                .range(rangeValue)
                .domain(d3.extent(this.data, (d) => d.date));
        }, 1000);
    }

    /**
     * return data string
     * @returns {string}
     */
    getLineData() {
        return this.lineFunc(this.generateNewData());
    }

    /**
     * return data string
     * @returns {string}
     */
    getAreaData() {
        return this.areaFunc(this.generateNewData(true));
    }

    /**
     * get json with new element
     * @param isSkipDateIncrease
     * @returns {Array}
     */
    generateNewData(isSkipDateIncrease = false) {
        const getNumb = () => parseFloat((Math.random() * (57.9 - 58) + 58).toFixed(3));
        const increaseValue = 2 * 60000;
        const updData = () => {
            this.data.push({
                date: (isSkipDateIncrease ? this.startDate : this.startDate += increaseValue),
                open: getNumb(),
                max: getNumb(),
                min: getNumb(),
                close: getNumb(),
            });
            this.data.shift();
            return this.data;
        };
        return updData();
    }
}
