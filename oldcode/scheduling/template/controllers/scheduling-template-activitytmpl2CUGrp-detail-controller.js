/**
 * Created by leo on 21.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.template';

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTmplGrp2CUGrpDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of ActivityTmplGrp2CUGrp template entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateActivityTmpl2CUGrpDetailController', SchedulingTemplateActivityTmpl2CUGrpDetailController);

	SchedulingTemplateActivityTmpl2CUGrpDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function SchedulingTemplateActivityTmpl2CUGrpDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652D080', 'schedulingTemplateTranslationService');
	}
})(angular);