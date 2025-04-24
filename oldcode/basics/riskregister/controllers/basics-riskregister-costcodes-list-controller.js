/**
 * Created by salopek on 17.09.2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.riskregister';
	var riskRegisterModule = angular.module(moduleName);
	/*global angular,_*/

	/**
	 * @ngdoc controller
	 * @name basicsRiskRegisterCostCodesListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of cost codes entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	riskRegisterModule.controller('basicsRiskRegisterCostCodesListController',
		['$scope', '$translate', 'platformGridControllerService', 'platformGridAPI', 'basicsCostCodesUIStandardService', 'basicsCostCodesUIConfigurationService', 'basicsRiskRegisterCostCodesMainService',
			function ($scope, $translate, platformGridControllerService, platformGridAPI, basicsCostCodesUIStandardService, basicsCostCodesUIConfigurationService, basicsRiskRegisterCostCodesMainService) {

				var myGridConfig = {
					initCalled: false, columns: [], parentProp: 'CostCodeParentFk', childProp: 'CostCodes',
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var column = arg.grid.getColumns()[arg.cell].field;
						basicsRiskRegisterCostCodesMainService.fieldChanged(arg.item, column);
					},
					type: 'costCodesList'
				};

				platformGridControllerService.initListController($scope, basicsCostCodesUIStandardService, basicsRiskRegisterCostCodesMainService, null, myGridConfig);

				//basicsRiskRegisterCostCodesMainService.addSelectionColumn($scope.gridId);

				// remove create and delete buttons
				_.remove($scope.tools.items, function (item) {
					return item.id === 'create' ||  item.id === 'createChild' || item.id === 'delete' || item.id === 't109' || item.id === 't14';
				});
			}
		]);
})(angular);

