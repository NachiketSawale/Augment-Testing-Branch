(function (angular) {
	'use strict';

	var moduleName = 'basics.procurementconfiguration';
	angular.module(moduleName).value('basicsProcurementConfigurationModule', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						editor: null,
						formatter: 'translation',
						readonly: true,
						width: 300
					}
				]
			};
		}
	});

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsProcurementConfigurationModuleController',
		['$scope', 'platformTranslateService', 'platformGridControllerService', 'basicsProcurementConfigurationModule', 'basicsProcurementConfigurationModuleDataService',
			function ($scope, platformTranslateService, platformGridControllerService, uiStandardConfig, basicsProcurementConfigurationModuleService) {
				var myGridConfig = {
					initCalled: false,
					columns: []
				};


				$scope.getContainerUUID = function getContainerUUID() {
					return '8C4EFB2026264965B5DDAC17AF4D9344';
				};

				platformGridControllerService.initListController($scope, uiStandardConfig, basicsProcurementConfigurationModuleService, null, myGridConfig);
			}
		]);
})(angular);