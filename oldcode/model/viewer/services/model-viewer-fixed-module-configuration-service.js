/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerFixedModuleConfigurationService
	 * @function
	 *
	 * @description Provides static module-specific settings.
	 */
	angular.module('model.viewer').factory('modelViewerFixedModuleConfigurationService', ['mainViewService',
		'modelViewerModelSelectionService',
		function (mainViewService, modelViewerModelSelectionService) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name getModelSelectionSource
			 * @function
			 * @methodOf modelViewerModelSelectionService
			 * @description Retrieves the model selection source for the active module.
			 * @returns {String} The identifier of the model selection source.
			 */
			service.getModelSelectionSource = function () {
				switch (mainViewService.getCurrentModuleName()) {
					case 'project.main':
						return 'modelDataService';
					case 'model.changeset':
					case 'model.change':
						return 'changeSet';
					default:
						return 'pinnedModel';
				}
			};

			/**
			 * @ngdoc function
			 * @name updateModelSelectionSource
			 * @function
			 * @methodOf modelViewerModelSelectionService
			 * @description Retrieves the model selection source for the active module and activates it in the model
			 *              selection service.
			 * @returns {String} The identifier of the model selection source.
			 */
			service.updateModelSelectionSource = function () {
				var result = service.getModelSelectionSource();
				modelViewerModelSelectionService.setItemSource(result);
				return result;
			};

			return service;
		}]);
})(angular);
