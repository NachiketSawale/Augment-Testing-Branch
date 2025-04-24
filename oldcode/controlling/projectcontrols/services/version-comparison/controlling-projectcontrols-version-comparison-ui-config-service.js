/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function () {
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectControlsVersionComparisonUIConfigService', [
		'_',
		'$injector',
		'platformLanguageService',
		'platformContextService',
		'accounting',
		'platformDomainService',
		'controllingProjectControlsVersionComparisonConfigService',
		'projectControlsColumnType',
		'projectControlsComparisonVersionType',
		function (_, $injector, platformLanguageService, platformContextService, accounting, platformDomainService, versionComparisonConfigService, projectControlsColumnType, comparisonVersionType) {

			function formatNumberToMoney(value, cultureInfo) {
				let domainInfo = platformDomainService.loadDomain('money');
				return accounting.formatNumber(value, domainInfo.precision, cultureInfo[domainInfo.datatype].thousand, cultureInfo[domainInfo.datatype].decimal);
			}

			function toNumberWithCulture(value, cultureInfo) {
				if (_.isNumber(value)) {
					return value;
				}

				let result = 0;

				if (!_.isString(value) || value === '' || !cultureInfo || !cultureInfo.numeric) {
					return result;
				}

				let inverseNumberDecimal = cultureInfo.numeric.decimal === ',' ? '.' : ',';
				result = _.toNumber(value.replaceAll(inverseNumberDecimal, '').replace(',', '.'));

				return _.isNaN(result) ? 0 : result;
			}

			function generateLookupForSAC(column) {
				const overload = {
					'maxLength': 255,
					'editor': 'directive',
					'editorOptions': {
						'directive': 'controlling-projectcontrols-formula-value-cell',
						'lookupOptions': {
							'showclearButton': true
						},
						validKeys: {
							regular: '(^[+-]?\\d*$)|(^(?:[+-]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,2})$)'
						}
					},
					'formatter': function (row, cell, value, columnDef, entity) {
						let field = columnDef.field;
						let inField = field + '_IN_RP',
							toField = field + '_TO_RP',
							detailField = field + 'Detail';
						let valueResult = $injector.get('controllingProjectcontrolsDashboardService').checkValueByCulture(entity[field]);

						let error = entity && entity.__rt$data && entity.__rt$data.errors && Object.prototype.hasOwnProperty.call(entity.__rt$data.errors, field) ? entity.__rt$data.errors[field] : null;
						if (error && error.error) {
							return '<div class="invalid-cell" title="' + error.error + '">' + value + '</div>';
						} else {
							let cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());
							entity[detailField] = toNumberWithCulture(valueResult.valueDetail, cultureInfo);
							entity[field] = formatNumberToMoney(entity[detailField], cultureInfo);
							entity[inField] = _.toNumber(entity[inField]);
							entity[toField] = _.toNumber(entity[toField]);

							return formatNumberToMoney(entity[field + '_IN_RP'], cultureInfo) + '(' + formatNumberToMoney(entity[field + '_TO_RP'], cultureInfo) + ')';
						}
					}
				};
				angular.extend(column, overload);
			}

			function formatter(columnPropDef, compareConfDetail, versionType, formatterValueFunc){
				let result = 'money';
				switch (versionType) {
					case comparisonVersionType.VersionA: {
						if(compareConfDetail.LabelAFormat){
							return function (row, cell, value, columnDef, entity) {
								const formatterValue = formatterValueFunc ? formatterValueFunc(row, cell, value, columnDef, entity) : value;
								return setStyleForCellValueUsingTagSpan(compareConfDetail.LabelAFormat, value, formatterValue);
							}
						}
						break;
					}
					case comparisonVersionType.VersionB: {
						if(compareConfDetail.LabelBFormat){
							return function (row, cell, value, columnDef, entity) {
								const formatterValue = formatterValueFunc ? formatterValueFunc(row, cell, value, columnDef, entity) : value;
								return setStyleForCellValueUsingTagSpan(compareConfDetail.LabelBFormat, value, formatterValue);
							}
						}
						break;
					}
					case comparisonVersionType.VersionDiffer: {
						if(compareConfDetail.LabelDiffFormat){
							return function (row, cell, value, columnDef, entity) {
								const formatterValue = formatterValueFunc ? formatterValueFunc(row, cell, value, columnDef, entity) : value;
								return setStyleForCellValueUsingTagSpan(compareConfDetail.LabelDiffFormat, value, formatterValue);
							}
						}
						break;
					}
				}
				return result;
			}

			function getConditionResult(script, value){
				let scope = $injector.get('$rootScope').$new(true);
				let result;
				let expression = {
					// usage: VAL() > 100 && VAL() < 200, which means,
					// for each cell in that row, is the cell value between 100 and 200
					VAL: function () {
						return value;
					}
				};

				// assign the method to scope
				_.map(expression, function (val, key) {
					scope[key] = val;
				});

				try {
					result = scope.$eval(script.toUpperCase());
				} catch (e) {
					result = false;
				}

				return result;
			}

			function setStyleForCellValueUsingTagSpan(styleList, value, formattedValue) {
				let styles = '';
				let styleListObj = _.isString(styleList) ? JSON.parse(styleList) : styleList;
				_.map(styleListObj, function (style, script) {
					if (getConditionResult(script, value)) {
						styles += style;
					}
				});
				if (styles) {
					styles = '<span style="' + styles + '">' + formattedValue + '</span>';
				} else {
					styles = formattedValue;
				}

				return styles;
			}

			return {
				getStandardConfigForListView: function () {
					const config = {
						addValidationAutomatically: true,
						columns: [
							{
								id: 'code',
								name: 'Code',
								name$tr$: 'cloud.common.entityCode',
								field: 'Code',
								editor: null,
								readonly: true,
								formatter: 'text',
								searchable: true,
								sortable: true,
								toolTip: 'Code',
								toolTip$tr$: 'cloud.common.entityCode',
								aggregation: false,
								grouping: {
									aggregateForce: true,
									generic: false
								}
							},
							{
								id: 'description',
								name: 'Description',
								name$tr$: 'cloud.common.entityDescription',
								field: 'Description',
								editor: null,
								readonly: true,
								formatter: 'text',
								searchable: true,
								sortable: true,
								toolTip: 'Description',
								toolTip$tr$: 'cloud.common.entityDescription',
								aggregation: false,
								grouping: {
									aggregateForce: true,
									generic: false
								}
							}
						]
					}

					let cultureInfo = platformLanguageService.getLanguageInfo(platformContextService.culture());

					_.forEach(versionComparisonConfigService.getColumns(), function (column) {
						if (column.basContrColumnType === projectControlsColumnType.WCF || column.basContrColumnType === projectControlsColumnType.BCF || column.basContrColumnType === projectControlsColumnType.CUSTOM_FACTOR) {
							column.formatter = function (row, cell, value, columnDef, entity) {
								if (columnDef && entity && entity.EditableInfo) {
									if (entity.EditableInfo.IsWCFBCFItem) {
										return formatNumberToMoney(value, cultureInfo);
									}
									return '';
								} else {
									return '';
								}
							}
						}

						// comment out the follow code to fix dev-25721 issue2
						// if (column.isLookupProp && column.basContrColumnType === projectControlsColumnType.SAC) {
						// 	generateLookupForSAC(column);
						// }

						if (column.propDefInfo && column.propDefInfo.type === 2 && column.propDefInfo.item) {
							column.basContrColumnType = column.propDefInfo.item.BasContrColumnTypeFk;
							column.basContrColumnId = column.propDefInfo.item.Id;
						}

						const formatterOriginal = angular.isFunction(column.formatter) ? column.formatter : function (row, cell, value, columnDef, entity) {
							return formatNumberToMoney(value, cultureInfo);
						};

						column.formatter = formatter(column, column.configDetail, column.versionType, formatterOriginal);
						column.readonly = true;

						config.columns.push(column);
					});

					return config;
				},
				getDtoScheme: function(){
					let dashboardAttributeDomains = {
						'Code': {
							'domain' : 'text'
						},
						'Description': {
							'domain' : 'text'
						}
					};

					_.forEach(versionComparisonConfigService.getColumns(), function(column){
						dashboardAttributeDomains[column.id] = {
							'domain' : column.domain
						};
					});

					return dashboardAttributeDomains;
				}
			}
		}
	]);
})(angular);
