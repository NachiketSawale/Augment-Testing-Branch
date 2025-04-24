/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.costcodes';

	/**
	 * @ngdoc controller
	 * @name basicsCostCodesPriceVersionListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of cost codes price version entities.
	 **/

	angular.module(moduleName).controller('basicsCostCodesPriceVersionListRecordController',
		['$scope', '$injector', 'platformGridAPI', 'platformGridControllerService',
			'basicsCostCodesPriceVersionListRecordUIStandardService', 'basicsCostCodesPriceVersionListRecordDataService',
			'basicsCostCodesPriceVersionListRecordValidationService', 'basicsCostcodesPriceVersionListRecordDynamicConfigurationService',
			function ($scope, $injector, platformGridAPI, platformGridControllerService,
				uiStandardService, dataService, validationService, basicsCostcodesPriceVersionListRecordDynamicConfigurationService) {

				let gridConfig = {
					cellChangeCallBack: function cellChangeCallBack(arg) {
						let column = arg.grid.getColumns()[arg.cell].field;
						dataService.fieldChanged(arg.item, column);
					}
				};

				platformGridControllerService.initListController($scope, basicsCostcodesPriceVersionListRecordDynamicConfigurationService, dataService, validationService, gridConfig);

				function setDynamicColumnsLayoutToGrid(){
					basicsCostcodesPriceVersionListRecordDynamicConfigurationService.applyToScope($scope);
				}
				basicsCostcodesPriceVersionListRecordDynamicConfigurationService.registerSetConfigLayout(setDynamicColumnsLayoutToGrid);
				let basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService = $injector.get('basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService');
				basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.initReloadFn();

				function onInitialized() {
					basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.loadDynamicColumns();
				}
				platformGridAPI.events.register($scope.gridId, 'onInitialized', onInitialized);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', onInitialized);
					basicsCostCodesPriceVersionListRecordDynamicUserDefinedColumnService.onDestroy();
				});
			}
		]);
})(angular);

