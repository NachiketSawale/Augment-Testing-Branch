/**
 * Created by anl on 4/3/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingRuleListController', RuleListController);

	RuleListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridControllerService',
		'platformTranslateService', 'productionplanningAccountingRuleUIStandardService',
		'platformModalService',
		'productionplanningAccountingRuleDataService',
		'productionplanningAccountingRuleCopyPasteBtnsExtension',
		'basicsCommonToolbarExtensionService',
		'platformGridAPI'];

	function RuleListController($scope, platformContainerControllerService,
								platformGridControllerService,
								platformTranslateService, uiStandardService,
								platformModalService,
								ruleDataService,
								ruleCopyPasteBtnsExtension,
								basicsCommonToolbarExtensionService,
								platformGridAPI) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		var containerUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUid);

		ruleDataService.registerLookupFilter();

		var modalConfig = {
			templateUrl: 'productionplanning.accounting/templates/pps-accounting-rule-check-template.html',
			controller: 'productionplanningAccountingRuleCheckController',
			resizeable: true
		};

		var checkRuleBtn = {
			id: 'checkRule',
			caption: 'productionplanning.accounting.rule.checkRule',
			type: 'item',
			iconClass: 'tlb-icons ico-question',
			fn: function () {
				platformModalService.showDialog(modalConfig);
			},
			disabled: function () {
				return !ruleDataService.getSelected();
			}
		};
		basicsCommonToolbarExtensionService.insertBefore($scope, checkRuleBtn);

		function doUpdateTools() {
			$scope.tools.update();
			//$scope.updateTools();
		}
		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', doUpdateTools);

		// add copy-button and paste-button behind delete-button on the toolbar
		let btns = ruleCopyPasteBtnsExtension.createCopyPasteBtns(ruleDataService, doUpdateTools);
		platformGridControllerService.addTools(btns);

		var onCellChange = function (e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			//Handle MaterialFk & CostCodeFk
			ruleDataService.handleFieldChanged(args.item, col);
		};
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', doUpdateTools);
			ruleCopyPasteBtnsExtension.clearPasteData(ruleDataService); // clear paste data after destroying rule list controller
			ruleDataService.unregisterLookupFilter();
		});
	}

})(angular);