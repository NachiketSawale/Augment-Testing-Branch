/* global math */
/* global Chart */
(function (angular) {
	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).directive('basicsCommonCustomChartDirective',
		['platformContextService', 'platformLanguageService', 'platformDomainService', 'basicsCommonDrawingUtilitiesService', '_',
			function (platformContextService, platformLanguageService, platformDomainService, drawingUtils, _) {
				return {
					restrict: 'E',
					template: '<canvas></canvas>',
					replace: true,
					scope: {
						chartDataSource: '=',
						chartDataConfig: '=',
						triggerUpdateEvent: '='
					},
					link: function (scope, element) {
						let myChart = null;

						function getRColumn(chartConfig) {
							let r = null;
							const chartSeries = chartConfig.UserchartSeriesEntities;
							const rColumnData = _.filter(chartSeries, function (cs) {
								return cs.ChartTypeFk === 7;
							});
							if (rColumnData.length > 0) {
								r = _.head(rColumnData).rColumn.DatabaseColumn;
							}
							return r;
						}

						function getTitle(chartConfig, config) {
							let titleColor = '#000';
							if (config.title.color) {
								titleColor = toRgbColor(drawingUtils, config.title.color);
							}
							return {
								display: config.title.show,
								position: config.title.position,
								fontColor: titleColor,
								text: chartConfig.TitleInfo.Description
							};
						}

						function getLegend(config) {
							let legendColor = '#000';
							if (config.legend.color) {
								legendColor = toRgbColor(drawingUtils, config.legend.color);
							}
							return {
								display: config.legend.show,
								position: config.legend.position,
								labels: {fontColor: legendColor}
							};
						}

						function getColorBySingle(chartType, data1, colors) {
							let color;
							if ('pie' === chartType || 'polarArea' === chartType || 'doughnut' === chartType) {
								color = [];
								if (colors && colors.length > 0) {
									_.each(colors, function (_color) {
										color.push(toRgbColor(drawingUtils, _color.color));
									});
								} else {
									_.each(data1, function (data1item, index) {
										const color1 = getColor(index);
										color.push(color1);
									});
								}
							} else {
								if (colors && colors.length > 0) {
									color = toRgbColor(drawingUtils, colors[0].color);
								} else {
									color = getColor(0);
								}
							}
							return color;
						}

						function getColorByGroup(index, colors) {
							let color;
							if (colors && colors.length > index) {
								const _color = colors[index];
								color = toRgbColor(drawingUtils, _color.color);
							} else {
								color = getColor(index);
							}
							return color;
						}

						function getCurrentShowGroup(chartConfig, parentGroup) {
							const gColumns = [];
							const g1Column = angular.copy(chartConfig.g1Column);
							const g2Column = angular.copy(chartConfig.g2Column);
							if (g1Column) {
								g1Column.gColumnNm = 'g1' + g1Column.Id;
								gColumns.push(g1Column);
							}
							if (g2Column) {
								g2Column.gColumnNm = 'g2' + g2Column.Id;
								gColumns.push(g2Column);
							}
							return _.find(gColumns, function (gColumn) {
								return gColumn.gColumnNm === parentGroup;
							});
						}

						function createChart(chartConfig, chartDataSource, element) {
							const data = angular.copy(chartDataSource.data);
							const groups = chartDataSource.group;
							const parentGroup = chartDataSource.parentGroup;
							let autoYMin = null;
							let autoYMax = null;
							if (!chartConfig || !data || !element) {
								return null;
							}
							initCanvasStyle(element);
							const ctx = element[0].getContext('2d');
							let chartData = null;
							const options = {};
							const chartType = getType(chartConfig.ChartTypeFk);
							const config = chartConfig.Config ? JSON.parse(chartConfig.Config) : {
								title: {
									show: true,
									position: 'top',
									color: 3355443
								},
								legend: {show: true, position: 'top', color: 3355443},
								group: {enable: false},
								scale: {x: {type: 'linear'}, y: {type: 'linear'}}
							};
							const colors = config.scale.x.categorys;
							const x = chartConfig.xColumn.DatabaseColumn;
							const y = chartConfig.yColumn.DatabaseColumn;
							const ylabel = chartConfig.yColumn.DescriptionInfo.Description ? chartConfig.yColumn.DescriptionInfo.Description : y;
							let labels = [];
							const datasets = [];
							let fill = false;
							if (groups && groups.length > 0 && parentGroup) {
								const currentColumn = getCurrentShowGroup(chartConfig, parentGroup);
								if (!currentColumn) {
									return false;
								}
								if ('bubble' === chartType) {
									_.each(groups, function (groupItem, index) {
										const _data = [];
										const groupData = _.groupBy(data, function (item) {
											return item[currentColumn.DatabaseColumn];
										});
										const r = getRColumn(chartConfig);
										const arrData = groupData[groupItem.group];
										if (r && arrData) {
											_.each(arrData, function (_Item) {
												const obj = {x: _Item[x], y: _Item[y], r: _Item[r]};
												_data.push(obj);
											});
										}
										const item = {data: _data, label: groupItem.group, fill: fill};
										const color = getColorByGroup(index, colors);
										angular.extend(item, {
											backgroundColor: color,
											borderColor: color,
											pointBackgroundColor: color
										});
										datasets.push(item);
									});

								} else if ('pie' === chartType) {
									// ignore
								} else {

									const filterData = _.filter(data, function (dataitem) {
										const indexGroup = _.findIndex(groups, function (o) {
											return o.group === dataitem[currentColumn.DatabaseColumn];
										});
										return indexGroup > -1;

									});
									const groupData = _.groupBy(filterData, function (item) {
										return item[x];
									});
									labels = _.keys(groupData);
									_.each(groups, function (groupItem, index) {
										const _data = [];
										_.each(labels, function (label) {
											const _groupData = _.filter(filterData, function (dataitem) {
												return dataitem[x] === label && dataitem[currentColumn.DatabaseColumn] === groupItem.group;
											});
											let fin = null;
											if (_groupData.length > 0) {
												fin = _.sumBy(_groupData, function (_data) {
													return !_.isNil(_data[y]) ? Number((_data[y] * 1).toFixed(2)) : null;
												});
											}
											_data.push(fin);
										});

										if ('radar' === chartType) {
											fill = true;
										}
										const item = {data: _data, label: groupItem.group, fill: fill};
										const color = getColorByGroup(index, colors);
										angular.extend(item, {
											backgroundColor: color,
											borderColor: color,
											pointBackgroundColor: color
										});
										datasets.push(item);
									});

									if (datasets.length > 0) {
										const allY = [];
										_.forEach(datasets, function (_items) {
											_.forEach(_items.data, function (_item) {
												if (_item !== null) {
													allY.push(_item);
												}
											});
										});

										if (allY.length > 0) {
											autoYMin = _.min(allY);
											autoYMax = _.max(allY);
										}
									}

								}

							} else if (!config.group.enable) {
								const data1 = [];
								if ('bubble' === chartType) {
									const r = getRColumn(chartConfig);
									if (r) {
										_.forEach(data, function (item) {
											const obj = {x: item[x], y: item[y], r: item[r]};
											data1.push(obj);
										});
									}

								} else {
									const newdata = _.groupBy(data, function (item) {
										return item[x];
									});
									_.forEach(newdata, function (item, key) {
										const fin = _.sumBy(item, function (_data) {
											return !_.isNil(_data[y]) ? Number((_data[y] * 1).toFixed(2)) : null;
										});
										labels.push(key);
										data1.push(fin);
									});
									if ('radar' === chartType) {
										fill = true;
									}
									if (data1.length > 0) {
										autoYMin = _.min(data1);
										autoYMax = _.max(data1);
									}
								}

								const color = getColorBySingle(chartType, data1, colors);
								const item = {data: data1, label: ylabel, fill: fill};
								angular.extend(item, {
									backgroundColor: color,
									borderColor: color,
									pointBackgroundColor: color
								});
								datasets.push(item);

							}

							chartData = {
								labels: labels,
								datasets: datasets
							};
							/** *******title**************/
							options.title = getTitle(chartConfig, config);
							/** ***********lenend***************/
							options.legend = getLegend(config);
							/** *********scales*********/
							if ('line' === chartType || 'bar' === chartType) {
								if (config.scale.x || config.scale.y) {
									options.scales = {xAxes: [], yAxes: []};
								}
								// x
								const xTicksObj = {};
								if (config.scale.x.linear) {
									const xMin = config.scale.x.linear.min;
									const xMax = config.scale.x.linear.max;
									const xUom = config.scale.x.linear.uom;
									if (xMin && xMax) {
										angular.extend(xTicksObj, {
											min: xMin,
											max: xMax
										});
									}
									if (xUom) {
										angular.extend(xTicksObj, {
											userCallback: function (value) {
												return value.toString() + xUom;
											}
										});
									}
									options.scales.xAxes = [{ticks: xTicksObj}];
								}

								const yTicksObj = {};
								let yMin = null;
								let yMax = null;
								let yStep = null;
								let yUom = null;
								// max min setting by custom
								if (config.scale.y.linear) {
									yMin = config.scale.y.linear.min;
									yMax = config.scale.y.linear.max;
									yStep = config.scale.y.linear.step;
									const yTick = config.scale.y.linear.tickCount;
									yUom = config.scale.y.linear.uom;
									if (!_.isNil(yMin)) {
										angular.extend(yTicksObj, {
											suggestedMin: yMin * 1
										});
									}
									if (!_.isNil(yMax)) {
										angular.extend(yTicksObj, {
											suggestedMax: yMax * 1
										});
									}
									/*
                                    if (yStep) {
                                        angular.extend(yTicksObj,{
                                            stepSize: yStep * 1
                                        });
                                    }
                                    */
									if (yTick) {
										angular.extend(yTicksObj, {
											maxTicksLimit: yTick * 1
										});
									}
									// tick by custom
									angular.extend(yTicksObj, {
										userCallback: function (value) {
											let remain = Number(math.format(value, {precision: 14}));
											if (yUom) {
												remain = remain.toString() + ' ' + yUom;
											}
											return remain.toString();
										}
									});

								}

								if (!(!_.isNil(yMin) || !_.isNil(yMax) || !_.isNil(yStep))) {
									// max min by auto
									if (!_.isNil(autoYMin) || !_.isNil(autoYMax)) {
										const range = autoYMax - autoYMin;
										if (range > 0) {
											const margin = ((range / 0.8) - range) / 2;
											const max = autoYMax + margin;
											const min = autoYMin - margin;
											angular.extend(yTicksObj, {
												min: min,
												max: max
											});
										}
										// tick by custom
										angular.extend(yTicksObj, {
											userCallback: function (value, index, ticks) {
												let remain = Number(math.format(value, {precision: 14}));
												if (index > 0 && index < ticks.length - 1) {
													if (yUom) {
														remain = remain.toString() + ' ' + yUom;
													}
												} else {
													remain = '';
												}

												return remain.toString();
											}
										});
									}
								}

								if (config.scale.y) {
									options.scales.yAxes = [{ticks: yTicksObj}];
								}
							}

							return new Chart(ctx, {type: chartType, data: chartData, options: options}, {
								onAnimationProgress: function () {
								}
							});
						}

						scope.$on('$destroy', function () {
							if (myChart) {
								myChart.destroy();
							}
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.unregister(resizeChart);
							}
						});

						function resizeChart() {
							if (myChart) {
								myChart.resize(myChart.render, true);
							}
						}

						function recreateChart() {
							if (myChart) {
								myChart.destroy();
							}
							myChart = createChart(scope.chartDataConfig, scope.chartDataSource, element);
						}

						scope.$watch('chartDataSource', function () {
							recreateChart();
						});
						scope.$watch('chartDataConfig', function () {
							recreateChart();
						});

						scope.$watch('triggerUpdateEvent', function () {
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.register(recreateChart);
							}
						});

						function initCanvasStyle(element) {
							// groups
							const parentElement = scope.groups ? element.parent() : element.parent().parent();
							const totalHeight = 0;
							const width = parseInt(parentElement.css('width')) - parseInt(parentElement.css('padding-left')) - parseInt(parentElement.css('padding-right')),
								height = parseInt(parentElement.css('height')) - parseInt(parentElement.css('padding-top')) - parseInt(parentElement.css('padding-bottom')) - totalHeight;
							element.attr('width', width).attr('height', height).css('width', width).css('height', height);

						}

					}
				};
			}]);

	function getType(type) {
		let typeStr = 'line';
		switch (type) {
			case 1:
				typeStr = 'line';
				break;
			case 2:
				typeStr = 'bar';
				break;
			case 3:
				typeStr = 'radar';
				break;
			case 4:
				typeStr = 'polarArea';
				break;
			case 5:
				typeStr = 'pie';
				break;
			case 6:
				typeStr = 'doughnut';
				break;
			case 7:
				typeStr = 'bubble';
				break;
		}
		return typeStr;
	}

	function toRgbColor(drawingUtils, color) {
		const titleRgbColor = drawingUtils.intToRgbColor(color);
		return 'rgb(' + titleRgbColor.r + ',' + titleRgbColor.g + ',' + titleRgbColor.b + ')';
	}

	const colorArray = ['rgba(0,103,177,0.7)', 'rgba(171,211,144,0.7)', 'rgba(182,96,238,0.7)'];

	function getColor(index) {
		if (colorArray.length <= index) {
			const rgb = 'rgba(' + getRandomColor() + ',' + getRandomColor() + ',' + getRandomColor() + ',0.7)';
			colorArray.push(rgb);
		}
		return colorArray[index];
	}

	function getRandomColor() {
		const max = 255;
		return Math.floor(Math.random() * max);
	}

})(angular);