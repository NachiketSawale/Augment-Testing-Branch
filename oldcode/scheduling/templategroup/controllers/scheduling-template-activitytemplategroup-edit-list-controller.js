/**
 * Created by leo on 17.11.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.templategroup';
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
	angModule.controller('schedulingTemplateActivityTmplGrpEditListController', SchedulingTemplateActivityTmplGrpEditListController);

	SchedulingTemplateActivityTmplGrpEditListController.$inject = ['$scope','platformContainerControllerService','basicsLookupdataLookupDescriptorService','schedulingTemplateGrpEditService'];
	function SchedulingTemplateActivityTmplGrpEditListController($scope, platformContainerControllerService, basicsLookupdataLookupDescriptorService, schedulingTemplateGrpEditService) {
		basicsLookupdataLookupDescriptorService.updateData('activitytemplategroupfk', schedulingTemplateGrpEditService.getList());
		platformContainerControllerService.initController($scope, moduleName, '59E580ECAB1F42608B3AB858DCBC22B0');
	}
})();