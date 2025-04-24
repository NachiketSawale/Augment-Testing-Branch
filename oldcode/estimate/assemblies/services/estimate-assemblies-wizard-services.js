/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesWizardService',
		['estimateAssembliesWizardServiceFactory', 'estimateAssembliesService', 'estimateAssembliesFilterService',
			function (estimateAssembliesWizardServiceFactory, estimateAssembliesService, estimateAssembliesFilterService) {

				let service = {};
				service = estimateAssembliesWizardServiceFactory.createNewEstAssembliesWizardService(estimateAssembliesService, estimateAssembliesFilterService);

				return service;
			}
		]);
})(angular);
