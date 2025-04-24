/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainRiskListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of estimate main risk entities.
	 **/

	angular.module(moduleName).controller('estimateMainRiskEventsController', EstimateMainRiskEventsController);

	EstimateMainRiskEventsController.$inject = ['$scope', '$translate', 'platformGridControllerService', 'estimateMainRiskEventsDataService',
		'basicsRiskRegisterStandardConfigurationService', '$injector', 'estimateMainRiskResourcesDataService', 'platformGridAPI',
		'platformContainerCreateDeleteButtonService'];

	function EstimateMainRiskEventsController($scope, $translate, platformGridControllerService, estimateMainRiskEventsDataService,
		basicsRiskRegisterStandardConfigurationService, $injector, estimateMainRiskResourcesDataService,
		platformGridAPI,platformContainerCreateDeleteButtonService) {
		let gridConfig = {
			initCalled: true,
			columns: [],
			parentProp: 'RiskRegisterParentFk',
			childProp: 'RiskRegisters',
			type: 'riskRegistersList',
			cellChangeCallback: function (arg) {
				estimateMainRiskEventsDataService.markItemAsModified(arg.item);
			},
			rowChangeCallBack: function rowChangeCallBack() {
				let selected = estimateMainRiskEventsDataService.getSelected();
				estimateMainRiskResourcesDataService.hasToLoadOnSelectionChange(selected);
				if(selected){
					estimateMainRiskResourcesDataService.getResources(selected).then(function (resources) {
						estimateMainRiskResourcesDataService.updateList(resources,false);
						estimateMainRiskResourcesDataService.gridRefresh();
					});
				}
			}
		};
		/* $scope.setTools = function ovverideTools(config){
			if(_.isObject(config)&&_.isArray(config.items)){
				let deleteTool = _.find(config.items,{id:'delete'});
				let deleteToolIdx = _.findIndex(config.items,{id:'delete'});
				if(deleteTool && _.isNumber(deleteToolIdx)){
					_.assign(deleteTool,{
						type: 'item',
						id: 'delete',
						iconClass: 'tlb-icons ico-delete',
						disabled:function(){

							let selected = estimateMainRiskEventsDataService.getSelected();
							if(selected){
								if(selected.IsMaster){
									return false;
								}
							}
							return true;
						},
						fn:deleteTool.fn
					});

					config.items.splice(deleteToolIdx,0,deleteTool);
				}
				//parentTools.update();
			}
		}; */
		platformGridControllerService.initListController($scope, basicsRiskRegisterStandardConfigurationService, estimateMainRiskEventsDataService, null, gridConfig);

		let tools = [
			{
				id: 'monteCarlo',
				caption: $translate.instant('estimate.main.calculateRisk'),
				type: 'item',
				cssClass: 'tlb-icons ico-instance-calculate',
				fn: function () {

					$injector.get('estimateMainRiskCalculatorWizardService').showDialog();

					// $injector.get('estimateMainRiskCalculatorAssignRiskService').showDialog();
				}
			},
			{
				id: 'assignLineItems',
				caption: $translate.instant('estimate.main.assignLineItems'),
				type: 'item',
				cssClass: 'tlb-icons ico-create-form',
				fn: function () {

					// $injector.get('estimateMainRiskCalculatorWizardService').showDialog();

					$injector.get('estimateMainRiskCalculatorAssignRiskService').showDialog();
				}
			}, {
				id: 'execute',
				caption: $translate.instant('estimate.main.testDefault'),
				type: 'item',
				iconClass: 'tlb-icons ico-filter',
				disabled: function () {
					return !estimateMainRiskEventsDataService.hasSelection();
				},
				fn: function () {

				}
			}
		];
		$scope.addTools(tools);


		function onSelected() {// 2-c)
			let selected = estimateMainRiskEventsDataService.getSelected();
			if(selected && selected.IsMaster){
				platformContainerCreateDeleteButtonService.toggleButtonUsingContainerState($scope.containerButtonConfig, estimateMainRiskEventsDataService, {disableCreate: false, disableDelete: true, disableCreateSub: true});
				$scope.tools.update();
			}else{
				platformContainerCreateDeleteButtonService.toggleButtonUsingContainerState($scope.containerButtonConfig, estimateMainRiskEventsDataService, {disableCreate: false, disableDelete: false, disableCreateSub: false});
				$scope.tools.update();
			}

		}

		estimateMainRiskEventsDataService.registerSelectionChanged(onSelected);

		$scope.$on('$destroy', function () {
			estimateMainRiskEventsDataService.unregisterSelectionChanged(onSelected);
		});
	}
})(angular);
