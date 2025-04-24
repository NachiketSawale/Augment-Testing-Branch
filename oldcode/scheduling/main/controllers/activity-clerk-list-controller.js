/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {

	'use strict';
	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainClerkListController', SchedulingMainClerkListController);

	SchedulingMainClerkListController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingMainClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'CDB0EA3D378846AB81BDE1020E62F32F');
	}
})(angular);
