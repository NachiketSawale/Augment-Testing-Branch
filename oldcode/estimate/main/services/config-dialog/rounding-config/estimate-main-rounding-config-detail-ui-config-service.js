/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainRoundingConfigDetailUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Rounding Configuration Detail UI config for dialog.
	 */
	angular.module(moduleName).factory('estimateMainRoundingConfigDetailUIConfigService',
		['_', '$injector','basicsLookupdataConfigGenerator', 'platformTranslateService',
			function (_, $injector, basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'estRoundingColumnId',
						field: 'ColumnId',
						name: 'Column ID',
						name$tr$: 'estimate.main.columnConfigDetails.ColumnId',
						toolTip: 'Column Id',
						toolTip$tr$: 'estimate.main.columnConfigDetails.ColumnId',
						formatter: 'lookup',
						mandatory: true,
						required: true,
						width: 110
					},
					{
						id: 'uiDisplayTo',
						field: 'UiDisplayTo',
						name: 'UI Display To',
						name$tr$: 'estimate.main.roundingConfigDialogForm.uiDisplayTo',
						domain: 'integer',
						editor: 'integer',
						width: 70,
						toolTip: 'UI Display To',
						toolTip$tr$: 'estimate.main.roundingConfigDialogForm.uiDisplayTo',
						formatter: 'integer'
					},
					{
						id: 'isWithoutRonding',
						field: 'IsWithoutRounding',
						name: 'Without Rounding',
						name$tr$: 'estimate.main.roundingConfigDialogForm.isWithoutRounding',
						domain: 'boolean',
						editor: 'boolean',
						width: 100,
						toolTip: 'Without Rounding',
						toolTip$tr$: 'estimate.main.roundingConfigDialogForm.isWithoutRounding',
						formatter: 'boolean'
					},
					{
						id: 'roundTo',
						field: 'RoundTo',
						name: 'Round To',
						name$tr$: 'estimate.main.roundingConfigDialogForm.roundTo',
						domain: 'integer',
						editor: 'integer',
						width: 70,
						toolTip: 'Round To',
						toolTip$tr$: 'estimate.main.roundingConfigDialogForm.roundTo',
						formatter: 'integer'
					},
					{
						id: 'roundToFk',
						field: 'RoundToFk',
						name: 'Rounding To',
						name$tr$: 'estimate.main.roundingConfigDialogForm.roundingTo',
						width: 170,
						toolTip: 'Rounding To',
						toolTip$tr$: 'estimate.main.roundingConfigDialogForm.roundingTo',
						formatter: 'lookup'
					},
					{
						id: 'roundingMethodFk',
						field: 'RoundingMethodFk',
						name: 'Rounding Method',
						name$tr$: 'estimate.main.roundingConfigDialogForm.roundingMethodFk',
						toolTip: 'Rounding Method',
						toolTip$tr$: 'estimate.main.roundingConfigDialogForm.roundingMethodFk',
						formatter: 'lookup',
						width: 100
					}
				];

				let estRoundingColumnIdConfig = _.find(gridColumns, function (item) {
					return item.id === 'estRoundingColumnId';
				});

				let estRoundingColumnIdLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'estimateMainRoundingConfigColumnIdsLookupService',
					valMember: 'ColumnId',
					dispMember: 'Column',
					readonly: true
				});

				angular.extend(estRoundingColumnIdConfig,estRoundingColumnIdLookupConfig.grid);

				let estRoundToConfig = _.find(gridColumns, function (item) {
					return item.id === 'roundToFk';
				});

				let estRoundToLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomRoundToLookupDataService',
					valMember: 'Id',
					dispMember: 'RoundTo'
				});

				angular.extend(estRoundToConfig,estRoundToLookupConfig.grid);

				let estRoundingMethodConfig = _.find(gridColumns, function (item) {
					return item.id === 'roundingMethodFk';
				});

				let estRoundingMethodLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomRoundingMethodLookupDataService',
					valMember: 'Id',
					dispMember: 'Type'
				});

				angular.extend(estRoundingMethodConfig,estRoundingMethodLookupConfig.grid );

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
