/**
 * Created by leo on 18.11.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.templategroup';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateEventTemplateListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingTemplateActivityTmplGrp2CUGrpListController', SchedulingTemplateActivityTmplGrp2CUGrpListController);

	SchedulingTemplateActivityTmplGrp2CUGrpListController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplateActivityTmplGrp2CUGrpListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '038BAA2DC7A94E56900B1C3F21FFC7AF');
	}
})();