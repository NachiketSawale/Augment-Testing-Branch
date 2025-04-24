/**
 * Created by clv on 10/23/2017.
 */
(function(angular){

	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageItemAssignmentListController', procurementPackageItemAssignmentListController);
	procurementPackageItemAssignmentListController.$inject = ['$scope', 'platformGridControllerService', 'packageItemAssignmentUIStandardService',
		'procurementPackageItemAssignmentDataService', 'procurementPackageItemAssignmentValidationService', 'procurementPackageClipboardService','procurementPackageDataService','$injector'];
	function procurementPackageItemAssignmentListController($scope, platformGridControllerService, packageItemAssignmentUIStandardService,
		procurementPackageItemAssignmentDataService, procurementPackageItemAssignmentValidationService, procurementPackageClipboardService,procurementPackageDataService, $injector){

		var gridConfig = {
			initCalled: false,
			columns: [],
			type: 'itemAssignment',
			parentProp: 'PrcItemAssignmentFk',
			childProp: 'PrcItemAssignments',
			dragDropService: procurementPackageClipboardService
		};
		var dataSerivce = procurementPackageItemAssignmentDataService;
		platformGridControllerService.initListController($scope, packageItemAssignmentUIStandardService, dataSerivce, procurementPackageItemAssignmentValidationService(dataSerivce.name, dataSerivce), gridConfig);

		let parentService = $injector.get('procurementPackageDataService');
		$injector.get('procurementCommonFilterJobVersionToolService').registerToolEvent($scope, dataSerivce, parentService);

		var toolbarItems = [{
			id: 't100',
			caption: 'Calculate Budgets',
			type: 'item',
			cssClass:'control-icons ico-recalculate',
			fn: function () {
				dataSerivce.relCalculationItemBudget();
			},
			disabled: function () {
				var item = procurementPackageDataService.getSelected();
				if (!item) {
					return true;
				}
				return !procurementPackageDataService.getHeaderEditAble();
			}
		}];

		platformGridControllerService.addTools(toolbarItems);

	}
})(angular);