/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).controller('estimateMainRiskEventResourcesController', [
		'$scope', '$translate', 'platformGridControllerService',
		'platformGridAPI','estimateMainRiskResourcesDataService',
		'estimateMainRiskRegisterResourceConfigurationService', '$injector',
		'estimateMainRiskEventsDataService',
		function ($scope, $translate,platformGridControllerService,
			platformGridAPI,estimateMainRiskResourcesDataService,
			estimateMainRiskRegisterResourceConfigurationService,$injector,
			estimateMainRiskEventsDataService) {

			let myGridConfig = {
				initCalled: false,
				columns: [],
				parentProp: 'RiskResourceFk',
				childProp: 'RiskResource',
				cellChangeCallBack: function cellChangeCallBack(arg) {
					let column = arg.grid.getColumns()[arg.cell].field;
					estimateMainRiskResourcesDataService.fieldChange(arg.item, column);
					estimateMainRiskResourcesDataService.markItemAsModified(arg.item);
				},
				type: 'resources'
			};

			platformGridControllerService.initListController($scope, estimateMainRiskRegisterResourceConfigurationService, estimateMainRiskResourcesDataService, null, myGridConfig);

			function updateCreationTools(){
				let selected = estimateMainRiskEventsDataService.getSelected();
				// eslint-disable-next-line no-prototype-builtins
				if(selected && selected.hasOwnProperty('IsMaster') && selected.IsMaster === true){
					let tools = $scope.$parent.tools;
					let createTool = _.filter(tools.items,function (item) {
						return item.id === 'create';
					});
					createTool[0].isDisabled = function () {
						return selected.IsMaster;
					};

					$scope.updateTools();
					estimateMainRiskResourcesDataService.gridRefresh();
				}
			}

			estimateMainRiskEventsDataService.registerSelectionChanged(updateCreationTools);
			estimateMainRiskEventsDataService.registerSelectionChanged(estimateMainRiskResourcesDataService.loadData);



			$scope.$on('$destroy', function () {
				estimateMainRiskEventsDataService.unregisterSelectionChanged(updateCreationTools);
				estimateMainRiskEventsDataService.unregisterSelectionChanged(estimateMainRiskResourcesDataService.loadData);

			});



		}
	]);
})(angular);
