/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

// This file uses D3 v4.
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.map.modelMapMinimapService
	 * @function
	 *
	 * @description Provides a class for minimaps.
	 */
	angular.module('model.map').factory('modelMapMinimapService', ['_', 'platformUnitFormattingService', 'd3',
		'pdfjsLib',
		function (_, platformUnitFormattingService, d3, pdfjsLib) {
			var service = {};

			function Minimap(drawingArea) {
				var that = this;

				this.zoom = 1;
				this.mapScale = d3.scaleLinear().domain([0, 1]).range([0, 1]);

				this.drawingArea = drawingArea;
				this.parentDiv = d3.select((function () {
					for (var current = drawingArea.node(); !_.isNil(current); current = current.parentElement) {
						if (current.localName === 'div') {
							return current;
						}
					}
					return drawingArea.node().parentElement;
				})());

				this.background = this.drawingArea.select('rect.bg');
				if (this.background.empty()) {
					this.background = this.drawingArea.append('rect').classed('bg', true).attrs({
						width: '100%',
						height: '100%'
					}).on('wheel', function () {
						return that.wheelEventHandler.apply(that, arguments);
					});
				}

				this.actorInViewportArea = this.drawingArea.select('g.actorInViewport');
				if (this.actorInViewportArea.empty()) {
					this.actorInViewportArea = this.drawingArea.append('g').classed('actorInViewport', true);
				}

				this.mapArea = this.actorInViewportArea.select('g.map');
				if (this.mapArea.empty()) {
					this.mapArea = this.actorInViewportArea.append('g').classed('map', true);

					this.mapGraphicsLayer = this.mapArea.append('g');
					this.mapPolygonsLayer = this.mapArea.append('g');
				}

				this.actorArea = this.actorInViewportArea.select('g.actor');
				if (this.actorArea.empty()) {
					this.actorArea = this.actorInViewportArea.append('g').classed('actor', true);

					drawActor(this.actorArea);
				}

				this.overlayArea = this.drawingArea.select('g.overlay');
				if (this.overlayArea.empty()) {
					this.overlayArea = this.drawingArea.append('g').classed('overlay', true);
				}

				this.setSize(0, 0);
			}

			Minimap.prototype.wheelEventHandler = function () {
				var that = this;
				if (d3.event.deltaY > 0) {
					that.zoom *= 0.9;
				} else if (d3.event.deltaY < 0) {
					that.zoom /= 0.9;
				}
				that.mapScale.range([0, that.zoom]);
				redrawMap(that);
				updateActorLocation(that);
			};

			service.Minimap = Minimap;

			function drawActor(actorArea) {
				actorArea.selectAll('*').remove();

				var gradient = actorArea.append('defs').append('radialGradient').attrs({
					id: 'viewingFrustumGradient',
					cx: '50%',
					cy: '100%',
					r: 1
				});
				gradient.append('stop').attrs({
					offset: '5%',
					'stop-color': 'rgba(255, 0, 0, 0.6)'
				});
				gradient.append('stop').attrs({
					offset: '98%',
					'stop-color': 'rgba(255, 0, 0, 0.1)'
				});

				actorArea.append('path').classed('actorViewingFrustum', true).attrs({
					d: 'M 0,0 L -12,-15 Q 0,-25,12,-15 Z',
					fill: 'url(#viewingFrustumGradient)'
				});

				actorArea.append('circle').classed('actorPosition', true).attrs({
					cx: 0,
					cy: 0,
					r: 2.5
				});
			}

			Minimap.prototype.setSize = function (width, height) {
				this.width = width;
				this.height = height;
				this.drawingArea.attr('width', width).attr('height', height);

				this.actorInViewportArea.attr('transform', 'translate(' + (width / 2) + ',' + (height / 3 * 2) + ')');
			};

			function preparePdfCanvases(map) {
				var renderPromises = {};

				var cntDiv = map.parentDiv.select('div.pdfCanvases');
				if (cntDiv.empty()) {
					cntDiv = map.parentDiv.append('div').classed('pdfCanvases', true).styles({
						position: 'absolute',
						left: -50000
					});
				}

				var pdfGraphics = _.isArray(map.mapData.graphics) ? _.filter(map.mapData.graphics, {type: 'pdf'}) : [];

				var canvases = cntDiv.selectAll('canvas.pdfCnv').data(pdfGraphics, function (d) {
					return d.url;
				});

				var newCanvases = canvases.enter().append('canvas').classed('pdfCnv', true).each(function (d) {
					var canvas = d3.select(this);
					renderPromises[d.url] = pdfjsLib.getDocument(d.url).promise.then(function (pdf) {
						return pdf.getPage(1);
					}).then(function (page) {
						var viewport = page.getViewport({
							scale: 1
						});

						var sizeAttrs = {
							width: viewport.width,
							height: viewport.height
						};
						canvas.attrs(sizeAttrs);

						var renderCtx = {
							canvasContext: canvas.node().getContext('2d'),
							viewport: viewport,
							background: 'rgba(0, 0, 0, 0)'
						};
						var renderTask = page.render(renderCtx);
						return renderTask.promise.then(function () {
							return {
								url: d.url,
								size: sizeAttrs,
								dataUrl: canvas.node().toDataURL('image/png')
							};
						});
					});
				});

				canvases.exit().remove();

				canvases = newCanvases.merge(canvases);

				return {
					getRenderPromise: function (url) {
						return renderPromises[url];
					}
				};
			}

			function redrawMap(map) {
				var canvasMgr = preparePdfCanvases(map);

				var graphics = map.mapGraphicsLayer.selectAll('.mapGraphic').data(map.mapData.graphics, function (d) {
					return _.isString(d.id) ? d.id : d.url;
				});

				var newGraphics = graphics.enter().append('g').classed('mapGraphic', true).each(function (d) {
					var gEl = d3.select(this);

					switch (d.type) {
						case 'bitmap':
							(function addBitmap() {
								var imgEl = gEl.append('image').attr('xlink:href', d.url);
								var img = new Image();
								img.onload = function () {
									imgEl.attrs({
										width: img.width,
										height: img.height
									});
								};
								img.src = d.url;
							})();
							break;
						case 'pdf':
							(function addPdf() {
								var imgEl = gEl.append('image');
								canvasMgr.getRenderPromise(d.url).then(function (info) {
									imgEl.attr('xlink:href', info.dataUrl).attrs(info.size);
								});
							})();
							break;
					}
				});

				graphics.exit().remove();

				graphics = newGraphics.merge(graphics);
				graphics.attr('transform', function (d) {
					var result = [];
					result.push('translate(' + map.mapScale(d.refPoint.x) + ',' + map.mapScale(-d.refPoint.y) + ')');
					result.push('rotate(' + (180 - d.orientationAngle) + ')');
					result.push('scale(' + map.mapScale(_.isNumber(d.scale) ? (1 / d.scale) : 1) + ')');
					result.push('translate(' + (d.refPoint.x + d.translation.x) + ',' + (-d.refPoint.y - d.translation.y) + ')');
					return result.length > 0 ? result.join(' ') : null;
				});

				var polygons = map.mapPolygonsLayer.selectAll('.mapPolygon').data(map.mapData.polygons);

				var newPolygons = polygons.enter().append('polygon').classed('mapPolygon', true);

				polygons.exit().remove();

				polygons = newPolygons.merge(polygons);
				polygons.attr('points', function (d) {
					return _.map(d.points, function (pt) {
						return map.mapScale(pt.x) + ',' + map.mapScale(pt.y);
					}).join(' ');
				});
			}

			Minimap.prototype.setMapData = function (mapData) {
				this.mapData = _.assign({
					graphics: [],
					polygons: []
				}, mapData || {});

				redrawMap(this);
			};

			function updateActorLocation(map) {
				map.mapArea.attr('transform', 'rotate(' + map.actorLocation.angle + ') translate(' + map.mapScale(-map.actorLocation.x) + ',' + map.mapScale(-map.actorLocation.y) + ')');

				var altitudeText = map.overlayArea.select('text.altitude');
				if (altitudeText.empty()) {
					altitudeText = map.overlayArea.append('text').classed('altitude', true);
				}
				altitudeText.attrs({
					x: 5,
					y: 12
				}).text(platformUnitFormattingService.formatLength(Math.round(map.actorLocation.z * 100) / 100));
			}

			Minimap.prototype.setActorLocation = function (x, y, z, angle) {
				this.actorLocation = {
					x: _.clamp(x, -1000000, 1000000),
					y: _.clamp(y, -1000000, 1000000),
					z: _.clamp(z, -1000000, 1000000),
					angle: angle
				};

				updateActorLocation(this);
			};

			return service;
		}]);
})(angular);
