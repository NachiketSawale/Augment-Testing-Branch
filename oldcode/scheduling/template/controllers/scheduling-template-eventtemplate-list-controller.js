/**
 * Created by leo on 18.11.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.template';
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
	angModule.controller('schedulingTemplateEventTemplateListController', SchedulingTemplateEventTemplateListController);

	SchedulingTemplateEventTemplateListController.$inject = ['$scope','platformContainerControllerService'];
	function SchedulingTemplateEventTemplateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652D04E');
	}
})();