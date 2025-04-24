/**
 * Created by mov on 07/22/2020.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc service
	 * @name estimateMainResourceCharacteristicsService
	 * @function
	 *
	 * @description
	 * estimateMainResourceCharacteristicsService is the data service for all estimate related functionality.
	 */
	angular.module(moduleName).factory('estimateAssembliesResourceCharacteristicsService',
		['$q', '$http',  '$injector', 'estimateCommonResourceCharacteristicsService',
			function ($q, $http, $injector, estimateCommonResourceCharacteristicsService) {

				let data = {
					sectionId: 45, // Resource characteristic section Id
					resGridId: 'a32ce3f29bd446e097bc818f71b1263d', // Resource grid Id to handle columns dynamically
					mainService: 'estimateAssembliesResourceService',
					dynamicConfigurationService: 'estimateAssembliesResourceDynamicConfigurationService'
				};
				return estimateCommonResourceCharacteristicsService.getDynamicCharService(data);
			}]);
})();
