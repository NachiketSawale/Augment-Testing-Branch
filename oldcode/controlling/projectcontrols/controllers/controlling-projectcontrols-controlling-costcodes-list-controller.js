

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectControlsControllingCostCodesListController',
		['_', '$scope', '$timeout', 'platformGridAPI', 'platformGridControllerService', 'basicsControllingCostCodesUIStandardService', 'controllingProjectControlsControllingCostCodesMainService', 'controllingProjectControlsUIConfigurationService',
			function (_, $scope, $timeout, platformGridAPI, platformGridControllerService, basicsControllingCostCodesUIStandardService, dataService, controllingProjectControlsUIConfigurationService) {

				$scope.config = controllingProjectControlsUIConfigurationService.getStandardConfigForListView();
				$scope.scheme = controllingProjectControlsUIConfigurationService.getDtoScheme();
				let columnRenames = {
					'sv': 'SV',
					'cv': 'CV',
					'spi': 'SPI',
					'cpi': 'CPI'
				};

				if (_.isArray($scope.config.columns) && $scope.config.columns.length > 0) {
					_.forEach($scope.config.columns, function (column) {
						column.name$tr$ = null;
						column.name = columnRenames[column.id] || column.name;
					});
				}

				let gridConfig = {
					initCalled: false,
					columns: [],
					parentProp: 'StructureParentId',
					childProp: 'Children',
					type: 'contrCostCodesList'
				};
				dataService.setGridColumns($scope.config.columns);
				platformGridControllerService.initListController($scope, controllingProjectControlsUIConfigurationService, dataService, null, gridConfig);

				function updateTools() {
					$scope.tools.items = _.filter($scope.tools.items, function (d) {
						return d.id === 't12' || d.id === 'gridSearchAll' ||
							d.id === 'gridSearchColumn' || d.id === 't200' || d.id === 'collapsenode' ||
							d.id === 'expandnode' || d.id === 'collapseall' || d.id === 'expandall';
					});
					$scope.tools.update();
				}

				updateTools();


				function resizeColumns(){

					var columnsConfiguration = platformGridAPI.columns.configuration($scope.gridId);
					var columns = columnsConfiguration.current;

					columns = _.filter(columns,function name(d) {
						return (d.id !=='wcf' && d.id !=='bcf');
					});

					platformGridAPI.columns.configuration($scope.gridId, columns);
					platformGridAPI.grids.refresh($scope.gridId);
					platformGridAPI.grids.invalidate($scope.gridId);
				}

				$timeout(function() {
					resizeColumns();
				});

				$scope.$on('$destroy', function () {

				});
			}
		]);
})(angular);