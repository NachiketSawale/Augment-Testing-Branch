(function () {

	'use strict';
	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainBaselineSuccessorListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingMainBaselineSuccessorListController', SchedulingMainBaselineSuccessorListController);

	SchedulingMainBaselineSuccessorListController.$inject = ['$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'basicsLookupdataLookupDescriptorService', 'schedulingMainActivityBaseLineComparisonService', 'schedulingMainSuccessorRelationshipDataService', 'schedulingMainConstantValues'];

	function SchedulingMainBaselineSuccessorListController($scope, platformContainerControllerService, platformContainerCreateDeleteButtonService, basicsLookupdataLookupDescriptorService, schedulingMainActivityBaseLineComparisonService, schedulingMainSuccessorRelationshipDataService, schedulingMainConstantValues) {
		let data = schedulingMainActivityBaseLineComparisonService.getList();
		basicsLookupdataLookupDescriptorService.updateData('activityfk', data);

		platformContainerControllerService.initController($scope, 'scheduling.main', schedulingMainConstantValues.uuid.container.baselineSuccessorList);
	}
})();