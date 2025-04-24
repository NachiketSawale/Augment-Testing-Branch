/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyCreditorListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics company creditor entities.
	 **/

	angular.module(moduleName).controller('basicsCompanyCreditorListController', BasicsCompanyCreditorListController);

	BasicsCompanyCreditorListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyCreditorListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bc9dee680be8436591036d1438c11296');
	}
})(angular);