/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsUtilitiesService
	 * @function
	 *
	 * @description Provides various utilities to use and control the Hoops 3D viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsUtilitiesService',
		modelViewerHoopsUtilitiesService);

	modelViewerHoopsUtilitiesService.$inject = ['_', '$q', 'Communicator', 'keyCodes',
		'modelViewerShortcutService', 'math', 'modelViewerObjectTreeService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerSelectabilityService'];

	function modelViewerHoopsUtilitiesService(_, $q, Communicator, keyCodes,
		modelViewerShortcutService, math, modelViewerObjectTreeService,
		modelViewerCompositeModelObjectSelectionService, modelViewerSelectabilityService) {

		const service = {};
		let markerShapeId = null;

		(function enhanceCommunicator() {
			if (!Communicator.Point2.prototype.normalize) {
				Communicator.Point2.prototype.normalize = function () {
					const l = this.length();
					this.x /= l;
					this.y /= l;
					return this;
				};
			}

			if (!Communicator.Point2.radiansBetween) {
				Communicator.Point2.radiansBetween = function (v1, v2) {
					v1 = v1.copy().normalize();
					v2 = v2.copy().normalize();
					return Math.atan2(v2.y, v2.x) - Math.atan2(v1.y, v1.x);
				};
			}

			if (!Communicator.Point2.degreesBetween) {
				Communicator.Point2.degreesBetween = function (v1, v2) {
					return Communicator.Point2.radiansBetween(v1, v2) * 180 / Math.PI;
				};
			}

			if (!Communicator.Point3.radiansBetween) {
				Communicator.Point3.radiansBetween = function (v1, v2) {
					return Math.acos(Communicator.Point3.dot(v1.copy().normalize(), v2.copy().normalize()));
				};
			}

			if (!Communicator.Point3.degreesBetween) {
				Communicator.Point3.degreesBetween = function (v1, v2) {
					return Communicator.Point3.radiansBetween(v1, v2) * 180 / Math.PI;
				};
			}

			if (!Communicator.Point3.normalFromVectors) {
				Communicator.Point3.normalFromVectors = function (v1, v2) {
					const plane = Communicator.Plane.createFromPoints(v1, v2, Communicator.Point3.zero());
					return plane.normal;
				};
			}

			if (!Communicator.Model.prototype.getNodesEffectiveVisibility) {
				Communicator.Model.prototype.getNodesEffectiveVisibility = function (uniqueIds) {
					return $q.when(_.map(uniqueIds, function () {
						return true;
					}));
				};
			}

			if (!Communicator.Camera.prototype.getDirection) {
				Communicator.Camera.prototype.getDirection = function () {
					return Communicator.Point3.subtract(this.getTarget(), this.getPosition());
				};
			}

			if (!Communicator.Camera.prototype.getRay) {
				Communicator.Camera.prototype.getRay = function () {
					return new Communicator.Ray(this.getPosition(), this.getDirection());
				};
			}
		})();

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name activateDefaultView
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Activates a pre-defined default view.
		 * @param {Communicator.WebViewer} viewer The target viewer.
		 * @param {Object} viewerSettings An object that contains the viewer configuration for the viewer.
		 * @param {String} viewId The identifier of the defined view.
		 * @param {boolean} suppressTransition Indicates whether smooth camera transitions should be skipped.
		 * @returns {Promise} A promise that is resolved when the view has been set.
		 */
		function activateDefaultView(viewer, viewerSettings, viewId, suppressTransition) {
			return viewer.view.setViewOrientation(Communicator.ViewOrientation[viewId], (viewerSettings.transitions && !suppressTransition) ? 500 : 0).then(function () {
				const cam = viewer.view.getCamera();
				cam.setNearLimit(0.0001);
				if (Math.abs(cam.getUp().z) > 0.001) {
					cam.setUp(new Communicator.Point3(0, 0, 1));
				}
				viewer.view.setCamera(cam);
			});
		}

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name getDefaultViews
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Returns a list of objects that describe available default views.
		 * @param {Object} context Optionally, an object that provides a {@link Communicator.WebViewer} in a
		 *                         `viewer` property and its configuration in a `viewerSettings` property. If this
		 *                         is not set, activation functions will not be available for the views.
		 * @returns {Array} An array of descriptor objects.
		 */
		service.getDefaultViews = function (context) {
			return [
				{
					id: 'Iso',
					title: 'model.viewer.cameraIsoFrontRight',
					iconId: 'iso-front',
					activate: context ? function (suppressTransition) {
						// activateDefaultView(context.viewer(), context.viewerSettings(), 'FrontTopLeft', suppressTransition);
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'Iso', suppressTransition);
					} : null
				}, {
					id: 'ReverseIso',
					title: 'model.viewer.cameraIsoBackLeft',
					iconId: 'iso-back',
					activate: context ? function (suppressTransition) {
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'BackTopRight', suppressTransition);
						// activateCustomDefaultView(context.viewer(), context.viewerSettings(), 'ReverseIso', suppressTransition);
					} : null
				}, {
					id: 'Back',
					title: 'model.viewer.cameraBack',
					iconId: 'back',
					activate: context ? function (suppressTransition) {
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'Back', suppressTransition);
					} : null
				}, {
					id: 'Front',
					title: 'model.viewer.cameraFront',
					iconId: 'front',
					activate: context ? function (suppressTransition) {
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'Front', suppressTransition);
					} : null
				}, {
					id: 'Left',
					title: 'model.viewer.cameraLeft',
					iconId: 'left',
					activate: context ? function (suppressTransition) {
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'Left', suppressTransition);
					} : null
				}, {
					id: 'Right',
					title: 'model.viewer.cameraRight',
					iconId: 'right',
					activate: context ? function (suppressTransition) {
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'Right', suppressTransition);
					} : null
				}, {
					id: 'Top',
					title: 'model.viewer.cameraBottom',
					iconId: 'bottom',
					activate: context ? function (suppressTransition) {
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'Top', suppressTransition);
					} : null
				}, {
					id: 'Bottom',
					title: 'model.viewer.cameraTop',
					iconId: 'top',
					activate: context ? function (suppressTransition) {
						return activateDefaultView(context.viewer(), context.viewerSettings(), 'Bottom', suppressTransition);
					} : null
				}
			];
		};

		/**
		 * @ngdoc method
		 * @name rendererTypeToString
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a render mode identifier to a string.
		 * @param {Communicator.RendererType} mode The render mode to convert.
		 * @param {String} defValue An optional default return value.
		 * @returns {String} The converted value.
		 */
		service.rendererTypeToString = function (mode, defValue) {
			switch (mode) {
				case Communicator.RendererType.Client:
					return 'c';
				case Communicator.RendererType.Server:
					return 's';
				default:
					return ((defValue === 'c') || (defValue === 's')) ? defValue : 'p';
			}
		};

		/**
		 * @ngdoc method
		 * @name stringToRendererType
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a string to a render mode identifier.
		 * @param {String} str The string to convert.
		 * @param {Communicator.RendererType} [defValue] An optional default return value.
		 * @returns {Communicator.RendererType} The converted value.
		 */
		service.stringToRendererType = function (str, defValue) {
			switch (str) {
				case 'c':
					return Communicator.RendererType.Client;
				case 's':
					return Communicator.RendererType.Server;
				default:
					return defValue ? defValue : Communicator.RendererType.Client;
			}
		};

		/**
		 * @ngdoc method
		 * @name streamingModeToString
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a streaming mode identifier to a string.
		 * @param {Communicator.StreamingMode} mode The streaming mode to convert.
		 * @param {String} defValue An optional default return value.
		 * @returns {String} The converted value.
		 */
		service.streamingModeToString = function (mode, defValue) {
			switch (mode) {
				case Communicator.StreamingMode.All:
					return 'f';
				case Communicator.StreamingMode.Interactive:
					return 'l';
				default:
					return ((defValue === 'f') || (defValue === 'l')) ? defValue : 'l';
			}
		};

		/**
		 * @ngdoc method
		 * @name stringToStreamingMode
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a string to a streaming mode identifier.
		 * @param {String} str The string to convert.
		 * @param {Communicator.StreamingMode} defValue An optional default return value.
		 * @returns {Communicator.StreamingMode} The converted value.
		 */
		service.stringToStreamingMode = function (str, defValue) {
			switch (str) {
				case 'f':
					return Communicator.StreamingMode.All;
				case 'l':
					return Communicator.StreamingMode.Interactive;
				default:
					return defValue ? defValue : Communicator.StreamingMode.Interactive;
			}
		};

		/**
		 * @ngdoc method
		 * @name projectionModeToString
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a projection mode identifier to a string.
		 * @param {Communicator.Projection} mode The projection mode to convert.
		 * @param {String} defValue An optional default return value.
		 * @returns {String} The converted value.
		 */
		service.projectionModeToString = function (mode, defValue) {
			switch (mode) {
				case Communicator.Projection.Orthographic:
					return 'o';
				case Communicator.Projection.Perspective:
					return 'p';
				default:
					return ((defValue === 'o') || (defValue === 'p')) ? defValue : 'p';
			}
		};

		/**
		 * @ngdoc method
		 * @name stringToProjectionMode
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a string to a projection mode identifier.
		 * @param {String} str The string to convert.
		 * @param {Communicator.Projection} defValue An optional default return value.
		 * @returns {Communicator.Projection} The converted value.
		 */
		service.stringToProjectionMode = function (str, defValue) {
			switch (str) {
				case 'o':
					return Communicator.Projection.Orthographic;
				case 'p':
					return Communicator.Projection.Perspective;
				default:
					return defValue ? defValue : Communicator.Projection.Perspective;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name drawingModeToString
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a drawing mode identifier to a string.
		 * @param {Communicator.DrawMode} mode The drawing mode to convert.
		 * @param {String} defValue An optional default return value.
		 * @returns {String} The converted value.
		 */
		service.drawingModeToString = function (mode, defValue) {
			switch (mode) {
				case Communicator.DrawMode.HiddenLine:
					return 'h';
				case Communicator.DrawMode.Shaded:
					return 's';
				case Communicator.DrawMode.Wireframe:
					return 'w';
				case Communicator.DrawMode.WireframeOnShaded:
					return 'a';
				default:
					return ((defValue === 'h') || (defValue === 's') || (defValue === 'w') || (defValue === 'a')) ? defValue : 's';
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name stringToDrawingMode
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a string to a drawing mode identifier.
		 * @param {String} str The string to convert.
		 * @param {Communicator.DrawMode} defValue An optional default return value.
		 * @returns {Communicator.DrawMode} The converted value.
		 */
		service.stringToDrawingMode = function (str, defValue) {
			switch (str) {
				case 'h':
					return Communicator.DrawMode.HiddenLine;
				case 's':
					return Communicator.DrawMode.Shaded;
				case 'w':
					return Communicator.DrawMode.Wireframe;
				case 'a':
					return Communicator.DrawMode.WireframeOnShaded;
				default:
					return defValue ? defValue : Communicator.DrawMode.Shaded;
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name antiAliasingModeToString
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts an anti-aliasing mode identifier to a string.
		 * @param {Communicator.AntiAliasingMode} mode The drawing mode to convert.
		 * @param {String} defValue An optional default return value.
		 * @returns {String} The converted value.
		 */
		service.antiAliasingModeToString = function (mode, defValue) {
			switch (mode) {
				case Communicator.AntiAliasingMode.None:
					return '-';
				case Communicator.AntiAliasingMode.SMAA:
					return 'smaa';
				default:
					return ((defValue === '-') || (defValue === 'smaa')) ? defValue : '-';
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name stringToAntiAliasingMode
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts a string to an anti-aliasing mode identifier.
		 * @param {String} str The string to convert.
		 * @param {Communicator.AntiAliasingMode} defValue An optional default return value.
		 * @returns {Communicator.AntiAliasingMode} The converted value.
		 */
		service.stringToAntiAliasingMode = function (str, defValue) {
			switch (str) {
				case '-':
					return Communicator.AntiAliasingMode.None;
				case 'smaa':
					return Communicator.AntiAliasingMode.SMAA;
				default:
					return defValue ? defValue : Communicator.DrawMode.Shaded;
			}
		};

		/**
		 * @ngdoc method
		 * @name rgbColorToViewerColor
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Converts one or more {@link RgbColor} objects into {@link Communicator.Color} obejcts.
		 * @param {RgbColor|Array<RgbColor>} c The color(s) to convert.
		 * @param {Communicator.Color} defValue An optional default return value.
		 * @returns {Communicator.Color|Array<Communicator.Color>} The converted value(s).
		 */
		service.rgbColorToViewerColor = function (c, defValue) {
			if (_.isArray(c)) {
				return _.map(c, function (cItem) {
					return service.rgbColorToViewerColor(cItem, defValue);
				});
			} else {
				if (c) {
					return new Communicator.Color(c.r, c.g, c.b);
				} else {
					return defValue || new Communicator.Color(0, 0, 0);
				}
			}
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name pointsToCoordArray
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Transfers the coordinates from 3D points into an array.
		 * @param {Array<Communicator.Point3>} points An array of points.
		 * @returns {Array<Number>} An array of single coordinate values.
		 */
		service.pointsToCoordArray = function (points) {
			return Array.prototype.concat.apply([], _.map(points, function (pt) {
				return [pt.x, pt.y, pt.z];
			}));
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name getTriangleStripPoints
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description A utility method that expands an array of points defining a triangle strip into an array
		 *              containing all points of each triangle.
		 * @param {Array<Communicator.Point3>} strip The triangle strip.
		 * @returns {Array<Communicator.Point3>} The array of triangle points.
		 */
		service.getTriangleStripPoints = function (strip) {
			if (strip.length < 3) {
				throw new Error('A triangle strip must contain at least three points.');
			}

			const result = [strip[0], strip[2], strip[1]];
			for (let idx = 3; idx < strip.length; idx++) {
				if (idx % 2 === 0) {
					result.push(strip[idx - 1]);
					result.push(strip[idx - 2]);
				} else {
					result.push(strip[idx - 2]);
					result.push(strip[idx - 1]);
				}
				result.push(strip[idx]);
			}
			return result;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc method
		 * @name getTriangleFanPoints
		 * @constructor
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description A utility method that expands an array of points defining a triangle fan into an array
		 *              containing all points of each triangle.
		 * @param {Array<Communicator.Point3>} fan The triangle fan.
		 * @returns {Array<Communicator.Point3>} The array of triangle points.
		 */
		service.getTriangleFanPoints = function (fan) {
			if (fan.length < 3) {
				throw new Error('A triangle fan must contain at least three points.');
			}

			const result = fan.slice(0, 3);
			for (let idx = 3; idx < fan.length; idx++) {
				result.push(fan[0]);
				result.push(fan[idx - 1]);
				result.push(fan[idx]);
			}
			return result;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name getRadialPoints
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Computes points on the boundary of a circle.
		 * @param {String} axis The string `x`, `y`, or `z` to denote the axis around which the points should be
		 *                      aligned.
		 * @param {Number} radius The radius of the circle.
		 * @param {Number} number The number of evenly spaced points.
		 * @returns {Array<Communicator.Point3>} An array of points.
		 * @throws {Error} If `axis` denotes an unsupported value.
		 */
		service.getRadialPoints = function (axis, radius, number) {
			let sinAxis, cosAxis;
			switch (axis) {
				case 'x':
					sinAxis = 'y';
					cosAxis = 'z';
					break;
				case 'y':
					sinAxis = 'x';
					cosAxis = 'z';
					break;
				case 'z':
					sinAxis = 'x';
					cosAxis = 'y';
					break;
				default:
					throw new Error('Unknown axis: ' + axis);
			}

			const result = [];
			const step = Math.PI * 2 / number;

			let pt;
			for (let idx = 0; idx < number; idx++) {
				pt = Communicator.Point3.zero();
				pt[sinAxis] = -Math.sin(idx * step) * radius;
				pt[cosAxis] = Math.cos(idx * step) * radius;
				result[idx] = pt;
			}
			return result;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name extrudePolygonToStrip
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Extrudes a set of points defining a polyline into a custom direction.
		 * @param {Array<Communicator.Point3>} points The corners of the polyline.
		 * @param {Communicator.Point3} direction The direction toward which to extrude.
		 * @param {Boolean} closed Indicates whether the polyline should be closed to form a polygon.
		 * @returns {Array<Communicator.Point3>} The points of the extrusion as a polygon strip.
		 */
		service.extrudePolygonToStrip = function (points, direction, closed) {
			const result = [];
			points.forEach(function (pt) {
				result.push(pt.copy().add(direction));
				result.push(pt.copy());
			});
			if (closed) {
				result.push(points[0].copy().add(direction));
				result.push(points[0].copy());
			}
			return result;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name createCylinderFaces
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Creates points that form faces of a closed cylinder extending along the Z axis, starting at
		 *              the origin.
		 * @param {Number} radius The radius of the cylinder.
		 * @param {Number|Object|Array} length The length of the cylinder, or an object with a `from` and a `to`
		 *                               property indicating the extent of the cylinder, or an array whose elements
		 *                               indicate the extent of the cylinder.
		 * @returns {Array<Communicator.Point3>} The points of the cylinder faces.
		 */
		service.createCylinderFaces = function (radius, length) {
			let cylinderFrom, cylinderTo;
			if (angular.isArray(length)) {
				cylinderFrom = Math.max.apply(null, length);
				cylinderTo = Math.min.apply(null, length);
			} else if (angular.isObject(length)) {
				cylinderFrom = Math.max(length.from, length.to);
				cylinderTo = Math.min(length.from, length.to);
			} else {
				cylinderFrom = length;
				cylinderTo = 0;
			}

			const crossSectionPoints = service.getRadialPoints('z', radius, 32);
			const sideStrip = service.extrudePolygonToStrip(_.map(crossSectionPoints, function (pt) {
				return new Communicator.Point3(pt.x, pt.y, cylinderFrom);
			}), new Communicator.Point3(0, 0, -(cylinderFrom - cylinderTo)), true);

			const topFan = [new Communicator.Point3(0, 0, cylinderFrom)].concat(_.map(crossSectionPoints, function (pt) {
				return new Communicator.Point3(pt.x, pt.y, cylinderFrom);
			}), [new Communicator.Point3(crossSectionPoints[0].x, crossSectionPoints[0].y, cylinderFrom)]);

			const bottomFan = _.map(topFan, function (pt) {
				return new Communicator.Point3(pt.x, pt.y, cylinderTo);
			});
			bottomFan.reverse();

			return service.getTriangleStripPoints(sideStrip).concat(
				service.getTriangleFanPoints(topFan),
				service.getTriangleFanPoints(bottomFan)
			);
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name createMatrix
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Concatenates any number of transformation matrices.
		 * @param {...Communicator.Matrix} matrices The matrices to concatenate, in their desired order of application.
		 * @returns {Communicator.Matrix} A transformation matrix that combines all operations described by the provided matrices.
		 */
		service.createMatrix = function (...matrices) {
			let result = new Communicator.Matrix();
			for (let i = 0; i < matrices.length; i++) {
				result = Communicator.Matrix.multiply(result, matrices[i]);
			}
			return result;
		};

		/**
		 * @ngdoc function
		 * @name addDefaultShortcuts
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Adds default keyboard shortcut definitions to a given viewer.
		 * @param {Object} viewerContainer An object that contains the destination viewer in its `viewer` property
		 *                                 as well as the active viewer settings in its `viewerSettings` property.
		 */
		service.addDefaultShortcuts = function (viewerContainer) {
			viewerContainer.viewer[modelViewerShortcutService.getShortcutPropertyName()] = [new modelViewerShortcutService.Shortcut(keyCodes.KEY_A, true, false, false, function () {
				modelViewerCompositeModelObjectSelectionService.selectAll(modelViewerSelectabilityService.getSelectabilityInfo(viewerContainer.viewer));
			})];
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name projectVectorToPlane
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Projects an arbitrary vector into a plane.
		 * @param {Communicator.Point3} vector The vector.
		 * @param {Communicator.Plane} plane The plane.
		 * @returns {Communicator.Point3} The projected vector.
		 */
		service.projectVectorToPlane = function (vector, plane) {
			const testPlane = Communicator.Plane.createFromPointAndNormal(Communicator.Point3.zero(), plane.normal);
			let ray = new Communicator.Ray(vector, plane.normal);
			const hitPt = Communicator.Point3.zero();
			if (!testPlane.intersectsRay(ray, hitPt)) {
				ray = new Communicator.Ray(vector, new Communicator.Point3(-plane.normal.x, -plane.normal.y, -plane.normal.z));
				if (!testPlane.intersectsRay(ray, hitPt)) {
					return Communicator.Point3.zero();
				}
			}
			return hitPt;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name decomposeVector
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Decomposes a vector into a linear combination of two other vectors.
		 * @param {Communicator.Point3} vector The composed vector.
		 * @param {Communicator.Point3} xVector The X vector.
		 * @param {Communicator.Point3} yVector The Y vector.
		 * @returns {Object} An object with the X and Y coefficients in an `x` and `y` property.
		 */
		service.decomposeVector = function (vector, xVector, yVector) {
			const helper = Communicator.Point3.cross(xVector, yVector).normalize();
			const factors = math.lusolve([[xVector.x, yVector.x, helper.x], [xVector.y, yVector.y, helper.y], [xVector.z, yVector.z, helper.z]], [vector.x, vector.y, vector.z]);
			return {
				x: factors[0][0],
				y: factors[1][0]
			};
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name getCenter2
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Computes the geometric center of two two-dimensional points.
		 * @param {Communicator.Point2} p1 The first point.
		 * @param {Communicator.Point2} p2 The secondp oint.
		 * @returns {Communicator.Point2} The central point.
		 */
		service.getCenter2 = function (p1, p2) {
			return new Communicator.Point2((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name getHelperGeometryRoot
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Returns the ID of a node that should be used as the root for any helper geometry in the
		 *              scene. If such a node does not exist yet, it will be created by the function.
		 * @param {Communicator.WebViewer} viewer The web viewer.
		 * @returns {Number} The root node ID for helper geometry.
		 */
		service.getHelperGeometryRoot = function (viewer) {
			let result = viewer.rib$helperGeometryRootId;
			if (!_.isNumber(result)) {
				const mdl = viewer.model;
				result = viewer.rib$helperGeometryRootId = mdl.createNode(mdl.getAbsoluteRootNode(), 'Helper Geometry');
			}
			return result;
		};

		// noinspection JSValidateJSDoc
		/**
		 * @ngdoc function
		 * @name getViewDirection
		 * @function
		 * @methodOf modelViewerHoopsUtilitiesService
		 * @description Computes the gaze direction vector of a given camera.
		 * @param {Communicator.Camera} camera The camera.
		 * @returns {Communicator.Point3} The non-normalized vector pointing in the gaze direction of the camera.
		 */
		service.getViewDirection = function (camera) {
			const pos = camera.getPosition();
			const trg = camera.getTarget();
			return trg.subtract(pos);
		};

		service.setMarkerShapeId = function (id) {
			markerShapeId = id;
		};

		service.getMarkerShapeId = function () {
			return markerShapeId;
		};

		return service;
	}
})(angular);
