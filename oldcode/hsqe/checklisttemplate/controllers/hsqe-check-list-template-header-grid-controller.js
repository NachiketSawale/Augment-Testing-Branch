/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {
	'use strict';

	angular.module('hsqe.checklisttemplate').controller('hsqeCheckListTemplateHeaderGridController',
		['$scope', 'globals', 'platformGridControllerService', 'hsqeCheckListTemplateUIStandardService', 'hsqeCheckListTemplateHeaderService','hsqeCheckListTemplateValidationService','hsqeCheckListGroupFilterService','procurementContextService',
			function ($scope, globals, gridControllerService, gridColumns, dataService,validationService,hsqeCheckListGroupFilterService, moduleContext) {
				$scope.path = globals.appBaseUrl;
				moduleContext.setLeadingService(dataService);
				moduleContext.setMainService(dataService);

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, {});

				hsqeCheckListGroupFilterService.setTobeFilterService(dataService);
			}
		]);
})(angular);
