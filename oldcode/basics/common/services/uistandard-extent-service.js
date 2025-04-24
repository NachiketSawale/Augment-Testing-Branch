/**
 * Created by chi on 8/13/2015. Implemented by rje.
 */

(function (angular) {
	'use strict';

	angular.module('basics.common').factory('platformUIStandardExtentService', [
		'_', 'basicsLookupdataLookupDescriptorService', 'platformGridDomainService', 'platformObjectHelper', 'platformSchemaService',
		function (_, lookupService, platformGridDomainService, platformObjectHelper, platformSchemaService) {

			function lookupDomainFormatter(row, cell, value, columnDef, dataContext, plainText) { // jshint ignore:line
				const targetData = lookupService.getData(columnDef.formatterOptions.lookupType);
				value = platformObjectHelper.getValue(dataContext, columnDef.field);
				let item;
				if (targetData) {
					item = targetData[value];
				}

				let result = '';

				if (targetData && item) {
					const css = platformGridDomainService.alignmentCssClass(columnDef.formatterOptions.domain);
					const formatter = platformGridDomainService.formatter(columnDef.formatterOptions.domain);

					result = formatter(row, cell, value, {field: columnDef.formatterOptions.displayMember}, item, plainText);
					if (css) {
						result = '<div class="' + css + '">' + result + '</div>';
					}
					return result;
				}

				return '';
			}

			function extendColumns(uiStandardService, extColumns, domainSchema) {

				const listConfig = uiStandardService.getStandardConfigForListView();

				const copy = function (col, fieldCol) {
					const options = (col.formatterOptions || col);
					return {
						id: col.id || fieldCol.field + options.displayMember,
						formatter: col.lookupDomain ? lookupDomainFormatter : 'lookup',
						formatterOptions: {
							lookupType: fieldCol.formatterOptions.lookupType,
							displayMember: options.displayMember || 'Description',
							imageSelector: col.imageSelector || (col.formatterOptions ? col.formatterOptions.imageSelector : ''),
							domain: col.lookupDomain
						},
						navigator: options.navigator,
						grouping: fieldCol.grouping,
						width: col.width || 250
					};
				};
				angular.forEach(extColumns, function (col) {

					let insertIndex = listConfig.columns.length - 1;
					let findIndex;
					let nav = null;

					if (col.lookupDisplayColumn) {

						findIndex = _.findLastIndex(listConfig.columns, {'field': col.field});
						const fieldCol = _.find(listConfig.columns, {'field': col.field});

						if (findIndex >= 0) {
							insertIndex = findIndex + 1;
						}
						if (col.navigator) {
							nav = col.navigator;
						} else if (col.formatterOptions && col.formatterOptions.navigator) {
							nav = col.formatterOptions.navigator;
						}
						col = angular.extend(col, copy(col, fieldCol));
						col.navigator = nav;

					} else if (col.afterId) {

						findIndex = _.findLastIndex(listConfig.columns, {'id': col.afterId});
						if (findIndex >= 0) {
							insertIndex = findIndex + 1;
						}
					} else {
						col.id = col.id || col.field;
					}
					col.sortable = !_.isNil(col.sortable) ? col.sortable : true;
					const findColumn = _.find(listConfig.columns, {'field': col.field});
					if (findColumn && angular.isDefined(findColumn.maxLength)) {
						col.maxLength = findColumn.maxLength;
					} else if (domainSchema) {
						const findDomainSchema = domainSchema[col.field];
						if (findDomainSchema && angular.isDefined(findDomainSchema.domainmaxlen)) {
							col.maxLength = findDomainSchema.domainmaxlen;
						}
					}
					listConfig.columns.splice(insertIndex, 0, col);

				});
			}

			function extendConfigurations(uiStandardService, extConfigurations) {
				const listConfig = uiStandardService.getStandardConfigForDetailView();
				angular.forEach(extConfigurations, function (row) {

					let rowNew = angular.copy(row);
					let insertIndex = listConfig.rows.length - 1;
					let findIndex = -1;
					let nav = null;

					if (row.lookupDisplayColumn) {

						findIndex = _.findLastIndex(listConfig.rows, {'model': row.model});
						const modelRow = _.find(listConfig.rows, {'model': row.model});

						if (findIndex >= 0) {
							insertIndex = findIndex + 1;
						}
						const copyitem = angular.copy(modelRow);

						if (copyitem.navigator) {
							copyitem.navigator = null;
						}
						if (rowNew.navigator) {
							nav = rowNew.navigator;
						}
						rowNew = angular.extend(copyitem, {
							rid: row.id || modelRow.model + (row.options ? (row.options.lookupOptions || row.options) : row).displayMember
						}, row);
						rowNew.navigator = nav;

					} else if (row.afterId) {

						findIndex = _.findIndex(listConfig.rows, {'rid': row.afterId});
						if (findIndex >= 0) {
							insertIndex = findIndex + 1;
						}
					} else {
						row.rid = row.rid || row.model;
					}

					listConfig.rows.splice(insertIndex, 0, rowNew);

				});
			}

			function extendUIConfig(uiStandardService, extConfig, domainSchema) {

				if (extConfig) {
					if (angular.isArray(extConfig.grid)) {
						extendColumns(uiStandardService, extConfig.grid, domainSchema);
					}

					if (angular.isArray(extConfig.detail)) {
						extendConfigurations(uiStandardService, extConfig.detail);
					}
				}

				if (_.isFunction(uiStandardService.getStandardConfigForDetailView)) {
					const listConfig = uiStandardService.getStandardConfigForDetailView();
					angular.forEach(listConfig.rows, function (row) {
						if (row.options && row.options.rows && angular.isArray(row.options.rows)) {
							angular.forEach(row.options.rows, function (optionRow) {
								if (optionRow.model && domainSchema) {
									const findDomainSchema = domainSchema[optionRow.model];
									if (findDomainSchema && angular.isDefined(findDomainSchema.domainmaxlen)) {
										optionRow.maxLength = findDomainSchema.domainmaxlen;
									}
								}
							});
						}
					});
				}
				return uiStandardService;
			}

			function extendFormConfig(formConfig) {
				if (!formConfig || !formConfig.rows) {
					return;
				}

				angular.forEach(formConfig.rows, function (row) {
					if (row.domainSchemaProperty) {
						const domainSchema = platformSchemaService.getSchemaFromCache({
							typeName: row.domainSchemaProperty.typeName,
							moduleSubModule: row.domainSchemaProperty.moduleSubModule
						});
						if (domainSchema) {
							const field = row.domainSchemaProperty.propertyName || row.model;
							const findDomainSchema = domainSchema.properties[field];
							if (findDomainSchema && angular.isDefined(findDomainSchema.domainmaxlen)) {
								row.maxLength = findDomainSchema.domainmaxlen;
							}
						}
					}
				});
			}

			return {
				extend: extendUIConfig,
				extendFormConfig: extendFormConfig
			};

		}]);

})(angular);
