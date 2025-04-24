(function (angular) {

	'use strict';
	let moduleName = 'timekeeping.recording';

	/**
	 * @ngdoc service
	 * @name timekeepingRoundingConfigDetailUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides Timekeeping Rounding Configuration Detail UI config for dialog.
	 */
	angular.module(moduleName).factory('timekeepingRoundingConfigDetailUIConfigService',
		['_', '$injector','basicsLookupdataConfigGenerator', 'platformTranslateService',
			function (_, $injector, basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'tksRoundingColumnId',
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
						name$tr$: 'timekeeping.recording.roundingConfigDialogForm.uiDisplayTo',
						domain: 'integer',
						editor: 'integer',
						width: 70,
						toolTip: 'UI Display To',
						toolTip$tr$: 'timekeeping.recording.roundingConfigDialogForm.uiDisplayTo',
						formatter: 'integer'
					},
					{
						id: 'isWithoutRonding',
						field: 'IsWithoutRounding',
						name: 'Without Rounding',
						name$tr$: 'timekeeping.recording.roundingConfigDialogForm.isWithoutRonding',
						domain: 'boolean',
						editor: 'boolean',
						width: 100,
						toolTip: 'Without Rounding',
						toolTip$tr$: 'timekeeping.recording.roundingConfigDialogForm.isWithoutRonding',
						formatter: 'boolean'
					},
					{
						id: 'roundTo',
						field: 'RoundTo',
						name: 'Round To',
						name$tr$: 'timekeeping.recording.roundingConfigDialogForm.roundTo',
						domain: 'integer',
						editor: 'integer',
						width: 70,
						toolTip: 'Round To',
						toolTip$tr$: 'timekeeping.recording.roundingConfigDialogForm.roundTo',
						formatter: 'integer'
					},
					{
						id: 'roundToFk',
						field: 'BasRoundToFk',
						name: 'Rounding To',
						name$tr$: 'timekeeping.recording.roundingConfigDialogForm.roundingTo',
						width: 170,
						toolTip: 'Rounding To',
						toolTip$tr$: 'timekeeping.recording.roundingConfigDialogForm.roundingTo',
						formatter: 'lookup'
					},
					{
						id: 'roundingMethodFk',
						field: 'BasRoundingMethodFk',
						name: 'Rounding Method',
						name$tr$: moduleName + '.roundingConfigDialogForm.roundingMethodFk',
						toolTip: 'Rounding Method',
						formatter: 'lookup',
						width: 100
					}
				];

				let tksRoundingColumnIdConfig = _.find(gridColumns, function (item) {
					return item.id === 'tksRoundingColumnId';
				});

				let tksRoundingColumnIdLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'timekeepingRoundingConfigColumnIdsLookupService',
					valMember: 'ColumnId',
					dispMember: 'Column',
					readonly: true
				});

				angular.extend(tksRoundingColumnIdConfig,tksRoundingColumnIdLookupConfig.grid);

				let tksRoundToConfig = _.find(gridColumns, function (item) {
					return item.id === 'roundToFk';
				});

				let tksRoundToLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomRoundToLookupDataService',
					valMember: 'Id',
					dispMember: 'RoundTo'
				});

				angular.extend(tksRoundToConfig,tksRoundToLookupConfig.grid);

				let tksRoundingMethodConfig = _.find(gridColumns, function (item) {
					return item.id === 'roundingMethodFk';
				});

				let tksRoundingMethodLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomRoundingMethodLookupDataService',
					valMember: 'Id',
					dispMember: 'Type'
				});

				angular.extend(tksRoundingMethodConfig,tksRoundingMethodLookupConfig.grid );

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
