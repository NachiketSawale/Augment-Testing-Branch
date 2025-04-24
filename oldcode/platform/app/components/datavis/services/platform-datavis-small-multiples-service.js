/*
 * $Id: platform-datavis-small-multiples-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

/* global d3 */
// This file uses D3 v4.
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformDatavisSmallMultiplesService
	 * @function
	 * @requires _, platformDatavisService
	 *
	 * @description Draws several instances of another visualization.
	 */
	angular.module('platform').factory('platformDatavisSmallMultiplesService', ['_', 'platformDatavisService',
		function (_, platformDatavisService) {
			var service = {};

			service.directions = {
				rowsBeforeColumns: 1,
				columnsBeforeRows: 2
			};

			function extractCanonicalSmallMultiplesConfiguration(cfg) {
				if (!angular.isFunction(cfg.visFactory)) {
					throw new Error('The visualization factory is not a function.');
				}

				return {
					columns: isFinite(cfg.columns) && (cfg.columns > 0) ? cfg.columns : 1,
					rows: isFinite(cfg.rows) && (cfg.rows > 0) ? cfg.rows : 1,
					direction: (function () {
						switch (cfg.direction) {
							case service.directions.columnsBeforeRows:
								return cfg.direction;
							default:
								return service.directions.rowsBeforeColumns;
						}
					})(),
					visFactory: cfg.visFactory
				};
			}

			function extractCanonicalSmallMultiplesData(data) {
				return {
					items: data.items,
					keyPosition: (function () {
						switch (data.keyPosition) {
							case 'above':
							case 'disabled':
								return data.keyPosition;
							default:
								return 'below';
						}
					})(),
					keyHeight: 25,
					itemPadding: isFinite(data.itemPadding) ? data.itemPadding : 2,
					borderPadding: isFinite(data.borderPadding) ? data.borderPadding : 2
				};
			}

			function MultiVis(dataVisualizationLink, visParent, cfg) {
				var actualVisParent = visParent.append('g').classed('smallMultiples', true);
				platformDatavisService.DataVisualization.call(this, dataVisualizationLink, actualVisParent);
				this.config = extractCanonicalSmallMultiplesConfiguration(cfg ? cfg : {});

				var that = this;

				this.multiples = _.map(_.range(0, cfg.columns * cfg.rows), function (index) {
					return {
						index: index,
						update: function (data) {
							if (this.visLink && this.vis) {
								this.visLink.setData(data);
							} else {
								this.visLink.setVisualization(that.config.visFactory, data);
								this.vis = platformDatavisService.createDataVisualization(this.visLink, this.parent);
							}
						}
					};
				});

				var smDrawingAreas = actualVisParent.selectAll('g.smallMultiple').data(this.multiples);
				smDrawingAreas = smDrawingAreas.enter().append('g').classed('smallMultiple', true).merge(smDrawingAreas);
				smDrawingAreas.each(function (d, i) {
					d.visLink = new platformDatavisService.DataVisualizationLink();

					var itemEl = d3.select(this);

					d.frame = itemEl.select('g.frame');
					if (d.frame.empty()) {
						d.frame = itemEl.append('g').classed('frame', true);
					}
					if (d.frame.select('rect.border').empty()) {
						d.frame.append('rect').classed('border', true);
					}

					d.parent = itemEl.select('g.vis');
					if (d.parent.empty()) {
						d.parent = itemEl.append('g').classed('vis', true);
					}

					switch (that.config.direction) {
						case service.directions.columnsBeforeRows:
							d.columnIndex = Math.floor(i / that.config.rows);
							d.rowIndex = i % that.config.rows;
							break;
						case service.directions.rowsBeforeColumns:
							d.columnIndex = i % that.config.columns;
							d.rowIndex = Math.floor(i / that.config.columns);
							break;
					}
				});
			}

			MultiVis.prototype = Object.create(platformDatavisService.DataVisualization.prototype);
			MultiVis.prototype.constructor = MultiVis;

			MultiVis.prototype.draw = function (info) {
				var data = extractCanonicalSmallMultiplesData(info.data ? info.data : {});
				var dataItems = angular.isArray(data.items) ? data.items : [];

				var smallMultipleSize = {
					width: info.width / this.config.columns,
					height: info.height / this.config.rows
				};
				smallMultipleSize.visWidth = smallMultipleSize.width - 2 * data.itemPadding - 2 * data.borderPadding;
				smallMultipleSize.visHeight = smallMultipleSize.height - 2 * data.itemPadding - 2 * data.borderPadding;
				if (data.keyPosition !== 'disabled') {
					smallMultipleSize.visHeight -= data.keyHeight;
				}

				this.multiples.forEach(function (item, index) {
					var itemData = dataItems[index];
					if (!itemData) {
						itemData = {};
					}

					var visPos = {
						x: item.columnIndex * smallMultipleSize.width + data.itemPadding + data.borderPadding,
						y: item.rowIndex * smallMultipleSize.height + data.itemPadding + data.borderPadding
					};
					if (data.keyPosition === 'above') {
						visPos.y += data.keyHeight;
					}

					item.parent.attr('transform', 'translate(' + visPos.x + ',' + visPos.y + ')');
					item.update(itemData.data);
					item.vis.updateSize(smallMultipleSize.visWidth, smallMultipleSize.visHeight);

					item.frame.select('rect.border')
						.attr('x', item.columnIndex * smallMultipleSize.width + data.borderPadding)
						.attr('y', item.rowIndex * smallMultipleSize.height + data.borderPadding)
						.attr('width', smallMultipleSize.width - 2 * data.borderPadding)
						.attr('height', smallMultipleSize.height - 2 * data.borderPadding);

					var keyText = item.frame.select('text.keyLabel');
					if (data.keyPosition === 'disabled') {
						keyText.remove();
					} else {
						if (keyText.empty()) {
							keyText = item.frame.append('text').classed('keyLabel', true).style('text-anchor', 'middle');
						}
						var textPos = {
							x: visPos.x + smallMultipleSize.visWidth / 2,
							y: data.keyPosition === 'above' ? (visPos.y - data.keyHeight) : (visPos.y + smallMultipleSize.visHeight + 20)
						};
						keyText.attr('x', textPos.x).attr('y', textPos.y).text(itemData.key);
					}
				});
			};

			service.createFactory = function (cfg) {
				return function (link, visParent) {
					return new MultiVis(link, visParent, cfg);
				};
			};

			return service;
		}]);
})();