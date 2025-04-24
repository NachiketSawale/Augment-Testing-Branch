/**
 * Created by lav on 6/25/2019.
 */
(function () {

	'use strict';
	var moduleName = 'productionplanning.common';

	/**
	 * @ngdoc controller
	 * @name ppsCommonProjectBPContactController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the project business partner Contact
	 **/
	angular.module(moduleName).controller('ppsCommonProjectBPContactController', PpsCommonProjectBPContactController);

	PpsCommonProjectBPContactController.$inject = ['$scope', 'platformContainerControllerService'];
	function PpsCommonProjectBPContactController($scope, platformContainerControllerService) {

		var guid = $scope.getContentValue('uuid');
		var cModuleName = $scope.getContentValue('moduleName') || moduleName;
		platformContainerControllerService.initController($scope, cModuleName, guid);

	}

})();