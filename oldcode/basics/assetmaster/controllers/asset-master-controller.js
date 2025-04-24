(function config(angular) {
	'use strict';

	var moduleName = 'basics.assetmaster';

	angular.module(moduleName).controller('basicsAssetmasterController',
		['$scope', 'platformMainControllerService', 'basicsAssetMasterService', 'basicsAssetMasterTranslationService', 'basicsAssetMasterSidebarWizardService',
			// jshint -W072
			function basicsAssetmasterController($scope, platformMainControllerService, leadingService, translateService, basicsAssetMasterSidebarWizardService) {

				var opt = {search: true, reports: false, auditTrail: '0484c4096a934b6299eab2dfc793185e'};
				var sidebarReports = platformMainControllerService.registerCompletely($scope, leadingService, {}, translateService, moduleName, opt);
				basicsAssetMasterSidebarWizardService.activate();

				// un-register on destroy
				$scope.$on('$destroy', function destroy() {
					platformMainControllerService.unregisterCompletely(leadingService, sidebarReports, translateService, opt);
					basicsAssetMasterSidebarWizardService.deactivate();
				});

			}]);
})(angular);
