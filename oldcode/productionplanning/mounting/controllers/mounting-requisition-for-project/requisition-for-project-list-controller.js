/**
 * Created by lid on 8/11/2017.
 */
(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.mounting';


	angular.module(moduleName).controller('productionplanningMountingRequisitionForProjectListController', ProductionplanningMountingRequisitionForProjectListController);

	ProductionplanningMountingRequisitionForProjectListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningMoungtingRequisitionUIStandardService',
		'productionplanningMountingRequisitionForProjectDataService'];

	function ProductionplanningMountingRequisitionForProjectListController($scope, platformContainerControllerService, platformTranslateService, uiStandardService,
									   mntRequisitionInProjectDataService) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

		platformContainerControllerService.initController($scope, moduleName, '5259b8bfb2c645c88a56acc693decd8c');

		mntRequisitionInProjectDataService.registerFilter();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			mntRequisitionInProjectDataService.unregisterFilter();
		});
	}
})();