/**
 * Created by zwz on 03/15/2022.
 */

(function (angular) {
	'use strict';
	/* global angular, Slick, globals, _ */
	let moduleName = 'productionplanning.product';

	angular.module(moduleName).factory('productionplanningProductEngProdCompMapDialogService', DialogService);
	DialogService.$inject = ['$http', '$injector', '$translate',
		'platformTranslateService', 'platformGridAPI',
		'productionplanningProductEngProdComponentUIStandardService'];

	function DialogService($http, $injector, $translate,
		platformTranslateService, platformGridAPI,
		prodComponentUIStandardService) {

		let service = {};

		let gridColumns = _.cloneDeep(prodComponentUIStandardService.getStandardConfigForListView().columns);
		_.forEach(gridColumns, function (o) {
			o.editor = null;
			o.navigator = null;
		});
		gridColumns.splice(0,0,{
			id: 'MappedQuantity',
			field: 'MappedQuantity',
			formatter: 'decimal',
			editor: 'decimal',
			name: '*Mapped Quantity',
			name$tr$: 'productionplanning.product.engProdComponent.MappedQuantity',
			toolTip: '*Mapped Quantity',
			toolTip$tr$: 'productionplanning.product.engProdComponent.MappedQuantity'
		});

		function getGridConfig(engProdComponentWithMapInfos) {
			return {
				id: '9d30c08e067040d3b8d4cd3d46beb2e2',
				state: '9d30c08e067040d3b8d4cd3d46beb2e2',
				columns: gridColumns,
				options: {
					indicator: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				data: engProdComponentWithMapInfos
			};
		}

		service.initial = function initial($scope, $options) {
			_.extend($scope, $options);

			// grid config
			let gridConfig = getGridConfig($scope.engProdComponentWithMapInfos);
			gridConfig.columns.current = gridConfig.columns;
			platformGridAPI.grids.config(gridConfig);
			$scope.grid = gridConfig;

			$scope.isOKDisabled = function () {
				// do nothing...
			};

			$scope.handleOK = function () {
				platformGridAPI.grids.commitAllEdits();
				_.forEach($scope.grid.data, function (o) {
					o.EngProdComponentTargetFk = $scope.targetEngProdComponent.Id;
				});
				let updateDto = {
					//MainItemId: $scope.targetEngProdComponent.Id,
					EngProdComponentWithMapInfos: $scope.grid.data
				};
				$http.post(globals.webApiBaseUrl+'productionplanning/product/engprodcomponentwithmap/update',updateDto);
				$scope.$close(true);
			};

			$scope.modalOptions = {
				headerText: $translate.instant('productionplanning.product.engProdComponent.engPropCompMapDialogTitle'),
				cancel: close
			};

			function close() {
				return $scope.$close(false);
			}
		};

		return service;
	}

})(angular);
