/**
 * Created by lnt on 08/23/2023.
 */

(function () {
	'use strict';
	let moduleName = 'project.assembly';

	angular.module(moduleName).factory('projectAssembliesResourceCharacteristicsService',
		['$q', '$http',  '$injector', 'estimateCommonResourceCharacteristicsService',
			function ($q, $http, $injector, estimateCommonResourceCharacteristicsService) {

				let data = {
					sectionId: 45, // Resource characteristic section Id
					resGridId: '20c0401F80e546e1bf12b97c69949f5b', // Resource grid Id to handle columns dynamically
					mainService: 'projectAssemblyResourceService',
					dynamicConfigurationService: 'projectAssembliesResourceDynamicConfigurationService'
				};
				return estimateCommonResourceCharacteristicsService.getDynamicCharService(data);
			}]);
})();
