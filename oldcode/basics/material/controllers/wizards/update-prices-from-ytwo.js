/**
 * Created by chi on 8/17/2017.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.material';
	angular.module(moduleName).controller('basicsMaterialUpdateMaterialPricesFromYtwoController', basicsMaterialUpdateMaterialPricesFromYtwoController);

	basicsMaterialUpdateMaterialPricesFromYtwoController.$inject = ['$scope', '_', '$http', 'globals', 'platformGridAPI', 'platformTranslateService'];

	function basicsMaterialUpdateMaterialPricesFromYtwoController($scope, _, $http, globals, platformGridAPI, platformTranslateService) {

		var options = $scope.modalOptions;

		if (angular.isUndefined(options.gridId) || options.gridId === null) {
			throw new Error('Please define the "gridId".');
		}

		var resultGridId = options.gridId;

		var getUrl = options.getUrl;

		var getRequestParams = options.getRequestParams;

		var updateUrl = options.updateUrl;

		var updateRequestParams = options.updateRequestParams;

		var customMapData = options.customMapData;

		var resultGridColumns = [
			{
				id: 'CatalogCode',
				field: 'CatalogCode',
				name: 'Material Catalog Code',
				name$tr$: 'cloud.common.entityMaterialCatalogCode',
				width: 90,
				formatter: 'description'
			},
			{
				id: 'CatalogDescription',
				field: 'CatalogDescription',
				name: 'Material Catalog Description',
				name$tr$: 'cloud.common.entityMaterialCatalogDescription',
				formatter: 'description',
				width: 150
			},
			{
				id: 'MaterialCode',
				field: 'MaterialCode',
				name: 'Material Code',
				name$tr$: 'basics.common.entityMaterialCode',
				width: 90,
				formatter: 'description'
			},
			{
				id: 'MaterialDescription',
				field: 'MaterialDescription',
				name: 'Material Description',
				name$tr$: 'basics.common.entityMaterialDescription',
				width: 150,
				formatter: 'description'
			},
			{
				id: 'UomFk',
				field: 'UomFk',
				name: 'UoM',
				name$tr$: 'cloud.common.entityUoM',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'Uom',
					displayMember: 'Unit'
				},
				width: 100
			},
			{
				id: 'OldEstimatePrice',
				field: 'OldEstimatePrice',
				name: 'Old Cost',
				name$tr$: 'basics.common.entityOldCost',
				width: 100,
				formatter: 'number'
			},
			{
				id: 'NewEstimatePrice',
				field: 'NewEstimatePrice',
				name: 'New Cost',
				name$tr$: 'basics.common.entityNewCost',
				width: 100,
				formatter: 'number'
			},
			{
				id: 'currencyFk',
				field: 'CurrencyFk',
				name: 'Currency',
				name$tr$: 'cloud.common.entityCurrency',
				searchable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'currency',
					displayMember: 'Currency'
				},
				width: 100
			},
			{
				id: 'Source',
				field: 'Source',
				name: 'Source',
				name$tr$: 'cloud.translation.source',
				width: 100,
				formatter: 'description'
			},
			{
				id: 'Comment',
				field: 'Comment',
				name: 'Comment',
				name$tr$: 'cloud.common.entityCommentText',
				width: 150,
				editor: 'description',
				formatter: 'description'
			}
		];

		var hasGridData = false;

		var updateData = [];

		$scope.isLoading = false;

		$scope.gridData = {
			state: resultGridId
		};

		$scope.canUpdate = canUpdate;

		$scope.update = update;

		if (angular.isArray(options.customColumns)) {
			var customCols = options.customColumns;
			_.forEach(customCols, function(col){
				var found = _.find(resultGridColumns, {id: col.id});
				if (found) {
					found = col;
				}
				else {
					resultGridColumns.push(col);
				}
			});
		}

		initialize();

		////////////////////////////////////////////

		function setupGrid() {

			var columns = angular.copy(resultGridColumns);

			if (!platformGridAPI.grids.exist(resultGridId)) {
				var resultGridConfig = {
					columns: columns,
					data: [],
					id: resultGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(resultGridConfig);
				platformTranslateService.translateGridConfig(resultGridConfig.columns);
			}
		}

		function updateGrid(resultGridData) {
			platformGridAPI.grids.invalidate(resultGridId);
			platformGridAPI.items.data(resultGridId, resultGridData);
		}

		function canUpdate() {
			return hasGridData;
		}

		function update() {
			$scope.isLoading = true;
			var promise = null;

			if (angular.isObject(updateRequestParams) || angular.isArray(updateRequestParams)) {
				for (var prop in updateRequestParams) {
					if (updateRequestParams.hasOwnProperty(prop) && updateRequestParams[prop] === '##updateData##') {
						updateRequestParams[prop] = updateData;
					}
				}

				promise = $http.post(globals.webApiBaseUrl + updateUrl, updateRequestParams);
			}else {
				promise = $http.get(globals.webApiBaseUrl + updateUrl + (updateRequestParams !== null && angular.isDefined(updateRequestParams) ? updateRequestParams : ''));
			}

			promise.then(function (response) {
				$scope.isLoading = false;
				if (response.data === true) {
					$scope.$close({success: true});
				}
				else {
					$scope.$close({success: false});
				}
			}, function () {
				$scope.isLoading = false;
				$scope.$close({success: false});
			});
		}

		function initialize() {

			setupGrid();
			$scope.isLoading = true;
			var promise = null;
			if (angular.isObject(getRequestParams) || angular.isArray(getRequestParams)) {
				promise = $http.post(globals.webApiBaseUrl + getUrl, getRequestParams);
			}else {
				promise = $http.get(globals.webApiBaseUrl + getUrl + (getRequestParams !== null && angular.isDefined(getRequestParams) ? getRequestParams : ''));
			}

			promise.then(function(response){
				$scope.isLoading = false;
				var result = response.data;

				if (!result || result.length === 0) {
					return;
				}

				hasGridData = true;

				for (var i = 0; i < result.length; i++) {
					var newData = {
						Id: result[i].Id,
						CatalogCode: result[i].CatalogCode,
						CatalogDescription: result[i].CatalogDescription,
						MaterialCode: result[i].MaterialCode,
						MaterialDescription: result[i].MaterialDescription,
						UomFk: result[i].Uom,
						CurrencyFk: result[i].CurrencyFk,
						Source: result[i].Source,
						Comment: result[i].CommentText,
						OldEstimatePrice: result[i].OldEstimatePrice.toFixed(2),
						NewEstimatePrice: result[i].NewEstimatePrice.toFixed(2)
					};

					if (angular.isFunction(customMapData)) {
						var customData = customMapData(result[i]);
						$.extend(newData, customData);
					}
					updateData.push(newData);
				}
				updateGrid(updateData);
			}, function() {
				$scope.isLoading = false;
				hasGridData = false;
			});
		}
	}
})(angular);