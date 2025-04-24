/**
 * Created by zwz on 2022/03/08
 */


(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.drawing';

	/**
	 * @ngdoc controller
	 * @name productionplanningDrawingSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of drawing skill entities.
	 **/
	angular.module(moduleName).controller('productionplanningDrawingSkillDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function DetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '55031220d38b4abd858c2301acebbace');
	}

})(angular);