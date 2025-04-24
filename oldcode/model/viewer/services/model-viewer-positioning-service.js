/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerPositioningService
	 * @function
	 *
	 * @description Manages a mode in which users can pick positions in three-dimensional space in 3D viewers.
	 */
	angular.module('model.viewer').factory('modelViewerPositioningService', ['$q', 'modelViewerViewerRegistryService',
		'modelViewerHoopsOperatorPositioningService', 'modelViewerHoopsUtilitiesService',
		function ($q, modelViewerViewerRegistryService, modelViewerHoopsOperatorPositioningService, modelViewerHoopsUtilitiesService) {
			var service = {};

			var state = {
				wrapper: null,
				result: null
			};

			function positionPicked(posInfo) {
				modelViewerHoopsOperatorPositioningService.unregisterPositionPicked(positionPicked);
				state.wrapper.unsetTemporaryManipulationOperator();
				state.wrapper.detach();

				if (posInfo) {
					state.result.resolve(posInfo);
				} else {
					state.result.reject('Position picking operation cancelled.');
				}
			}

			/**
			 * @ngdoc method
			 * @name pickPosition
			 * @method
			 * @methodOf modelViewerPositioningService
			 * @description Switches all active viewers into position picking mode.
			 * @param {Object} preselected Optionally, an object storing a position and a camera position that is used
			 *                             for the initial selection.
			 * @returns {Promise<Object>} A promise that is resolved when the user has picked a position. The returned
			 *                            object will have two properties, `pos` and `campos`, indicating x, y, and z
			 *                            coordinates for the picked position and a corresponding camera position that
			 *                            allows a view on the picked position. If the user aborts the position picking
			 *                            operation, the promise will be rejected.
			 */
			service.pickPosition = function (preselected) {
				state.wrapper = modelViewerViewerRegistryService.getViewerWrapper();
				state.wrapper.setTemporaryManipulationOperator('position', preselected);

				modelViewerHoopsOperatorPositioningService.registerPositionPicked(positionPicked);

				state.result = $q.defer();
				return state.result.promise;
			};

			service.detachPickPosition = function () {
				if (state.wrapper.detach) {
					positionPicked();
				}
			};

			service.setMarkerShapeId = function (shapeId) {
				//state.markerShapeId = shapeId;
				modelViewerHoopsUtilitiesService.setMarkerShapeId(shapeId);
			};
			return service;
		}]);
})(angular);
