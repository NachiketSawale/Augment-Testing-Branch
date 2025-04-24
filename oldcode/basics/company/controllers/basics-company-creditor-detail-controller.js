/**
 * Created by baf on 16.05.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyCreditorDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics company creditor entities.
	 **/
	angular.module(moduleName).controller('basicsCompanyCreditorDetailController', BasicsCompanyCreditorDetailController);

	BasicsCompanyCreditorDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyCreditorDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f419dce401ca4f378598eec59b296b63');
	}

})(angular);