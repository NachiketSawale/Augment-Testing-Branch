(function (angular, globals) {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name platformGridFormControl
	 * @element div
	 * @restrict A
	 * @priority default value
	 * @description
	 * Insert a grid for the desktop layout formular
	 */
	let modulename = 'platform';
	let directiveName = 'platformGridFormControl';

	angular.module(modulename).directive(directiveName, ['platformGridAPI', '_', function (platformGridAPI, _) {
		return {

			restrict: 'A',
			scope: {
				options: '=',
				gridData: '=ngModel',
			},
			templateUrl: globals.appBaseUrl + 'app/components/formcontrols/template/platform-grid-form-control-template.html',
			link: linker,
			controller: ['$scope', function($scope) {
				let options = _.get($scope, 'options');
				let gridId = _.get(options, 'gridConfig.id', options.gridId);
				if (!gridId) {
					throw 'The necessary property "gridId" is missing in "options.gridConfig"';
				}
				$scope.gridId = gridId;

				if (!_.get($scope, 'gridData')) {
					_.set($scope, 'gridData', []);
				}

				$scope.overlay = options.overlay;

				if (!platformGridAPI.grids.exist(gridId)) {
					let finalGridConfig;
					if ($scope.options.gridConfig) {
						finalGridConfig = _.assign({}, $scope.options.gridConfig, { data: $scope.gridData});
					}

					platformGridAPI.grids.config(finalGridConfig);
				}
			}]
		};

		function linker(scope) {
			function updateState() {
				// To ensure that the toolbar is updated.
				scope.$evalAsync();
			}

			platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', updateState);

			scope.$on('$destroy', function () {
				platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', updateState);
			});
		}
	}]);
})(angular, globals);
