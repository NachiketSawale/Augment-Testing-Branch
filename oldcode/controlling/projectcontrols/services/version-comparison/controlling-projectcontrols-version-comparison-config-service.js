/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function () {
	/* global globals _ */
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectControlsVersionComparisonConfigService', [
		'$http',
		'$q',
		'projectControlsColumnType',
		'definitionType',
		'projectControlsComparisonVersionType',
		function ($http, $q, projectControlsColumnType, definitionType, comparisonVersionType) {

			let _configComplete = null,
				_columns = [];

			let versionComparisonConfigHeader = null;

			let service = {};

			function generateColumnsByConfig(configComplete) {
				let columns = [];

				if (configComplete && angular.isArray(configComplete.CompareConfDetails) && configComplete.CompareConfDetails.length) {
					configComplete.CompareConfDetails.forEach(function (compareConfDetail) {
						if (compareConfDetail.MdcContrColumnPropdefFk) {
							const columnPropDef = configComplete.MdcContrColumnPropDefs.find(e => e.Id === compareConfDetail.MdcContrColumnPropdefFk);
							if (columnPropDef) {
								generateColumns(columns, columnPropDef, compareConfDetail, definitionType.COLUMN);
							}
						} else if (compareConfDetail.MdcContrFormulaPropdefFk) {
							const columnPropDef = configComplete.MdcContrFormulaPropDefs.find(e => e.Id === compareConfDetail.MdcContrFormulaPropdefFk);
							if (columnPropDef) {
								generateColumns(columns, columnPropDef, compareConfDetail, definitionType.FORMULA);
							}
						}
					});
				}

				return columns;
			}

			function generateColumns(columns, columnPropDef, compareConfDetail, definitionType){
				columns.push(createColumn(columnPropDef, compareConfDetail, definitionType, comparisonVersionType.VersionA));
				columns.push(createColumn(columnPropDef, compareConfDetail, definitionType, comparisonVersionType.VersionB));
				columns.push(createColumn(columnPropDef, compareConfDetail, definitionType, comparisonVersionType.VersionDiffer));
			}

			function createColumn(columnPropDef, compareConfDetail, type, versionType) {
				let item = {
					id: generateColumnCode(columnPropDef, versionType),
					formatter: 'money',
					domain: 'money',
					field: generateColumnCode(columnPropDef, versionType),
					name: generateColumnDescription(columnPropDef, compareConfDetail, type, versionType),
					width: type === definitionType.FORMULA && columnPropDef.BasContrColumnTypeFk === projectControlsColumnType.SAC ? 300 : 120,
					readonly: type === definitionType.COLUMN || !columnPropDef.IsEditable,
					isLookupProp: type === definitionType.FORMULA && columnPropDef.BasContrColumnTypeFk === projectControlsColumnType.SAC,
					isFormulaDef: type === definitionType.FORMULA,
					basContrColumnType: columnPropDef.BasContrColumnTypeFk,
					propDefInfo: {
						type: type,
						item: columnPropDef
					},
					aggregation : false,
					grouping : {
						aggregateForce : true,
						generic : false
					},
					configDetail:compareConfDetail,
					versionType: versionType,
					cssClass: 'text-right'
				};

				if (type === definitionType.FORMULA && columnPropDef.Formula) {
					let formulaType = columnPropDef.BasContrColumnTypeFk;
					if (formulaType === projectControlsColumnType.CTC || formulaType === projectControlsColumnType.CAC_METHOD
						|| formulaType === projectControlsColumnType.CACWC || formulaType === projectControlsColumnType.CACBC
						|| formulaType === projectControlsColumnType.CUSTOM_FORMULA) {
						item.toolTip = columnPropDef.Formula;
					}
				}

				return item;
			}

			function generateColumnCode(columnPropDef, versionType){
				return columnPropDef.Code.trim() + '_' + getVersionName(versionType);
			}

			function generateColumnDescription(columnPropDef, compareConfDetail, type, versionType) {
				const descriptionAlias = getDescriptionAlias(compareConfDetail, versionType);
				if(descriptionAlias){
					return descriptionAlias;
				}
				let description = type === definitionType.COLUMN ? columnPropDef.Description.Translated : columnPropDef.DescriptionInfo.Translated;
				return description + '(' + getVersionDescription(versionType) + ')';
			}

			function getVersionName(versionType){
				switch (versionType) {
					case comparisonVersionType.VersionA: {
						return 'VersionA';
					}
					case comparisonVersionType.VersionB: {
						return 'VersionB';
					}
					case comparisonVersionType.VersionDiffer: {
						return 'VersionDiff';
					}
				}
			}

			function getVersionDescription(versionType){
				switch (versionType) {
					case comparisonVersionType.VersionA: {
						return 'A';
					}
					case comparisonVersionType.VersionB: {
						return 'B';
					}
					case comparisonVersionType.VersionDiffer: {
						return 'Difference';
					}
				}
			}

			function getDescriptionAlias(compareConfDetail, versionType){
				if (compareConfDetail && versionType) {
					switch (versionType) {
						case comparisonVersionType.VersionA: {
							return getDescriptionTranslated(compareConfDetail.DescriptionAInfo);
						}
						case comparisonVersionType.VersionB: {
							return getDescriptionTranslated(compareConfDetail.DescriptionBInfo);
						}
						case comparisonVersionType.VersionDiffer: {
							return getDescriptionTranslated(compareConfDetail.DescriptionDiffInfo);
						}
					}
				}
				return null;
			}

			function getDescriptionTranslated(descriptionBInfo){
				if(descriptionBInfo){
					return descriptionBInfo.Translated ? descriptionBInfo.Translated : descriptionBInfo.Description;
				}
				return null;
			}

			function loadConfiguration(mdcContrCompareConfigFk) {
				return $http.get(globals.webApiBaseUrl + 'controlling/configuration/contrheader/getVersionComparisonConfig?mdcContrCompareConfigFk=' + mdcContrCompareConfigFk)
					.then(function (response) {
						_configComplete = response.data;
						versionComparisonConfigHeader = _configComplete.CompareConfig;
						_columns = generateColumnsByConfig(_configComplete);
						return _configComplete;
					});
			}

			function loadConfigById(mdcContrCompareConfigFk){
				return $http.get(globals.webApiBaseUrl + 'controlling/configuration/contrheader/getVersionComparisonConfigById?mdcContrCompareConfigFk=' + mdcContrCompareConfigFk)
					.then(function (response) {
						_columns = generateColumnsByConfig(response.data);
						return response.data;
					});
			}

			function getColumns() {
				return _columns;
			}

			function getSACColumns() {
				return _.filter(_columns, function (column) {
					return column.isFormulaDef && column.basContrColumnType === projectControlsColumnType.SAC;
				});
			}

			function getEditableFactorColumns() {
				return _.filter(_columns, function (column) {
					return column.isFormulaDef && !column.readonly &&
						(column.basContrColumnType === projectControlsColumnType.WCF || column.basContrColumnType === projectControlsColumnType.BCF || column.basContrColumnType === projectControlsColumnType.CUSTOM_FACTOR);
				});
			}

			function getEditableColumnFieldByType(columnTypes) {
				let codes = [];

				_.forEach(_columns, function (column) {
					if (column.isFormulaDef && !column.readonly && columnTypes.includes(column.basContrColumnType) > 0) {
						codes.push(column.field);
					}
				});

				return codes;
			}

			function getConfig() {
				return _configComplete;
			}

			function getFormulaConfig(selectedField) {
				if (!_configComplete || !_.isArray(_configComplete.MdcContrFormulaPropDefs) || !_.isString(selectedField)) {
					return null;
				}

				return _.find(_configComplete.MdcContrFormulaPropDefs, function (def) {
					return def.Code.trim().toUpperCase() === selectedField.trim().toUpperCase();
				});
			}

			function getCompareConfigSelected(){
				return versionComparisonConfigHeader;
			}

			function setCompareConfigSelectedById(value){
				const item = getCompareConfigs().find(e => e.Id === value);
				if(item){
					versionComparisonConfigHeader = item;
					return loadConfigById(value);
				}
				return $q.when(null);
			}

			function getCompareConfigs(){
				return _configComplete ? _configComplete.CompareConfigs : [];
			}

			angular.extend(service, {
				loadConfiguration: loadConfiguration,
				getColumns: getColumns,
				getSACColumns: getSACColumns,
				getEditableFactorColumns: getEditableFactorColumns,
				getConfig: getConfig,
				getFormulaConfig: getFormulaConfig,
				getEditableColumnFieldByType: getEditableColumnFieldByType,
				getCompareConfigs: getCompareConfigs,
				getCompareConfigSelected: getCompareConfigSelected,
				setCompareConfigSelectedById: setCompareConfigSelectedById,
				loadConfigById: loadConfigById
			});

			return service;
		}
	]);
})(angular);
