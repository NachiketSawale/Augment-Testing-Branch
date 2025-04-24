/**
 * Created by xia on 5/8/2019.
 */
(function (angular) {

	'use strict';
	let moduleName = 'basics.indextable';

	/**
     * @ngdoc controller
     * @name basicsIndexHeaderDetailController
     * @function
     *
     * @description
     * Controller for the  index header view of unit entities.
     **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsIndexHeaderDetailController', BasicsIndexHeaderDetailController);

	BasicsIndexHeaderDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function BasicsIndexHeaderDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '65CADB68E8484235BA460341A509DB7F', 'basicsIndextableTranslationService');
	}
})(angular);
