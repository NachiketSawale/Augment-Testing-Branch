/*
 * $Id: platform-datavis-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform.platformDatavisService
	 * @function
	 * @requires PlatformMessenger, $timeout
	 *
	 * @description Provides basic datatypes for managing data visualizations.
	 */
	angular.module('platform').factory('platformDatavisService', ['PlatformMessenger', '$timeout',
		function (PlatformMessenger, $timeout) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name DataVisualizationLink
			 * @function
			 * @methodOf DataVisualizationLink
			 * @description Initializes a new instance of the `DataVisualizationLink` class that serves as a controller
			 *              link to update a data visualization.
			 */
			function DataVisualizationLink() {
				this.visFactory = null;
				this.data = null;
				this._onStateUpdated = new PlatformMessenger();
			}

			service.DataVisualizationLink = DataVisualizationLink;

			/**
			 * @ngdoc function
			 * @name setVisualization
			 * @function
			 * @methodOf DataVisualizationLink
			 * @description Instantiates a specific data visualization and loads some initial data.
			 * @param {Function} visFactory A factory function that creates the actual {@see DataVisualization}. It
			 *                              will be invoked with two arguments, the current {@see DataVisualizationLink}
			 *                              instance, as well as the D3.js SVG parent element.
			 * @param {Object} initialData An object whose contents will be processed by the data visualization as the
			 *                             data to display in its initial state.
			 */
			DataVisualizationLink.prototype.setVisualization = function (visFactory, initialData) {
				this.visFactory = visFactory;
				this.data = initialData;
				this._onStateUpdated.fire({
					visFactory: visFactory,
					data: initialData
				});
			};

			/**
			 * @ngdoc function
			 * @name setData
			 * @function
			 * @methodOf DataVisualizationLink
			 * @description Updates the data displayed in the visualization.
			 * @param {Object} data The data that will be passed on to the visualization.
			 */
			DataVisualizationLink.prototype.setData = function (data) {
				this.data = data;
				this._onStateUpdated.fire({
					data: data
				});
			};

			/**
			 * @ngdoc function
			 * @name registerStateUpdated
			 * @function
			 * @methodOf DataVisualizationLink
			 * @description Registers an event handler that is invoked when the state of the visualization link has
			 *              changed. This is the case when the visualization or the data has changed.
			 * @param {Function} handler The event handler.
			 */
			DataVisualizationLink.prototype.registerStateUpdated = function (handler) {
				this._onStateUpdated.register(handler);
			};

			/**
			 * @ngdoc function
			 * @name unregisterStateUpdated
			 * @function
			 * @methodOf DataVisualizationLink
			 * @description Unregisters an event handler added with {@see DataVisualizationLink.registerStateUpdated}.
			 * @param {Function} handler The event handler.
			 */
			DataVisualizationLink.prototype.unregisterStateUpdated = function (handler) {
				this._onStateUpdated.unregister(handler);
			};

			/**
			 * @ngdoc function
			 * @name DataVisualization
			 * @function
			 * @methodOf DataVisualization
			 * @description Initializes a new data visualization. This class serves as a base for actual data
			 *              visualization implementations.
			 * @param {DataVisualizationLink} dataVisualizationLink A link object that provides the data for the
			 *                                                      visualization.
			 * @param {Object} visParent A D3 selection that represents the parent element within which to draw the
			 *                           visualization.
			 */
			function DataVisualization(dataVisualizationLink, visParent) {
				this.dataProvider = dataVisualizationLink;
				this.visParent = visParent;
			}

			service.DataVisualization = DataVisualization;

			/**
			 * @ngdoc function
			 * @name updateData
			 * @function
			 * @methodOf DataVisualization
			 * @description Updates the visualization to reflect updated data.
			 * @param {Object} data The data to visualize.
			 */
			DataVisualization.prototype.updateData = function (data) {
				this.data = data;
				this.drawIfReady();
			};

			/**
			 * @ngdoc function
			 * @name updateSize
			 * @function
			 * @methodOf DataVisualization
			 * @description Updates the total size of the visualization.
			 * @param {Number} width The width in pixels.
			 * @param {Number} height The height in pixels.
			 */
			DataVisualization.prototype.updateSize = function (width, height) {
				this.width = width;
				this.height = height;
				this.drawIfReady();
			};

			/**
			 * @ngdoc function
			 * @name drawIfReady
			 * @function
			 * @methodOf DataVisualization
			 * @description Draws the visualization if all prerequisites are met.
			 */
			DataVisualization.prototype.drawIfReady = function () {
				if (this.data && this.width && this.height) {
					this.draw({
						data: this.data,
						width: this.width,
						height: this.height,
						visParent: this.visParent
					});
				}
			};

			/**
			 * @ngdoc function
			 * @name draw
			 * @function
			 * @methodOf DataVisualization
			 * @description Draws the visualization. This method needs to be overridden by derived classes.
			 * @param {Object} info An object that contains `data`, `width`, and `height` properties.
			 */
			DataVisualization.prototype.draw = function () {
			};

			/**
			 * @ngdoc function
			 * @name destroy
			 * @function
			 * @methodOf DataVisualization
			 * @description Releases all resources occupied by the visualization. The default implementation will
			 *              remove all SVG `<g>` elements that are descendants of the drawing area provided to the
			 *              data visualization object.
			 */
			DataVisualization.prototype.destroy = function () {
				this.visParent.select('g').remove();
			};

			/**
			 * @ngdoc function
			 * @name createDataVisualization
			 * @function
			 * @methodOf platformDatavisService
			 * @description Initializes a data visualization for a given SVG parent element.
			 * @param {DataVisualizationLink} link An object that supplies the visualization with data after
			 *                                     determining the visualization type to use.
			 * @param {Object} visParent A D3.js selection containing the parent element for the visualization.
			 * @return {Object}
			 */
			service.createDataVisualization = function (link, visParent) {
				var result = {
					vis: null,
					visFactory: null,
					destroy: function () {
						link.unregisterStateUpdated(this.updateState);
						if (this.vis) {
							this.vis.destroy();
						}
					},
					updateSize: function (width, height) {
						this.width = width;
						this.height = height;
						if (this.vis) {
							this.vis.updateSize(width, height);
						}
					}
				};

				result.updateState = function (linkState) {
					if (angular.isDefined(linkState.visFactory) && (result.visFactory !== linkState.visFactory)) {
						if (result.vis) {
							result.vis.destroy();
						}

						result.visFactory = linkState.visFactory;
						if (angular.isFunction(linkState.visFactory)) {
							result.vis = linkState.visFactory(link, visParent);
						} else {
							result.vis = null;
						}
					}

					if (result.vis) {
						if (result.width && result.height) {
							result.vis.updateSize(result.width, result.height);
						}
						result.vis.updateData(linkState.data);
					}
				};

				link.registerStateUpdated(result.updateState);
				result.updateState({
					visFactory: link.visFactory,
					data: link.data
				});

				return result;
			};

			/**
			 * @ngdoc function
			 * @name initDatavisContainerController
			 * @function
			 * @methodOf platformDatavisService
			 * @description Initializes a controller for a plain data visualization container.
			 * @param {Object} scope The controller scope.
			 * @param {Function} visFactory A factory function that creates a {@see DataVisualization} object.
			 * @param {Object} visData The initial data to visualize.
			 * @returns {DataVisualizationLink} A link object that can be used to update the visualization.
			 */
			service.initDatavisContainerController = function (scope, visFactory, visData) {
				function updateSize() {
					var size = scope.getCurrentDimensions();
					scope.visWidth = size.width;
					scope.visHeight = size.height;
				}

				scope.onContentResized(updateSize);
				$timeout(updateSize);

				scope.visLink = new service.DataVisualizationLink();
				scope.visLink.setVisualization(visFactory, visData);

				return scope.visLink;
			};

			return service;
		}]);
})();