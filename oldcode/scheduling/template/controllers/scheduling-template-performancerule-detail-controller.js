/**
 * Created by leo on 23.03.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplatePerformanceRuleDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of performance sheet entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplatePerformanceRuleDetailController', SchedulingTemplatePerformanceRuleDetailController);

	SchedulingTemplatePerformanceRuleDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplatePerformanceRuleDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8CBBCED1A6E142D095F19E0387AF0664', 'schedulingTemplateTranslationService');
	}
})(angular);