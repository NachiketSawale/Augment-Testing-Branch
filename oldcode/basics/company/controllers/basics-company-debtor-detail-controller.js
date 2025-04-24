/**
 * Created by baf on 16.05.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyDebtorDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics company debtor entities.
	 **/
	angular.module(moduleName).controller('basicsCompanyDebtorDetailController', BasicsCompanyDebtorDetailController);

	BasicsCompanyDebtorDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyDebtorDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3dac85c30d4c468c9678d9f010a8501a');
	}

})(angular);