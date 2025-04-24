/**
 * Created by leo on 18.11.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.template';
	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTmpl2CUGrpListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingTemplateActivityTmpl2CUGrpListController', SchedulingTemplateActivityTmpl2CUGrpListController);

	SchedulingTemplateActivityTmpl2CUGrpListController.$inject = ['$scope','platformContainerControllerService'];
	function SchedulingTemplateActivityTmpl2CUGrpListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652D050');
	}
})();