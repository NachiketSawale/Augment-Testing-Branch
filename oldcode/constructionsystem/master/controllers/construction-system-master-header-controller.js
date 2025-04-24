(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterHeaderController', [
		'$injector',
		'$scope',
		'platformControllerExtendService',
		'constructionSystemMasterHeaderService',
		'platformGridControllerService',
		'constructionSystemMasterHeaderUIStandardService',
		'constructionSystemMasterHeaderValidationService',
		'constructionSystemMasterGroupFilterService',
		'constructionSystemMasterClipboardService',
		function (
			$injector,
			$scope,
			platformControllerExtendService,
			constructionSystemMasterHeaderService,
			platformGridControllerService,
			constructionSystemMasterHeaderUIStandardService,
			constructionSystemMasterHeaderValidationService,
			constructionSystemMasterGroupFilterService,
			constructionSystemMasterClipboardService) {

			platformControllerExtendService.initListController(
				$scope,
				constructionSystemMasterHeaderUIStandardService,
				constructionSystemMasterHeaderService,
				constructionSystemMasterHeaderValidationService,
				{
					costGroupConfig: {
						dataLookupType: 'Header2CostGroups',
						identityGetter: function (entity) {
							return {
								MainItemId: entity.Id
							};
						}
					},
					type: 'basics.material',
					dragDropService: constructionSystemMasterClipboardService
				});

			constructionSystemMasterGroupFilterService.setTobeFilterService(constructionSystemMasterHeaderService);
		}
	]);
})(angular);