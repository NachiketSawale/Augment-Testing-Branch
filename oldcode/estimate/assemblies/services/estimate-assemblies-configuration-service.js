/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';

	// TODO: make ngdoc
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('estimateAssembliesConfigurationService',
		['estimateAssembliesUIConfigurationServiceFactory',
			function (estimateAssembliesUIConfigurationServiceFactory ) {

				return estimateAssembliesUIConfigurationServiceFactory.createEstAssembliesListUIConfigService();

			}
		]);
})();
