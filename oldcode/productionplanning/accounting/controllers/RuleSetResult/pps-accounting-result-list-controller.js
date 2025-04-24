/**
 * Created by anl on 4/25/2019.
 */



(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingResultListController', ResultListController);

	ResultListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningAccountingRuleUIStandardService',
		'productionplanningAccountingResultDataService',
		'platformGridAPI',
		'platformModalService',
		'basicsCommonToolbarExtensionService'];

	function ResultListController($scope, platformContainerControllerService,
								  platformTranslateService, uiStandardService,
								  resultService,
								  platformGridAPI,
								  platformModalService,
								  basicsCommonToolbarExtensionService) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);

		var modalConfig = {
			templateUrl: 'productionplanning.accounting/templates/pps-accounting-result-check-template.html',
			controller: 'productionplanningAccountingResultCheckController',
			resizeable: true
		};

		var checkRuleBtn = {
			id: 'checkResultFormula',
			caption: 'productionplanning.accounting.result.checkFormula',
			type: 'item',
			//permission: '#c',
			iconClass: 'tlb-icons ico-question',
			fn: function () {
				platformModalService.showDialog(modalConfig);
			},
			disabled: function () {
				return !resultService.getSelected();
			}
		};

		basicsCommonToolbarExtensionService.insertBefore($scope, checkRuleBtn);

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			//Handle MaterialFk & CostCodeFk
			resultService.handleFieldChanged(args.item, col);
		};

		resultService.registerFilters();
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			resultService.unregisterFilters();
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
		});

	}

})(angular);