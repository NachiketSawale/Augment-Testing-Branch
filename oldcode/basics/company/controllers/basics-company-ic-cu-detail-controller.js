/**
 * Created by leo on 18.02.2021
 */

(function (angular) {

	'use strict';
	var moduleName = 'basics.company';

	/**
	 * @ngdoc controller
	 * @name basicsCompanyICCuDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of basics company IC CU entities.
	 **/
	angular.module(moduleName).controller('basicsCompanyICCuDetailController', BasicsCompanyICCuDetailController);

	BasicsCompanyICCuDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsCompanyICCuDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3bff3962163b4ab49afda5a5e9199e0c', 'basicsCompanyTranslationService');
	}

})(angular);
