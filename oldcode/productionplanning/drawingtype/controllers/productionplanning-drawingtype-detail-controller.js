/**
 * Created by zwz on 2022/03/02
 */


(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc controller
	 * @name productionPlanningDrawingTypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of drawing type entities.
	 **/
	angular.module(moduleName).controller('productionPlanningDrawingTypeDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionPlanningDrawingTypeConstantValues'];

	function DetailController($scope, platformContainerControllerService, constantValues) {
		platformContainerControllerService.initController($scope, moduleName, constantValues.uuid.container.drawingTypeDetails);
	}

})(angular);