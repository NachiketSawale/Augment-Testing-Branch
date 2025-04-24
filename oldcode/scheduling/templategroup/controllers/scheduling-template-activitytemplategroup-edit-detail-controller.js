/**
 * Created by leo on 21.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.templategroup';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTmplGrpEditDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of activity template group entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateActivityTmplGrpEditDetailController', SchedulingTemplateActivityTmplGrpEditDetailController);

	SchedulingTemplateActivityTmplGrpEditDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplateActivityTmplGrpEditDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9F6BDD0C5B51423CA2BCA64FE103187C', 'schedulingTemplateTranslationService');
	}
})(angular);