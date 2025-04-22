/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {extend, isNumber, forEach, isArray, filter} from 'lodash';
import {IChartDataSource} from '../interface/chart-data.interface';
import {Injectable} from '@angular/core';
import {ChartTypeEnum} from '../entity/chart-type.enum';
import {Chart, ChartData, ChartDataset, ChartType} from 'chart.js';
import {IChartViewData} from '../interface/chart-view-data.interface';
import {IChartColorStructure} from '../interface/chart-color-structure.interface';
import {IToolTipItem} from '../interface/tool-tip-item.interface';

@Injectable({
	providedIn: 'root'
})
export class ChartDataProcessService {
	private pieColor: string[] = [];

	/**
	 * process user's chart config data to Chart.js tool config data
	 * @param { string } chartType.
	 * @param { IChartDataSource } chartDataSource.
	 * @param{ HTMLElement } element
	 * @param{IChartViewData} viewData
	 * @param { string[] } legendColors.
	 * @param { object } options.
	 */
	public processChartEval(chartType: ChartTypeEnum, chartDataSource: IChartDataSource, element: object, viewData: IChartViewData, legendColors: string[], options?: object) {
		if (!chartType || !chartDataSource || !element || !Array.isArray(chartDataSource.labels) || !Array.isArray(chartDataSource.datasets) ||
			chartDataSource.labels.length < 1 || chartDataSource.datasets.length < 1) {
			return null;
		}

		this.initCanvasStyle(element as HTMLElement);
		const myCanvas = element as HTMLCanvasElement;
		const ctx = myCanvas.getContext('2d'),
			barChartData = chartDataSource.datasets;
		if (!Array.isArray(barChartData)) {
			return false;
		}

		this.addLegend(chartDataSource);

		const colorStructures = this.generateColorStructure(chartDataSource);
		if (legendColors) {
			if (isArray(legendColors) && legendColors.length > 0) {
				legendColors.splice(0, legendColors.length);
			}
		}

		this.addColors(barChartData as unknown as ChartDataset, chartType, viewData, colorStructures, legendColors);

		options = extend(options, {
			legendData: chartDataSource.legends,
		});

		const parseFun = this.parseFun;

		options = extend(options, {
			data: chartDataSource,
			barStrokeWidth: 1
		});

		//   if (chartData.datasets.yValueDomain) {
		//     if (Chart.Domain[chartDataSource.datasets.yValueDomain.name]) {
		//       parseFun = Chart.Domain[chartDataSource.datasets.yValueDomain.name].parse;
		//     }
		//   }

		switch (chartType) {
			case ChartTypeEnum.line:
				options = extend(options, {
					tooltips: {
						callbacks: {
							title: function (tooltipItem: IToolTipItem[], data: IChartDataSource) {
								if (data && tooltipItem && data.legends && data.legends.length > 0 && tooltipItem.length > 0) {
									return data.legends[tooltipItem[0].datasetIndex].name;
								} else {
									return '';
								}
							},
							label: function (tooltipItem: IToolTipItem, data: IChartDataSource) {
								return data.labels[tooltipItem.dataIndex] + ': ' + parseFun(tooltipItem.yLabel);
							},
						},
					},
				});
				break;
			default:
				break;
		}

		extend(options, {
			scales: {
				y: {
					beginAtZero: true,
					ticks: {
						callback: function (value: number) {
							return parseFun(value);
						}
					}
				}
			},
			lineTension: 0
		});

		if (ctx) {
			return new Chart(ctx, {type: chartType as ChartType, data: chartDataSource, options: options});
		}
		return null;
	}

