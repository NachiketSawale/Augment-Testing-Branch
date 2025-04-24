/**
 * Created by xia on 5/8/2019.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.indextable';

	/**
     * @ngdoc controller
     * @name BasicsIndexDetailDetailController
     * @function
     *
     * @description
     * Controller for the  index header view of unit entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsIndexDetailDetailController', BasicsIndexDetailDetailController);

	BasicsIndexDetailDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsIndexDetailDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '85204B8ECC5E4921A5C004B18FD01507', 'basicsIndextableTranslationService');
	}
})(angular);
