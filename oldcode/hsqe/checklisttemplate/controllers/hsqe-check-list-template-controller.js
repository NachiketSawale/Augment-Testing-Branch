/**
 * Created by alm on 1/20/2021.
 */
(function () {
	'use strict';
	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName).controller('hsqeChecklisttemplateController',
		['$scope', 'globals', '$injector', 'platformMainControllerService','platformNavBarService','hsqeCheckListTemplateTranslationService','hsqeCheckListTemplateHeaderService','hsqeCheckListGroupService',
			function ($scope, globals, $injector, platformMainControllerService,platformNavBarService,hsqeCheckListTemplateTranslationService,hsqeCheckListTemplateHeaderService,hsqeCheckListGroupService) {
				$scope.path = globals.appBaseUrl;
				var opt = {
					search: true,
					reports: true,
				};

				var sidebarReports = platformMainControllerService.registerCompletely($scope, hsqeCheckListTemplateHeaderService, {}, hsqeCheckListTemplateTranslationService, moduleName, opt);

				var originalFn = platformNavBarService.getActionByKey('save').fn;
				platformNavBarService.getActionByKey('save').fn = function () {
					if (originalFn) {
						originalFn();
					}
					if(hsqeCheckListGroupService.isModelChanged()){
						var selectedItem = hsqeCheckListGroupService.getSelected();
						if(selectedItem){
							var validationService = $injector.get('hsqeCheckListGroupValidationService');
							validationService.asyncValidateCode(selectedItem, selectedItem.Code, 'Code');
						}
					}
					hsqeCheckListGroupService.update();
				};

				$scope.$on('$destroy', function () {
					platformMainControllerService.unregisterCompletely(hsqeCheckListTemplateHeaderService, sidebarReports, hsqeCheckListTemplateTranslationService, opt);
				});
			}
		]);
})();