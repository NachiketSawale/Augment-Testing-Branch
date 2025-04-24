(function () {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection

	angular.module(moduleName).controller('schedulingMainPredecessorListController', SchedulingMainPredecessorListController);

	SchedulingMainPredecessorListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsLookupdataLookupDescriptorService', 'schedulingMainService'];

	function SchedulingMainPredecessorListController($scope, platformContainerControllerService, basicsLookupdataLookupDescriptorService, schedulingMainService) {
		var data = schedulingMainService.getList();
		basicsLookupdataLookupDescriptorService.updateData('activityfk', data);

		platformContainerControllerService.initController($scope, 'scheduling.main', 'e4a4e97657ef4068bdf1367afca01375');
	}
})();
