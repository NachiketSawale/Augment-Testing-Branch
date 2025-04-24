(function () {
	/* global globals _ */
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectControlsConfigService', ['$http', 'projectControlsColumnType',
		function ($http, projectControlsColumnType) {

			let _configComplete = null,
				_columns = [];

			let service = {};

			function generateColumnsByConfig(configComplete) {
				let columns = [];


				if (configComplete && configComplete.MdcContrColumnPropDefs) {
					_.forEach(configComplete.MdcContrColumnPropDefs, function (columnPropDef) {
						columns.push(createColumn(columnPropDef, 1));
					});
				}

				if (configComplete && configComplete.MdcContrFormulaPropDefs) {
					_.forEach(configComplete.MdcContrFormulaPropDefs, function (columnPropDef) {
						if(columnPropDef.IsVisible){
							columns.push(createColumn(columnPropDef, 2));
						}
					});
				}

				return columns;
			}

			function createColumn(columnPropDef, type) {
				let item =  {
					id: columnPropDef.Code.trim(),
					formatter: 'money',
					domain: 'money',
					field: columnPropDef.Code.trim(),
					name: columnPropDef.Code.trim(),
					description: type === 1 ? columnPropDef.Description.Translated : columnPropDef.DescriptionInfo.Translated,
					width: type === 2 && columnPropDef.BasContrColumnTypeFk === projectControlsColumnType.SAC ? 300 : 120,
					readonly: type === 1 || !columnPropDef.IsEditable,
					isLookupProp: type === 2 && columnPropDef.BasContrColumnTypeFk === projectControlsColumnType.SAC,
					isFormulaDef: type === 2,
					basContrColumnType: columnPropDef.BasContrColumnTypeFk,
					propDefInfo: {
						type: type,
						item: columnPropDef
					}
				};

				if(type === 2 && columnPropDef.Formula){
					let formulaType = columnPropDef.BasContrColumnTypeFk;
					if(formulaType === projectControlsColumnType.CTC || formulaType === projectControlsColumnType.CAC_METHOD
						|| formulaType === projectControlsColumnType.CACWC || formulaType === projectControlsColumnType.CACBC
						|| formulaType === projectControlsColumnType.CUSTOM_FORMULA){
						item.toolTip = columnPropDef.Formula;
					}
				}

				return item;
			}



			function loadControllingConfiguration() {
				return $http.get(globals.webApiBaseUrl + 'controlling/configuration/contrheader/getconfigcomplete')
					.then(function (response) {
						_configComplete = response.data;
						_columns = generateColumnsByConfig(_configComplete);
						return _configComplete;
					});
			}

			function getColumns() {
				return _columns;
			}

			function getSACColumns(){
				return _.filter(_columns, function (column) {
					return column.isFormulaDef && column.basContrColumnType === projectControlsColumnType.SAC;
				});
			}

			function getEditableFactorColumns(){
				return _.filter(_columns, function (column) {
					return column.isFormulaDef && !column.readonly &&
						(column.basContrColumnType === projectControlsColumnType.WCF || column.basContrColumnType === projectControlsColumnType.BCF || column.basContrColumnType === projectControlsColumnType.CUSTOM_FACTOR);
				});
			}

			function getEditableColumnFieldByType(columnTypes){
				let codes = [];

				_.forEach(_columns, function(column){
					if(column.isFormulaDef && !column.readonly && columnTypes.includes(column.basContrColumnType) > 0){
						codes.push(column.field);
					}
				});

				return codes;
			}

			function getConfig() {
				return _configComplete;
			}

			function getFormulaConfig(selectedField){
				if(!_configComplete || !_.isArray(_configComplete.MdcContrFormulaPropDefs) || !_.isString(selectedField)){
					return null;
				}

				return  _.find(_configComplete.MdcContrFormulaPropDefs, function(def){
					return def.Code.trim().toUpperCase() === selectedField.trim().toUpperCase();
				});
			}

			angular.extend(service, {
				loadControllingConfiguration: loadControllingConfiguration,
				getColumns: getColumns,
				getSACColumns: getSACColumns,
				getEditableFactorColumns: getEditableFactorColumns,
				getConfig: getConfig,
				getFormulaConfig: getFormulaConfig,
				getEditableColumnFieldByType: getEditableColumnFieldByType
			});

			return service;
		}
	]);
})(angular);
