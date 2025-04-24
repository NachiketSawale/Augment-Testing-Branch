/**
 * Created by chm on 6/3/2015.
 */
(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.billingschema').controller('basicsBillingSchemaBillingSchemaDetailListController',
		['$scope', 'platformTranslateService', 'platformGridControllerService', 'basicsBillingSchemaBillingSchemaDetailStandardConfigurationService', 'basicsBillingSchemaBillingSchemaDetailService', 'basicsBillingSchemaBillingSchemaDetailValidationService',
			'platformGridAPI', 'platformCreateUuid', 'basicsBillingSchemaBillingLineType', 'platformRuntimeDataService',
			function ($scope, platformTranslateService, platformGridControllerService, basicsBillingSchemaBillingSchemaDetailStandardConfigurationService, basicsBillingSchemaBillingSchemaDetailService, basicsBillingSchemaBillingSchemaDetailValidationService,
			          platformGridAPI, platformCreateUuid, basicsBillingSchemaBillingLineType, platformRuntimeDataService) {
				var myGridConfig = {
					initCalled: false,
					columns: []
				};

				$scope.gridId = platformCreateUuid();

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);

				function onSelectedRowsChanged(e, args) {
					let selections = args.rows.map(function (row) {
						return args.grid.getDataItem(row);
					});

					if (selections && selections.length > 0) {
						let selection = selections[0];
						basicsBillingSchemaBillingSchemaDetailService.setFactorReadOnly(selection);
					}
				}

				platformTranslateService.translateGridConfig(basicsBillingSchemaBillingSchemaDetailStandardConfigurationService.getStandardConfigForListView().columns);

				platformGridControllerService.initListController($scope, basicsBillingSchemaBillingSchemaDetailStandardConfigurationService, basicsBillingSchemaBillingSchemaDetailService, basicsBillingSchemaBillingSchemaDetailValidationService(basicsBillingSchemaBillingSchemaDetailService), myGridConfig);

				var tools = [
					{
						id: 't5',
						sort: 5,
						caption: 'cloud.common.taskBarDeepCopyRecord',
						type: 'item',
						disabled: function () {
							return basicsBillingSchemaBillingSchemaDetailService.disableDeepCopy();
						},
						iconClass: 'tlb-icons ico-copy-paste-deep',
						fn: function deepCopy() {
							basicsBillingSchemaBillingSchemaDetailService.copyPaste();
						}
					}
				];
				platformGridControllerService.addTools(tools);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged)
				});
			}
		]);
})(angular);