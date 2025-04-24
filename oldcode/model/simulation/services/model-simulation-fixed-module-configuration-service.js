/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelSimulationFixedModuleConfigurationService
	 * @function
	 *
	 * @description Provides static module-specific settings.
	 */
	angular.module('model.simulation').factory('modelSimulationFixedModuleConfigurationService',
		modelSimulationFixedModuleConfigurationService);

	modelSimulationFixedModuleConfigurationService.$inject = ['projectMainFixedModuleConfigurationService'];

	function modelSimulationFixedModuleConfigurationService(projectMainFixedModuleConfigurationService) {
		return projectMainFixedModuleConfigurationService;
	}
})(angular);
