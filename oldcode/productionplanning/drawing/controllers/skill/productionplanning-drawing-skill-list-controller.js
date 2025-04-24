/**
 * Created by zwz on 2022/03/08
 */

(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.drawing';

	/**
	 * @ngdoc controller
	 * @name productionplanningDrawingSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of drawing skill entities.
	 **/

	angular.module(moduleName).controller('productionplanningDrawingSkillListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6ab72263fd7d49b98ca55ecdaf21e3fd');
	}

})(angular);