/**
 * Created by baf on 30.05.2016.
 */
(function () {

	'use strict';
	var moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationLanguageListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of resource entities
	 **/
	angular.module(moduleName).controller('cloudTranslationLanguageListController', CloudTranslationLanguageListController);

	CloudTranslationLanguageListController.$inject = ['$scope','platformContainerControllerService'];
	function CloudTranslationLanguageListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'f13984620ae3483c913aef196f02ad7e');
	}
})();