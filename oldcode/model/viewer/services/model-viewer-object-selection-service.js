/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerObjectSelectionService
	 * @function
	 *
	 * @description Stores and manages a set of selected objects in the currently loaded model,
	 *              for models stored in the object hierarchy format. Internally, the set of
	 *              selected objects is stored as a set of object IDs. There is no guarantee
	 *              that any or all of these object IDs match at least one mesh ID. Hence, the
	 *              set of selected objects in a model may be non-empty, even though no 3D
	 *              objects are selected.
	 */
	angular.module('model.viewer').factory('modelViewerObjectSelectionService', ['_', 'PlatformMessenger',
		'modelViewerModelSelectionService', 'modelViewerObjectIdMapService', 'modelViewerObjectTreeService',
		'modelViewerCompositeModelObjectSelectionService', '$log',
		function (_, PlatformMessenger, modelViewerModelSelectionService, modelViewerObjectIdMapService,
		          modelViewerObjectTreeService, modelViewerCompositeModelObjectSelectionService, $log) {
			var service = {};

			function printCompositeModelWarning() {
				var msg = 'DEPRECATION WARNING: A function from modelViewerObjectSelectionService was called. This service does not support composite models. Calls should be replaced with analogous calls to the modelViewerCompositeModelObjectSelectionService. Note the changed interface: Instead of arrays of object IDs or object ID maps, the modelViewerCompositeModelObjectSelectionService uses objects containing one such array or map per sub-model.';
				$log.warn(msg);
			}

			/**
			 * @ngdoc function
			 * @name registerSelectionChanged
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Registers a function that gets called when the set of
			 *              selected objects has changed.
			 * @param {Function} handler The function to register.
			 */
			service.registerSelectionChanged = function (handler) {
				printCompositeModelWarning();

				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(handler);
			};

			/**
			 * @ngdoc function
			 * @name unregisterSelectionChanged
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Unregisters a function registered with
			 *              `registerSelectionChanged`.
			 * @param {Function} handler The function to unregister.
			 */
			service.unregisterSelectionChanged = function (handler) {
				printCompositeModelWarning();

				modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(handler);
			};

			/**
			 * @ngdoc function
			 * @name getSelectedObjectIds
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Returns the selected object IDs in an array.
			 * @returns {Array<Number>} The selected object IDs. For any node whose ID
			 *                          is included, all nodes in the node's subtree
			 *                          are considered selected, as well.
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.getSelectedObjectIds = function () {
				printCompositeModelWarning();

				var result = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
				var props = Object.keys(result);
				if (props.length > 0) {
					return result[props[0]];
				} else {
					return [];
				}
			};

			/**
			 * @ngdoc function
			 * @name getExpandedSelectedObjectIdMap
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Returns a map of all selected object IDs.
			 * @returns {ObjectIdMap} The selected object IDs. This map also includes
			 *                        all nodes whose parent nodes are marked as
			 *                        selected.
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.getExpandedSelectedObjectIdMap = function () {
				printCompositeModelWarning();

				var result = modelViewerCompositeModelObjectSelectionService.getExpandedSelectedObjectIdMaps();
				var props = Object.keys(result);
				if (props.length > 0) {
					return result[props[0]];
				} else {
					return new modelViewerObjectIdMapService.ObjectIdMap();
				}
			};

			/**
			 * @ngdoc function
			 * @name getExpandedSelectedObjectIds
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Returns an array of all selected object IDs.
			 * @returns {Array<Number>} The selected object IDs. This map also includes
			 *                          all nodes whose parent nodes are marked as
			 *                          selected.
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.getExpandedSelectedObjectIds = function () {
				printCompositeModelWarning();

				var result = modelViewerCompositeModelObjectSelectionService.getExpandedSelectedObjectIds();
				var props = Object.keys(result);
				if (props.length > 0) {
					return result[props[0]];
				} else {
					return [];
				}
			};

			/**
			 * @ngdoc function
			 * @name getSelectedMeshIds
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Returns the selected mesh IDs in an array.
			 * @returns {Array<Number>} The selected mesh IDs.
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.getSelectedMeshIds = function () {
				printCompositeModelWarning();

				var result = modelViewerCompositeModelObjectSelectionService.getSelectedMeshIds();
				var props = Object.keys(result);
				if (props.length > 0) {
					return result[props[0]];
				} else {
					return [];
				}
			};

			/**
			 * @ngdoc function
			 * @name setSelectedObjectIds
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Sets the set of selected object IDs.
			 * @param {Array<Number>|ObjectIdMap} objectIds The new set of selected
			 *                                              object IDs.
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.setSelectedObjectIds = function (objectIds) {
				printCompositeModelWarning();

				var useArrays = angular.isArray(objectIds);
				var newSel = {};
				var isFirst = true;
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					if (isFirst) {
						newSel[subModelId] = objectIds;
						isFirst = false;
					} else {
						newSel[subModelId] = useArrays ? [] : new modelViewerObjectIdMapService.ObjectIdMap();
					}
				});
				modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(newSel);
			};

			/**
			 * @ngdoc function
			 * @name setSelectedMeshIds
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Sets the set of selected mesh IDs.
			 * @param {Array<Number>|ObjectIdMap} meshIds The new set of selected
			 *                                            mesh IDs.
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.setSelectedMeshIds = function (meshIds) {
				printCompositeModelWarning();

				var useArrays = angular.isArray(meshIds);
				var newSel = {};
				var isFirst = true;
				modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
					if (isFirst) {
						newSel[subModelId] = meshIds;
						isFirst = false;
					} else {
						newSel[subModelId] = useArrays ? [] : new modelViewerObjectIdMapService.ObjectIdMap();
					}
				});
				modelViewerCompositeModelObjectSelectionService.setSelectedMeshIds(newSel);
			};

			/**
			 * @ngdoc function
			 * @name selectAll
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Selects all objects in the loaded model.
			 * @param {String} filterId Optionally, the ID of a filter. If supplied,
			 *                          the selection will be restricted to any objects
			 *                          that are in an included filter state for the
			 *                          given filter.
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.selectAll = function (filterId) {
				printCompositeModelWarning();

				modelViewerCompositeModelObjectSelectionService.selectAll(filterId);
			};

			/**
			 * @ngdoc function
			 * @name toggleSelection
			 * @function
			 * @methodOf modelViewerObjectSelectionService
			 * @description Toggles the selection for all objects in the current model.
			 * @param {String} filterId
			 * @throws {Error} A model is loaded that is stored with a flat object
			 *                 list.
			 */
			service.toggleSelection = function (filterId) {
				printCompositeModelWarning();

				modelViewerCompositeModelObjectSelectionService.toggleSelection(filterId);
			};

			return service;
		}]);
})(angular);
