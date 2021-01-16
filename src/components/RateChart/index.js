import React, { useRef, useEffect, useCallback } from 'react';
import bridge from '@vkontakte/vk-bridge';
import c from 'classnames';
import * as d3 from 'd3';
import useWindowSizes from '../../hooks/useWindowSizes';
import { makeStyles } from '@material-ui/styles';
import { createPortal } from 'react-dom';

import { formatDateAxisLabel, formatRateAxisLabel } from '../../utils/formatter';

const useStyles = makeStyles({
    chartRoot: {
        width: '100%',
        userSelect: 'none',
    },
    chart: {
        position: 'relative',
        width: '100%',
        display: 'flex',
    },
    chart__image: {
        height: 160,
        zIndex: 1,
        borderRadius: 10,
        border: `.5px solid var(--field_border)`,
        boxSizing: 'border-box',
        background: 'var(--background_content)',
        width: 'inherit',
    },
    chart__axis: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        color: 'var(--text_tertiary)',
        fontSize: 13,
        lineHeight: '16px',
        overflow: 'inherit',
        '& > li': {
            position: 'relative',
            height: 0,
        },
        whiteSpace: 'nowrap',
    },
    chart__axis_y: {
        textAlign: 'right',
        marginLeft: 16,
        transform: 'translateY(3px)',
        flex: '0 1 auto',
    },
    chart__axis_x: {
        height: 26,
        paddingTop: 10,
        boxSizing: 'border-box',
    },
    chartLabel__date: {
        fontSize: 14,
        color: 'var(--text_tertiary)',
    },
    chartLabel__rate: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 4,
    },
});

// interface RateChartPoint {
//     date: number;
//     rate: number;
// }
//
// interface RateChartProps {
//     points: RateChartPoint[];
//     currentPointRootEl: HTMLDivElement | null;
// }

const X_AXIS_LINE_MAX_OFFSET = 75;
const Y_AXIS_LINE_MIN_OFFSET = 38;

