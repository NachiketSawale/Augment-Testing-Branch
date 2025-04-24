(angular => {
	'use strict';

	const moduleName = 'productionplanning.configuration';

	angular.module(moduleName).controller('ppsStatusTriggerRuleController', ppsStatusTriggerRuleController);

	ppsStatusTriggerRuleController.$inject = ['$scope',
		'platformGridControllerService',
		'ppsStatusInheritedTriggerRuleDataService',
		'ppsStatusInheritedTriggeringUIStandardService',
		'ppsStatusTriggerRuleValidationService',
		'productionplanningItemStatusLookupService',
		'productionplanningCommonProductStatusLookupService'];

	function ppsStatusTriggerRuleController($scope,
		platformGridControllerService,
		dataService,
		uiStandardService,
		validationService,
		productionplanningItemStatusLookupService,
		productionplanningCommonProductStatusLookupService) {

		const gridConfig = {
			initCalled: false,
			columns: []
		};

		platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		productionplanningItemStatusLookupService.load();
		productionplanningCommonProductStatusLookupService.load();

		// remove bulk editor because it doesn't support dynamic columns.
		$scope.tools.items = _.filter($scope.tools.items, function (item) {
			return item && item.id !== 't14';
		});
	}
})(angular);