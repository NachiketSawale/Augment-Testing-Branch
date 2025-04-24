/**
 * Created by zwz on 2022/03/03
 */


(function (angular) {

	'use strict';
	const moduleName = 'productionplanning.drawingtype';

	/**
	 * @ngdoc controller
	 * @name productionPlanningDrawingTypeSkillDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of drawing type skill entities.
	 **/
	angular.module(moduleName).controller('productionPlanningDrawingTypeSkillDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionPlanningDrawingTypeConstantValues'];

	function DetailController($scope, platformContainerControllerService, constantValues) {
		platformContainerControllerService.initController($scope, moduleName, constantValues.uuid.container.drawingTypeSkillDetails);
	}

})(angular);