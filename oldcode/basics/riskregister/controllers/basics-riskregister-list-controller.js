/*
 * Created by salopek on 26.09.2019.
 */

(function (angular) {
	'use strict';
	/*globals angular,global*/
	var moduleName = 'basics.riskregister';

	/**
	 * @ngdoc controller
	 * @name basicsRiskRegisterListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of risk register entities.
	 **/

	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('basicsRiskRegisterListController',
		['$scope', '$q', '$translate',
			'$injector', 'platformGridControllerService', 'basicsRiskRegisterDataService',
			'basicsRiskRegisterStandardConfigurationService', 'basicsRiskRegisterAssignedResourcesMainService',
			'basicsRiskRegisterDependentLookupService',
			function ($scope, $q, $translate,
			          $injector, platformGridControllerService, basicsRiskRegisterDataService,
			          basicsRiskRegisterStandardConfigurationService, basicsRiskRegisterAssignedResourcesMainService,
			          basicsRiskRegisterDependentLookupService) {
				var gridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'RiskRegisterParentFk',
					childProp: 'RiskRegisters',
					rowChangeCallBack: function rowChangeCallBack(arg) {
						basicsRiskRegisterDependentLookupService.reLoad();
						//basicsRiskRegisterAssignedResourcesMainService.refresh();
						/*var defer = $q.defer();

							defer.resolve($injector.get('basicsRiskregisterResourcesDataService').gridRefresh());

						return defer.promise;*/
						//var selectedItem = basicsRiskRegisterDataService.getSelected();
						/*if(isSorted){
							var selected = angular.copy(selectItem);
							var activeCell = arg.grid.getActiveCell();
							isSorted = false;
							setFocusOnSort(activeCell, selected);
						}*/

					},
					type: 'riskRegistersList',
					dragDropService : $injector.get('basicsCommonClipboardService')
				};

				platformGridControllerService.initListController($scope, basicsRiskRegisterStandardConfigurationService, basicsRiskRegisterDataService, null, gridConfig);

				/*var tools = [
					{
						id: 'addToRiskEvents',
						caption: $translate.instant('basics.riskregister.addResources'),
						type: 'item',
						cssClass: 'app-icons ico-cost-code',
						fn: function() {
						},
						disabled: function () {
							var selectedRiskEvents = basicsRiskRegisterDataService.getSelected();
							return selectedRiskEvents === null;
						}
					}
				];

				$scope.addTools(tools);*/
			}
		]);
})(angular);
