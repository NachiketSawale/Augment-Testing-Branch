/**
 * Created by leo on 21.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTemplateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of eactivity template entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateActivityTemplateDetailController', SchedulingTemplateActivityTemplateDetailController);

	SchedulingTemplateActivityTemplateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplateActivityTemplateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652D060', 'schedulingTemplateTranslationService');
	}
})(angular);