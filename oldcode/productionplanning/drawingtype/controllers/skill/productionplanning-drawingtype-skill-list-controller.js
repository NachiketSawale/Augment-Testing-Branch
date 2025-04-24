/**
 * Created by zwz on 2022/03/03
 */

(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc controller
	 * @name productionPlanningDrawingTypeSkillListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of drawing type skill entities.
	 **/

	angular.module(moduleName).controller('productionPlanningDrawingTypeSkillListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService', 'productionPlanningDrawingTypeConstantValues'];

	function ListController($scope, platformContainerControllerService, constantValues) {
		platformContainerControllerService.initController($scope, moduleName, constantValues.uuid.container.drawingTypeSkillList);
	}

})(angular);