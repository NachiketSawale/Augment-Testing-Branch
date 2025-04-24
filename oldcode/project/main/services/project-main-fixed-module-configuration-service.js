/*
 * $Id: project-main-fixed-module-configuration-service.js 537000 2019-03-12 11:58:13Z haagf $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name project.main.projectMainFixedModuleConfigurationService
	 * @function
	 * @requires mainViewService, projectMainProjectSelectionService
	 *
	 * @description Provides static module-specific settings.
	 */
	angular.module('project.main').factory('projectMainFixedModuleConfigurationService', ['mainViewService',
		'projectMainProjectSelectionService',
		function (mainViewService, projectMainProjectSelectionService) {
			var service = {};

			/**
			 * @ngdoc function
			 * @name getProjectSelectionSource
			 * @function
			 * @methodOf projectMainFixedModuleConfigurationService
			 * @description Retrieves the project selection source for the active module.
			 * @returns {String} The identifier of the project selection source.
			 */
			service.getProjectSelectionSource = function () {
				switch (mainViewService.getCurrentModuleName()) {
					case 'project.main':
						return 'projectDataService';
					default:
						return 'pinnedProject';
				}
			};

			/**
			 * @ngdoc function
			 * @name updateProjectSelectionSource
			 * @function
			 * @methodOf projectMainFixedModuleConfigurationService
			 * @description Retrieves the project selection source for the active module and activates it in the project
			 *              selection service.
			 * @returns {String} The identifier of the project selection source.
			 */
			service.updateProjectSelectionSource = function () {
				var result = service.getProjectSelectionSource();
				projectMainProjectSelectionService.setItemSource(result);
				return result;
			};

			return service;
		}]);
})();