	/**
	 * process user's chart config data to Chart.js tool config data
	 * @param { string } chartType.
	 * @param { IChartDataSource } chartDataSource.
	 * @param { object } options.
	 * @param { string[] } legendColors.
	 * @param { object } plugins.
	 */
	public process(chartType?: ChartTypeEnum, chartDataSource?: IChartDataSource, options?: object, legendColors?: string[], plugins?: object) {
		if (!chartType || !chartDataSource || !Array.isArray(chartDataSource.labels) || !Array.isArray(chartDataSource.datasets) ||
			chartDataSource.labels.length < 1 || chartDataSource.datasets.length < 1) {
			return;
		}

		if (options && 'skipNull' in options && options.skipNull as boolean && chartDataSource.labels.length > 1) {
			const count = chartDataSource.labels.length;
			for (let i = count - 1; i >= 0; i--) {
				let allZeroOrNull = true;
				forEach(chartDataSource.datasets, function (dataset) {
					if (dataset.data[i]) {
						allZeroOrNull = false;
					}
				});
				if (allZeroOrNull) {

					if (chartType === 'line' && i === 0) {
						continue;
					} // for line chart, the first dataset is added manually, don't need to filter

					chartDataSource.labels.splice(i, 1);
					for (let j = 0; j < chartDataSource.datasets.length; j++) {
						chartDataSource.datasets[j].data.splice(i, 1);
					}
				}
			}
		}

		const chartData = chartDataSource,
			barChartData = chartDataSource.datasets;
		if (!Array.isArray(barChartData)) {
			return;
		}

		this.addLegend(chartData);

		this.addConfigColors(barChartData, chartType, legendColors || []);

		extend(options, {legendData: chartData.legends});

		// let parseFun = function (value: any) {
		// 	if (isNumber(value)) {
		// 		return (value as number).toFixed(2);
		// 	}
		// 	return value;
		// };

		extend(options, {data: chartData});

		// if (chartData.datasets.yValueDomain) {
		// 	if (Chart.Domain[chartDataSource.datasets.yValueDomain.name]) {
		// 		parseFun = Chart.Domain[chartDataSource.datasets.yValueDomain.name].parse;
		// 	}
		// }

		extend(options, {barStrokeWidth: 1});

		// extend(options, {
		// 	tooltips: {
		// 		callbacks: {
		// 			title: function (tooltipItem, data) {
		// 				if (data && tooltipItem && data.legends && data.legends.length > 0 && tooltipItem.length > 0) {
		// 					return data.legends[tooltipItem[0].datasetIndex].name;
		// 				} else {
		// 					return '';
		// 				}
		// 			},
		// 			label: function (tooltipItem, data) {
		// 				let culture = platformContextService.culture();
		// 				let cultureInfo = platformLanguageService.getLanguageInfo(culture);
		// 				return data.labels[tooltipItem.index] + ': ' + accounting.formatNumber(tooltipItem.yLabel, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
		// 			}
		// 		}
		// 	}
		// });
	}

	private addLegend(chartSource: IChartDataSource) {
		for (let i = 0; i < chartSource.datasets.length; i++) {
			extend(chartSource.datasets[i], {label: chartSource.legends[i].name});
		}
	}

	private generateColorStructure(chartData: ChartData) {
		const structures: IChartColorStructure[] = [];
		if (chartData && chartData.labels) {
			for (let i = 0; i < chartData.labels.length; i++) {
				const data: never[] = [];
				for (let k = 0; k < chartData.datasets.length; k++) {
					const datasets: ChartDataset = chartData.datasets[k];
					const label = datasets.label;
					if (label && !this.isAverage(label)) {
						data.push(datasets.data[i] as never);
					}
				}
				structures.push({
					label: chartData.labels[i] as string,
					datasets: data,
					max: Math.max(...data),
					min: Math.min(...data),
				});
			}
		}
		return structures;
	}

	private isAverage(label: string) {
		return label === 'Average';
	}

