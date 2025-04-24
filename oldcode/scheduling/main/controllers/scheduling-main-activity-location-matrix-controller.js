/* global _ */
/**
 * Created by baf on 16.11.2015.
 */
(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainActivityLocationMatrixController
	 * @function
	 *
	 * @description
	 * Controller for matrix with horizontal location data, vertical activity data and activity data in cells
	 **/
	angular.module(moduleName).controller('schedulingMainActivityLocationMatrixController', SchedulingMainActivityLocationMatrixController);

	SchedulingMainActivityLocationMatrixController.$inject = ['$scope', 'platformMatrixControllerService', 'schedulingMainActivityLocationMatrixService', '$rootScope'];

	function SchedulingMainActivityLocationMatrixController($scope, platformMatrixControllerService, schedulingMainActivityLocationMatrixService, $rootScope) {

		var self = this;

		var config = {
			matrixDataSource: 1,
			horizontalParent: 'LocationParentFk',
			horizontalChildren: 'Locations',
			verticalParent: 'ParentActivityFk',
			verticalChildren: 'Activities',
			linkProperty: 'LocationFk',
			schemaInfo: {
				typeName: 'ActivityDto',
				moduleSubModule: 'Scheduling.Main'
			},
			containerUUID:$scope.getContainerUUID(),
			// default fields to show when no config is provided
			defaultContentDefinition:{
				PropertyIdentifier11:'code',
				PropertyIdentifier12:'description',
				PropertyIdentifier21:'plannedstart' ,
				PropertyIdentifier22:'plannedfinish'
			},
			uiStandardServiceName:'schedulingMainActivityStandardConfigurationService'
		};

		$scope.gridConfigReady = false;

		function init() {
			schedulingMainActivityLocationMatrixService.disConnect();
			if (_.isFunction(platformMatrixControllerService.unregister)) {
				platformMatrixControllerService.unregister();
			}
			self.setLoading();
			return schedulingMainActivityLocationMatrixService.createMainActivityLocationMatrixService(config).then(function (matrixService) {
				platformMatrixControllerService.initMatrixController($scope, matrixService, config);
				schedulingMainActivityLocationMatrixService.connect(self);
				$scope.gridConfigReady = true;
			});
		}

		self.setLoading = function setLoading() {
			$scope.gridConfigReady = false;
		};

		self.reinitializeMatrix = function reinitializeMatrix() {
			return init();
		};

		self.reload = function () {
			schedulingMainActivityLocationMatrixService.reload();
		};

		$rootScope.$on('configUpdated', self.reload);

		$scope.$on('$destroy', function () {
			schedulingMainActivityLocationMatrixService.disConnect();
		});

		init();
	}

})(angular);