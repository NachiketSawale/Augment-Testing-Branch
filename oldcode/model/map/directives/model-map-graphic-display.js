/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('model.map').directive('modelMapGraphicDisplay', ['_', 'd3', 'pdfjsLib', 'PlatformMessenger',
		function (_, d3, pdfjsLib, PlatformMessenger) {
			return {
				restrict: 'A',
				replace: true,
				scope: {
					mapGraphic: '<',
					setLink: '&'
				},
				templateUrl: globals.appBaseUrl + 'model.map/partials/model-map-graphic-display-partial.html',
				link: function (scope, elem) {
					scope.requiresCanvas = function () {
						return scope.mapGraphic && (scope.mapGraphic.type === 'pdf');
					};

					scope.requiresImage = function () {
						return scope.mapGraphic && (scope.mapGraphic.type === 'bitmap');
					};

					var privateState = {
						imgElem: elem.find('img'),
						currentGraphic: null,
						scalingFactor: 1,
						offset: {
							x: 0,
							y: 0
						},
						hScale: d3.scaleLinear(),
						vScale: d3.scaleLinear(),
						centerByOffset: function (containerSize) {
							privateState.offset.x = (containerSize.width - (privateState.scalingFactor * privateState.currentGraphic.width)) / 2;
							privateState.offset.y = (containerSize.height - (privateState.scalingFactor * privateState.currentGraphic.height)) / 2;
						},
						graphicToDisplay: function (x, y) {
							return {
								x: privateState.hScale(x),
								y: privateState.vScale(y)
							};
						},
						displayToGraphic: function (x, y) {
							return {
								x: privateState.hScale.invert(x),
								y: privateState.vScale.invert(y)
							};
						},
						onRequiresRedraw: new PlatformMessenger(),
						pdfCanvasParent: d3.select(elem[0]).append('div').classed('pdfCanvasParent', true).styles({
							position: 'absolute',
							left: '-50000px'
						})
					};

					privateState.imgElem[0].onload = function () {
						privateState.currentGraphic = {
							width: privateState.imgElem[0].naturalWidth,
							height: privateState.imgElem[0].naturalHeight
						};
						resetSize();
					};

					function resetSize() {
						if (privateState.currentGraphic && (privateState.currentGraphic.width > 0) && (privateState.currentGraphic.height > 0)) {
							var containerSize = {
								width: elem.outerWidth(),
								height: elem.outerHeight()
							};
							if ((containerSize.width > 0) && (containerSize.height > 0)) {
								var availableAspectRatio = containerSize.width / containerSize.height;
								var graphicAspectRatio = privateState.currentGraphic.width / privateState.currentGraphic.height;

								if (availableAspectRatio > graphicAspectRatio) {
									// fit height
									privateState.scalingFactor = containerSize.height * 0.75 / privateState.currentGraphic.height;
								} else {
									// fit width
									privateState.scalingFactor = containerSize.width * 0.75 / privateState.currentGraphic.width;
								}

								privateState.centerByOffset(containerSize);

								privateState.hScale.range([privateState.offset.x, privateState.offset.x + privateState.scalingFactor]);
								privateState.vScale.range([privateState.offset.y, privateState.offset.y + privateState.scalingFactor]);

								updateElementSize();

								privateState.onRequiresRedraw.fire();
							}
						}
					}

					function updateElementSize() {
						if (privateState.currentGraphic && (privateState.currentGraphic.width > 0) && (privateState.currentGraphic.height > 0)) {
							privateState.imgElem.css('left', privateState.hScale(0)).css('top', privateState.vScale(0)).width(privateState.currentGraphic.width * privateState.scalingFactor).height(privateState.currentGraphic.height * privateState.scalingFactor);
						}
					}

					function zoom(x, y, delta) {
						if (!privateState.currentGraphic || (privateState.currentGraphic.width <= 0) || (privateState.currentGraphic.height <= 0)) {
							return;
						}

						var containerSize = {
							width: elem.outerWidth(),
							height: elem.outerHeight()
						};

						var pointInGraphic = privateState.displayToGraphic(x, y);

						privateState.scalingFactor = Math.max(privateState.scalingFactor + delta, 0.00001);

						if ((privateState.scalingFactor * privateState.currentGraphic.width >= containerSize.width) || (privateState.scalingFactor * privateState.currentGraphic.height >= containerSize.height)) {
							privateState.hScale.range([privateState.offset.x, privateState.offset.x + privateState.scalingFactor]);
							privateState.vScale.range([privateState.offset.y, privateState.offset.y + privateState.scalingFactor]);

							var newPointInDisplay = privateState.graphicToDisplay(pointInGraphic.x, pointInGraphic.y);
							privateState.offset.x -= newPointInDisplay.x - x;
							privateState.offset.y -= newPointInDisplay.y - y;
						} else {
							privateState.centerByOffset(containerSize);
						}

						privateState.hScale.range([privateState.offset.x, privateState.offset.x + privateState.scalingFactor]);
						privateState.vScale.range([privateState.offset.y, privateState.offset.y + privateState.scalingFactor]);

						updateElementSize();

						privateState.onRequiresRedraw.fire();
					}

					scope.$watch('mapGraphic', function mapGraphicChanged(newValue) {
						if (newValue) {
							scope.imageUrl = null;

							switch (newValue.type) {
								case 'bitmap':
									privateState.imgElem.attr('src', newValue.url);
									break;
								case 'pdf':
									privateState.currentGraphic = null;
									pdfjsLib.getDocument(newValue.url).promise.then(function (pdf) {
										return pdf.getPage(1);
									}).then(function (page) {
										var viewport = page.getViewport({
											scale: 1
										});

										var sizeAttrs = {
											width: viewport.width,
											height: viewport.height
										};
										_.assign(privateState.currentGraphic, sizeAttrs);
										privateState.pdfCanvasParent.selectAll('canvas.pdfCnv').classed('discarded', true).remove();
										var pdfCanvas = privateState.pdfCanvasParent.append('canvas').classed('pdfCnv', true);
										pdfCanvas.attrs(sizeAttrs);

										var renderCtx = {
											canvasContext: pdfCanvas.node().getContext('2d'),
											viewport: viewport,
											background: 'rgba(0, 0, 0, 0)'
										};
										var renderTask = page.render(renderCtx);
										return renderTask.promise.then(function () {
											return {
												url: newValue.url,
												size: sizeAttrs,
												dataUrl: pdfCanvas.node().toDataURL('image/png'),
												canvas: pdfCanvas
											};
										});
									}).then(function displayPdfCanvasImage(info) {
										if (info.canvas.classed('discarded')) {
											info.canvas.remove();
										} else {
											privateState.imgElem.attr('src', info.dataUrl);
										}
									});
									break;
							}
						} else {
							privateState.currentGraphic = null;
						}
					});

					scope.setLink({
						link: {
							graphicToDisplay: privateState.graphicToDisplay,
							displayToGraphic: privateState.displayToGraphic,
							registerRequiresRedraw: function (handler) {
								privateState.onRequiresRedraw.register(handler);
							},
							unregisterRequiresRedraw: function (handler) {
								privateState.onRequiresRedraw.unregister(handler);
							},
							zoom: function (x, y, delta) {
								zoom(x, y, delta);
							}
						}
					});
				}
			};
		}]);
})(angular);
