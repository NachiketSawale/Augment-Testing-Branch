/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerDragdropService
	 * @function
	 *
	 * @description Centrally manages drag-drop functionality related to the 3D viewer.
	 */
	angular.module('model.viewer').factory('modelViewerDragdropService', ['$q', 'PlatformMessenger',
		'modelViewerModelSelectionService', 'platformDragdropService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerHoopsOperatorManipulationService',
		function ($q, PlatformMessenger, modelViewerModelSelectionService, platformDragdropService,
		          modelViewerCompositeModelObjectSelectionService, modelViewerHoopsOperatorManipulationService) {
			var service = {};

			/**
			 * @ngdoc method
			 * @name DragdropAdapter
			 * @constructor
			 * @methodOf DragdropAdapter
			 * @description Initializes a new dragdrop adapter. The dragdrop adapter should be added to the dragged data
			 *              object by all containers from which data can be dragged onto a 3D viewer.
			 */
			function DragdropAdapter() {
			}

			service.DragdropAdapter = DragdropAdapter;

			/**
			 * @ngdoc method
			 * @name canDrop
			 * @constructor
			 * @methodOf DragdropAdapter
			 * @description Checks whether the dragged data can be dropped onto the viewer. The default implementation
			 *              will return `true` unless no model objects are selected.
			 * @param {Object} info The object passed to the {@see platformDragdropService.DragdropTarget.canDrop}
			 *                      method.
			 * @returns {Boolean} A value that indicates whether the data being dragged can be dropped onto the viewer.
			 */
			DragdropAdapter.prototype.canDrop = function () {
				return !modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().isEmpty();
			};

			/**
			 * @ngdoc method
			 * @name drop
			 * @constructor
			 * @methodOf DragdropAdapter
			 * @description Reacts to dropping of the dragged data onto the 3D viewer.
			 * @param {Object} info The object passed to the {@see platformDragdropService.DragdropTarget.canDrop}
			 *                      method.
			 */
			DragdropAdapter.prototype.drop = function () {
			};

			var state = {
				dropMessage: ''
			};

			/**
			 * @ngdoc method
			 * @name setDropMessage
			 * @constructor
			 * @methodOf DragdropAdapter
			 * @description Sets a message that is displayed on all 3D viewers that can serve as a drop target.
			 * @param {String} message The new message.
			 */
			service.setDropMessage = function (message) {
				var newMessage = angular.isString(message) ? message : '';
				if (state.dropMessage !== newMessage) {
					state.dropMessage = newMessage;
					fireMessageChanged();
				}
			};

			var onMessageChanged = new PlatformMessenger();

			/**
			 * @ngdoc method
			 * @name registerMessageChanged
			 * @constructor
			 * @methodOf DragdropAdapter
			 * @description Registers an event handler that is invoked when the message for 3D viewers has changed.
			 * @param {Function} handler The handler to register.
			 */
			service.registerMessageChanged = function (handler) {
				onMessageChanged.register(handler);
			};

			/**
			 * @ngdoc method
			 * @name unregisterMessageChanged
			 * @constructor
			 * @methodOf DragdropAdapter
			 * @description Unregisters an event handler that is invoked when the message for 3D viewers has changed.
			 * @param {Function} handler The handler to register.
			 */
			service.unregisterMessageChanged = function (handler) {
				onMessageChanged.unregister(handler);
			};

			/**
			 * @ngdoc method
			 * @name fireMessageChanged
			 * @constructor
			 * @methodOf DragdropAdapter
			 * @description Invokes all handlers registered with {@see registerMessageChanged}.
			 */
			function fireMessageChanged() {
				onMessageChanged.fire({
					message: state.dropMessage
				});
			}

			platformDragdropService.registerDragStateChanged(function (info) {
				if (!info.isDragging) {
					service.setDropMessage('');
				}
			});

			service.paste = function () {
				var deferred = $q.defer();
				if (!modelViewerModelSelectionService.getSelectedModelId()) {
					return $q.reject(false);
				}

				//prepare create parameters
				var createParam = {
					modelId: modelViewerModelSelectionService.getSelectedModelId(),
					includedObjectIds: modelViewerHoopsOperatorManipulationService.getDraggedObjectsIds().objectIds,
					viewRange: null
				};

				deferred.resolve(createParam);
				return deferred.promise;
			};

			return service;
		}]);
})(angular);
