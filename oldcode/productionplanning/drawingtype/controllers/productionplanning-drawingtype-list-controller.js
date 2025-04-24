/**
 * Created by zwz on 2022/03/02
 */

(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc controller
	 * @name productionPlanningDrawingTypeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of drawing type entities.
	 **/

	angular.module(moduleName).controller('productionPlanningDrawingTypeListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService', 'productionPlanningDrawingTypeConstantValues'];

	function ListController($scope, platformContainerControllerService, constantValues) {
		platformContainerControllerService.initController($scope, moduleName, constantValues.uuid.container.drawingTypeList);
	}

})(angular);