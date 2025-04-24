/*
 * Created by wul at 5/05/2023
 *
 */
(function (angular) {
	/* global Chart:false */

	'use strict';
	const moduleName = 'basics.common';
	/*
	 * chartDataSource = { legends: [],
	                       labels: [],
	                       datasets: [{ data: [] }, { data: [] },,, ],
	                       yValueDomain: ''//money,..
	                     };

	 * chartType= Bar Radar Line 3D_Columns

	 * triggerUpdateEvent = new PlatformMessenger();
	 */
	angular.module(moduleName).directive('basicsCommonChartConfigDirective',
		['platformContextService', 'platformLanguageService', 'platformDomainService', 'basicsCommonChartService',
			function (platformContextService, platformLanguageService, platformDomainService, basicsCommonChartService) {
				return {
					restrict: 'E',
					template: '<canvas></canvas>',
					replace: true,
					scope: {
						chartDataSource: '=',
						chartType: '=',
						triggerUpdateEvent: '=',
						chartUuid: '=',
						legendColors: '=',
						chartOption: '=',
						plugins: '=',
						chartClickFun: '='
					},
					link: function (scope, element) {
						let myChart = null;

						element.on('click', handleClick);

						function handleClick(evt){
							let activePoints = myChart.getElementAtEvent(evt);
							if(!activePoints || activePoints.length <= 0 || !scope.chartClickFun){return;}
							scope.chartClickFun(activePoints[0]._model.label);
						}

						scope.$watch('chartDataSource', function () {
							recreateChart();
						});

						scope.$watch('triggerUpdateEvent', function () {
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.register(recreateChart);
							}
						});

						platformContextService.contextChanged.register(contextChangedHandler);

						function contextChangedHandler(type) {
							if (type === 'culture' &&
								scope.chartDataSource &&
								scope.chartDataSource.datasets &&
								scope.chartDataSource.datasets.yValueDomain &&
								scope.chartDataSource.datasets.yValueDomain.name) {
								const domainInfo = platformDomainService.loadDomain(scope.chartDataSource.datasets.yValueDomain.name),
									culture = platformContextService.culture(),
									cultureInfo = platformLanguageService.getLanguageInfo(culture);

								angular.extend(scope.chartDataSource.datasets.yValueDomain, {
									decimal: cultureInfo[domainInfo.datatype].decimal,
									thousand: cultureInfo[domainInfo.datatype].thousand
								});
							}
						}

						scope.$on('$destroy', function () {
							platformContextService.contextChanged.unregister(contextChangedHandler);
							if (myChart) {
								myChart.destroy();
							}
							if (scope.triggerUpdateEvent) {
								scope.triggerUpdateEvent.unregister(resizeChart);
							}

							Chart.controllers.bar.prototype._getStacks = _getStacks_Old;
							Chart.controllers.bar.prototype.getStackCount = getStackCount_old;
							Chart.controllers.bar.prototype.getStackIndex = getStackIndex_old;
							Chart.controllers.bar.prototype.calculateBarIndexPixels = calculateBarIndexPixels_old;
							Chart.elements.Rectangle.prototype.inRange = ractangeInrange_old;
						});

						function recreateChart() {
							if (myChart) {
								myChart.destroy();
							}

							contextChangedHandler('culture');
							let options = {
								onAnimationProgress: function () {
									if (!basicsCommonChartService.hasValue(scope.chartDataSource)) {
										this.destroy();
									}
								}
							};
							if (scope.chartOption) {
								angular.extend(options, scope.chartOption);

								if(scope.chartOption.containerTitle){
									let titleElement = element.parent().parent().parent().children('.subview-header').children('.title');
									if(titleElement){
										let titles = titleElement.html().split(' - ');
										titleElement.html(titles[0] +' - ' + scope.chartOption.containerTitle);
									}
								}
							}
							myChart = basicsCommonChartService.createConfigChart(scope.chartType, scope.chartDataSource, element, options, scope.legendColors, scope.plugins);
						}

						function resizeChart() {
							if (myChart) {
								myChart.resize(myChart.render, true);
							}
						}

						// enhance Chart to supprot skip null or Zero value data set.
						let _getStacks_Old = Chart.controllers.bar.prototype._getStacks;
						let getStackCount_old = Chart.controllers.bar.prototype.getStackCount;
						let getStackIndex_old = Chart.controllers.bar.prototype.getStackIndex;
						let calculateBarIndexPixels_old = Chart.controllers.bar.prototype.calculateBarIndexPixels;
						let ractangeInrange_old = Chart.elements.Rectangle.prototype.inRange;

						Chart.controllers.bar.prototype._getStacks = function(last, dataIndex) {
							let me = this;
							let scale = me._getIndexScale();
							let metasets = scale._getMatchingVisibleMetas(me._type);
							let stacked = scale.options.stacked;
							let ilen = metasets.length;
							let stacks = [];
							let i, meta;

							for (i = 0; i < ilen; ++i) {
								meta = metasets[i];

								if(!!dataIndex || dataIndex === 0){
									let value = meta.controller.getDataset().data[dataIndex];
									if(!value) {
										continue;
									}
								}

								if (stacked === false || stacks.indexOf(meta.stack) === -1 ||
									(stacked === undefined && meta.stack === undefined)) {
									stacks.push(meta.stack);
								}
								if (meta.index === last) {
									break;
								}
							}

							return stacks;
						};

						Chart.controllers.bar.prototype.getStackCount = function(dataIndex) {
							return this._getStacks(null, dataIndex).length;
						};

						Chart.controllers.bar.prototype.getStackIndex = function(datasetIndex, name, dataIndex) {
							var stacks = this._getStacks(datasetIndex, dataIndex);
							var index = (name !== undefined)
								? stacks.indexOf(name)
								: -1; // indexOf returns -1 if element is not present

							return (index === -1)
								? stacks.length - 1
								: index;
						};

						Chart.controllers.bar.prototype.calculateBarIndexPixels = function(datasetIndex, index, ruler, options) {
							let me = this;
							let stactCount = me.chart.config.options.element.skipNullOrZero ? this.getStackCount(index): ruler.stackCount;
							let range = _computeFitCategoryTraits_(index, ruler, options, stactCount);

							let stackIndex = me.getStackIndex(datasetIndex, me.getMeta().stack, (me.chart.config.options.element.skipNullOrZero ? index : null));
							let center = range.start + (range.chunk * stackIndex) + (range.chunk / 2);
							let size = Math.min(
								Chart.helpers.valueOrDefault(options.maxBarThickness, Infinity),
								range.chunk * range.ratio);

							return {
								base: center - size / 2,
								head: center + size / 2,
								center: center,
								size: size
							};

							function _computeFitCategoryTraits_(index, ruler, options, strackCount) {
								let thickness = options.barThickness;
								let count = strackCount || ruler.stackCount;
								let curr = ruler.pixels[index];
								let min = Chart.helpers.isNullOrUndef(thickness)
									? _computeMinSampleSize_(ruler.scale, ruler.pixels)
									: -1;
								let size, ratio;

								if (Chart.helpers.isNullOrUndef(thickness)) {
									size = min * options.categoryPercentage;
									ratio = options.barPercentage;
								} else {
									size = thickness * count;
									ratio = 1;
								}

								return {
									chunk: size / count,
									ratio: ratio,
									start: curr - (size / 2)
								};
							}

							function _computeMinSampleSize_(scale, pixels) {
								let min = scale._length;
								let prev, curr, i, ilen;

								for (i = 1, ilen = pixels.length; i < ilen; ++i) {
									min = Math.min(min, Math.abs(pixels[i] - pixels[i - 1]));
								}

								for (i = 0, ilen = scale.getTicks().length; i < ilen; ++i) {
									curr = scale.getPixelForTick(i);
									min = i > 0 ? Math.min(min, Math.abs(curr - prev)) : min;
									prev = curr;
								}

								return min;
							}
						};

						Chart.elements.Rectangle.prototype.inRange = function (x,y){
							let vm = this._view;
							let skipX = x === null;
							let skipY = y === null;
							let bounds = !vm || (skipX && skipY) ? false : getBarBounds(vm);

							return bounds
								&& (skipX || x >= bounds.left && x <= bounds.right)
								&& (skipY || y >= bounds.top - 20 && y <= bounds.bottom);

							function getBarBounds(vm) {
								let x1, x2, y1, y2, half;

								if (vm && vm.width !== undefined) {
									half = vm.width / 2;
									x1 = vm.x - half;
									x2 = vm.x + half;
									y1 = Math.min(vm.y, vm.base);
									y2 = Math.max(vm.y, vm.base);
								} else {
									half = vm.height / 2;
									x1 = Math.min(vm.x, vm.base);
									x2 = Math.max(vm.x, vm.base);
									y1 = vm.y - half;
									y2 = vm.y + half;
								}

								return {
									left: x1,
									top: y1,
									right: x2,
									bottom: y2
								};
							}
						};
					}
				};
			}
		]);

})(angular);