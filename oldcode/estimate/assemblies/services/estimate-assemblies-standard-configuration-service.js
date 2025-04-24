/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';

	// TODO: make ngdoc
	angular.module(moduleName).factory('estimateAssembliesStandardConfigurationService',
		['estimateAssembliesStructureUIConfigurationServiceFactory',
			function (estimateAssembliesStructureUIConfigurationServiceFactory) {

				return  estimateAssembliesStructureUIConfigurationServiceFactory.createEstAssembliesConfigService();
			}
		]);
})();
