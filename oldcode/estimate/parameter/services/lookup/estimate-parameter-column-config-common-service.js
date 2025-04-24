/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.parameter';

	/**
	 * @ngdoc service
	 * @name estimateParamColumnConfigService
	 * @function
	 *
	 * @description
	 * This provides all columns configuration for dropdown/dialog lookup of Parameters.
	 */
	angular.module(moduleName).service('estimateParamColumnConfigService', ['_', 'basicsLookupdataConfigGenerator', 'estimateParameterPrjParamValidationService',
		'estimateCommonLookupValidationService', 'estimateRuleParameterConstant',
		function (_, basicsLookupdataConfigGenerator, paramValidationService, estimateCommonLookupValidationService, estimateRuleParameterConstant) {

			// Object presenting the service
			let service = {
				getColumns : getColumns,
				getAllColumns :getAllColumns
			};

			function getColumns(){
				return [
					{
						id: 'code',
						formatter: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						editor: 'directive',
						editorOptions: {
							directive: 'basics-common-limit-input',
							validKeys: {
								regular: '^([a-zA-Z_][a-zA-Z0-9_]{0,15})?$'
							}
						},
						width: 70,
						sorting : 1
					},
					{
						id: 'desc',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						width: 120,
						toolTip: 'Description',
						editor : 'description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription',
						sorting : 2
					}
				];
			}

			function getAllColumns(){
				let addCols = [
					{
						id: 'estparamgrpfk',
						field: 'EstParameterGroupFk',
						name: 'EstParameterGroupFk',
						width: 120,
						toolTip: 'Est Parameter Group Fk',
						editor : 'lookup',
						formatter: 'lookup',
						name$tr$: 'basics.customize.estparametergroup',
						sorting : 3
					},
					{
						id: 'valuedetail',
						field: 'ValueDetail',
						name: 'ValueDetail',
						width: 120,
						toolTip: 'ValueDetail',
						editor : 'comment',
						formatter: 'comment',/* function(row,cell,value){
							return angular.uppercase(value);
						}, */
						name$tr$: 'basics.customize.valuedetail',
						sorting : 4
					},

					{
						id: 'uomfk',
						field: 'UomFk',
						name: 'UomFk',
						width: 120,
						toolTip: 'UomFk',
						editor : 'integer',
						formatter: 'integer',
						name$tr$: 'cloud.common.entityUoM',
						sorting : 6
					},
					{
						id: 'parametervalue',
						field: 'ParameterValue',
						name: 'ParameterValue',
						width: 120,
						toolTip: 'ParameterValue',
						editor : 'dynamic',
						formatter: 'dynamic',
						name$tr$: 'basics.customize.parametervalue',
						sorting : 5,
						domain: function (item, column) {
							let domain;

							if(item.ValueType === estimateRuleParameterConstant.Boolean ){

								domain = 'boolean';
								// column.editor ='boolean',
								column.DefaultValue = false;
								column.field = 'ParameterValue';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.regex = null;

							}else if(item.ValueType === estimateRuleParameterConstant.Text){
								domain = 'description';
								column.ParameterValue = 0;
								column.field = 'ParameterText';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.maxLength=255;
								column.regex = null;

							}else if(item.ValueType === estimateRuleParameterConstant.TextFormula){
								domain = 'directive';
								column.field = 'ParameterText';
								column.ValueText = null;
								column.editorOptions = {
									lookupDirective: 'parameter-value-type-text-formula-lookup',
									lookupType: 'ParamValueTypeTextFormulaLookup',
									dataServiceName: 'estimateMainParameterValueLookupService',
									displayMember: 'DescriptionInfo.translation',
									isTextEditable: true,
									multiSelect: true,
									showClearButton: true
								};

								column.formatterOptions = {
									lookupType: 'ParamValueTypeTextFormulaLookup',
									dataServiceName: 'estimateMainParameterValueLookupService',
									displayMember: 'DescriptionInfo.translation',
									field: 'ParameterText',
									isTextEditable: true,
									multiSelect: true
								};
							}else{   // means the valueType is Decimal2 or the valueType is Undefined
								domain = 'quantity';
								// column.DefaultValue = null;
								column.field = 'ParameterValue';
								column.editorOptions = { decimalPlaces: 3 };
								column.formatterOptions = { decimalPlaces: 3 };
							}

							return domain;
						}

					},
					{
						id: 'islookup',
						field: 'IsLookup',
						name: 'IsLookup',
						width: 120,
						toolTip: 'IsLookup',
						editor : 'boolean',
						formatter: 'boolean',
						name$tr$: 'estimate.parameter.isLookup',
						sorting : 9
					},
					{
						id: 'defaultvalue',
						field: 'DefaultValue',
						name: 'DefaultValue',
						width: 120,
						toolTip: 'DefaultValue',
						editor : 'dynamic',
						formatter: 'dynamic',
						name$tr$: 'estimate.parameter.defaultValue',
						sorting : 7,
						domain: function (item, column) {
							let domain;

							if(item.ValueType === estimateRuleParameterConstant.Boolean ){

								domain = 'boolean';
								column.DefaultValue = false;
								column.field = 'DefaultValue';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.regex = null;
								column.readonly = true;

							}else if(item.ValueType === estimateRuleParameterConstant.Text || item.ValueType === estimateRuleParameterConstant.TextFormula){

								domain = 'description';
								column.DefaultValue = null;
								column.field = 'ValueText';
								column.editorOptions = null;
								column.formatterOptions = null;
								column.maxLength= 255;
								column.regex = null;
								column.readonly = true;

							}else{   // means the valueType is Decimal2 or the valueType is Undefined

								domain = 'decimal';
								column.DefaultValue = null;
								column.field = 'DefaultValue';
								column.editorOptions = { decimalPlaces: 3 };
								column.formatterOptions = { decimalPlaces: 3 };
								column.readonly = true;
							}

							return domain;
						}
					}
				];
				let columns = service.getColumns().concat(addCols);
				let uomConfig = _.find(columns, function (item) {
					return item.id === 'uomfk';
				});

				let paramgrpConfig = _.find(columns, function (item) {
					return item.id === 'estparamgrpfk';
				});
				angular.extend(uomConfig,basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsUnitLookupDataService', cacheEnable: true }).grid);

				angular.extend(paramgrpConfig,basicsLookupdataConfigGenerator.provideGenericLookupConfig('estimate.lookup.parametergroup').grid);


				estimateCommonLookupValidationService.addValidationAutomatically(columns, paramValidationService);

				return columns;
			}

			return service;
		}]);
})();