	private addColors(dataSet: ChartDataset, chartType: ChartTypeEnum, viewData: IChartViewData, colorStructures: IChartColorStructure[], legendColors: string[]) {
		if (isArray(dataSet)) {
			for (let index = 0; index < dataSet.length; index++) {
				const item = dataSet[index];
				const colorIndex = isNumber(item.colorIndex) ? item.colorIndex : index;
				let color = this.compareColor(this.defaultColor(colorIndex), viewData);
				color = this.getColor(color, item, viewData);
				if (legendColors) {
					legendColors.push('rgba(' + color + ',1)');
				}

				switch (chartType) {
					case ChartTypeEnum.radar:
						extend(item, {
							backgroundColor: 'rgba(' + color + ',0.5)',
							borderColor: 'rgba(' + color + ',0.4)',
							pointBackgroundColor: 'rgba(' + color + ',0.3)',
							pointBorderColor: 'rgba(' + color + ',1)',
							pointHoverBackgroundColor: 'rgba(' + color + ',0.8)',
							pointHoverBorderColor: 'rgba(' + color + ',0.9)',
						});
						break;
					case ChartTypeEnum.line:
						extend(item, {
							fill: true,
							lineTension: 0.1,
							backgroundColor: 'rgba(' + color + ',0.5)',
							borderColor: 'rgba(' + color + ',0.3)',
							borderCapStyle: 'rgba(' + color + ',0.4)',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'rgba(' + color + ',0.6)',
							pointBackgroundColor: 'rgba(' + color + ',1)',
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBorderColor: 'rgba(' + color + ',1)',
							pointHoverBorderWidth: 2,
							pointHitRadius: 10,
							spanGaps: false,
						});
						break;
					case ChartTypeEnum.threeD_Columns: {
						let colors: string | string[] = color;
						if (!this.isAverage(item.label)) {
							if (viewData && (viewData.max || viewData.min)) {
								colors = this.getDefaultBackgroundColors(item.data, color, viewData, colorStructures);
							}
						}
						extend(item, {
							fillColor: this.addRgba(colors, 0.9),
							strokeColor: this.addRgba(colors, 0.7),
							highlightFill: this.addRgba(colors, 0.7),
							highlightStroke: this.addRgba(colors, 0.7),
							middleColor: this.addRgba(colors, 0.5),
							pointColor: this.addRgba(colors, 1),
							pointStrokeColor: '#fff',
							pointHighlightFill: '#fff',
							pointHighlightStroke: '#fff',
							backgroundColor: this.addRgba(colors, 1),
							borderColor: this.addRgba(colors, 1),
							borderWidth: 1,
						});
						break;
					}
					case ChartTypeEnum.horizontalBar:
					case ChartTypeEnum.bar: {
						let borderColors: string | string[] = color;
						if (!this.isAverage(item.label)) {
							if (viewData && (viewData.max || viewData.min)) {
								borderColors = this.getDefaultBackgroundColors(item.data, color, viewData, colorStructures);
							}
						}
						extend(item, {
							backgroundColor: this.addRgba(color, 1),
							borderColor: this.addRgba(borderColors, 1),
							borderWidth: {
								left: 0,
								top: 10,
								right: 0,
								bottom: 0,
							},
						});
						break;
					}
					case ChartTypeEnum.pie:
						for (let i = 0; i < item.data.length - this.pieColor.length; i++) {
							const color = this.PickColor();
							this.pieColor.push('rgba(' + color + ',0.8)');
						}
						extend(item, {
							backgroundColor: this.pieColor,
						});
						break;
					default:
						extend(item, {
							fillColor: 'rgba(' + color + ',1)',
							strokeColor: 'rgba(' + color + ',1)',
							highlightFill: 'rgba(' + color + ',0.9)',
							highlightStroke: 'rgba(' + color + ',1)',
							middleColor: 'rgba(' + color + ',0.5)',
							pointColor: 'rgba(' + color + ',1)',
							pointStrokeColor: '#fff',
							pointHighlightFill: '#fff',
							pointHighlightStroke: '#fff',
						});
						break;
				}
			}
		}
	}

	/**
	 * check whether the data list of chart is empty
	 * @param { IChartDataSource } data.
	 * @return boolean
	 */
	public hasValue(data?: IChartDataSource) {
		return (data && Array.isArray(data.datasets) && Array.isArray(data.labels) &&
			data.labels.length > 0 && data.datasets.length > 0);
	}

