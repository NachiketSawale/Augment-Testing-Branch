(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'object.main';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('objectMainUnit2ObjUnitListController', ObjectMainUnit2ObjUnitListController);

	ObjectMainUnit2ObjUnitListController.$inject = ['$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService',
		'objectMainUnit2ObjUnitService', 'allProjectParkingSpaceObjectUnitDataService'];

	function ObjectMainUnit2ObjUnitListController($scope, platformContainerControllerService, platformContainerCreateDeleteButtonService,
	                                              objectMainUnit2ObjUnitService, allProjectParkingSpaceObjectUnitDataService) {
		platformContainerControllerService.initController($scope, moduleName, '687b0fd5315f47e8a109715375f2596a');

		function onParkingSpacesLoaded() {//2-c)
			platformContainerCreateDeleteButtonService.toggleButtonUsingContainerState($scope.containerButtonConfig, objectMainUnit2ObjUnitService, {disableCreate: false, disableDelete: false, disableCreateSub: false});
			$scope.tools.update();
		}

		allProjectParkingSpaceObjectUnitDataService.registerListLoaded(onParkingSpacesLoaded);//2-b)

		$scope.$on('$destroy', function () {
			allProjectParkingSpaceObjectUnitDataService.unregisterListLoaded(onParkingSpacesLoaded);
		});

	}
})();