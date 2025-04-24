/**
 * Created by baf on 2016/06/01.
 */
(function () {

	'use strict';
	var moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationSourceListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of resource entities
	 **/
	angular.module(moduleName).controller('cloudTranslationSourceListController', CloudTranslationSourceListController);

	CloudTranslationSourceListController.$inject = ['$scope','platformContainerControllerService'];
	function CloudTranslationSourceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '55c5907fd4224605876685a2b6066783');
	}
})();