(function () {
	'use strict';

	angular.module('platform').service('platformMatrixConfigurationServiceFactory', PlatformMatrixConfigurationServiceFactory);

	PlatformMatrixConfigurationServiceFactory.$inject = ['platformGridDomainService', '_', 'platformObjectHelper', 'basicsCommonRuleAnalyzerService'];

	function PlatformMatrixConfigurationServiceFactory(platformGridDomainService, _, objectHelper, analyzerService) {
		var self = this;

		self.createGridConfigService = function createGridConfigService(input, matrixDataService) {
			var gridConfig = {
				showHeaderRow: true,
				rowHeight: self.getTotalRowHeight(input.content.contentDefinition),

				// showTopPanel: false,
				columns: [
					{
						id: 'main_col',
						formatter: 'description',
						field: 'mainCol',
						name: 'Summary',
						sortable: false,
						width: 60,
						name$tr$: 'platform.summary'
					},
					{
						id: 'sub_col',
						formatter: 'description',
						field: 'subCol',
						name: 'Children',
						sortable: false,
						width: 50,
						name$tr$: 'platform.subordinated'
					}
				]
			};

			gridConfig = angular.merge(gridConfig, input.content.contentDefinition);

			self.addHorizontalDataColumns(gridConfig, input, matrixDataService);

			var configService = {
				headerRow: {},
				gridConfig: gridConfig,
				getStandardConfigForListView: function () {
					return gridConfig;
				}
			};

			configService.getHeaderRow = function () {
				return configService.headerRow;
			};

			configService.getHeaderRowEntry = function getHeaderRowEntry(field) {
				return configService.headerRow[field] || '';
			};

			self.initHeaderRow(configService, input, matrixDataService);

			return configService;
		};

		self.initHeaderRow = function initHeaderRow(configService, input, matrixDataService) {
			configService.headerRow = {
				mainCol: '',
				subCol: ''
			};

			var mainColumns = input.horizontal.getTree();

			var index = 0;
			_.forEach(mainColumns, function (mainCol) {
				var field = matrixDataService.fieldName(index);
				configService.headerRow[field] = {
					hasActions: true,
					actionList: [{
						toolTip: 'Collapse',
						icon: 'tlb-icons ico-tree-collapse-all matrix-toggle',
						callbackFn: function () {
							self.toggleMainColExpandState(mainCol, matrixDataService, configService, input);
						}
					}]
				};
				++index;

				_.forEach(mainCol.Children, function () {
					var field = matrixDataService.fieldName(index);
					configService.headerRow[field] = '';
					++index;
				});
			});
		};

		self.toggleMainColExpandState = function toggleMainColExpandState(mainColData, matrixDataService, configService, input) {
			var colName = mainColData.Id;
			var mainCol = _.find(configService.gridConfig.columns, {id: colName});
			var index = _.findIndex(configService.gridConfig.columns, {id: colName});
			mainCol.expanded = !mainCol.expanded;
			index -= 3;

			_.forEach(mainColData.Children, function (child, colIndex) {
				colName = matrixDataService.columnName(index + colIndex);
				var col = _.find(configService.gridConfig.columns, {id: colName});
				if (col) {
					col.hidden = !col.hidden;
				}
			});

			input.usingController.updateColumnVisibility();
			// additional cols are maybe added therefor the viewport has be recalculated
			input.usingController.resizeGrid();
		};

		self.isNodeRowNodeColumnCell = function isNodeRowNodeColumnCell(column, item) {
			return column.children && column.children.length > 0 && item.HasChildren;
		};

		self.formatNodeRowNodeColumnCell = function formatNodeRowNodeColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService) {
			var mainCol = _.find(gridConfig.columns, {id: column.id});
			if (mainCol && mainCol.expanded) {
				return '';// No content is to be displayed
			} else if (!item.nodeInfo.collapsed) {
				return '';// No content is to be displayed
			} else {
				return self.formatLeafRowLeafColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService);
			}
		};

		self.isNodeRowLeafColumnCell = function isNodeRowLeafColumnCell(column, item) {
			return (!column.children || column.children.length === 0) && item.HasChildren;
		};

		self.formatNodeRowLeafColumnCell = function formatNodeRowLeafColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService) {
			if (item && item.expanded) {
				return '';// No content is to be displayed
			} else {
				return self.formatLeafRowLeafColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService);
			}
		};

		self.isLeafRowNodeColumnCell = function isLeafRowNodeColumnCell(column, item) {
			return (column.children && column.children.length > 0) && !item.HasChildren;
		};

		self.formatLeafRowNodeColumnCell = function formatLeafRowNodeColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService) {
			var mainCol = _.find(gridConfig.columns, {id: column.id});
			if (mainCol && mainCol.expanded && item) {
				return '';// No content is to be displayed
			} else {
				return self.formatLeafRowLeafColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService);
			}
		};

		self.getFieldInfoObject = function getFieldInfoObject(cellModel, field, gridConfig) {
			var numberPattern = /\d+/g;
			var res = {
				domain: gridConfig[field] ? gridConfig[field].domain : null,
				value: cellModel[field] ? cellModel[field].model : null,
				name: _.clone(gridConfig[field].name),
				width: 0,
				height: 0
			};

			var fieldNumbers = field.match(numberPattern)[0];
			res.formatterOptions = gridConfig[field] ? gridConfig[field].formatterOptions : null;
			if (gridConfig[field].doesDependOn) {
				res.doesDependOn = gridConfig[field].doesDependOn;
			}
			res.width = gridConfig['Columnwidth0' + fieldNumbers[1]];
			res.height = gridConfig['Rowheight0' + fieldNumbers[0]];

			if (res.value && res.value._isAMomentObject) {
				res.value = res.value.clone();
			} else {
				res.value = _.clone(res.value);
			}

			// dont want to show a checkBox, instead show the propertyName when true e.g. IsCritical
			if (res.domain === 'boolean') {
				if (_.startsWith(res.name, 'Is')) {
					res.name = res.name.slice(2, res.value.length);
				}
				res.value = res.value === true ? res.name : 'Not ' + res.name;
				res.domain = 'code';
			}

			return res;
		};

		self.formatLeafRowLeafColumnCell = function formatLeafRowLeafColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService) {
			var cellContent = '';
			if (!_.isEmpty(cellModel)) {
				var resultingClasses;

				var entity = item.dataSource;
				if (entity) {
					resultingClasses = analyzerService.getAnalyzedClasses(entity) || '';
				}

				var rowCount = 0;
				var showActualRow = self.hasToShowRow(rowCount, gridConfig);
				var colCount = 0;
				cellContent = '<div class="absolute-container flex-box flex-column" style="' + resultingClasses + '">';

				_.forEach(matrixDataService.fields, function (field) {
					if (colCount === 0 && showActualRow) {
						cellContent += '<div class="flex-element flex-box">';
					}

					if (self.hasToShowCell(colCount, rowCount, gridConfig, cellModel[field])) {
						var infoObject = self.getFieldInfoObject(cellModel, field, gridConfig);
						column.formatterOptions = infoObject.formatterOptions;
						var divStyle = 'style="width:' + infoObject.width + 'px;"';
						var formatter = platformGridDomainService.formatter(infoObject.domain || 'description');
						var formattedValue = '';
						var entityValue = null;
						if (infoObject.doesDependOn && cellModel[field][infoObject.doesDependOn]) {
							formattedValue = formatter(row, cell, infoObject.value, column, cellModel[field], plainText, uniqueId);
						} else {
							// handle Lookups which sometimes need the entity to determine filters for retrieving lookup item lists
							if (infoObject.domain === 'lookup' && entity) {
								entityValue = _.clone(entity);
								column = _.clone(column);
								column.field = infoObject.name;
								_.set(entityValue, infoObject.name, infoObject.value);
							}
							// handle Description Info Objects
							if (infoObject.domain === 'translation' && _.isObject(infoObject.value) && infoObject.value.Translated) {
								infoObject.value = infoObject.value.Translated;
							}
							formattedValue = formatter(row, cell, infoObject.value, column, entityValue, plainText, uniqueId);
						}
						var title = infoObject.name ? infoObject.name + ': ' + formattedValue : '';
						title = infoObject.domain === 'lookup' ? infoObject.name : title;

						cellContent += '<div ' + 'title="' + title + '"' + divStyle + '" class="ellipsis">';
						if (objectHelper.isSet(formatter) && objectHelper.isSet(infoObject.value)) {
							cellContent += formattedValue;
						}
						cellContent += '</div>';
					}

					++colCount;

					if (colCount === 3) {
						colCount = 0;
						++rowCount;
						// close row when one was created
						if (showActualRow) {
							cellContent += '</div>';
						}
					}
					showActualRow = self.hasToShowRow(rowCount, gridConfig);
				});
				cellContent += '</div>';
			}

			return cellContent;
		};

		self.getCellFormatFunction = function getCellFormatFunction(gridConfig, input, matrixDataService) {
			return function CellFormatFunction() {
				return function formatCellDynamically(row, cell, value, column, item, plainText, uniqueId) {
					var cellContent = '';
					var cellModel;
					if (_.isFunction(value)) {
						cellModel = value();
					} else {
						cellModel = value;
					}

					if (self.isNodeRowNodeColumnCell(column, item)) {
						cellContent = self.formatNodeRowNodeColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService);
					} else if (self.isNodeRowLeafColumnCell(column, item)) {
						cellContent = self.formatNodeRowLeafColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService);
					} else if (self.isLeafRowNodeColumnCell(column, item)) {
						cellContent = self.formatLeafRowNodeColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService);
					} else {
						cellContent = self.formatLeafRowLeafColumnCell(cellModel, row, cell, value, column, item, plainText, uniqueId, gridConfig, input, matrixDataService);
					}

					return cellContent;
				};
			};
		};

		self.hasToShowRow = function hasToShowRow(row, gridConfig) {
			var show = false;

			switch (row) {
				case 0:
					show = gridConfig.Rowheight01 > 0;
					break;
				case 1:
					show = gridConfig.Rowheight02 > 0;
					break;
				case 2:
					show = gridConfig.Rowheight03 > 0;
					break;
				default:
					show = false;
					break;
			}

			return show;
		};

		self.hasToShowCell = function hasToShowCell(column, row, gridConfig) {
			var show = true;

			switch (column) {
				case 0:
					show = gridConfig.Columnwidth01 > 0 && self.hasToShowRow(row, gridConfig);
					break;
				case 1:
					show = gridConfig.Columnwidth02 > 0 && self.hasToShowRow(row, gridConfig);
					break;
				case 2:
					show = gridConfig.Columnwidth03 > 0 && self.hasToShowRow(row, gridConfig);
					break;
				default:
					show = false;
					break;
			}
			return show;
		};

		self.getTotalRowHeight = function getTotalRowHeight(gridConfig) {
			var total = gridConfig.Rowheight01;
			total += gridConfig.Rowheight02;
			total += gridConfig.Rowheight03;

			return total;
		};

		self.getTotalColumnWidth = function getTotalColumnWidth(gridConfig) {
			var total = gridConfig.Columnwidth01;
			total += gridConfig.Columnwidth02;
			total += gridConfig.Columnwidth03;

			return total;
		};

		self.addHorizontalDataColumns = function addHorizontalDataColumns(gridConfig, input, matrixDataService) {
			var mainColumns = input.horizontal.getTree();
			var colWidth = self.getTotalColumnWidth(input.content.contentDefinition);

			var index = 0;
			_.forEach(mainColumns, function (mainCol) {
				var parentCol = {
					id: matrixDataService.columnName(index),
					formatter: 'dynamic',
					field: matrixDataService.fieldName(index),
					name: mainCol.Code,
					width: colWidth,
					sortable: false,
					expanded: false,
					hidden: false,
					children: [],
					domain: self.getCellFormatFunction(gridConfig, input, matrixDataService)
				};

				gridConfig.columns.push(parentCol);
				++index;

				_.forEach(mainCol.Children, function (col) {
					var childCol = {
						id: matrixDataService.columnName(index),
						formatter: 'dynamic',
						field: matrixDataService.fieldName(index),
						name: col.Code,
						width: colWidth,
						hidden: true,
						sortable: false,
						domain: self.getCellFormatFunction(gridConfig, input, matrixDataService)
					};
					gridConfig.columns.push(childCol);
					parentCol.children.push(childCol);
					++index;
				});
			});
		};
	}
})();
