/*
 * $Id: ui-standard-config-service.js 634282 2021-04-27 16:17:27Z baf $
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name cloud.platform.services:formContainerStandardConfigService
	 * @description
	 * Creates a form container standard config from dto and high level description
	 *
	 * @example
	 * <div paltform-layout initial-layout="name of layout", layout-options="options"></div>
	 */
	angular.module('platform').factory('platformUIStandardConfigService',
		['platformTranslateService', 'platformUiConfigAdditionalColumnService', '_', '$translate', '$log', 'platformUIConfigInitService', '$injector', 'platformDomainService',

			/* jshint -W072 */ // Many parameter due to dependency injection
			function (platformTranslateService, platformUiConfigAdditionalColumnService, _, $translate, $log, platformUIConfigInitService, $injector, platformDomainService) {

				var types = {
					boolean: 'boolean',
					date: 'date',
					datetime: 'datetime',
					integer: 'integer',
					number: 'number',
					string: 'string',
					time: 'time',
					translation: 'translation',
					colorpicker: 'colorpicker'
				};

				return function (layout, dtoScheme, translationService, entityInformation) {

					var self = this;

					var standardConfig = {
						attToGroup: {},
						columns: []
					};

					function addUserDefGroup(attName, group) {
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

					function extendWithOverLoad(layout, rowProperties, attName) {
						var overload = layout.overloads[attName];

						if (!_.isNil(overload)) {
							rowProperties = $.extend(rowProperties, overload);
						}

						return rowProperties;
					}

					function extendWithOverLoadForDetail(layout, rowProperties, attName) {
						if (angular.isDefined(layout.overloads)) {
							var overload = layout.overloads[attName];
							if (!_.isNil(overload)) {
								if (!_.isNil(overload.detail)) {
									rowProperties = $.extend(rowProperties, overload.detail);
									var showClearBtn = !overload.required && !overload.readonly;
									rowProperties.required = overload.required;
									rowProperties.options = rowProperties.options || {};
									rowProperties.options.showClearButton = showClearBtn;
									rowProperties.options.lookupOptions = rowProperties.options.lookupOptions || {};
									rowProperties.options.lookupOptions.showClearButton = showClearBtn;
									if (overload.readonly) {
										rowProperties.readonly = true;
									}
									if (overload.navigator) {
										rowProperties.navigator = overload.navigator;
									}
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

					function extendWithOverLoadForGrid(layout, rowProperties, attName, readOnlyRows) {
						if (angular.isDefined(layout.overloads)) {
							var overload = layout.overloads[attName];
							if (!_.isNil(overload)) {
								if (!_.isNil(overload.grid)) {
									rowProperties = $.extend(rowProperties, overload.grid);
									var showClearBtn = !overload.required && !overload.readonly;
									rowProperties.required = overload.required;
									rowProperties.editorOptions = rowProperties.editorOptions || {};
									rowProperties.editorOptions.showClearButton = showClearBtn;
									rowProperties.editorOptions.lookupOptions = rowProperties.editorOptions.lookupOptions || {};
									rowProperties.editorOptions.lookupOptions.showClearButton = showClearBtn;
									if (!overload.readonly) {
										if (!_.isEmpty(rowProperties.pinningContextFilter)) {
											rowProperties.editorOptions.lookupOptions.pinningContextFilter = rowProperties.pinningContextFilter;
										}
									}
									if (overload.navigator) {
										rowProperties.navigator = overload.navigator;
									}
									if (overload.disallowNegative) {
										rowProperties.disallowNegative = overload.disallowNegative;
									}
								} else {
									extendWithOverLoad(layout, rowProperties, attName);
								}
								overload.readonly = overload.readonly || _.some(readOnlyRows, function (rop) {
									return rop.IsReadonly === 'true' && rop.PropertyName === attName;
								});
								if (overload.readonly && rowProperties.editor) {
									rowProperties.editor = null;
									if (rowProperties.editorOptions) {
										rowProperties.editorOptions = null;
									}
								}
							}
						}
						return rowProperties;
					}

					function createDetailRowFromDomain(layout, domain, attName, model, scheme, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
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

						if (dom && (dom.domainmaxlen || dom.maxlen)) {
							row.maxLength = _.min([dom.maxlen || 2500, dom.domainmaxlen || 2500]);// || 2500 to avoid undefined and compare to a number outside the string domin max length
						}
						if (dom && dom.mandatory) {
							row.required = true;
						}

						var overload = layout.overloads[lcAttName] || {};
						var customLabel = platformUIConfigInitService.coalesceProperty(overload, overload.detail || {}, 'displayName', 'label');
						var customLabelTr = platformUIConfigInitService.coalesceProperty(overload, overload.detail || {}, 'displayName$tr$', 'label$tr$');

						if (!!customLabel || !!customLabelTr) {
							row.label = customLabel;
							row.label$tr$ = customLabelTr;
						} else if (translation) {
							row.label = translation.initial || translation.location + '.' + translation.identifier;
							row.label$tr$ = translation.location + '.' + translation.identifier;
							row.label$tr$param$ = translation.param;
						}

						if (translation && translation.tooltipIdentifier) {
							row.toolTip = translation.location + '.' + translation.tooltipIdentifier;
							row.toolTip$tr$ = translation.location + '.' + translation.tooltipIdentifier;
							row.toolTip$tr$param$ = translation.tooltipParam;
						}

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createExtendedRow(layout, attOriginalObj, model, scheme, readOnlyRows) {
						const colOverloadConfig = layout.overloads && layout.overloads[attOriginalObj.lcName];
						var attName = attOriginalObj.ccName + ' ' + colOverloadConfig.nameExtension;
						var lcAttName = attName.toLowerCase();
						var translation = translationService.getTranslationInformation(attOriginalObj.ccName);
						var lcAttOriginal = attOriginalObj.lcName;

						var row = {
							gid: standardConfig.attToGroup[lcAttOriginal].gid,
							rid: lcAttName,
							label: attName,
							type: colOverloadConfig.formatter,
							model: model,
							afterId: attOriginalObj.lcName,
							readonly: standardConfig.attToGroup[lcAttOriginal].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						var dom = scheme[attOriginalObj.ccName];

						if (dom && (dom.domainmaxlen || dom.maxlen)) {
							row.maxLength = _.min([dom.maxlen || 2500, dom.domainmaxlen || 2500]);// || 2500 to avoid undefined and compare to a number outside the string domin max length;
						}
						if (dom && dom.mandatory) {
							row.required = true;
						}

						if (translation) {
							row.label = translation.initial ? translation.initial + ' ' + colOverloadConfig.nameExtension : translation.location + '.' + translation.identifier;
							// row.label$tr$ = translation.location + '.' + translation.identifier;
							row.label$tr$param$ = translation.param;
						}

						return extendWithOverLoadForDetail(layout, row, lcAttOriginal);

					}

					function createBooleanForDetailView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var row = {
							gid: standardConfig.attToGroup[lcAttName].gid,
							rid: lcAttName,
							label: translation.initial,
							label$tr$: translation.location + '.' + translation.identifier,
							label$tr$param$: translation.param,
							toolTip: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$param$: translation.tooltipParam,
							type: 'boolean',
							model: attName,
							sortOrder: standardConfig.attToGroup[lcAttName].index,
							readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createTimeForDetailView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var row = {
							gid: standardConfig.attToGroup[lcAttName].gid,
							rid: lcAttName,
							label: translation.initial || translation.location + '.' + translation.identifier,
							label$tr$: translation.location + '.' + translation.identifier,
							label$tr$param$: translation.param,
							toolTip: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$param$: translation.tooltipParam,
							type: 'time',
							model: attName,
							sortOrder: standardConfig.attToGroup[lcAttName].index,
							readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createDateForDetailView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var row = {
							gid: standardConfig.attToGroup[lcAttName].gid,
							rid: lcAttName,
							label: translation.initial || translation.location + '.' + translation.identifier,
							label$tr$: translation.location + '.' + translation.identifier,
							label$tr$param$: translation.param,
							toolTip: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$param$: translation.tooltipParam,
							type: 'date',
							model: attName,
							sortOrder: standardConfig.attToGroup[lcAttName].index,
							readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createIntegerForDetailView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var row = {
							gid: standardConfig.attToGroup[lcAttName].gid,
							rid: lcAttName,
							label: translation.initial || translation.location + '.' + translation.identifier,
							label$tr$: translation.location + '.' + translation.identifier,
							label$tr$param$: translation.param,
							toolTip: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$param$: translation.tooltipParam,
							type: 'integer',
							model: attName,
							sortOrder: standardConfig.attToGroup[lcAttName].index,
							readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createNumberForDetailView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var row = {
							gid: standardConfig.attToGroup[lcAttName].gid,
							rid: lcAttName,
							label: translation.initial || translation.location + '.' + translation.identifier,
							label$tr$: translation.location + '.' + translation.identifier,
							label$tr$param$: translation.param,
							toolTip: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$param$: translation.tooltipParam,
							type: 'factor',
							model: attName,
							sortOrder: standardConfig.attToGroup[lcAttName].index,
							readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createStringForDetailView(layout, attName, attributeProperty, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var row = {
							gid: standardConfig.attToGroup[lcAttName].gid,
							rid: lcAttName,
							label: translation.initial || translation.location + '.' + translation.identifier,
							label$tr$: translation.location + '.' + translation.identifier,
							label$tr$param$: translation.param,
							toolTip: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$param$: translation.tooltipParam,
							type: 'description',
							model: attName,
							sortOrder: standardConfig.attToGroup[lcAttName].index,
							readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						switch (attributeProperty.maxLength) {
							case 16:
								row.type = 'code';
								break;
							case 255:
								row.type = 'comment';
								break;
							case 2000:
								row.type = 'remark';
								break;
						}

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createTranslatedDescriptionForDetailView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var row = {
							gid: standardConfig.attToGroup[lcAttName].gid,
							rid: lcAttName,
							label: translation.initial || translation.location + '.' + translation.identifier,
							label$tr$: translation.location + '.' + translation.identifier,
							label$tr$param$: translation.param,
							toolTip: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$: translation.location + '.' + translation.tooltipIdentifier,
							toolTip$tr$param$: translation.tooltipParam,
							type: 'translation',
							model: attName,
							sortOrder: standardConfig.attToGroup[lcAttName].index,
							readonly: standardConfig.attToGroup[lcAttName].readonly || _.some(readOnlyRows, function (rop) {
								return rop.IsReadonly === 'true' && rop.PropertyName === model;
							})
						};

						return extendWithOverLoadForDetail(layout, row, lcAttName);
					}

					function createColumnFromDomain(layout, attributeProperty, attName, scheme, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);

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
								title: translation.initial,
								getter: attName,
								aggregators: [],
								aggregateCollapsed: true
							}
						};

						var overload = layout.overloads[lcAttName] || {};
						var customName = platformUIConfigInitService.coalesceProperty(overload, overload.grid || {}, 'displayName', 'name');
						var customNameTr = platformUIConfigInitService.coalesceProperty(overload, overload.grid || {}, 'displayName$tr$', 'name$tr$');
						if (!!customName || !!customNameTr) {
							col.name = customName;
							col.name$tr$ = customNameTr;
						}
						overload.readonly = overload.readonly || _.some(readOnlyRows, function (rop) {
							return rop.IsReadonly === 'true' && rop.PropertyName === attName;
						});
						if (attributeProperty.mandatory) {
							col.required = true;
						}
						if (!_.isEmpty(attributeProperty.lookupfilterkeys)) {
							col.pinningContextFilter = attributeProperty.lookupfilterkeys;
						}

						var dom = scheme[attName];

						if (dom) {
							if (dom.domainmaxlen || dom.maxlen) {
								col.maxLength = _.min([dom.maxlen || 2500, dom.domainmaxlen || 2500]);// || 2500 to avoid undefined and compare to a number outside the string domin max length
							}

							if (dom.groupings) { // rei@2.10.18 support new groupings info array coming from schema description
								col.grouping.generic = true;
							}
							if (dom.grouping) { // rei@2.10.18 no longer part of schema
								col.grouping.generic = true;
							}

							if (!_.endsWith(lcAttName, 'fk') && dom.domain) {
								var domain = platformDomainService.loadDomain(dom.domain);

								if (domain && domain.genericGrouping) {
									col.grouping.generic = true;
								}
							}
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

						return extendWithOverLoadForGrid(layout, col, lcAttName);
					}

					function createExtendedColumn(attOriginal, domOriginal, colOverloadConfig) {

						var domain = platformDomainService.loadDomain(domOriginal);
						var attName = attOriginal + ' ' + (colOverloadConfig.nameExtension || domain.nameExtension);
						var lcAttName = attName.toLowerCase();

						// no translation defined yet
						var translation = translationService.getTranslationInformation(attOriginal);

						var col = {
							id: lcAttName,
							formatter: colOverloadConfig.formatter || domain.extendedDomain,
							field: attOriginal,
							name: translation.initial + ' ' + (colOverloadConfig.nameExtension || domain.nameExtension),
							// name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							sortable: true,
							grouping: {
								title: translation.initial,
								getter: attName,
								aggregators: [],
								aggregateCollapsed: true
							}
						};

						// if parent readonly also readonly
						if (!standardConfig.attToGroup[attOriginal.toLowerCase()].readonly) {
							col.editor = colOverloadConfig.formatter || domain.extendedDomain;
						}

						return extendWithOverLoadForGrid(layout, col, attOriginal.toLowerCase());
					}

					function createBooleanForGridView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							formatter: 'boolean',
							field: attName,
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 25
						};

						if (!standardConfig.attToGroup[lcAttName].readonly) {
							col.editor = 'boolean';
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function createDateForGridView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							formatter: 'date',
							field: attName,
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 50
						};

						if (!standardConfig.attToGroup[lcAttName].readonly) {
							col.editor = 'date';
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function createTimeForGridView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							formatter: 'time',
							field: attName,
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 50
						};

						if (!standardConfig.attToGroup[lcAttName].readonly) {
							col.editor = 'time';
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function createIntegerForGridView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							formatter: 'integer',
							field: attName,
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 60
						};

						if (!standardConfig.attToGroup[lcAttName].readonly) {
							col.editor = 'integer';
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function createNumberForGridView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							formatter: 'factor',
							field: attName,
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 75
						};

						if (!standardConfig.attToGroup[lcAttName].readonly) {
							col.editor = 'factor';
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function createStringForGridView(layout, attName, attributeProperty, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							formatter: 'description',
							field: attName,
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 100,
							searchable: true
						};

						var writeable = !standardConfig.attToGroup[lcAttName].readonly;
						if (writeable) {
							col.editor = 'description';
						}

						switch (attributeProperty.maxLength) {
							case 16:
								col.width = 175;
								col.formatter = 'code';
								if (writeable) {
									col.editor = 'code';
								}
								break;
							case 255:
								col.width = 200;
								col.formatter = 'comment';
								if (writeable) {
									col.editor = 'comment';
								}
								break;
							case 2000:
								col.width = 200;
								col.formatter = 'remark';
								if (writeable) {
									col.editor = 'remark';
								}
								break;
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function createTranslatedDescriptionForGridView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							formatter: 'translation',
							field: attName,
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 200
						};

						if (!standardConfig.attToGroup[lcAttName].readonly) {
							col.editor = 'translation';
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function createColorPickerForGridView(layout, attName, readOnlyRows) {
						var translation = translationService.getTranslationInformation(attName);
						var lcAttName = attName.toLowerCase();

						var col = {
							id: lcAttName,
							field: attName,
							formatter: 'colorpicker',
							name: translation.initial || translation.location + '.' + translation.identifier,
							name$tr$: translation.location + '.' + translation.identifier,
							name$tr$param$: translation.param,
							width: 25
						};

						if (!standardConfig.attToGroup[lcAttName].readonly) {
							col.editor = 'colorpicker';
						}

						return extendWithOverLoadForGrid(layout, col, lcAttName, readOnlyRows);
					}

					function initGroups(layout, detailConfig) {
						for (var i = 0; i < layout.groups.length; ++i) {
							var group = layout.groups[i];
							var translate = translationService.getTranslationInformation(group.gid);
							detailConfig.groups[i] = {
								gid: group.gid,
								header: translate.initial,
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

								addUserDefGroup(textAttName, group);
							}

							if (group.isUserDefNumber) {
								var numberAttName = group.attName || 'userdefinednumber';

								addUserDefGroup(numberAttName, group);
							}

							if (group.isUserDefDate) {
								var dateAttName = group.attName || 'userdefineddate';

								addUserDefGroup(dateAttName, group);
							}

							if (group.isHistory) {
								standardConfig.columns.push({
									lcName: 'insertedat',
									grid: {
										hidden: true,
										formatter: 'history',
										field: '__rt$data.history.insertedAt'
									}
								});
								standardConfig.columns.push({
									lcName: 'insertedby',
									grid: {
										hidden: true,
										formatter: 'history',
										field: '__rt$data.history.insertedBy'
									}
								});
								standardConfig.columns.push({
									lcName: 'updatedat',
									grid: {hidden: true, formatter: 'history', field: '__rt$data.history.updatedAt'}
								});
								standardConfig.columns.push({
									lcName: 'updatedby',
									grid: {hidden: true, formatter: 'history', field: '__rt$data.history.updatedBy'}
								});

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

					/* jshint -W074 */ // For me there is no cyclomatic complexity
					function initRows(layout, scheme, detailConfig, entityInformation) {
						let readOnlyRows = platformUIConfigInitService.determineFieldsReadonlyByConfiguration(entityInformation);
						_.each(Object.getOwnPropertyNames(scheme), function (prop) { // jshint ignore:line
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
									detailConfig.rows.push(createDetailRowFromDomain(layout, domain, prop, model, scheme, readOnlyRows));
									switch (domain) {
										case 'quantity':
										case 'decimal':
											if (layout.overloads && layout.overloads[lcPropName]
												&& layout.overloads[lcPropName].nameExtension && layout.overloads[lcPropName].formatter) {
												const propertyName = {lcName: lcPropName, ccName: prop};
												detailConfig.rows.push(createExtendedRow(layout, propertyName, model, scheme, readOnlyRows));
											}
											break;
										default:
											break;
									}
								} else {
									domain = scheme[prop].type;

									switch (domain) {
										case types.boolean:
											detailConfig.rows.push(createBooleanForDetailView(layout, prop, readOnlyRows));
											break;

										case types.date:
											detailConfig.rows.push(createDateForDetailView(layout, prop, readOnlyRows));
											break;

										case types.integer:
											detailConfig.rows.push(createIntegerForDetailView(layout, prop, readOnlyRows));
											break;

										case types.number:
											detailConfig.rows.push(createNumberForDetailView(layout, prop, readOnlyRows));
											break;

										case types.string:
											detailConfig.rows.push(createStringForDetailView(layout, prop, scheme[prop], readOnlyRows));
											break;

										case types.time:
											detailConfig.rows.push(createTimeForDetailView(layout, prop, readOnlyRows));
											break;

										case types.translation:
											detailConfig.rows.push(createTranslatedDescriptionForDetailView(layout, prop, readOnlyRows));
											break;
									}
								}
							}
						});

						return detailConfig;
					}

					/* jshint -W074 */ // For me there is no cyclomatic complexity
					function initColumns(layout, scheme, listConfig, entityInformation) { // jshint ignore:line
						let readOnlyRows = platformUIConfigInitService.determineFieldsReadonlyByConfiguration(entityInformation);
						_.forEach(standardConfig.columns,
							/* jshint -W074 */ // For me there is no cyclomatic complexity
							function (colDef) {
								var propName = colDef.ccName;

								if (!propName) {
									throw new Error('Layout configuration with fid: ' + layout.fid + ' - ' + colDef.lcName + ' not found in scheme.');
								}

								var attributeProperty = scheme[propName];
								var column = null;
								var extendedColumn = null;

								if (attributeProperty.domain) {
									column = createColumnFromDomain(layout, attributeProperty, propName, scheme, readOnlyRows);
									// additional columns
									switch (attributeProperty.domain) {
										case 'quantity':
										case 'decimal':
											if (layout.overloads && layout.overloads[colDef.lcName]
												&& layout.overloads[colDef.lcName].nameExtension && layout.overloads[colDef.lcName].formatter) {
												extendedColumn = createExtendedColumn(propName, attributeProperty.domain, layout.overloads[colDef.lcName]);
											}
											break;
										default:
											break;
									}
								} else {
									switch (attributeProperty.type) {
										case types.boolean:
											column = createBooleanForGridView(layout, propName, readOnlyRows);
											break;

										case types.date:
											column = createDateForGridView(layout, propName, readOnlyRows);
											break;

										case types.integer:
											column = createIntegerForGridView(layout, propName, readOnlyRows);
											break;

										case types.number:
											column = createNumberForGridView(layout, propName, readOnlyRows);
											break;

										case types.string:
											column = createStringForGridView(layout, propName, attributeProperty, readOnlyRows);
											break;

										case types.time:
											column = createTimeForGridView(layout, propName, readOnlyRows);
											break;

										case types.translation:
											column = createTranslatedDescriptionForGridView(layout, propName, readOnlyRows);
											break;

										case types.colorpicker:
											column = createColorPickerForGridView(layout, propName, readOnlyRows);
											break;
									}
								}

								if (!column) {
									throw new Error('Layout configuration with fid: ' + layout.fid + ' - domain not found for property: ' + propName);
								}

								if (colDef.grid) {
									_.extend(column, colDef.grid);
								}

								if (!column.hasOwnProperty('toolTip')) {
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

								platformUiConfigAdditionalColumnService.addAdditionalColumnsTo({
									curColumn: column,
									columns: listConfig.columns,
									layout: layout,
									propName: propName
								});
							});

						return listConfig;
					}

					var detailConfig;

					function doCreateStandardConfigForDetailView(layout, scheme, entityInformation) {
						detailConfig = {
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

						detailConfig = initGroups(layout, detailConfig);
						platformUIConfigInitService.addRequiredFieldsToLayout(layout, scheme, standardConfig, entityInformation);
						detailConfig = initRows(layout, scheme, detailConfig, entityInformation);

						platformTranslateService.translateFormConfig(detailConfig);

						return detailConfig;
					}

					function doCreateStandardConfigForListView(layout, scheme, entityInformation) {
						var listConfig = {columns: []};
						if (layout.addValidationAutomatically) {
							listConfig.addValidationAutomatically = true;
						}

						listConfig = initColumns(layout, scheme, listConfig, entityInformation);

						platformTranslateService.translateGridConfig(listConfig.columns);

						return listConfig;
					}

					if (_.isNil(dtoScheme)) {
						throw new Error('DTO scheme is missing.');
					}

					detailConfig = doCreateStandardConfigForDetailView(layout, dtoScheme, entityInformation);
					var listConfig = doCreateStandardConfigForListView(layout, dtoScheme, entityInformation);

					self.getStandardConfigForDetailView = function () {
						return detailConfig;
					};

					self.getStandardConfigForListView = function () {
						return listConfig;
					};

					self.getDtoScheme = function () {
						return dtoScheme;
					};

				};
			}]);
})(angular);



