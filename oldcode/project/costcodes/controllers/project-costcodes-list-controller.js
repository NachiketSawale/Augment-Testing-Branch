/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'project.costcodes';

	/**
	 * @ngdoc controller
	 * @name projectCostCodesListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of costcodes
	 **/
	angular.module(moduleName).controller('projectCostCodesListController', ProjectCostCodesListController);

	ProjectCostCodesListController.$inject = ['$scope', '$injector', 'platformGridAPI', 'projectCostCodesMainService', 'platformContainerControllerService', 'ProjectCostCodesProcessor', 'platformContainerCreateDeleteButtonService'];
	function ProjectCostCodesListController($scope, $injector, platformGridAPI, projectCostCodesMainService, platformContainerControllerService, ProjectCostCodesProcessor, platformContainerCreateDeleteButtonService) {
		platformContainerControllerService.initController($scope, moduleName, '99E75030E41F11E4B5710800200C9A66');
		function refreshLookup(){
			let jobLookupServ = $injector.get('logisticJobLookupByProjectDataService');
			if(jobLookupServ){
				jobLookupServ.resetCache({lookupType:'logisticJobLookupByProjectDataService'});
			}
		}

		function updateTools(){
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, projectCostCodesMainService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		}
		let projectCostCodesDynamicUserDefinedColumnService = $injector.get('projectCostCodesDynamicUserDefinedColumnService');

		let projectCostCodesDynamicConfigurationService = $injector.get('projectCostCodesDynamicConfigurationService');
		function setDynamicColumnsLayoutToGrid(){
			projectCostCodesDynamicConfigurationService.applyToScope($scope);
		}
		projectCostCodesDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);
		projectCostCodesDynamicUserDefinedColumnService.initReloadFn();

		function onInitialized() {
			projectCostCodesDynamicUserDefinedColumnService.loadDynamicColumns();
		}
		platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

		function onSelectedRowsChanged() {
			$injector.get('projectCostCodesJobRateMainService').clearCostCodeJobRateCacheData();
			$injector.get('projectMainService').update();
		}


		projectCostCodesMainService.registerListLoaded(refreshLookup);
		ProjectCostCodesProcessor.onChildAllowedChanged.register(updateTools);
		projectCostCodesMainService.registerSelectionChanged(updateTools);
		projectCostCodesMainService.registerSelectionChanged(onSelectedRowsChanged);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			projectCostCodesMainService.unregisterListLoaded(refreshLookup);
			ProjectCostCodesProcessor.onChildAllowedChanged.unregister(updateTools);
			projectCostCodesMainService.unregisterSelectionChanged(updateTools);
			projectCostCodesDynamicUserDefinedColumnService.onDestroy();
			platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
			projectCostCodesMainService.unregisterSelectionChanged(onSelectedRowsChanged);
		});
	}

})(angular);
