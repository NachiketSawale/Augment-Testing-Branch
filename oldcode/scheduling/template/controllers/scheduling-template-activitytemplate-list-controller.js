/**
 * Created by leo on 18.11.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.template';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTemplateListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of schedule entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingTemplateActivityTemplateListController', SchedulingTemplateActivityTemplateListController);

	SchedulingTemplateActivityTemplateListController.$inject = ['$scope','platformContainerControllerService','schedulingTemplateGrpMainService','basicsLookupdataLookupDescriptorService'];
	function SchedulingTemplateActivityTemplateListController($scope, platformContainerControllerService, schedulingTemplateGrpMainService, basicsLookupdataLookupDescriptorService) {

		basicsLookupdataLookupDescriptorService.updateData('activitytemplategroupfk', schedulingTemplateGrpMainService.getList());

		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652D04D');
	}
})();