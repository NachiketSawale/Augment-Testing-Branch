/**
 * Created by winjit.juily.deshkar on 22/01/2024.
 */

(function () {
	'use strict';
	let moduleName = 'project.plantassembly';

	angular.module(moduleName).factory('projectPlantAssembliesResourceCharacteristicsService',
		['$q', '$http',  '$injector', 'estimateCommonResourceCharacteristicsService',
			function ($q, $http, $injector, estimateCommonResourceCharacteristicsService) {

				let data = {
					sectionId: 45, // Resource characteristic section Id
					resGridId: 'bedc9497ca84537ae6c8cabbb0b8faeb', // Resource grid Id to handle columns dynamically
					mainService: 'projectPlantAssemblyResourceService',
					dynamicConfigurationService: 'projectPlantAssembliesResourceDynamicConfigurationService'
				};
				return estimateCommonResourceCharacteristicsService.getDynamicCharService(data);
			}]);
})();
