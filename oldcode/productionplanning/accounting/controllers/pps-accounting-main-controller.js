/**
 * Created by anl on 4/8/2019.
 */

(function () {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).controller('productionplanningAccountingController', AccountingMainController);

	AccountingMainController.$inject = ['$scope', 'platformMainControllerService',
		'productionplanningAccountingTranslationService', 'productionplanningAccountingRuleSetDataService'];

	function AccountingMainController($scope, platformMainControllerService,
							   translationService, accountingRuleSetService) {
		var options = {search: true, reports: false};
		var sidebarReports = platformMainControllerService.registerCompletely($scope, accountingRuleSetService,
			{}, translationService, moduleName, options);

		//wizardService.activate();

		// un-register on destroy
		$scope.$on('$destroy', function () {
			//wizardService.deactivate();
			platformMainControllerService.unregisterCompletely(accountingRuleSetService, sidebarReports,
				translationService, options);
		});
	}
})();
