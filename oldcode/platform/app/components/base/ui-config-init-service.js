/*
 * $Id: ui-config-init-service.js.js 634282 2021-04-27 16:17:27Z baf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:platformUIConfigInitService
	 * @description
	 * Provides methods to create standard configuration for list / form from dto and high level description
	 * Difference to platformUIStandardConfigService: Just inject and use. platformUIConfigInitService supports attributes described by domains only.
	 */
	angular.module('platform').factory('platformUIConfigInitService', ['$injector', 'platformUiConfigAdditionalColumnService', 'platformTranslateService',
		'_', '$log', 'platformSchemaService', 'platformDomainService', 'platformModuleEntityCreationConfigurationService',
		function ($injector, platformUiConfigAdditionalColumnService, platformTranslateService, _, $log, platformSchemaService, platformDomainService, platformModuleEntityCreationConfigurationService) {

			var service = {};

			function addUserDefGroup(attName, group, standardConfig) {
				var interFix = '0';
				if (group.noInfix) {
					interFix = '';
				}
				for (var j = 1; j <= group.attCount; ++j) {
					var createdName = attName + interFix + j;
					standardConfig.attToGroup[createdName] = {gid: group.gid, index: j + 1};
					standardConfig.columns.push({lcName: createdName});

					if (j === 9) {
						interFix = '';
					}
				}
			}

			function extendWithOverLoad(layout, rowProperties, attName, overload) {
				overload = overload || layout.overloads[attName];

				if (!_.isNil(overload)) {
					rowProperties = $.extend(rowProperties, overload);
				}

				return rowProperties;
			}

			function extendWithOverLoadForDetail(layout, rowProperties, attName) {
				if (angular.isDefined(layout.overloads)) {
					var overload = layout.overloads[attName];
					if (!_.isNil(overload)) {
						if (overload.readonly) {
							var item = {'readonly': overload.readonly};
							rowProperties = $.extend(rowProperties, item);
						}
						if (!_.isNil(overload.detail)) {
							rowProperties = $.extend(rowProperties, overload.detail);
							if (overload.disallowNegative) {
								rowProperties.disallowNegative = overload.disallowNegative;
							}
						} else {
							extendWithOverLoad(layout, rowProperties, attName);
						}
					}
				}
				return rowProperties;
			}

			function extendWithOverLoadForGrid(layout, rowProperties, attName, overload) {
				if (!_.isNil(overload)) {
					if (!_.isNil(overload.grid)) {
						rowProperties = $.extend(rowProperties, overload.grid);
						if (overload.required) {
							rowProperties.required = true;
						}
						if (overload.navigator) {
							rowProperties.navigator = overload.navigator;
						}
						if (overload.disallowNegative) {
							rowProperties.disallowNegative = overload.disallowNegative;
						}
					} else {
						extendWithOverLoad(layout, rowProperties, attName, overload);
					}

					if (overload.readonly && rowProperties.editor) {
						rowProperties.editor = null;
						if (rowProperties.editorOptions) {
							rowProperties.editorOptions = null;
						}
					}
				}

				return rowProperties;
			}

			function coalesceProperty(generalOverload, specificOverload, generalName, specificName) {
				var val = specificOverload[generalName] || generalOverload[generalName];
				if (_.isString(val) && !_.isString(specificOverload[specificName])) {
					return val;
				}

				return null;
			}

			service.coalesceProperty = coalesceProperty;

			/* jshint -W072 */ // Parameter are needed
			function createDetailRowFromDomain(layout, domain, attName, model, standardConfig, scheme, readOnlyRows) {
				var translation = standardConfig.transService.getTranslationInformation(attName);
				var lcAttName = attName.toLowerCase();

				var row = {
					gid: standardConfig.attToGroup[lcAttName].gid,
					rid: lcAttName,
					label: attName,
					type: domain,
					model: model,
					sortOrder: standardConfig.attToGroup[lcAttName].index,
					readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
						return rop.IsReadonly === 'true' && rop.PropertyName === model;
					})
				};

				var dom = scheme[attName];
				if (dom && dom.domainmaxlen) {
					row.maxLength = dom.domainmaxlen;
				}
				var overload = layout.overloads[lcAttName] || {};
				var customLabel = coalesceProperty(overload, overload.detail || {}, 'displayName', 'label');
				var customLabelTr = coalesceProperty(overload, overload.detail || {}, 'displayName$tr$', 'label$tr$');

				if (!!customLabel || !!customLabelTr) {
					row.label = customLabel;
					row.label$tr$ = customLabelTr;
				} else if (translation) {
					row.label = translation.initial || translation.location + '.' + translation.identifier;
					row.label$tr$ = translation.location + '.' + translation.identifier;
					row.label$tr$param$ = translation.param;
				}

				return extendWithOverLoadForDetail(layout, row, lcAttName);
			}

			function createExtendedRow(layout, domOriginal, attOriginal, model, standardConfig, scheme, readOnlyRows) {
				var domain = platformDomainService.loadDomain(domOriginal);
				var attName = attOriginal + ' ' + domain.nameExtension;
				var lcAttName = attName.toLowerCase();
				var translationInfo = standardConfig.transService.getTranslationInformation(attOriginal);
				var translationPath = translationInfo.location + '.' + translationInfo.identifier;
				var translationOriginal = platformTranslateService.instant(translationPath);

				var extendedRow = createDetailRowFromDomain(layout, domain.extendedDomain, attOriginal, model, standardConfig, scheme, readOnlyRows);
				_.extend(extendedRow, {
					rid: lcAttName,
					afterId: attOriginal.toLowerCase(),
					label: _.get(translationOriginal, translationPath) + ' ' + domain.nameExtension,
					label$tr$: null
				});

				return extendedRow;
			}

			function createColumnFromDomain(layout, attributeProperty, attName, standardConfig, scheme, readOnlyRows) {
				var translation = standardConfig.transService.getTranslationInformation(attName);

				if (!translation) {
					throw new Error('Layout configuration with fid: ' + layout.fid + ' - translation of ' + attName + ' is missing!');
				}

				var lcAttName = attName.toLowerCase();

				var col = {
					id: lcAttName,
					formatter: attributeProperty.domain,
					field: attName,
					name: translation.initial || translation.location + '.' + translation.identifier,
					name$tr$: translation.location + '.' + translation.identifier,
					name$tr$param$: translation.param,
					sortable: true,
					grouping: {
						title: translation.initial || translation.location + '.' + translation.identifier,
						getter: attName,
						aggregators: [],
						aggregateCollapsed: true
					}
				};

				var overload = layout.overloads[lcAttName] || {};
				overload.readonly = overload.readonly || _.some(readOnlyRows, function (rop) {
					return rop.IsReadonly === 'true' && rop.PropertyName === attName;
				});
				var customName = coalesceProperty(overload, overload.grid || {}, 'displayName', 'name');
				var customNameTr = coalesceProperty(overload, overload.grid || {}, 'displayName$tr$', 'name$tr$');
				if (!!customName || !!customNameTr) {
					col.name = customName;
					col.name$tr$ = customNameTr;
				}

				var dom = scheme[attName];
				if (dom && (dom.domainmaxlen || dom.maxlen)) {
					col.maxLength = _.min([dom.maxlen || 2500, dom.domainmaxlen || 2500]);// || 2500 to avoid undefined and compare to a number outside the string domin max length
				}

				switch (attributeProperty.domain) {
					case 'code':
					case 'description':
					case 'comment':
					case 'remark':
						col.searchable = true;
						break;

					default:
						break;
				}

				if (!standardConfig.attToGroup[lcAttName].readonly) {
					col.editor = attributeProperty.domain;
				}

				return extendWithOverLoadForGrid(layout, col, lcAttName, overload);
			}

			function createExtendedColumn(layout, attOriginalObj, standardConfig, scheme, readOnlyRows) {
				const colOverloadConfig = layout.overloads && layout.overloads[attOriginalObj.lcName];
				var attName = attOriginalObj.ccName + ' ' + colOverloadConfig.nameExtension;
				var lcAttName = attName.toLowerCase();

				var attributeInfo = {
					domain: colOverloadConfig.formatter
				};
				var extendedColumn = createColumnFromDomain(layout, attributeInfo, attOriginalObj.ccName, standardConfig, scheme, readOnlyRows);

				// no translation defined yet
				var translationInfo = standardConfig.transService.getTranslationInformation(attOriginalObj.ccName);
				var translationPath = translationInfo.location + '.' + translationInfo.identifier;
				var translationOriginal = platformTranslateService.instant(translationPath);

				_.extend(extendedColumn, {
					id: lcAttName,
					name: _.get(translationOriginal, translationPath) + ' ' + colOverloadConfig.nameExtension,
					name$tr$: null
				});

				return extendedColumn;
			}

			function initGroups(layout, detailConfig, standardConfig) {
				for (var i = 0; i < layout.groups.length; ++i) {
					var group = layout.groups[i];
					var translate = standardConfig.transService.getTranslationInformation(group.gid);
					detailConfig.groups[i] = {
						gid: group.gid,
						header: translate.initial || translate.location + '.' + translate.identifier,
						header$tr$: translate.location + '.' + translate.identifier,
						sortOrder: i + 1,
						isOpen: true,
						visible: true
					};

					if (group.attributes && group.attributes.length) {
						var j = 0;
						for (j = 0; j < group.attributes.length; ++j) {
							var att = group.attributes[j];
							standardConfig.attToGroup[att] = {gid: group.gid, index: j + 1};
							standardConfig.columns.push({lcName: att});
						}
					}

					if (group.isUserDefText) {
						var textAttName = group.attName || 'userdefinedtext';

						addUserDefGroup(textAttName, group, standardConfig);
					}

					if (group.isUserDefNumber) {
						var numberAttName = group.attName || 'userdefinednumber';

						addUserDefGroup(numberAttName, group, standardConfig);
					}

					if (group.isUserDefDate) {
						var dateAttName = group.attName || 'userdefineddate';

						addUserDefGroup(dateAttName, group, standardConfig);
					}

					if (group.isHistory) {
						if (group.showFields) {
							standardConfig.columns.push({
								lcName: 'insertedat',
								grid: {formatter: 'history', field: '__rt$data.history.insertedAt'}
							});
							standardConfig.columns.push({
								lcName: 'insertedby',
								grid: {formatter: 'history', field: '__rt$data.history.insertedBy'}
							});
							standardConfig.columns.push({
								lcName: 'updatedat',
								grid: {formatter: 'history', field: '__rt$data.history.updatedAt'}
							});
							standardConfig.columns.push({
								lcName: 'updatedby',
								grid: {formatter: 'history', field: '__rt$data.history.updatedBy'}
							});
						} else {
							standardConfig.columns.push({
								lcName: 'insertedat',
								grid: {hidden: true, formatter: 'history', field: '__rt$data.history.insertedAt'}
							});
							standardConfig.columns.push({
								lcName: 'insertedby',
								grid: {hidden: true, formatter: 'history', field: '__rt$data.history.insertedBy'}
							});
							standardConfig.columns.push({
								lcName: 'updatedat',
								grid: {hidden: true, formatter: 'history', field: '__rt$data.history.updatedAt'}
							});
							standardConfig.columns.push({
								lcName: 'updatedby',
								grid: {hidden: true, formatter: 'history', field: '__rt$data.history.updatedBy'}
							});
						}

						standardConfig.attToGroup.insertedat = {readonly: true, form: {skip: true}};
						standardConfig.attToGroup.insertedby = {readonly: true, form: {skip: true}};
						standardConfig.attToGroup.updatedat = {readonly: true, form: {skip: true}};
						standardConfig.attToGroup.updatedby = {readonly: true, form: {skip: true}};

						standardConfig.attToGroup.inserted = {
							gid: group.gid,
							index: 1,
							readonly: true,
							domain: 'description',
							field: '__rt$data.history.inserted'
						};
						standardConfig.attToGroup.updated = {
							gid: group.gid,
							index: 2,
							readonly: true,
							domain: 'description',
							field: '__rt$data.history.updated'
						};
					}
				}

				return detailConfig;
			}

			function determineFieldsReadonlyByConfiguration(entityInformation) {
				let conf = null;
				if (!_.isNil(entityInformation)) {
					conf = platformModuleEntityCreationConfigurationService.getEntity(entityInformation.module.name, entityInformation.entity);
				}

				if (!_.isNil(conf) && conf.IsReadonlyActive && conf.ColumnsForCreateDialog.length > 0) {
					return _.filter(conf.ColumnsForCreateDialog, function (propConf) {
						return propConf.IsReadonly;
					});
				}

				return [];
			}

			/* jshint -W074 */ // For me there is no cyclomatic complexity
			function initRows(layout, scheme, detailConfig, standardConfig, entityInformation) {
				let readOnlyRows = determineFieldsReadonlyByConfiguration(entityInformation);
				_.each(Object.getOwnPropertyNames(scheme), function (prop) {
					var lcPropName = prop.toLowerCase();
					var elem = _.find(standardConfig.columns, {lcName: lcPropName});

					if (elem) {
						elem.ccName = prop;
					}

					elem = standardConfig.attToGroup[lcPropName];

					if (elem && (!elem.form || !elem.form.skip)) {
						var domain = scheme[prop] ? scheme[prop].domain : elem.domain;
						var model = elem.field || prop;

						if (domain) {
							detailConfig.rows.push(createDetailRowFromDomain(layout, domain, prop, model, standardConfig, scheme, readOnlyRows));

							// extension of additional column @saa.hof 05.01.2021
							switch (domain) {
								case 'quantity':
								case 'decimal':
									if (layout.overloads && layout.overloads[elem.lcName]
										&& layout.overloads[elem.lcName].nameExtension && layout.overloads[elem.lcName].formatter) {
										detailConfig.rows.push(createExtendedRow(layout, domain, prop, model, standardConfig, scheme, readOnlyRows));
									}
									break;
							}

						}
					}
				});

				return detailConfig;
			}

			/* jshint -W074 */ // For me there is no cyclomatic complexity
			function initColumns(layout, scheme, listConfig, standardConfig, entityInformation) { // jshint ignore:line
				let readOnlyRows = determineFieldsReadonlyByConfiguration(entityInformation);
				_.forEach(standardConfig.columns,
					/* jshint -W074 */ // For me there is no cyclomatic complexity
					function (colDef) {
						var propName = colDef.ccName;

						if (!propName) {
							throw new Error('Layout configuration with fid: ' + layout.fid + ' - ' + colDef.lcName + ' not found in scheme. May forgot to add domain Attribute to the Class Field?');
						}

						var attributeProperty = scheme[propName];
						var column = null;
						var extendedColumn = null;

						if (attributeProperty.domain) {
							column = createColumnFromDomain(layout, attributeProperty, propName, standardConfig, scheme, readOnlyRows);

							// extension of additional row @saa.hof 05.01.2021
							switch (attributeProperty.domain) {
								case 'quantity':
								case 'decimal':
									if (layout.overloads && layout.overloads[colDef.lcName]
										&& layout.overloads[colDef.lcName].nameExtension && layout.overloads[colDef.lcName].formatter) {
										extendedColumn = createExtendedColumn(layout, colDef, standardConfig, scheme, readOnlyRows);
									}
									break;
								default:
									break;
							}

						}

						if (!column) {
							throw new Error('Layout configuration with fid: ' + layout.fid + ' - domain not found for property: ' + propName);
						}

						if (colDef.grid) {
							_.extend(column, colDef.grid);
						}

						if (!(column.toolTip || column.toolTip$tr$)) {
							column.toolTip = column.name;

							if (column.name$tr$) {
								column.toolTip$tr$ = column.name$tr$;
							}

							//TODO: "column.name$tr$param" or "column.name$tr$param$"?
							if (column.name$tr$param) {
								column.toolTip$tr$param$ = column.name$tr$param;
							}
						}

						listConfig.columns.push(column);

						if (extendedColumn) {
							listConfig.columns.push(extendedColumn);
						}

						if (layout.addAdditionalColumns) {
							platformUiConfigAdditionalColumnService.addAdditionalColumnsTo({
								curColumn: column,
								columns: listConfig.columns,
								layout: layout,
								propName: propName
							});
						}
					}
				);

				return listConfig;
			}

			function doCreateStandardConfigForDetailView(layout, scheme, standardConfig, entityInformation) {
				var detailConfig = {
					fid: layout.fid,
					version: layout.version,
					showGrouping: layout.showGrouping,
					change: layout.change,
					groups: [],
					rows: []
				};

				if (layout.addValidationAutomatically) {
					detailConfig.addValidationAutomatically = true;
				}

				detailConfig = initGroups(layout, detailConfig, standardConfig);
				service.addRequiredFieldsToLayout(layout, scheme, standardConfig, entityInformation);
				detailConfig = initRows(layout, scheme, detailConfig, standardConfig, entityInformation);

				platformTranslateService.translateFormConfig(detailConfig);

				return detailConfig;
			}

			function doCreateStandardConfigForListView(layout, scheme, standardConfig, entityInformation) {
				var listConfig = {columns: []};
				if (layout.addValidationAutomatically) {
					listConfig.addValidationAutomatically = true;
				}

				listConfig = initColumns(layout, scheme, listConfig, standardConfig, entityInformation);

				platformTranslateService.translateGridConfig(listConfig.columns);

				return listConfig;
			}

			function determineFieldsRequiredByConfiguration(entityInformation) {
				let conf = null;
				if (!_.isNil(entityInformation)) {
					conf = platformModuleEntityCreationConfigurationService.getEntity(entityInformation.module.name, entityInformation.entity);
				}

				if (!_.isNil(conf) && conf.IsMandatoryActive && conf.ColumnsForCreateDialog.length > 0) {
					return _.filter(conf.ColumnsForCreateDialog, function (propConf) {
						return propConf.IsMandatory === 'true';
					});
				}

				return [];
			}

			function makePropertyMandatory(lcPropName, layout, standardConfig) {
				let elem = _.find(standardConfig.columns, {lcName: lcPropName});

				if (elem) {
					let overload = layout.overloads[lcPropName];
					if (overload) {
						if (overload.detail) {
							overload.detail.required = true;
						}
						if (overload.grid) {
							overload.grid.required = true;
						}
						overload.required = true;
					} else {
						layout.overloads[lcPropName] = {
							required: true
						};
					}
				}
			}

			service.determineFieldsReadonlyByConfiguration = determineFieldsReadonlyByConfiguration;

			service.addRequiredFieldsToLayout = function addRequiredFieldsToLayout(layout, scheme, standardConfig, entityInformation) {
				if (!layout.overloads) {
					layout.overloads = {};
				}
				_.each(Object.getOwnPropertyNames(scheme), function (propName) {
					let prop = scheme[propName];
					if (prop && prop.mandatory) {
						let lcPropName = propName.toLowerCase();
						makePropertyMandatory(lcPropName, layout, standardConfig);
					}
				});

				if (!_.isNil(entityInformation)) {
					let requiredProps = determineFieldsRequiredByConfiguration(entityInformation);

					_.forEach(requiredProps, function (prop) {
						let lcPropName = prop.PropertyName.toLowerCase();
						makePropertyMandatory(lcPropName, layout, standardConfig);
					});
				}
			};

			service.provideConfigForDetailView = function provideConfigForDetailView(layout, dtoScheme, translationService, entityInformation) {
				var standardConfig = {
					transService: translationService,
					attToGroup: {},
					columns: []
				};

				return doCreateStandardConfigForDetailView(layout, dtoScheme, standardConfig, entityInformation);
			};

			service.provideConfigForListView = function provideConfigForListView(layout, dtoScheme, translationService, entityInformation) {
				var standardConfig = {
					transService: translationService,
					attToGroup: {},
					columns: []
				};

				doCreateStandardConfigForDetailView(layout, dtoScheme, standardConfig, entityInformation);
				return doCreateStandardConfigForListView(layout, dtoScheme, standardConfig, entityInformation);
			};

			service.createUIConfigurationService = function createUIConfigurationService(servData) {
				var dtoScheme = !_.isNil(servData.dtoSchemeId) ?
					platformSchemaService.getSchemaFromCache(servData.dtoSchemeId).properties :
					!_.isNil(servData.dtoSchemeProperties) ?
						servData.dtoSchemeProperties :
						null;
				if(dtoScheme){
					servData.detailLayout = service.provideConfigForDetailView(servData.layout, dtoScheme, servData.translator, servData.entityInformation);
					servData.gridLayout = service.provideConfigForListView(servData.layout, dtoScheme, servData.translator, servData.entityInformation);

					servData.service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
						return servData.detailLayout;
					};

					servData.service.getStandardConfigForListView = function getStandardConfigForListView() {
						return servData.gridLayout;
					};

					servData.service.getDtoScheme = function () {
						return dtoScheme;
					};

					if (servData.standardExtentService && servData.layout.addition) {
						servData.standardExtentService.extend(servData.service, servData.layout.addition, dtoScheme);
					}
				}
				else {
					//TODO:
					//console.error('dtoScheme is null. Handle this case appropriately');
				}
			};

			return service;
		}]);
})(angular);
