/**
 * Created by leo on 23.03.2015.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.template';
	/**
	 * @ngdoc controller
	 * @name schedulingTemplatePerformanceRuleListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplatePerformanceRuleListController', SchedulingTemplatePerformanceRuleListController);

	SchedulingTemplatePerformanceRuleListController.$inject = ['$scope','platformContainerControllerService'];
	function SchedulingTemplatePerformanceRuleListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'A7F6EEA9117C4F72BB73F88709F6583D');
	}

})();