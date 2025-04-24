/**
 * Created by baf on 16.05.2018.
 */

(function (angular) {
	'use strict';

	angular.module('platform').service('platformUiConfigAdditionalColumnService', PlatformUiConfigAdditionalColumnService);

	PlatformUiConfigAdditionalColumnService.$inject = ['_', '$translate', '$log', '$injector'];

	function PlatformUiConfigAdditionalColumnService(_, $translate, $log, $injector) {
		var self = this;

		function getDisplayMember(gridOptions) {
			var disp = gridOptions.editorOptions.lookupOptions.displayMember;

			if (!disp) {
				disp = _.get(gridOptions, 'formatterOptions.displayMember');
				if (!disp) {
					disp = '';
				}
			}

			return disp;
		}

		this.addAdditionalColumnsTo = function addAdditionalColumnsTo(confData) {
			var lcPropName = confData.propName.toLowerCase();

			if (_.has(confData.layout, 'overloads.' + lcPropName + '.grid.editorOptions.lookupOptions')) {
				var lookupOptions = confData.layout.overloads[lcPropName].grid.editorOptions.lookupOptions,
					columns = lookupOptions.addGridColumns ? lookupOptions.addGridColumns : lookupOptions.columns,
					additionalColumns = lookupOptions.additionalColumns;

				if (!!additionalColumns && columns && columns.length > 0) {
					var columnsToAdd = (additionalColumns.length > 0) ? _.filter(columns, function (item) {/* jshint -W083 */ // Just a lambda expression
						return _.some(additionalColumns, function (col) {
							return item.field === col.field;
						});
					}) : columns;

					self.createLookupColumnsForGridView({
						curColumn: confData.curColumn,
						columns: confData.columns,
						attName: confData.propName,
						addColumns: columnsToAdd,
						lookupField: getDisplayMember(confData.layout.overloads[lcPropName].grid)
					});
				}
			} else if (_.has(confData.layout, 'overloads.' + lcPropName + '.grid.addColumns')) {
				var lookupToolsService = $injector.get('basicsLookupdataConfigGenerator');

				if (lookupToolsService) {
					var addColConf = confData.layout.overloads[lcPropName].grid.addColumns;
					var lookupConfig = lookupToolsService.getDataServiceDefaultSpec({dataServiceName: addColConf.dataServiceName});

					if (lookupConfig) {
						if (lookupConfig.columns && lookupConfig.columns.length > 0) {
							self.createDataServiceBasedReferenceColumnsForGridView({
								curColumn: confData.curColumn,
								columns: confData.columns,
								attName: confData.propName,
								addColumns: lookupConfig.columns,
								addColumnConf: addColConf
							});
						}
					} else {
						self.createAttributeBasedReferenceColumnsForGridView({
							curColumn: confData.curColumn,
							columns: confData.columns,
							attName: confData.propName,
							addColumns: addColConf
						});
					}
				}
			}
		};

		this.getAdditionalColumnSpec = function getAdditionalColumnSpec(addColumn) {
			var res = _.cloneDeep(addColumn);

			return res;
		};

		this.prepareNameOfAdditionalColumn = function prepareNameOfAdditionalColumn (curColumn, addColumn) {
			if(_.isString(curColumn.additionalColumnPrefix) && _.isString(addColumn.additionalColumnPostfix)) {
				var translateIdent = curColumn.additionalColumnPrefix + addColumn.additionalColumnPostfix;

				return $translate.instant(translateIdent);
			}

			return self.getTranslation(curColumn) + '-' + self.getTranslation(addColumn);
		};

		this.createLookupColumnsForGridView = function createLookupColumnsForGridView(confData) {
			var lcAttName = confData.attName.toLowerCase();
			var curColumn = confData.curColumn;

			// add columns
			_.each(confData.addColumns, function (addColumn) {
				// skip lookup field
				if (addColumn.field === confData.lookupField || addColumn.field === confData.lookupField.split('.')[0]) {
					return true;
				}

				confData.columns.push({
					id: lcAttName + addColumn.id.toLowerCase(),
					formatter: curColumn.formatter,
					field: curColumn.field,
					name: self.prepareNameOfAdditionalColumn(curColumn, addColumn),
					sortable: true,
					grouping: curColumn.grouping,
					width: 60,
					formatterOptions: curColumn.formatterOptions,
					additionalColumn: self.getAdditionalColumnSpec(addColumn)
				});
			});
		};

		this.createDataServiceBasedReferenceColumnsForGridView = function createDataServiceBasedReferenceColumnsForGridView(confData) {
			var lcAttName = confData.attName.toLowerCase();
			var curColumn = confData.curColumn;

			// add columns
			_.each(confData.addColumns, function (addColumn) {
				// skip lookup field
				if (addColumn.field === confData.addColumnConf.displayMember || addColumn.field === confData.addColumnConf.displayMember.split('.')[0]) {
					return true;
				}

				confData.columns.push({
					id: lcAttName + addColumn.id.toLowerCase(),
					readonly: true,
					formatter: curColumn.formatter,
					field: curColumn.field,
					name: self.prepareNameOfAdditionalColumn(curColumn, addColumn),
					sortable: true,
					grouping: curColumn.grouping,
					width: 60,
					formatterOptions: curColumn.formatterOptions,
					additionalColumn: self.getAdditionalColumnSpec(addColumn)
				});
			});
		};

		this.createAttributeBasedReferenceColumnsForGridView = function createAttributeBasedReferenceColumnsForGridView(confData) {
			var lcAttName = confData.attName.toLowerCase();
			var curColumn = confData.curColumn;
			// add columns

			_.each(confData.addColumns, function (addColumn) {
				// skip lookup field
				if (addColumn.field === curColumn.field) {
					return true;
				}

				confData.columns.push({
					id: lcAttName + addColumn.id.toLowerCase(),
					readonly: true,
					formatter: addColumn.formatter,
					field: addColumn.field,
					model: addColumn.field,
					name: self.prepareNameOfAdditionalColumn(curColumn, addColumn),
					sortable: true,
					grouping: curColumn.grouping,
					width: 60,
					formatterOptions: addColumn.formatterOptions,
					additionalColumn: self.getAdditionalColumnSpec(addColumn)
				});
			});
		};

		this.getTranslation = function getTranslation(col) {
			var translation = col.name$tr$ ? $translate.instant(col.name$tr$, col.name$tr$param$) : col.name,
				notTranslated = translation === col.name$tr$;
			if (notTranslated) {
				$log.warn('Identifier "' + col.name$tr$ + '" was not translated (for additional lookup column).');
			}
			return notTranslated ? col.name : translation;
		};

	}

})(angular);
