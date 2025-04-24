/**
 * Created by lid on 8/11/2017.
 */

(function (angular) {

	'use strict';
	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingRequisitionForProjectDetailController', ProductionplanningMountingRequisitionForProjectDetailController);

	ProductionplanningMountingRequisitionForProjectDetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningMountingTranslationService'];

	function ProductionplanningMountingRequisitionForProjectDetailController($scope, platformContainerControllerService, translationService) {
		platformContainerControllerService.initController($scope, moduleName, '06a28e3323cc476ca62c4b2966aec398', translationService);
	}
})(angular);