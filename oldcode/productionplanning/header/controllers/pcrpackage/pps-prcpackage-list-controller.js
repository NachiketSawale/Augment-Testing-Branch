/**
 * Created by lav on 9/21/2020.
 */
(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'productionplanning.header';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('ppsPrcPackageListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService',
		'platformGridAPI'];

	function ListController($scope, platformContainerControllerService,
							platformGridAPI) {
		var guid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, guid);

		var setCellEditable = function (e, args) {
			return false;
		};

		platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
		});
	}
})();