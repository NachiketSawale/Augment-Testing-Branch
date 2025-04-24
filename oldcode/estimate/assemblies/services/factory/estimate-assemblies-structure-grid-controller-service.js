/**
 * Created by lnt on 21.05.2020.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('estimate.assemblies').factory('estimateAssembliesStructureGridControllerService',
		['$window', '$injector', 'platformGridAPI', 'platformContainerControllerService', 'estimateAssembliesCreationService',

			function ($window, $injector, platformGridAPI, platformContainerControllerService, estimateAssembliesCreationService) {

				let service = {};

				service.initAssembliesStructureController = function ($scope, moduleName, assembliesStructureService, estimateAssembliesService, estimateAssembliesFilterService, grid) {
					platformContainerControllerService.initController($scope, moduleName, grid);
					estimateAssembliesService.setIsAssembly(true);

					function updateList (updateData, response){
						if (updateData.EstAssemblyCat){
							assembliesStructureService.refreshAssemblyCategoryLookup({updated: updateData.EstAssemblyCat});
						}
						assembliesStructureService.updateList(updateData, response);
					}

					assembliesStructureService.registerSelectionChanged(assembliesStructureService.creatorItemChanged);

					// refresh data when assemblies are refreshed
					estimateAssembliesService.registerRefreshRequested(assembliesStructureService.refresh);
					estimateAssembliesService.onUpdated.register(updateList);
					estimateAssembliesFilterService.onFilterButtonRemoved.register($scope.updateTools);

					estimateAssembliesService.setEstHeaderFkToEstimateParameterFormatter();
					estimateAssembliesService.isAssemblyParameterActived = true;
					assembliesStructureService.setGridId($scope.gridId);

					function onClickFuc(){
						$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, assembliesStructureService);
					}
					platformGridAPI.events.register($scope.gridId, 'onClick',onClickFuc);

					$scope.winEstAssemblyCatIttem = null;

					if($window.parent !== null && $window.opener && $window.opener.selectedEntityID)
					{
						let assemblyCatFk = $window.opener.selectedEntityID;

						estimateAssembliesFilterService.setFilterIds('ASSEMBLYCAT', [assemblyCatFk]);

						assembliesStructureService.setWinEstAssemblyItem(assemblyCatFk);
					}

					$scope.$on('$destroy', function () {
						estimateAssembliesService.isAssemblyParameterActived = false;
						estimateAssembliesService.unregisterRefreshRequested(assembliesStructureService.refresh);
						estimateAssembliesService.onUpdated.unregister(updateList);
						estimateAssembliesFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
						assembliesStructureService.unregisterSelectionChanged(assembliesStructureService.creatorItemChanged);
						estimateAssembliesService.setIsAssembly(false);
						platformGridAPI.events.unregister($scope.gridId, 'onClick',onClickFuc);
						assembliesStructureService.setWinEstAssemblyItem(null);
						estimateAssembliesCreationService.removeCreationProcessor('projectAssemblyStructureService');
						estimateAssembliesCreationService.removeCreationProcessor('estimateAssembliesAssembliesStructureService');
					});
				};

				return service;
			}]);
})(angular);