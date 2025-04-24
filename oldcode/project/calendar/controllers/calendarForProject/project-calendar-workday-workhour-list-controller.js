/**
 * Created by leo on 11.03.2019.
 */
(function () {

	'use strict';
	var moduleName = 'project.calendar';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name projectCalendarWorkdayWorkhourListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of workday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('projectCalendarWorkdayWorkhourListController',
		['_', '$scope', '$timeout', 'platformModuleInitialConfigurationService', 'projectCalendarForProjectDataServiceFactory',
			'platformGridAPI', 'projectCalendarValidationServiceFactory',
			function (_, $scope, $timeout, platformModuleInitialConfigurationService, projectCalendarForProjectDataServiceFactory,
				platformGridAPI, projectCalendarValidationServiceFactory) {

				var parentAllowCreateDelete = false;
				var parentTemplUid = 'f3d6a5449d10497d9a09fbb7807260fb';
				var modConf = platformModuleInitialConfigurationService.get('Project.Calendar');
				if (!modConf) {
					modConf = platformModuleInitialConfigurationService.get('Project.Main');
				}
				var parentTemplInfo = _.find(modConf.container, function (c) {
					return c.layout === parentTemplUid;
				});
				var parentSrv = projectCalendarForProjectDataServiceFactory.createDataService(parentTemplInfo, parentAllowCreateDelete);
				var validationService = projectCalendarValidationServiceFactory.createValidationService(parentTemplInfo, parentSrv);

				var defineGrid = function () {
					var selectItem = parentSrv.getSelected();
					if (parentSrv.isSelection(selectItem) && selectItem.WorkHourDefinesWorkDay) {
						$scope.workHour = true;
						$scope.workDay = false;
						$scope.gridId = 'f915322c445c4463ab40f8993a800056';
					} else if (parentSrv.isSelection(selectItem)) {
						$scope.workHour = false;
						$scope.workDay = true;
						$scope.gridId = '9c7070fe60f34d27a9a1003bf03d9bac';
					}
					$timeout(function () {
						if ($scope.gridId) {
							platformGridAPI.grids.resize($scope.gridId);
						}
					}, 600);
				};
				defineGrid();

				var defineGridValue = function (value) {
					if (value) {
						$scope.workHour = true;
						$scope.workDay = false;
						$scope.gridId = 'f915322c445c4463ab40f8993a800056';
					} else {
						$scope.workHour = false;
						$scope.workDay = true;
						$scope.gridId = '9c7070fe60f34d27a9a1003bf03d9bac';
					}
					$timeout(function () {
						if ($scope.gridId) {
							platformGridAPI.grids.resize($scope.gridId);
						}
					}, 600);
				};

				parentSrv.registerSelectionChanged(defineGrid);
				validationService.changedWorkhourDefinesWorkday.register(defineGridValue);
				$scope.$on('$destroy', function () {
					validationService.changedWorkhourDefinesWorkday.unregister(defineGridValue);
					parentSrv.unregisterSelectionChanged(defineGrid);
				});
			}
		]);
})();
