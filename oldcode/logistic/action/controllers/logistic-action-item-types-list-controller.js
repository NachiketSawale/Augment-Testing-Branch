/**
 * Created by Shankar on 20.01.2025
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionItemTypesListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic action item types entities.
	 **/

	angular.module(moduleName).controller('logisticActionItemTypesListController', LogisticActionItemTypesListController);

	LogisticActionItemTypesListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticActionItemTypesListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '655124b7bd5447d8805276058df6027d');
	}
})(angular);