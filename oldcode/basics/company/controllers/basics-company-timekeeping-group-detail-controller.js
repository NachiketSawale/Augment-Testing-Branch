/**
 * Created by baf on 07.06.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyTimekeepingGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics company timekeepingGroup entities.
	 **/
	angular.module(moduleName).controller('basicsCompanyTimekeepingGroupDetailController', BasicsCompanyTimekeepingGroupDetailController);

	BasicsCompanyTimekeepingGroupDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyTimekeepingGroupDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '818c680483854e4f9ec50a71203cd49d');
	}

})(angular);