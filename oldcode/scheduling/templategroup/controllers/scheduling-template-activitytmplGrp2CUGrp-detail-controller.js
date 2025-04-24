/**
 * Created by leo on 21.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.templategroup';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTmplGrp2CUGrpDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of ActivityTmplGrp2CUGrp template entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateActivityTmplGrp2CUGrpDetailController', SchedulingTemplateActivityTmplGrp2CUGrpDetailController);

	SchedulingTemplateActivityTmplGrp2CUGrpDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplateActivityTmplGrp2CUGrpDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '54259D07F8CC42C7AD5B3CD44D39E3E1', 'schedulingTemplateTranslationService');
	}
})(angular);