/**
 * Created by lav on 6/25/2019.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc controller
	 * @name ppsCommonProjectBPController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project business partner
	 **/
	angular.module(moduleName).controller('ppsCommonProjectBPController', PpsCommonProjectBPController);

	PpsCommonProjectBPController.$inject = ['$scope', 'platformContainerControllerService'];
	function PpsCommonProjectBPController($scope, platformContainerControllerService) {

		var guid = $scope.getContentValue('uuid');
		var cModuleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, cModuleName, guid);

	}

})();