/**
 * Created by leo on 21.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTmplGrpEditDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of activity template group entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateActivityTmplGrpDetailController', SchedulingTemplateActivityTmplGrpDetailController);

	SchedulingTemplateActivityTmplGrpDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplateActivityTmplGrpDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652F060', 'schedulingTemplateTranslationService');
	}
})(angular);