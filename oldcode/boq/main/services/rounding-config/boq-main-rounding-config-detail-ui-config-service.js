/**
 * $Id: boq-main-rounding-config-detail-ui-config-service.js 46191 2022-07-14 17:40:38Z joshi $
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainRoundingConfigDetailUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides Boq Rounding Configuration Detail UI config for dialog.
	 */
	angular.module(moduleName).factory('boqMainRoundingConfigDetailUIConfigService',
		['_', '$injector','basicsLookupdataConfigGenerator', 'platformTranslateService',
			function (_, $injector, basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'boqRoundingColumnId',
						field: 'ColumnId',
						name: 'Column ID',
						name$tr$: moduleName + '.columnConfigDetails.ColumnId',
						toolTip: 'Column ID',
						formatter: 'lookup',
						mandatory: true,
						required: true,
						width: 110,
						readonly: true
					},
					{
						id: 'uiDisplayTo',
						field: 'UiDisplayTo',
						name: 'UI Display To',
						name$tr$: 'estimate.main.roundingConfigurationDialogForm.uiDisplayTo',
						domain: 'integer',
						editor: 'integer',
						width: 70,
						toolTip: 'Length',
						toolTip$tr$: 'estimate.main.roundingConfigurationDialogForm.uiDisplayTo',
						formatter: 'integer'
					},
					{
						id: 'isWithoutRonding',
						field: 'IsWithoutRounding',
						name: 'Without Rounding',
						name$tr$: 'estimate.main.columnConfigurationDialogForm.isWithoutRonding',
						domain: 'boolean',
						editor: 'boolean',
						width: 100,
						toolTip: 'Length',
						toolTip$tr$: 'estimate.main.roundingConfigurationDialogForm.isWithoutRonding',
						formatter: 'boolean'
					},
					{
						id: 'roundTo',
						field: 'RoundTo',
						name: 'Round To',
						name$tr$: 'estimate.main.roundingConfigurationDialogForm.roundTo',
						domain: 'integer',
						editor: 'integer',
						width: 70,
						toolTip: 'Length',
						toolTip$tr$: 'estimate.main.roundingConfigurationDialogForm.roundTo',
						formatter: 'integer'
					},
					{
						id: 'roundToFk',
						field: 'BasRoundToFk',
						name: 'Rounding To',
						name$tr$: 'estimate.main.roundingConfigurationDialogForm.roundingTo',
						width: 170,
						toolTip: 'Rounding To',
						toolTip$tr$: 'estimate.main.roundingConfigurationDialogForm.roundingTo',
						formatter: 'lookup'
					},
					{
						id: 'roundingMethodFk',
						field: 'BasRoundingMethodFk',
						name: 'Rounding Method',
						name$tr$: moduleName + '.roundingConfigurationDialogForm.roundingMethodFk',
						toolTip: 'Rounding Method',
						formatter: 'lookup',
						width: 100
					}
				];

				let boqRoundingColumnIdConfig = _.find(gridColumns, function (item) {
					return item.id === 'boqRoundingColumnId';
				});

				let boqRoundingColumnIdLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'boqMainRoundingConfigColumnIdsLookupService',
					valMember: 'ColumnId',
					dispMember: 'Column',
					readonly: true
				});

				angular.extend(boqRoundingColumnIdConfig,boqRoundingColumnIdLookupConfig.grid);

				let boqRoundToConfig = _.find(gridColumns, function (item) {
					return item.id === 'roundToFk';
				});

				let boqRoundToLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomRoundToLookupDataService',
					valMember: 'Id',
					dispMember: 'RoundTo'
				});

				angular.extend(boqRoundToConfig,boqRoundToLookupConfig.grid);

				let boqRoundingMethodConfig = _.find(gridColumns, function (item) {
					return item.id === 'roundingMethodFk';
				});

				let boqRoundingMethodLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomRoundingMethodLookupDataService',
					valMember: 'Id',
					dispMember: 'Type'
				});

				angular.extend(boqRoundingMethodConfig,boqRoundingMethodLookupConfig.grid );

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function(){

					return{
						addValidationAutomatically: true,
						columns : gridColumns
					};
				};

				return service;
			}
		]);

})(angular);
