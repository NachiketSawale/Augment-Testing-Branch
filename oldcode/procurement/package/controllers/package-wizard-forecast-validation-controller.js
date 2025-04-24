/**
 * Created by xai on 1/31/2018.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module('procurement.package').value('procurementPackageForecastValidationGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'code', field: 'code', name$tr$: 'cloud.common.entityPackageCode',
						formatter: 'code',sortable: true, resizable: true
					},
					{
						id: 'description', field: 'description', name$tr$: 'procurement.package.pacakge2headerGridTitle',
						formatter: 'description', sortable: true, resizable: true
					},
					{
						id: 'itemno', field: 'itemno', name$tr$: 'basics.common.poChange.itemNo',
						formatter: 'description', sortable: true, resizable: true,width:100
					},
					{
						id: 'requiredby', field: 'requiredby', name$tr$: 'cloud.common.entityRequiredBy',
						formatter: 'description', sortable: true, resizable: true,width:100
					},
					{
						id: 'materialvalidation', field: 'materialvalidation', name$tr$: 'basics.common.entityMaterialCode',
						formatter: 'description', sortable: true, resizable: true,width:100
					},
					{
						id: 'uomvalidation', field: 'uomvalidation', name$tr$: 'cloud.common.entityUoM',
						formatter: 'description', sortable: true, resizable: true,width:100
					}
				]
			};
		}
	});


	angular.module('procurement.package').controller('procurementPackageForecastValidationGridController',
		['$scope', '$timeout', 'platformGridAPI',  'procurementPackageForecastValidationGridColumns',
			'$translate',
			function ($scope, $timeout, platformGridAPI, gridColumns, $translate) {

				$scope.gridId = '7DB55D465C84408C8F435B276E873259';

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: gridColumns.getStandardConfigForListView().columns,
						data: [],
						id: $scope.gridId,
						options: {
							indicator: true,
							idProperty: 'id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);

					var list = $scope.$parent.modalOptions.validationResultData;
					if (list.length > 0) {
						var data=[];
						_.forEach(list, function (item) {
							var dateRequiredFiled='',materialRequired='',uomRequired='';
							if(item.RequiredByValidation){
								dateRequiredFiled=$translate.instant('procurement.package.wizard.forecastValidation.requiredField');
							}
							if(item.MaterialValidation){
								materialRequired=$translate.instant('procurement.package.wizard.forecastValidation.requiredField');
							}
							if(item.UomValidation){
								uomRequired=$translate.instant('procurement.package.wizard.forecastValidation.requiredField');
							}
							data.push({
								id:item.Id,
								code: item.PrcPackageCode,
								description: item.PrcSubPackageDesp,
								itemno:item.ItemNo,
								requiredby:dateRequiredFiled,
								materialvalidation:materialRequired,
								uomvalidation:uomRequired
							});
						});
						platformGridAPI.items.data($scope.gridId, data);
					}

				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.modalOptions = {
					headerText: $translate.instant('procurement.package.import.errorMessage'),
					footer: {
						Accept: $translate.instant('cloud.common.ok')
					},
					onAccept: close,
					cancel: close
				};
				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
				});

				function close() {
					$scope.$close(false);
				}
			}
		]);
})(angular);