	/*
	 * fillColor: "rgba(220,220,220,0.7)"
	 * strokeColor: "rgba(220,220,220,0.8)"
	 * highlightFill: "rgba(220,220,220,0.9)"
	 * highlightStroke: "rgba(220,220,220,1)"
	 */
	private addConfigColors(dataSet: object[], chartType: ChartTypeEnum, legendColors: string[]) {
		return dataSet.map((item, index) => {
			const colorIndex = 'colorIndex' in item && isNumber(item.colorIndex) ? item.colorIndex : index;
			let color = legendColors[colorIndex];
			if (!color) {
				let idx = colorIndex;
				color = this.defaultColor(colorIndex);
				while (legendColors.indexOf(color) >= 0) {
					color = this.defaultColor(idx++);
				}
			} else {
				this.colorArray.push(color);
			}

			if (!legendColors[colorIndex]) {
				legendColors[colorIndex] = color;
			}
			switch (chartType) {
				case ChartTypeEnum.line:
					extend(item, {
						fill: false,
						lineTension: 0.3,
						borderWidth: 2,
						backgroundColor: 'rgba(' + color + ',1)',
						borderColor: 'rgba(' + color + ',1)',
						borderCapStyle: 'rgba(' + color + ',0.4)',
						borderDash: [],
						borderDashOffset: 0.0,
						borderJoinStyle: 'rgba(' + color + ',0.6)',
						pointBackgroundColor: 'rgba(' + color + ',1)',
						pointBorderWidth: 1,
						pointHoverRadius: 5,
						pointHoverBorderColor: 'rgba(' + color + ',1)',
						pointHoverBorderWidth: 2,
						pointHitRadius: 10,
						spanGaps: false
					});
					break;
				case ChartTypeEnum.threeD_Columns: {
					const colors = color;
					extend(item, {
						fillColor: this.addRgba(colors, 0.9),
						strokeColor: this.addRgba(colors, 0.7),
						highlightFill: this.addRgba(colors, 0.7),
						highlightStroke: this.addRgba(colors, 0.7),
						middleColor: this.addRgba(colors, 0.5),
						pointColor: this.addRgba(colors, 1),
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: '#fff',
						backgroundColor: this.addRgba(colors, 1),
						borderColor: this.addRgba(colors, 1),
						borderWidth: 1
					});
					break;
				}
				case ChartTypeEnum.horizontalBar:
				case ChartTypeEnum.bar: {
					const colors = color;
					extend(item, {
						backgroundColor: this.addRgba(colors, 1),
						borderColor: this.addRgba(colors, 1),
						borderWidth: 1
					});
					break;
				}
				default:
					extend(item, {
						fillColor: 'rgba(' + color + ',1)',
						strokeColor: 'rgba(' + color + ',1)',
						highlightFill: 'rgba(' + color + ',0.9)',
						highlightStroke: 'rgba(' + color + ',1)',
						middleColor: 'rgba(' + color + ',0.5)',
						pointColor: 'rgba(' + color + ',1)',
						pointStrokeColor: '#fff',
						pointHighlightFill: '#fff',
						pointHighlightStroke: '#fff'
					});
			}
		});
	}

	private getColor(defaultColor: string, dataSet: ChartDataset, viewData: IChartViewData) {
		if (dataSet.label === 'Average' && viewData && viewData.avg) {
			defaultColor = viewData.avg;
		}
		return defaultColor;
	}

	private colorArray = ['16,78,139', '124,205,124', '154,50,205', '244,164,96', '205,205,0', '255,130,171'];

	private defaultColor(index: number) {
		if (this.colorArray.length <= index) {
			this.colorArray.push(this.getRandomColor() + ',' + this.getRandomColor() + ',' + this.getRandomColor());
		}
		return this.colorArray[index];
	}

	private PickColor() {
		return this.getRandomColor() + ',' + this.getRandomColor() + ',' + this.getRandomColor();
	}

	private getRandomColor() {
		const max = 255;
		return Math.floor(Math.random() * max);
	}


	private addRgba(colors: string[] | string, alpha: number) {
		if (!Array.isArray(colors)) {
			colors = 'rgba(' + colors + ',' + alpha + ')';
		} else {
			colors = colors.map(item => 'rgba(' + item + ',' + alpha + ')');
		}
		return colors;
	}

