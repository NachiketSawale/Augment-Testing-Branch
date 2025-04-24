/**
 * Created by waldrop on 1/23/2020
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainAssignedRiskEventsController
	 * @function
	 *
	 * @description
	 * Controller for the list view of estimate main assignedRisk entities.
	 **/

	angular.module(moduleName).controller('estimateMainAssignedRiskEventsController', EstimateMainAssignedRiskEventsController);

	EstimateMainAssignedRiskEventsController.$inject = ['$scope', 'platformGridControllerService','estimateMainAssignedRiskDataService',
		'basicsRiskRegisterStandardConfigurationService'];

	function EstimateMainAssignedRiskEventsController($scope, platformGridControllerService,estimateMainAssignedRiskDataService,
		basicsRiskRegisterStandardConfigurationService) {

		let gridConfig = {
			initCalled: false,
			columns: [],
			parentProp: 'RiskRegisterParentFk',
			childProp: 'RiskRegisters',
			rowChangeCallBack: function rowChangeCallBack(/* arg */) {
			},
			type: 'riskRegistersList'
		};



		platformGridControllerService.initListController($scope, basicsRiskRegisterStandardConfigurationService,estimateMainAssignedRiskDataService,null,gridConfig);
		/* let tools = [{
			id:'assignLineItems',
			caption: 'Assign LineItems',
			type: 'item',
			cssClass: 'tlb-icons ico-create-form',
			fn: function () {

				//$injector.get('estimateMainRiskCalculatorWizardService').showDialog();

				$injector.get('estimateMainRiskCalculatorAssignRiskService').showDialog();
			}
		}];
		$scope.addTools(tools); */

	}
})(angular);
