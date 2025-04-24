/**
 * Created by leo on 17.11.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.template';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingTemplateActivityTemplateGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of ActivityTemplateGroup entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingTemplateActivityTemplateGroupListController', SchedulingTemplateActivityTemplateGroupListController);

	SchedulingTemplateActivityTemplateGroupListController.$inject = ['$scope','platformContainerControllerService','schedulingTemplateGrpMainService', 'basicsLookupdataLookupDescriptorService'];
	function SchedulingTemplateActivityTemplateGroupListController($scope, platformContainerControllerService, schedulingTemplateGrpMainService, basicsLookupdataLookupDescriptorService) {

		basicsLookupdataLookupDescriptorService.updateData('activitytemplategroupfk', schedulingTemplateGrpMainService.getList());

		platformContainerControllerService.initController($scope, moduleName, 'AFECDE4A08404395855258B70652D04C');

		if(schedulingTemplateGrpMainService.loadNew)
		{
			schedulingTemplateGrpMainService.load();
		}
	}
})();