const RateChart = ({ points, currentPointRootEl }) => {
    const mc = useStyles();
    const { innerWidth } = useWindowSizes();

    const getNearPoint = useCallback(
        (date) => {
            const index = points.findIndex((point) => point.date >= date);
            const itemMore = points[index];
            const itemLess = points[index - 1];

            if (!itemLess) {
                return itemMore;
            } else if (!itemMore) {
                return itemLess;
            } else if (!itemLess && !itemMore) {
                return null;
            }

            return itemMore.date - date <= date - itemLess.date ? itemMore : itemLess;
        },
        [points]
    );

    const chartRef = useRef(null);

    useEffect(() => {
        const el = chartRef.current;

        if (el === null) {
            return;
        }

        const svgEl = el.querySelector(`svg.${mc.chart__image}`);
        const yAxisEl = el.querySelector(`ul.${mc.chart__axis_y}`);
        const xAxisEl = el.querySelector(`ul.${mc.chart__axis_x}`);
        const labelEl = currentPointRootEl;

        if (!(svgEl && yAxisEl && xAxisEl && labelEl)) {
            return;
        }

        // y axis label

        const yLabelsCount = Math.floor(svgEl.clientHeight / Y_AXIS_LINE_MIN_OFFSET);

        const minValue = Math.min(...points.map((point) => point.rate));
        const maxValue = Math.max(...points.map((point) => point.rate));
        const valueDelta = Math.max(maxValue - minValue, 0.0001);

        const maxYValue = maxValue + valueDelta * 0.25;
        const minYValue = minValue - valueDelta * 0.25;

        const yLabelValueStep = (maxYValue - minYValue) / yLabelsCount;

        const yLabels = Array(yLabelsCount)
            .fill(0)
            .map((_, index) => maxYValue - yLabelValueStep * index);

        const yAxisScale = d3.scaleLinear().range([0, svgEl.clientHeight]).domain([maxYValue, minYValue]);

        d3.select(yAxisEl)
            .text('')
            .selectAll('ul')
            .data(yLabels)
            .enter()
            .append('li')
            .text(formatRateAxisLabel(minYValue, maxYValue))
            .style('top', (d) => yAxisScale(d) + 'px');

        // x axis labels

        const xLabelsCount = Math.floor(svgEl.clientWidth / X_AXIS_LINE_MAX_OFFSET);

        const minXValue = Math.min(...points.map((point) => point.date));
        const maxXValue = Math.max(...points.map((point) => point.date));
        const xLabelValueStep = (maxXValue - minXValue) / xLabelsCount;

        const xLabels = Array(xLabelsCount)
            .fill(0)
            .map((_, index) => minXValue + xLabelValueStep * index);

        const xAxisScale = d3.scaleLinear().range([0, svgEl.clientWidth]).domain([minXValue, maxXValue]);

        d3.select(xAxisEl)
            .text('')
            .selectAll('ul')
            .data(xLabels)
            .enter()
            .append('li')
            .text(formatDateAxisLabel(minXValue, maxXValue))
            .style('left', (d) => xAxisScale(d) + 'px');

        // svg

        const graph = d3.select(svgEl).text('');

        const graphWidth = svgEl.clientWidth;
        const graphHeight = svgEl.clientHeight;

        // graph background

        graph
            .append('clipPath')
            .attr('id', 'chart-area')
            .append('rect')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('x', 0)
            .attr('y', 0)
            .attr('rx', 10)
            .attr('ry', 10);

        graph
            .append('linearGradient')
            .attr('id', 'line-area')
            .attr('gradientUnits', 'userSpaceOnUse')
            .attr('x1', 0)
            .attr('y1', yAxisScale(maxYValue))
            .attr('x2', 0)
            .attr('y2', yAxisScale(minYValue))
            .selectAll('stop')
            .data([
                { offset: '0%', color: 'rgba(63, 138, 224, 0.7)' },
                { offset: '100%', color: 'rgba(63, 138, 224, 0)' },
            ])
            .enter()
            .append('stop')
            .attr('offset', (d) => d.offset)
            .attr('stop-color', (d) => d.color);

        const xStepWidth = graphWidth / xLabels.length;
        const yStepHeigth = graphHeight / yLabels.length;

        graph
            .selectAll('g')
            .data(xLabels.slice(0, -1))
            .enter()
            .append('line')
            .style('stroke', 'var(--background_highlighted)')
            .attr('stroke-width', 0.5)
            .attr('x1', (_, index) => (index + 1) * xStepWidth)
            .attr('y1', 0)
            .attr('x2', (_, index) => (index + 1) * xStepWidth)
            .attr('y2', graphHeight);

        graph
            .selectAll('g')
            .data(yLabels.slice(0, -1))
            .enter()
            .append('line')
            .style('stroke', 'var(--field_border)')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', 8)
            .attr('stroke-dashoffset', 4)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round')
            .attr('x1', 0)
            .attr('y1', (_, index) => (index + 1) * yStepHeigth)
            .attr('x2', graphWidth)
            .attr('y2', (_, index) => (index + 1) * yStepHeigth);

        // active point line

        const pointLine = graph
            .append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', '100%')
            .attr('stroke', 'var(--header_text)')
            .style('transform', `translate(-10px, -10px)`)
            .attr('stroke-width', 1);

        // graph line

        const line = d3
            .line()
            .x((d) => xAxisScale(d.date))
            .y((d) => yAxisScale(d.rate));

        graph
            .append('path')
            .attr('clip-path', 'url(#chart-area)')
            .datum([
                { date: points[0].date - 2000000000, rate: minYValue },
                { date: points[0].date - 1000000000, rate: points[0].rate },
                ...points,
                { date: points[points.length - 1].date + 1000000000, rate: points[0].rate },
                { date: points[points.length - 1].date + 2000000000, rate: minYValue },
            ])
            .attr('stroke', 'var(--accent)')
            .attr('stroke-linecap', 'round')
            .attr('stroke-width', 2)
            .attr('d', line)
            .attr('fill', 'url(#line-area)');

        // active point dot

        const pointDot = graph
            .append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 5)
            .attr('stroke', 'var(--accent)')
            .attr('stroke-width', 2)
            .style('transform', `translate(-10px, -10px)`)
            .style('fill', 'var(--background_content)');

        const label = d3.select(labelEl);

        function clearLabelPosition() {
            label.select(`.${mc.chartLabel__date}`).text('');
            label.select(`.${mc.chartLabel__rate}`).text('');
        }

        const drawLabelPosition = function () {
            d3.event.preventDefault();

            const [x] = d3.mouse(this);
            const date = xAxisScale.invert(x);
            const point = getNearPoint(date);

            if (!point) {
                clearLabelPosition();
                return;
            }

            pointDot.style('transform', `translate(${xAxisScale(point.date)}px, ${yAxisScale(point.rate)}px)`);
            pointLine.style('transform', `translate(${xAxisScale(point.date)}px, 0)`);
            label.select(`.${mc.chartLabel__date}`).text((new Date(point.date).toLocaleDateString()));
            label.select(`.${mc.chartLabel__rate}`).text(`${point.rate}`);
            bridge.send('VKWebAppTapticSelectionChanged', {});
        };

        label.style('position', `absolute`);
        label.style('z-index', `99999`);

        graph.on('mousemove', drawLabelPosition);
        graph.on('mouseout', clearLabelPosition);

        graph.on('touchstart', drawLabelPosition);
        graph.on('touchmove', drawLabelPosition);
        graph.on('touchend', clearLabelPosition);
        graph.on('touchcancel', clearLabelPosition);

        return () => {
            graph.on('mousemove', null);
            graph.on('mouseout', null);

            graph.on('touchstart', null);
            graph.on('touchmove', null);
            graph.on('touchend', null);
            graph.on('touchcancel', null);
        };
    }, [points, innerWidth, currentPointRootEl, getNearPoint, mc]);

    return (
        <div className={mc.chartRoot} ref={chartRef}>
            <div className={mc.chart}>
                <svg className={mc.chart__image} />
                <ul className={c(mc.chart__axis, mc.chart__axis_y)} />
                {currentPointRootEl &&
                    createPortal(
                        <div style={{ textAlign: 'center' }}>
                            <div className={mc.chartLabel__rate} />
                            <div className={mc.chartLabel__date} />
                        </div>,
                        currentPointRootEl
                    )
                }
            </div>
            <ul className={c(mc.chart__axis, mc.chart__axis_x)} />
        </div>
    );
};

export default RateChart;