/*
 * Created by salopek on 07.10.2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.riskregister';
	var riskRegisterModule = angular.module(moduleName);
	/*global angular,_*/
	/**
	 * @ngdoc controller
	 * @name basicsRiskRegisterAssignedResourcesListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of assigned resource entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	riskRegisterModule.controller('basicsRiskRegisterAssignedResourcesListController',
		['$scope', '$translate', 'platformGridControllerService', 'platformGridAPI', 'basicsCostCodesUIStandardService', 'basicsCostCodesUIConfigurationService', 'basicsRiskRegisterAssignedResourcesMainService',
			function ($scope, $translate, platformGridControllerService, platformGridAPI, basicsCostCodesUIStandardService, basicsCostCodesUIConfigurationService, basicsRiskRegisterAssignedResourcesMainService) {

				var myGridConfig = {
					initCalled: false, columns: [], parentProp: 'CostCodeParentFk', childProp: 'CostCodes',
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var column = arg.grid.getColumns()[arg.cell].field;
						basicsRiskRegisterAssignedResourcesMainService.fieldChanged(arg.item, column);
					},
					type: 'costCodesList'
				};

				platformGridControllerService.initListController($scope, basicsCostCodesUIStandardService, basicsRiskRegisterAssignedResourcesMainService, null, myGridConfig);

				// remove create and delete buttons
				_.remove($scope.tools.items, function (item) {
					return item.id === 'create' ||  item.id === 'createChild' || item.id === 'delete' || item.id === 't109' || item.id === 't14';
				});
			}
		]);
})(angular);

