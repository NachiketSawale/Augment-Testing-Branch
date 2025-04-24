/**
 * Created by baf on 07.06.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyTimekeepingGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics company timekeepingGroup entities.
	 **/

	angular.module(moduleName).controller('basicsCompanyTimekeepingGroupListController', BasicsCompanyTimekeepingGroupListController);

	BasicsCompanyTimekeepingGroupListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyTimekeepingGroupListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fad2f7ae9ac24fffa884a5245d4e8d18');
	}
})(angular);