/**
 * Created by las on 2/1/2018.
 */

(function () {
	'use strict';
	/*global angular*/

	angular.module('productionplanning.common').controller('productionplanningCommonLiccostgroupListController', ['$scope','$injector','productionplanningCommonLiccostgroupsService', 'productionplanningCommonLiccostgroupControllerService', 'productionplanningCommonStructureFilterService',
		function ($scope,$injector,PpsCommonLiccostgroupsService, PpsCommonLiccostgroupControllerService, PpsCommonStructureFilterService) {

			var mainServiceName = $scope.getContentValue('mainService');
			var mainService = $injector.get(mainServiceName);

			var costGroup =  $scope.getContentValue('costGroup');
			var seqNumber = $scope.getContentValue('seqNumber');

			var costgroupService = PpsCommonLiccostgroupsService.createCostGroupsDataService(mainService, costGroup);
			PpsCommonLiccostgroupsService.extendByFilter(mainServiceName, costgroupService, mainServiceName + '_Liccostgroups' + seqNumber, PpsCommonStructureFilterService, seqNumber);

			PpsCommonLiccostgroupControllerService.initLiccostgroupController($scope, seqNumber, mainService, costgroupService, PpsCommonStructureFilterService);

			var toolItem = _.find($scope.tools.items, {id:'t13'});  //item filter button
			if(toolItem)
			{
				toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
			}

			PpsCommonStructureFilterService.onFilterButtonRemoved.register($scope.updateTools);
			$scope.$on('$destroy', function () {
				PpsCommonStructureFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
			});

		}]);
})();