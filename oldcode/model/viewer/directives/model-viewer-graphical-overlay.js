/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

// This file uses D3 v4.
(function (angular) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name model.viewer.directive:modelViewerGraphicalOverlay
	 * @element div
	 * @restrict A
	 * @description Provides a graphical overlay for 3D viewers.
	 */
	angular.module('model.viewer').directive('modelViewerGraphicalOverlay', directiveFunc);

	directiveFunc.$inject = ['d3'];

	function directiveFunc(d3) {
		return {
			restrict: 'A',
			scope: false,
			link: function (scope, elem) {
				var d3Canvas = d3.select(elem[0]);

				var state = {
					areas: {
						selRectangle: d3Canvas.append('g').classed('selection-rectangle', true),
						cursorCrosshair: d3Canvas.append('g').classed('cursor-crosshair', true)
					}
				};

				function updateSelectionRectangleIncludesPartial(rect) {
					var includesPartial = state.selectionRectangleIncludesPartial;
					(rect || state.areas.selRectangle.selectAll('rect')).classed('onlyContained', !includesPartial).classed('includePartial', includesPartial);
				}

				var manager = {
					updateCursorPos: function (x, y) {
						var hLine = state.areas.cursorCrosshair.selectAll('line.horizontal');
						if (!hLine.empty()) {
							hLine.attrs({
								x2: d3Canvas.node().parentNode.clientWidth,
								y1: y,
								y2: y
							});
						}

						var vLine = state.areas.cursorCrosshair.selectAll('line.vertical');
						if (!vLine.empty()) {
							vLine.attrs({
								y2: d3Canvas.node().parentNode.clientHeight,
								x1: x,
								x2: x
							});
						}
					},
					enterCursor: function () {
						state.isCursorInArea = true;

						state.areas.cursorCrosshair.selectAll('line').attr('visibility', 'visible');
					},
					leaveCursor: function () {
						state.isCursorInArea = false;

						state.areas.cursorCrosshair.selectAll('line').attr('visibility', 'hidden');
					},

					showCursorCrosshair: function () {
						var hLine = state.areas.cursorCrosshair.selectAll('line.horizontal');
						if (hLine.empty()) {
							hLine = state.areas.cursorCrosshair.append('line').classed('horizontal', true).attrs({
								x1: 0,
								visibility: state.isCursorInArea ? 'visible' : 'hidden'
							});
						}

						var vLine = state.areas.cursorCrosshair.selectAll('line.vertical');
						if (vLine.empty()) {
							vLine = state.areas.cursorCrosshair.append('line').classed('vertical', true).attrs({
								y1: 0,
								visibility: state.isCursorInArea ? 'visible' : 'hidden'
							});
						}
					},
					clearCursorCrosshair: function () {
						state.areas.cursorCrosshair.selectAll('line').remove();
					},

					showSelectionRectangle: function () {
						var rect = state.areas.selRectangle.selectAll('rect');
						if (rect.empty()) {
							rect = state.areas.selRectangle.append('rect');
							updateSelectionRectangleIncludesPartial(rect);
						}
						rect.attrs({
							x: 0,
							y: 0,
							width: 0,
							height: 0
						});
					},
					updateSelectionRectangle: function (x, y, width, height) {
						var rect = state.areas.selRectangle.selectAll('rect');
						rect.attrs({
							x: x,
							y: y,
							width: width,
							height: height
						});
					},
					clearSelectionRectangle: function () {
						state.areas.selRectangle.selectAll('rect').remove();
					},
					setSelectionRectangleIncludesPartial: function (includesPartial) {
						if (state.selectionRectangleIncludesPartial !== includesPartial) {
							state.selectionRectangleIncludesPartial = !!includesPartial;
							updateSelectionRectangleIncludesPartial();
						}
					}
				};

				scope.graphicalOverlayManager = function getGraphicalOverlayManagerInstance() {
					return manager;
				};
			}
		};
	}
})(angular);
