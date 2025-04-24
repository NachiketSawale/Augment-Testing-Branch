(function () {

	'use strict';
	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingMainBaselinePredecessorListController', SchedulingMainBaselinePredecessorListController);

	SchedulingMainBaselinePredecessorListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsLookupdataLookupDescriptorService', 'schedulingMainActivityBaseLineComparisonService', 'schedulingMainConstantValues'];

	function SchedulingMainBaselinePredecessorListController($scope, platformContainerControllerService, basicsLookupdataLookupDescriptorService, schedulingMainActivityBaseLineComparisonService, schedulingMainConstantValues) {
		let data = schedulingMainActivityBaseLineComparisonService.getList();
		basicsLookupdataLookupDescriptorService.updateData('activityfk', data);

		platformContainerControllerService.initController($scope, 'scheduling.main', schedulingMainConstantValues.uuid.container.baselinePredecessorList);
	}
})();
