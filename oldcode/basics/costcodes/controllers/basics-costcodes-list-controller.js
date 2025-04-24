/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'basics.costcodes';
	let angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsCostCodesListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of cost codes entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('basicsCostCodesListController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService', 'basicsCostCodesUIStandardService', 'basicsCostCodesMainService',
			'basicsCostCodesValidationService', 'basicsCostCodesDynamicConfigurationService','platformDragdropService',
			function ($scope, $injector, platformGridAPI, platformGridControllerService, basicsCostCodesUIStandardService, basicsCostCodesMainService,
				basicsCostCodesValidationService, basicsCostCodesDynamicConfigurationService,platformDragdropService) {

				let myGridConfig = {
					initCalled: false, columns: [], parentProp: 'CostCodeParentFk', childProp: 'CostCodes',
					dragDropService: $injector.get('basicsCostCodesClipboardService'),
					allowedDragActions: [platformDragdropService.actions.move],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						basicsCostCodesMainService.fieldChanged(arg.item, column);
					},
					type: 'costCodesList'
				};

				if (basicsCostCodesMainService.getIsload()){
					basicsCostCodesMainService.load();
					basicsCostCodesMainService.setIsLoad();
				}

				function setDynamicColumnsLayoutToGrid(){
					basicsCostCodesDynamicConfigurationService.applyToScope($scope);
				}
				basicsCostCodesDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);
				let basicsCostCodesDynamicUserDefinedColumnService = $injector.get('basicsCostCodesDynamicUserDefinedColumnService');
				basicsCostCodesDynamicUserDefinedColumnService.initReloadFn();

				function onInitialized() {
					basicsCostCodesDynamicUserDefinedColumnService.loadDynamicColumns();
				}

				platformGridControllerService.initListController($scope, basicsCostCodesDynamicConfigurationService, basicsCostCodesMainService, basicsCostCodesValidationService, myGridConfig);

				platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
					basicsCostCodesDynamicUserDefinedColumnService.onDestroy();
				});
			}
		]);
})(angular);

