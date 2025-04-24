/**
 * Created By Roberson Luo 2016-07-11
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCommonLanguageDialogGridControllerService
	 * @function
	 * @description
	 * #
	 * Service for initializing a controller for the form row translation directive in dialog.
	 **/
	angular.module('basics.common').factory('basicsCommonLanguageDialogGridControllerService', [
		'cloudCommonLanguageService', 'cloudCommonLanguageGridConfig', 'platformGridAPI',
		function (cloudCommonLanguageService, cloudCommonLanguageGridConfig, platformGridAPI) {
			const service = {};

			service.initLanguageController = function initLanguageController($scope, options) {
				$scope.gridId = options.gridId;

				$scope.getContainerUUID = function () {
					return $scope.gridId;
				};

				// init grid if not already done....
				const gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
				if (!gridInstance) {
					const grid = {
						data: [],
						columns: angular.copy(cloudCommonLanguageGridConfig),
						id: $scope.gridId,
						options: {
							tree: false,
							indicator: true,
							skipPermissionCheck: options.skipPermissionCheck || false  // (todo: Roberson) need to add it in language-grid-controller.js line 66)
						}
					};
					platformGridAPI.grids.config(grid);
				}

				if (options.onBeforeEditCell) {
					platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', options.onBeforeEditCell);
				}

				$scope.$on('$destroy', function () {
					if (options.onBeforeEditCell) {
						platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', options.onBeforeEditCell);
					}
				});
			};

			return service;
		}
	]);
})(angular);
