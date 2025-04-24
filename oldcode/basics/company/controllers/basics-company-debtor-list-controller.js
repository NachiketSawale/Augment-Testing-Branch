/**
 * Created by baf on 16.05.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyDebtorListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of basics company debtor entities.
	 **/

	angular.module(moduleName).controller('basicsCompanyDebtorListController', BasicsCompanyDebtorListController);

	BasicsCompanyDebtorListController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyDebtorListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '21ea54ddccde46cea63aeaa86eb82b1b');
	}
})(angular);