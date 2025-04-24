/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc directive
	 * @name model.map.polygon.overlay:modelMapPolygonOverlay
	 * @element div
	 * @restrict EA
	 * @description Displays an overlay for the map polygon mini viewer to draw map polygons.
	 */
	const moduleName = 'model.map';
	angular.module(moduleName).directive('modelMapPolygonOverlay', modelMapPolygonOverlay);

	modelMapPolygonOverlay.$inject = ['modelMapPolygonDataService', 'Communicator', 'd3'];

	function modelMapPolygonOverlay(modelMapPolygonDataService, Communicator, d3) {
		return {
			restrict: 'EA',
			scope: {
				viewer: '=',
				setLink: '&'
			},
			template:
				'<svg class="map-polygon-overlay fullwidth fullheight"></svg>',
			link: function (scope, elem) {
				const dragging = false;
				let drawing = false;
				let startPoint;
				let stopDrawingPolygon = false;
				const svg = d3.select(elem[0]).select('svg');
				let points = [];
				let g;

				/**
				 * @ngdoc function
				 * @name reDrawMap
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description redraw map polygons and highlight the current selected entity.
				 * @returns Nothing returned.
				 */

				const reDrawMap = function () {
					const mapPolygons = modelMapPolygonDataService.getList();
					if (mapPolygons) {
						svg.selectAll('g').remove();
						let color = '#c8c8c8';
						let opacity = 0.5;
						drawPolygons(mapPolygons, color, opacity);

						const selectedMapPolygons = modelMapPolygonDataService.getSelectedEntities();
						svg.selectAll('polygon').style('fill', '#c8c8c8');
						if (selectedMapPolygons) {
							color = '#c6c845';
							opacity = 0.8;
							drawPolygons(selectedMapPolygons, color, opacity);
						}
					}
				};
				/**
				 * @ngdoc function
				 * @name undoDrawingPolygon
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description Undo Drawing Polygon with clicking space.
				 * @returns Nothing returned.
				 */

				modelMapPolygonDataService.undoDrawingPolygon = function () {
					stopDrawingPolygon = true;
					const selectedMapPolygon = modelMapPolygonDataService.getSelected();
					selectedMapPolygon.Points = null;
					points = [];
					stopDrawingPolygon = false;
					reDrawMap();
				};
				/**
				 * @ngdoc event {d3}
				 * @name registerSelectionChanged
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description handle selection change of map polygons.
				 */
				modelMapPolygonDataService.registerSelectionChanged(function () {
					reDrawMap();
				});
				/**
				 * @ngdoc event {d3}
				 * @name registerListLoaded
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description Handle list loading of map polygons.
				 */
				modelMapPolygonDataService.registerListLoaded(function () {
					reDrawMap();
				});

				/**
				 * @ngdoc event {d3}
				 * @name onClick
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description Handle clicking to draw polygon using d3.
				 */
				svg.on('click', function () {
					let canDrawPolygon = false;
					const selectedMapPolygon = modelMapPolygonDataService.getSelected();
					if (selectedMapPolygon) {
						if (selectedMapPolygon.Points === null) {
							canDrawPolygon = true;
						}
					}
					if (canDrawPolygon && stopDrawingPolygon === false) {
						if (dragging) {
							return;
						}
						drawing = true;
						startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
						if (svg.select('g.drawPoly').empty()) {
							g = svg.append('g').classed('drawPoly', true);
						}
						if (d3.event.target.hasAttribute('is-handle')) {
							closePolygon();
							return;
						}
						points.push(d3.mouse(this));
						g.select('polyline').remove();
						g.append('polyline').attr('points', points)
							.style('fill', 'none')
							.attr('stroke', '#000');
						for (let i = 0; i < points.length; i++) {
							g.append('circle').attrs({
								'cx': points[i][0],
								'cy': points[i][1],
								'r': 4,
								'fill': 'yellow',
								'stroke': '#000',
								'is-handle': 'true'
							})
								.style({
									cursor: 'pointer'
								});
						}
					}

				});

				/**
				 * @ngdoc event {d3}
				 * @name onMouseMove
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description Handle clicking to draw polygon using d3.
				 */
				svg.on('mousemove', function () {
					if (!drawing) {
						return;
					}
					const g = svg.select('g.drawPoly');
					g.select('line').remove();
					g.append('line').attrs({
						'x1': startPoint[0],
						'y1': startPoint[1],
						'x2': d3.mouse(this)[0] + 2,
						'y2': d3.mouse(this)[1],
						'stroke': '#53DBF3',
						'stroke-width': 1
					});
				});

				/**
				 * @ngdoc function
				 * @name closePolygon
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description Close Polygon that drawn using d3.
				 */
				function closePolygon() {
					svg.select('g.drawPoly').remove();
					svg.append('gAll');
					const g = svg.append('g');
					g.append('polygon')
						.attr('points', points)
						.style('fill', '#c6c845');

					const polygonPoints = stringifyPoints(points);
					const selectedMapElement = modelMapPolygonDataService.getSelected();
					selectedMapElement.Points = polygonPoints;
					modelMapPolygonDataService.markItemAsModified(selectedMapElement);

					for (let i = 0; i < points.length; i++) {
						g.selectAll('circles')
							.data([points[i]])
							.enter()
							.append('circle')
							.attrs({
								'cx': points[i][0],
								'cy': points[i][1],
								'r': 4,
								'fill': '#FDBC07',
								'stroke': '#000',
								'is-handle': 'true'
							})
							.style({
								cursor: 'move'
							});

					}
					points.splice(0);
					drawing = false;

				}

				/**
				 * @ngdoc function
				 * @name transformOverlayToModelPoints
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description parse stringfied Points string to model Points.
				 * @param {String} pointsStr String of polygon points which is extracted from Databse.
				 * @returns {Array<Polygon.Points>}.
				 */
				function transformOverlayToModelPoints(pointsStr) {
					const modelPoints = [];
					const parsedPoints = modelMapPolygonDataService.parsePointsStr(pointsStr);

					for (let i = 0; i < parsedPoints.length; i++) {
						const point = parsedPoints[i];
						if (point && scope.viewer) {
							const projectedPoint = scope.viewer().view.projectPoint(new Communicator.Point3(point[0], point[1], 0));
							const transformedPoint = [];

							transformedPoint.push(projectedPoint.x);
							transformedPoint.push(projectedPoint.y);
							modelPoints.push(transformedPoint);
						}
					}
					return modelPoints;
				}

				/**
				 * @ngdoc function
				 * @name stringifyPoints
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description get stringfied Points record from Array of points to be stored in Database.
				 * @param {Array} localPoints Array of Points to be stored per map polygon.
				 * @returns {String} Polygon points.
				 */
				function stringifyPoints(localPoints) {
					let transformedPointsStr = '';
					for (let i = 0; i < localPoints.length; i++) {
						const localPoint = new Communicator.Point2(localPoints[i][0], localPoints[i][1]);

						const transformedPoint = getModelCoordinatesOfClickedPoint(scope.viewer(), localPoint);
						if (i === localPoints.length - 1) {
							transformedPointsStr += Math.round(transformedPoint.x * 1000) + ',' + Math.round(transformedPoint.y * 1000);
						} else {
							transformedPointsStr += Math.round(transformedPoint.x * 1000) + ',' + Math.round(transformedPoint.y * 1000) + ';';
						}
					}
					return transformedPointsStr;
				}

				/**
				 * @ngdoc function
				 * @name drawPolygons
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description redraw map polygons and highlight the current selected entity.
				 * @param {Array} polygonsArr Array of Polygons to be drawn.
				 * @param {Color} color Polygons Fill Color.
				 * @param {Number} opacity The opacity of the polygons.
				 * @returns Nothing returned.
				 */

				function drawPolygons(polygonsArr, color, opacity) {
					let points = [];
					for (let i = 0; i < polygonsArr.length; i++) {
						if (typeof (polygonsArr[i].Points) === 'string' && polygonsArr[i].Points !== '') {
							points = transformOverlayToModelPoints(polygonsArr[i].Points);
						} else {
							points = polygonsArr[i].Points;
						}
						const g = svg.append('g');
						g.append('polygon')
							.attr('points', points)
							.styles({'fill': color, 'fill-opacity': opacity, 'stroke': color});
					}
				}

				// noinspection JSValidateJSDoc
				/**
				 * @ngdoc function
				 * @name getModelCoordinatesOfClickedPoint
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description Computes model point coordinates from clicked point on d3 overlay.
				 * @param {Communicator.WebViewer} viewer The web viewer.
				 * @param {Communicator.Point3} viewportCoords Coordinate.
				 * @returns {Communicator.Point3} real model point coordinates.
				 */
				function getModelCoordinatesOfClickedPoint(viewer, viewportCoords) {
					let intersectingPoint = new Communicator.Point3();
					const view = viewer.view;
					const camera = view.getCamera();

					const viewDir = getViewDirection(camera);

					const targetPos = camera.getPosition();
					targetPos.add(viewDir);

					if (viewportCoords) {
						const targetPlane = Communicator.Plane.createFromPointAndNormal(targetPos, viewDir);
						const targetRay = view.raycastFromPoint(viewportCoords);
						const intersect = targetPlane.intersectsRay(targetRay, targetPos);
						if (intersect) {
							intersectingPoint = targetPlane.rayIntersection(targetRay);
						}
					}
					return intersectingPoint;
				}

				// noinspection JSValidateJSDoc
				/**
				 * @ngdoc function
				 * @name getViewDirection
				 * @function
				 * @methodOf modelMapPolygonOverlay
				 * @description Computes the gaze direction vector of a given camera.
				 * @param {Communicator.Camera} camera The camera.
				 * @returns {Communicator.Point3} The non-normalized vector pointing in the gaze direction of the camera.
				 */
				function getViewDirection(camera) {
					const pos = camera.getPosition();
					const trg = camera.getTarget();
					return trg.subtract(pos);
				}

				const linkObject = {
					resizeMapContent: function () {
						scope.$evalAsync(function () {
							reDrawMap();
						});
					}
				};
				scope.$on('$destroy', function () {
					modelMapPolygonDataService.unregisterSelectionChanged(reDrawMap);
				});

				scope.setLink({
					link: linkObject
				});

			}
		};
	}
})(angular);
