/**
 * Created by lav on 10/22/2020.
 */
(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.common';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('ppsCommonNotificationListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ListController($scope, platformContainerControllerService) {
		var guid = $scope.getContentValue('uuid');
		var _moduleName = $scope.getContentValue('moduleName');
		platformContainerControllerService.initController($scope, _moduleName, guid);
	}
})();