	private deviateColor(sourceColor: string, compareColor: string) {
		const sR = parseInt(sourceColor.split(',')[0]);
		const sG = parseInt(sourceColor.split(',')[1]);
		const sP = parseInt(sourceColor.split(',')[2]);
		let rR = sR, rG = sG, rP = sP;
		const cR = parseInt(compareColor.split(',')[0]);
		const cG = parseInt(compareColor.split(',')[1]);
		const cP = parseInt(compareColor.split(',')[2]);

		if (Math.abs(sR - cR) === 0 && Math.abs(sG - cG) === 0 && Math.abs(sP - cP) === 0) {
			rR = rR < sR ? rR - 100 : rR + 100;
			if (rR < 0) {
				rR = 0;
			}
			if (rR > 255) {
				rR = 255;
			}

			rG = rG < sG ? rG - 100 : rG + 100;
			if (rG < 0) {
				rG = 0;
			}
			if (rG > 255) {
				rG = 255;
			}

			rP = rP < sP ? rP - 100 : rP + 100;
			if (rP < 0) {
				rP = 0;
			}
			if (rP > 255) {
				rP = 255;
			}
		}

		return rR.toString() + ',' + rG.toString() + ',' + rP.toString();
	}

	private initCanvasStyle(element: HTMLElement) {
		const parentElement = element.parentElement!;
		// const siblingElements = parentElement.children as unknown as HTMLElement[];
		const siblingElements = this.getSiblingElement(parentElement.parentElement!);
		let totalHeight = 0;

		for (let i = 0; i < siblingElements.length; i++) {
			totalHeight += siblingElements[i].offsetHeight;
		}

		const style = parentElement.style;

		const width = parentElement.offsetWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
			height = parentElement.offsetHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom) - totalHeight;

		const elementStyle = element.style;
		elementStyle.width = elementStyle.maxWidth = width + 'px';
		elementStyle.height = elementStyle.maxHeight = height + 'px';
	}

	private getSiblingElement(element: HTMLElement): HTMLElement[] {
		const parentElem = element.parentElement;
		const allElement = parentElem!.children as HTMLCollection;
		const siblingElem = filter(allElement, function (item) {
			return item !== element;
		});

		return siblingElem as HTMLElement[];
	}


	private compareColor(defaultColor: string, viewData: IChartViewData) {
		if (viewData) {
			if (viewData.avg) {
				const avgColor = viewData.avg;
				defaultColor = this.deviateColor(defaultColor, avgColor);
			}
			if (viewData.max) {
				const maxColor = viewData.max;
				defaultColor = this.deviateColor(defaultColor, maxColor);
			}
			if (viewData.min) {
				const minColor = viewData.min;
				defaultColor = this.deviateColor(defaultColor, minColor);
			}
		}
		return defaultColor;
	}

	private getDefaultBackgroundColors(chartData: ChartData, defaultColor: string, viewData: IChartViewData, colorStructures: IChartColorStructure[]) {
		const maxColor = this.getMaxColor(defaultColor, viewData);
		const minColor = this.getMinColor(defaultColor, viewData);
		const backgroundColors = [];
		if (isArray(chartData)) {
			for (let index = 0; index < chartData.length; index++) {
				const item = chartData[index];

				if (item === colorStructures[index].max) {
					backgroundColors.push(maxColor);
				} else if (item === colorStructures[index].min) {
					backgroundColors.push(minColor);
				} else {
					backgroundColors.push(defaultColor);
				}
			}
		}
		return backgroundColors;
	}

	private getMaxColor(defaultColor: string, viewData: IChartViewData) {
		if (viewData && viewData.max) {
			defaultColor = viewData.max;
		}
		return defaultColor;
	}

	private getMinColor(defaultColor: string, viewData: IChartViewData) {
		if (viewData && viewData.min) {
			defaultColor = viewData.min;
		}
		return defaultColor;
	}

	private parseFun(value: number | string) {
		if (isNumber(value)) {
			return parseFloat(value.toFixed(2));
		}
		return value;
	}
}