/**
 * Created by las on 2/1/2018.
 */


(function () {
	'use strict';
	/*global angular*/

	angular.module('productionplanning.common').controller('productionplanningCommonPrjcostgroupListController', ['$scope','$injector','productionplanningCommonPrjcostgroupsService', 'productionplanningCommonPrjcostgroupControllerService',
		'productionplanningCommonStructureFilterService', 'estimateCommonControllerFeaturesServiceProvider', 'cloudDesktopPinningContextService', 'cloudDesktopSidebarService',
		function ($scope,$injector,PpsCommonPrjcostgroupsService, PpsCommonPrjcostgroupControllerService, PpsCommonStructureFilterService, estimateCommonControllerFeaturesServiceProvider, cloudDesktopPinningContextService, cloudDesktopSidebarService) {

			var mainServiceName = $scope.getContentValue('mainService');
			var mainService = $injector.get(mainServiceName);
			initMainService(mainService);

			function initMainService(mainService) {
				if(mainService.getSelectedProjectId === undefined){
					mainService.getSelectedProjectId = function () {
						return cloudDesktopSidebarService.filterRequest.projectContextId || -1;
					};
				}
			}

			var costGroup =  $scope.getContentValue('costGroup');
			var seqNumber = $scope.getContentValue('seqNumber');

			var costgroupService = PpsCommonPrjcostgroupsService.createCostGroupsDataService(mainService, costGroup);
			PpsCommonPrjcostgroupsService.extendByFilter(mainServiceName, costgroupService, mainServiceName + '_Prjcostgroup' + seqNumber, PpsCommonStructureFilterService, seqNumber);

			PpsCommonPrjcostgroupControllerService.initLiccostgroupController($scope, seqNumber, mainService, costgroupService, PpsCommonStructureFilterService);

			estimateCommonControllerFeaturesServiceProvider.extendControllerByIsProjectContextService($scope);

			function reloadData() {
				var projectId = mainService.getSelectedProjectId();
				if(projectId > 0)
				{
					costgroupService.load();
				}
			}

			var toolItem = _.find($scope.tools.items, {id:'t13'});  //item filter button
			if(toolItem)
			{
				toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
			}

			PpsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
			cloudDesktopPinningContextService.onSetPinningContext.register(reloadData);
			$scope.$on('$destroy', function () {
				PpsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				cloudDesktopPinningContextService.onSetPinningContext.unregister(reloadData);

			});

		}]);
})();