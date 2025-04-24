/*
 * $Id: project-main-project-selection-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name project.main.projectMainProjectSelectionService
	 * @function
	 * @requires $injector, PlatformMessenger, _
	 *
	 * @description This service watches the project selection in a project selection source.
	 */
	angular.module('project.main').factory('projectMainProjectSelectionService', ['$injector', 'PlatformMessenger', '_',
		function ($injector, PlatformMessenger, _) {
			var service = {};

			var currentItemSource = null;
			var currentItemSourceData = null;
			var currentProjectInfo = null;

			/**
			 * @ngdoc function
			 * @name projectSelectionChanged
			 * @function
			 * @methodOf projectMainProjectSelectionService
			 * @description Processes a change of the selected project.
			 */
			function projectSelectionChanged() {
				service.onSelectedProjectChanged.fire();
			}

			/**
			 * @ngdoc function
			 * @name attachToItemSource
			 * @function
			 * @methodOf projectMainProjectSelectionService
			 * @description Establishes a connection to the current item source.
			 * @throws {Error} If the current item source identifier is not supported.
			 */
			function attachToItemSource() {
				switch (currentItemSource) {
					case 'projectDataService':
						currentItemSourceData = {
							service: $injector.get('projectMainService'),
							updateFunc: function () {
								var selProject = currentItemSourceData.service.getSelected();
								if (selProject) {
									currentProjectInfo = {
										id: selProject.Id
									};
								} else {
									currentProjectInfo = null;
								}
								projectSelectionChanged();
							}
						};
						currentItemSourceData.service.registerSelectionChanged(currentItemSourceData.updateFunc);
						currentItemSourceData.detach = function() {
							currentItemSourceData.service.unregisterSelectionChanged(currentItemSourceData.updateFunc);
						};
						break;
					case 'pinnedProject':
						currentItemSourceData = {
							service: $injector.get('cloudDesktopPinningContextService'),
							updateFunc: function () {
								var projectId = service.getSelectedProjectId();
								if (projectId) {
									currentProjectInfo = {
										id: projectId
									};
								} else {
									currentProjectInfo = null;
								}
								projectSelectionChanged();
							}
						};
						currentItemSourceData.service.onSetPinningContext.register(currentItemSourceData.updateFunc);
						currentItemSourceData.service.onClearPinningContext.register(currentItemSourceData.updateFunc);
						currentItemSourceData.detach = function() {
							currentItemSourceData.service.onSetPinningContext.unregister(currentItemSourceData.updateFunc);
							currentItemSourceData.service.onClearPinningContext.unregister(currentItemSourceData.updateFunc);
						};
						break;
					default:
						currentItemSource = null;
						currentItemSourceData = null;
						throw new Error('Unsupported item source: ' + currentItemSource);
				}

				currentItemSourceData.updateFunc();
			}

			/**
			 * @ngdoc function
			 * @name detachFromItemSource
			 * @function
			 * @methodOf projectMainProjectSelectionService
			 * @description Removes any connection to the current item source.
			 */
			function detachFromItemSource() {
				currentItemSourceData.detach();
				currentItemSourceData = null;
			}

			/**
			 * @ngdoc function
			 * @name setItemSource
			 * @function
			 * @methodOf projectMainProjectSelectionService
			 * @description Switches to another item source.
			 * @param {String} itemSource The identifier of the new item source.
			 * @throws {Error} If `itemSource` is not supported.
			 */
			service.setItemSource = function(itemSource) {
				var previouslySelectedProjectId = service.getSelectedProjectId();

				if (itemSource === currentItemSource) {
					return;
				}

				if (currentItemSource) {
					detachFromItemSource();
				}

				currentItemSource = itemSource;

				if (currentItemSource) {
					attachToItemSource();
				}

				if (previouslySelectedProjectId !== service.getSelectedProjectId()) {
					projectSelectionChanged();
				}
			};

			/**
			 * @ngdoc function
			 * @name getItemSource
			 * @function
			 * @methodOf projectMainProjectSelectionService
			 * @description Returns the identifier of the current item source.
			 * @returns {String} The identifier of the current item source.
			 */
			service.getItemSource = function() {
				return currentItemSource;
			};

			/**
			 * @ngdoc function
			 * @name getSelectedProjectId
			 * @function
			 * @methodOf projectMainProjectSelectionService
			 * @description Returns the ID of the selected model.
			 * @returns {Number} The ID of the selected model, or `null` if no model is selected.
			 */
			service.getSelectedProjectId = function() {
				switch (currentItemSource) {
					case 'projectDataService':
						return (function() {
							var selItem = currentItemSourceData.service.getSelected();
							if (selItem) {
								return selItem.Id;
							} else {
								return null;
							}
						})();
					case 'pinnedProject':
						return (function() {
							var pinningCtx = currentItemSourceData.service.getContext();
							if (_.isArray(pinningCtx)) {
								var selProject = _.find(pinningCtx, function(item) {
									return item.token === 'project.main';
								});
								if (selProject) {
									return selProject.id || selProject.Id;
								} else {
									return null;
								}
							} else {
								return null;
							}
						})();
					default:
						return null;
				}
			};

			service.onSelectedProjectChanged = new PlatformMessenger();

			return service;
		}]);
})();