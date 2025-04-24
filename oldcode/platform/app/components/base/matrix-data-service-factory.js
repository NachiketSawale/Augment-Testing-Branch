(function () {
	'use strict';

	angular.module('platform').service('platformMatrixDataServiceFactory', PlatformMatrixDataServiceFactory);

	PlatformMatrixDataServiceFactory.$inject = ['_', 'platformMatrixConfigurationServiceFactory', 'basicsCommonMatrixConfigMainService', '$q', 'basicsCommonRuleAnalyzerService', 'platformObjectHelper', 'mainViewService', '$injector'];

	function PlatformMatrixDataServiceFactory(_, platformMatrixConfigurationServiceFactory, matrixConfigMainService, $q, analyzerService, objectHelper, mainViewService, $injector) {
		var self = this;

		self.fields = ['field11', 'field12', 'field13', 'field21', 'field22', 'field23', 'field31', 'field32', 'field33'];

		self.createMatrixCompleteService = function createMatrixCompleteService(horizontalService, verticalService, dataService, contentService, configService, dialogConfigService) { // jshint ignore:line
			var input = {
				horizontal: self.createHorizontalDataService(horizontalService, contentService, configService),
				vertical: self.createVerticalDataService(verticalService, contentService, configService),
				data: dataService,
				content: contentService,
				config: configService,
				usingController: null
			};

			return {
				loadColumns: function loadColumns() {
					return input.horizontal.loadColumns();
				},
				gridConfig: platformMatrixConfigurationServiceFactory.createGridConfigService(input, self),
				data: self.createMatrixDataService(input),
				validation: self.createMatrixValidationService(input),
				registerController: self.getRegisterControllerFunction(input, horizontalService),
				deregisterController: self.getDeregisterControllerFunction(input, horizontalService),
				destroyInstance: self.getDestroyInstanceFunction(),
				onHorizontalDataReloaded: self.getOnHorizontalDataReloadedFunction(input, horizontalService),
				dialogConfigService: dialogConfigService
			};
		};

		function allConfigPropsAreNull(config) {
			var c = config;
			if (!c.PropertyIdentifier11 && //
				!c.PropertyIdentifier12 && //
				!c.PropertyIdentifier13 && //
				!c.PropertyIdentifier21 && //
				!c.PropertyIdentifier22 && //
				!c.PropertyIdentifier23 && //
				!c.PropertyIdentifier31 && //
				!c.PropertyIdentifier32 && //
				!c.PropertyIdentifier33 && //
				!c.Columnwidth01 && //
				!c.Columnwidth02 && //
				!c.Columnwidth03 && //
				!c.Rowheight01 && //
				!c.Rowheight02 && //
				!c.Rowheight03 //

			) {
				return true;
			}
			return false;
		}

		self.getContentService = function getContentService(config, configService, recursiveDefer) {

			var settings = mainViewService.customData(config.containerUUID, 'matrixSettings');
			var defer = recursiveDefer ? recursiveDefer : $q.defer();
			var readOrCreateFn = matrixConfigMainService.createItem;
			if (settings && settings.matrixId) {
				readOrCreateFn = matrixConfigMainService.load;
				matrixConfigMainService.setReadDataFunc(function (data) {
					data.mainItemId = settings.matrixId;
					data.dataSourceId = config.matrixDataSource;
				});
			} else {
				matrixConfigMainService.setCreationDataFunc(function (data) {
					data.mainItemId = config.matrixDataSource;
				});
			}

			readOrCreateFn().then(function (configuration) {
				configuration = configuration ? configuration[0] : null;
				if (!configuration) {
					// in case of customData corruption reset customData and start again
					mainViewService.customData(config.containerUUID, 'matrixSettings', {}).then(function () {
						getContentService(config, configService, defer);
					});
					return;
				}
				configuration.AvailableProperties = _.cloneDeep($injector.get(config.uiStandardServiceName).getStandardConfigForListView().columns);
				var statusConfig = _.find(configuration.AvailableProperties, function (prop) {
					return prop.id === 'activitystatefk';
				});

				var basicsLookupdataConfigGenerator = $injector.get('basicsLookupdataConfigGenerator');
				_.assign(statusConfig, basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.activitystate', null, {
					showIcon: true,
					imageSelectorService: 'platformStatusIconService'
				}).grid);

				// in case of a create the ReadDataFunc will set when
				matrixConfigMainService.setReadDataFunc(function (data) {
					data.mainItemId = configuration.MatrixDto.Id;
					data.dataSourceId = config.matrixDataSource;
				});

				// take the first config for the first step
				var loadedContentDefinition = configuration.MatrixcelldefinitionDto;

				var defaultContent = {
					contentDefinition: {
						Columnwidth01: 120,
						Columnwidth02: 120,
						Columnwidth03: 0,
						Rowheight01: 25,
						Rowheight02: 25,
						Rowheight03: 0,
						summarize: 'root'
					}
				};

				angular.extend(defaultContent, config);
				if (allConfigPropsAreNull(loadedContentDefinition)) {
					defaultContent.contentDefinition = angular.extend(defaultContent.contentDefinition, config.defaultContentDefinition);
				} else {
					delete defaultContent.defaultContentDefinition;
					angular.extend(defaultContent.contentDefinition, loadedContentDefinition);
				}

				var fieldList = matrixConfigMainService.getFields(defaultContent.contentDefinition, configuration.AvailableProperties, config.schemaInfo);
				analyzerService.setConfig(configuration);
				configService.enrichFieldInformation(fieldList);

				angular.extend(defaultContent.contentDefinition, fieldList);
				// save the matrixId in the Custom Data of the layout System
				mainViewService.customData(defaultContent.containerUUID, 'matrixSettings', {
					matrixId: configuration.MatrixDto.Id
				}).then(function () {
					defer.resolve(defaultContent);
				});
			});
			return defer.promise;
		};

		self.getRegisterControllerFunction = function getRegisterControllerFunction(input, horizontalService) {
			return function (controller, matrixSerivce) {
				input.usingController = controller;
				horizontalService.registerListLoaded(matrixSerivce.onHorizontalDataReloaded, matrixSerivce);
			};
		};

		self.getDeregisterControllerFunction = function getDeregisterControllerFunction(input, horizontalService) {
			return function (controller, matrixService) {
				input.usingController = null;
				horizontalService.unregisterListLoaded(matrixService.onHorizontalDataReloaded);
			};
		};

		self.getDestroyInstanceFunction = function getDestroyInstanceFunction() {
			return function (matrixService) {
				delete matrixService.gridConfig;
				delete matrixService.data;
				delete matrixService.validation;
			};
		};

		self.getOnHorizontalDataReloadedFunction = function getOnHorizontalDataReloadedFunction(input, horizontalService) {
			return function (matrixService) {
				if (input.usingController) {
					self.initHorizontalDataServiceColumns(input.horizontal, horizontalService, input.content, input.config);
					platformMatrixConfigurationServiceFactory.addHorizontalDataColumns(matrixService.gridConfig.gridConfig, input, self);
					self.updateMatrixDataService(matrixService.data, input);
					platformMatrixConfigurationServiceFactory.initHeaderRow(matrixService.gridConfig, input, self);
					input.usingController.adjustMatrixConfiguration();
				}
			};
		};

		self.createHorizontalDataService = function createHorizontalDataService(horizontalService, contentService, configService) {
			var service = {
				topRow: [],
				loadColumns: function loadColumns() {
					return horizontalService.loadColumns();
				},
				dataService: horizontalService
			};
			service.getTree = function () {
				return service.topRow;
			};

			self.initHorizontalDataServiceColumns(service, horizontalService, contentService, configService);

			return service;
		};

		self.initHorizontalDataServiceColumn = function initHorizontalDataServiceColumn(col, service, childProp, index) {
			var root = {
				Id: self.columnName(index),
				Code: col.Code,
				Children: [],
				HasChildren: false,
				data: col
			};
			service.topRow.push(root);
			++index;

			_.forEach(col[childProp], function (colChild) {
				root.HasChildren = true;
				var leaves = self.FindHorizontalLeavesTo(colChild, childProp, index);
				index += leaves.length;
				_.forEach(leaves, function (leave) {
					root.Children.push(leave);
				});
			});

			return index;
		};

		self.initHorizontalDataServiceColumns = function initHorizontalDataServiceColumns(service, horizontalService, contentService, configService) {
			var index = 0;
			service.topRow.length = 0;
			var extraParentForFlatRoots = configService.createEmptyHorizontalRoot();

			if (configService.usesRootLeafForColumns) {
				_.forEach(horizontalService.getTree(), function (col) {
					if (col[contentService.horizontalChildren] && col[contentService.horizontalChildren].length > 0) {
						index = self.initHorizontalDataServiceColumn(col, service, contentService.horizontalChildren, index);
					} else {
						extraParentForFlatRoots[contentService.horizontalChildren].push(col);
						extraParentForFlatRoots.HasChildren = true;
					}
				});

				if (extraParentForFlatRoots.HasChildren) {
					index = self.initHorizontalDataServiceColumn(extraParentForFlatRoots, service, contentService.horizontalChildren, index);
				}
			} else {// then we use the lowest two level of horizontal input.
				service.topRow.push({
					Id: 1,
					Code: 'Not supported yet',
					Children: [],
					HasChildren: false
				});
			}
		};

		self.FindHorizontalLeavesTo = function FindHorizontalLeavesTo(col, childrenField, start) {
			var leaves = [];
			var index = start;

			if (_.isEmpty(col[childrenField])) {
				leaves.push({
					Id: self.columnName(index),
					Code: col.Code,
					Children: [],
					HasChildren: false,
					data: col
				});
			} else {
				_.forEach(col[childrenField], function (colChild) {
					var childLeaves = self.FindHorizontalLeavesTo(colChild, childrenField, index);
					index += childLeaves.length;
					_.forEach(childLeaves, function (leave) {
						leaves.push(leave);
					});
				});
			}

			return leaves;
		};

		self.createVerticalDataServiceRow = function createVerticalDataServiceRow(mainRow, service, childProp) {
			var root = {
				Id: mainRow.Id,
				Code: mainRow.Code,
				Children: [],
				HasChildren: false,
				data: mainRow
			};
			service.topRow.push(root);

			_.forEach(mainRow[childProp], function (colChild) {
				root.HasChildren = true;
				var leaves = self.FindVerticalLeavesTo(colChild, childProp);
				_.forEach(leaves, function (leave) {
					root.Children.push(leave);
				});
			});
		};

		self.createVerticalDataService = function createVerticalDataService(verticalService, contentService, configService) {
			var service = {
				topRow: [],
				serviceName: verticalService.getServiceName(),
				dataService: verticalService
			};
			service.getTree = function () {
				return service.topRow;
			};
			var extraParentForFlatRoots = configService.createEmptyVerticalRoot();

			if (configService.usesRootLeafForRows) {
				_.forEach(verticalService.getTree(), function (mainRow) {
					if (mainRow[contentService.verticalChildren] && mainRow[contentService.verticalChildren].length > 0) {
						self.createVerticalDataServiceRow(mainRow, service, contentService.verticalChildren);
					} else {
						extraParentForFlatRoots[contentService.verticalChildren].push(mainRow);
						extraParentForFlatRoots.HasChildren = true;
					}
				});

				if (extraParentForFlatRoots.HasChildren) {
					self.createVerticalDataServiceRow(extraParentForFlatRoots, service, contentService.verticalChildren);
				}
			} else {// then we use the lowest two level of horizontal input.
				service.topRow.push({
					Id: 1,
					Code: 'Not supported yet',
					Children: [],
					HasChildren: false
				});
			}

			return service;
		};

		self.FindVerticalLeavesTo = function FindVerticalLeavesTo(row, childrenField) {
			var leaves = [];

			if (_.isEmpty(row[childrenField])) {
				leaves.push({
					Id: row.Id,
					Code: row.Code,
					Children: [],
					HasChildren: false,
					data: row
				});
			} else {
				_.forEach(row[childrenField], function (subRow) {
					var childLeaves = self.FindVerticalLeavesTo(subRow, childrenField);
					_.forEach(childLeaves, function (leave) {
						leaves.push(leave);
					});
				});
			}

			return leaves;
		};

		self.createMatrixDataService = function createMatrixDataService(input) {
			var gridDataService = {
				treeData: [],
				getServiceName: function getServiceName() {
					return input.vertical.serviceName;
				},
				getMatrixContent: function getMatrixContent() {
					return input.content;
				}
			};

			gridDataService.getTree = function () {
				return gridDataService.treeData;
			};
			gridDataService.getSelected = function getSelectedMatrixData() {
				var horSel = input.vertical.dataService.getSelected();
				var sel = null;
				if (horSel && horSel.Id > 0) {
					sel = _.find(gridDataService.listData, {Id: horSel.Id});
				}

				return sel;
			};
			gridDataService.setSelected = function setSelectedMatrixData(row) {
				if (row) {
					return input.vertical.dataService.setSelected(row.dataSource);
				} else {
					return $q.when(null);
				}
			};

			gridDataService.setSelectedEntities = function setSelectedEntities(rows) {
				if (rows) {
					return input.vertical.dataService.setSelected(rows[0].dataSource);
				} else {
					return $q.when(null);
				}
			};

			gridDataService.deselect = function deselect() {
				return input.vertical.dataService.deselect();
			};

			gridDataService.getItemById = function getItemById(Id) {
				return _.find(gridDataService.listData, {Id: Id});
			};
			gridDataService.updateDataOnRowCountChanged = function updateMatrixDataOnRowCountChanged() {
				var changed = [];
				_.forEach(gridDataService.treeData, function (mainRow) {

					if (mainRow.nodeInfo && mainRow.HasChildren && mainRow.expanded === mainRow.nodeInfo.collapsed) {
						mainRow.expanded = !mainRow.expanded;
						changed.push(mainRow);
					}

				});
				return changed;
			};

			var mainRows = input.vertical.getTree();

			_.forEach(mainRows, function (mainRow) {
				self.addMainRowData(mainRow, gridDataService, input);
			});

			return gridDataService;
		};

		self.updateMatrixDataService = function updateMatrixDataService(gridDataService, input) {
			var mainRows = gridDataService.getTree();

			_.forEach(mainRows, function (mainRow) {
				self.updateMainRowEntity(mainRow, input);
			});
		};

		self.createMatrixValidationService = function createMatrixDataService() { // jshint ignore:line
			return {};
		};

		self.columnName = function columnName(colIndex) {
			return 'col_' + colIndex;
		};

		self.fieldName = function fieldName(colIndex) {
			return 'field_' + colIndex;
		};

		self.addMainRowData = function addMainRowData(mainRow, gridDataService, input) {
			var rowData = self.initMainRowFields(mainRow);
			gridDataService.treeData.push(rowData);
			_.forEach(mainRow.Children, function (row) {
				rowData.children.push(self.initLeaveRowFields(row, input, rowData));
			});

			if (!_.isEmpty(rowData.children)) {
				rowData.HasChildren = true;
				self.updateMainRowFields(rowData, input);
			}

			return gridDataService;
		};

		self.updateMainRowEntity = function updateMainRowEntity(mainRowData, input) {
			_.forEach(mainRowData.children, function (rowData) {
				self.updateLeaveRowFields(rowData, input);
			});
			self.updateMainRowFields(mainRowData, input);
		};

		self.initMainRowFields = function initMainRowFields(mainRow) {
			return {
				parent: null,
				expanded: false,
				image: mainRow.data.image,
				mainCol: mainRow.Code,
				Id: mainRow.Id,
				subCol: '',
				children: [],
				HasChildren: false,
				dataSource: mainRow.data
			};
		};

		self.updateMainRowFields = function updateMainRowFields(rowData, input) {
			var mainColumns = input.horizontal.getTree();
			var index = 0;
			var nextMC = 0;
			var entries = [];

			_.forEach(mainColumns, function (mainCol) {
				++index;
				_.forEach(mainCol.Children, function () {
					var field = self.fieldName(index);
					var entry = self.getMainRowCellContent(rowData, field, input);
					if (entry) {
						rowData[field] = entry;
						entries.push(entry);
					}
					++index;
				});

				var mainfield = self.fieldName(nextMC);
				self.updateMainColumnField(rowData, mainfield, entries, input);
				nextMC = index;

				entries.length = 0;
			});

			return rowData;
		};

		self.getMinMaxValue = function getMinMaxValue(value, domain) {
			if (value) {
				switch (domain) {
					case 'dateutc':
						return value.format('YYYY MM DD');
					case 'datetimeutc':
						return value.format('YYYY MM DD');
					case 'date':
						return value.format('YYYY MM DD');
					case 'datetime':
						return value.format('YYYY MM DD');
					default:
						return value;
				}
			}

			return value;
		};

		self.hasFieldValue = function hasFieldValue(entity, field) {
			return objectHelper.isSet(entity[field]) && objectHelper.isSet(entity[field].model);
		};

		self.updateMainColumnField = function updateMainColumnField(rowData, mainfield, entries, input) {
			// first, last, min, max, sum, all, one, none
			var res = null;
			var withValues = null;
			if (entries.length > 0) {
				var contDef = input.content.contentDefinition;
				rowData[mainfield] = {};
				_.forEach(self.fields, function (field) {
					var fieldDef = contDef[field];
					if (!!fieldDef && !!fieldDef.model) {
						if (fieldDef.sumType.first) {
							rowData[mainfield][field] = _.result(_.find(entries, function (entry) {
								return self.hasFieldValue(entry, field);
							}), field);
						}
						if (fieldDef.sumType.last) {
							rowData[mainfield][field] = _.result(_.findLast(entries, function (entry) {
								return self.hasFieldValue(entry, field);
							}), field);
						}
						if (fieldDef.sumType.min) {
							withValues = _.filter(entries, function (e) {
								return self.hasFieldValue(e, field);
							});
							if (withValues.length > 0) {
								withValues = _.orderBy(withValues, [function (entry) {
									return self.getMinMaxValue(entry[field].model, fieldDef.domain);
								}], ['asc']);
								rowData[mainfield][field] = withValues[0][field];
							}
						}
						if (fieldDef.sumType.max) {
							withValues = _.filter(entries, function (e) {
								return self.hasFieldValue(e, field);
							});
							if (withValues.length > 0) {
								withValues = _.orderBy(withValues, [function (entry) {
									return self.getMinMaxValue(entry[field].model, fieldDef.domain);
								}], ['desc']);
								rowData[mainfield][field] = withValues[0][field];
							}
						}
						if (fieldDef.sumType.sum) {
							rowData[mainfield][field] = {
								model: _.sumBy(entries, function (entry) {
									return entry[field].model;
								})
							};
						}
						if (fieldDef.sumType.all) {
							rowData[mainfield][field] = {
								model: _.every(entries, function (entry) {
									return entry[field].model;
								})
							};
						}
						if (fieldDef.sumType.one) {
							rowData[mainfield][field] = {
								model: _.some(entries, function (entry) {
									return entry[field].model;
								})
							};
						}
						// if(fieldDef.sumType.none) { }
					}
				});

				res = rowData[mainfield];
			}

			return res;
		};

		self.initLeaveRowFields = function initLeaveRowFields(row, input, parent) {
			var rowData = {
				parent: parent.Id,
				Id: row.Id,
				expanded: false,
				image: row.data.image,
				mainCol: '',
				subCol: row.Code,
				children: [],
				HasChildren: false,
				dataSource: row.data,
				horizontalRef: row.data[input.content.linkProperty]
			};

			self.updateLeaveRowFields(rowData, input);

			return rowData;
		};

		self.updateLeaveRowFields = function updateLeaveRowFields(rowData, input) {
			var mainColumns = input.horizontal.getTree();
			var index = 0;
			var nextMC = 0;
			var entries = [];

			_.forEach(mainColumns, function (mainCol) {
				++index;
				_.forEach(mainCol.Children, function (col) {
					var field = self.fieldName(index);
					var entry = self.getCellContent(rowData, col, input);
					if (entry) {
						rowData[field] = entry;
						entries.push(entry);
					}
					++index;
				});

				var mainfield = self.fieldName(nextMC);
				self.updateMainColumnField(rowData, mainfield, entries, input);
				nextMC = index;

				entries.length = 0;
			});
		};

		self.getMainRowCellContent = function getMainRowCellContent(mainRow, field, input) {
			var childEntries = [];
			_.forEach(mainRow.children, function (row) {
				if (row[field]) {
					childEntries.push(row[field]);
				}
			});

			return self.updateMainColumnField(mainRow, field, childEntries, input);
		};

		self.getCellContent = function getCellContent(rowData, col, input) {
			return rowData.horizontalRef === col.data.Id ? self.getCellData(rowData, col, input) : null;
		};

		self.getCellData = function getCellData(rowData, col, input) {
			var dataEntity = input.content.getCellDataEntity(rowData, col);
			return input.content.initField(dataEntity);
		};
	}
})();
