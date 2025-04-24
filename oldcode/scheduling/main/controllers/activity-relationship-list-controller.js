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

	angular.module(moduleName).controller('schedulingMainRelationshipListController', SchedulingMainRelationshipListController);

	SchedulingMainRelationshipListController.$inject = ['$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'basicsLookupdataLookupDescriptorService', 'schedulingMainService', 'schedulingMainSuccessorRelationshipDataService'];

	function SchedulingMainRelationshipListController($scope, platformContainerControllerService, platformContainerCreateDeleteButtonService, basicsLookupdataLookupDescriptorService, schedulingMainService, schedulingMainSuccessorRelationshipDataService) {
		var data = schedulingMainService.getList();
		var updateStateOfToolBarButtons = function updateStateOfToolBarButtons() {
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, schedulingMainSuccessorRelationshipDataService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		};

		basicsLookupdataLookupDescriptorService.updateData('activityfk', data);

		platformContainerControllerService.initController($scope, 'scheduling.main', 'D8FE0DF4C85241048ABEA198A699595A');

		schedulingMainService.registerCallBackOnChangeActivityType(updateStateOfToolBarButtons);

		$scope.$on('$destroy', function () {
			schedulingMainService.unRegisterCallBackOnChangeActivityType(updateStateOfToolBarButtons);
		});
	}
})();