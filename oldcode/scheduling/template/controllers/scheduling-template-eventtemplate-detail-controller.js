/**
 * Created by leo on 21.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.template';
	/**
	 * @ngdoc controller
	 * @name schedulingTemplateEventTemplateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of event template entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateEventTemplateDetailController', SchedulingTemplateEventTemplateDetailController);

	SchedulingTemplateEventTemplateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplateEventTemplateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652D070', 'schedulingTemplateTranslationService');
	}
})(angular);