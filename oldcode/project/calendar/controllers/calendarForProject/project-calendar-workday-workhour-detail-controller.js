/**
 * Created by leo on 11.03.2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'project.calendar';

	/**
	 * @ngdoc controller
	 * @name projectCalendarWorkdayWorkhourDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of weekday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('projectCalendarWorkdayWorkhourDetailController', ['_', '$scope', 'platformModuleInitialConfigurationService', 'platformDetailControllerService',
		'projectCalendarForProjectDataServiceFactory', 'projectCalendarValidationServiceFactory',
		function (_, $scope, platformModuleInitialConfigurationService, platformDetailControllerService, projectCalendarForProjectDataServiceFactory, projectCalendarValidationServiceFactory) {

			var parentAllowCreateDelete = false;
			var parentTemplUid = 'f3d6a5449d10497d9a09fbb7807260fb';
			var modConf = platformModuleInitialConfigurationService.get('Project.Calendar');
			if (!modConf){
				modConf = platformModuleInitialConfigurationService.get('Project.Main');
			}
			var parentTemplInfo = _.find(modConf.container, function(c) { return c.layout === parentTemplUid; });
			var parentSrv = projectCalendarForProjectDataServiceFactory.createDataService(parentTemplInfo, parentAllowCreateDelete);
			var validationService = projectCalendarValidationServiceFactory.createValidationService(parentTemplInfo, parentSrv);
			var defineGrid = function() {
				var selectItem = parentSrv.getSelected();
				if (parentSrv.isSelection(selectItem) && parentSrv.getSelected().WorkHourDefinesWorkDay) {
					$scope.workHour = true;
					$scope.workDay = false;
				} else {
					$scope.workHour = false;
					$scope.workDay = true;
				}
			};
			
			var defineGridValue = function(value) {
				if (value) {
					$scope.workHour = true;
					$scope.workDay = false;
				} else {
					$scope.workHour = false;
					$scope.workDay = true;
				}
			};
			
			defineGrid();
			parentSrv.registerSelectionChanged(defineGrid);
			validationService.changedWorkhourDefinesWorkday.register(defineGridValue);
			$scope.$on('$destroy', function () {
				validationService.changedWorkhourDefinesWorkday.unregister(defineGridValue);
				parentSrv.unregisterSelectionChanged(defineGrid);
			});
		}
	]);
})(angular);