/**
 * Created by zwz on 6/30/2020.
 */
(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.common';

	var columnNameLookupServiceName = 'ppsCommonColumnNameLookupDataService';
	angular.module(moduleName).factory(columnNameLookupServiceName, [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(columnNameLookupServiceName, {
				valMember: 'field',
				dispMember: 'name',
				uuid: '5d6dea962b4a430487b38269ac1280b2'
			});
			return platformLookupDataServiceFactory.createInstance({
				dataAlreadyLoaded: true
			}).service;
		}
	]);

	angular.module(moduleName).service('ppsCommonLogSourceFilterService', FilterService);

	FilterService.$inject = ['_',
		'$injector',
		'$translate',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'ppsCommonContainerInformationService',
		'ppsEntityConstant'];

	function FilterService(_,
		$injector,
		$translate,
		platformTranslateService,
		basicsLookupdataConfigGenerator,
		basicsLookupdataLookupFilterService,
		ppsCommonContainerInformationService,
		ppsEntityConstant) {
		var self = this;
		//var instances = {};
		var entity = {};

		let ppsEntity2FilterKeyTable = (function () {
			let table = {};
			table[ppsEntityConstant.PPSItem] = 'pps-common-ppsitem-ppsentity-filter';
			table[ppsEntityConstant.TransportRequisition] = 'pps-common-trsreq-ppsentity-filter';
			table[ppsEntityConstant.EngineeringTask] = 'pps-common-engtask-ppsentity-filter';
			table[ppsEntityConstant.PPSProductionSet] = 'pps-common-prodset-ppsentity-filter';
			// to be extending...
			// table[ppsEntityConstant.TransportRoute] = 'productionplanning-common-route-ppsentity-filter';

			return table;
		})();

		let filters = [
			// ppsEntity Filters
			{
				key: 'pps-common-ppsitem-ppsentity-filter',
				fn: function (ppsEntity) {
					return ppsEntity && (ppsEntity.Id === ppsEntityConstant.PPSItem || ppsEntity.Id === ppsEntityConstant.GenericEvent || ppsEntity.Id === ppsEntityConstant.EngineeringTask2Clerk);
				}
			}, {
				key: 'pps-common-trsreq-ppsentity-filter',
				fn: function (ppsEntity) {
					return ppsEntity && ppsEntity.Id === ppsEntityConstant.TransportRequisition;
				}
			}, {
				key: 'pps-common-engtask-ppsentity-filter',
				fn: function (ppsEntity) {
					return ppsEntity && (ppsEntity.Id === ppsEntityConstant.EngineeringTask || ppsEntity.Id === ppsEntityConstant.GenericEvent);
				}
			}, {
				key: 'pps-common-prodset-ppsentity-filter',
				fn: function (ppsEntity) {
					return ppsEntity && (ppsEntity.Id === ppsEntityConstant.PPSProductionSet || ppsEntity.Id === ppsEntityConstant.GenericEvent);
				}
			},
			// ppsEventType filters
			{
				key: 'pps-common-engtask-eventtype-filter',
				fn: function (item) {
					return item && item.PpsEntityFk === ppsEntityConstant.EngineeringTask && item.IsLive;
				}
			}, {
				key: 'pps-common-prodset-eventtype-filter',
				fn: function (item) {
					return item && item.PpsEntityFk === ppsEntityConstant.PPSProductionSet && item.IsLive;
				}
			}, {
				key: 'pps-common-trsreq-eventtype-filter',
				fn: function (item) {
					return item && item.PpsEntityFk === ppsEntityConstant.TransportRequisition && item.IsLive;
				}
			}];
		_.each(filters, function (filter) {
			if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
				basicsLookupdataLookupFilterService.registerFilter(filter);
			}
		});

		self.createFilterParams = function createFilterParams(filter, uuid) {
			// var params = instances[uuid];
			// if (_.isNil(params)) {
			// 	params = provideFilterParams(filter, uuid);
			// 	instances[uuid] = params;
			// }
			// return params;

			return provideFilterParams(filter, uuid); // items of ppsCommonColumnNameLookupDataService should be changed
		};

		function provideFilterParams(filter, uuid) {
			var formConfig = {
				fid: '',
				version: '',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: []
			};

			setRowsAndEntityByFilter(formConfig, entity, filter, uuid);

			entity.uuid = uuid;
			entity.PpsEntityFk = ppsCommonContainerInformationService.getPpsEntityByGuid(uuid);
			return {entity: entity, config: platformTranslateService.translateFormConfig(formConfig)};
		}

		function setRowsAndEntityByFilter(formConfig, entity, filter, uuid) {
			if (angular.isArray(filter)) {
				for (var i = 0, filterLength = filter.length; i < filterLength; i++) {
					setRowAndEntityByFilter(formConfig, entity, filter[i], i + 1, uuid);
				}
			} else {
				setRowAndEntityByFilter(formConfig, entity, filter, 1, uuid);
			}

		}

		function setRowAndEntityByFilter(formConfig, entity, filter, sortOrder, uuid) {
			var createRow = self['provide' + filter + 'RowConfig'];
			if (_.isFunction(createRow)) {
				var row = null;
				if (filter === 'PpsEntityFk' || filter === 'ColumnName') {
					row = createRow(uuid);
				} else {
					row = createRow();
				}

				row.gid = 'selectionfilter';
				row.model = filter;
				row.sortOrder = sortOrder;
				formConfig.rows.push(row);
				entity[filter] = null;
			}
		}

		this.provideDateRowConfig = function provideDateRowConfig() {
			var dateChanged = function dateChanged(entity) {
				var tmp = _.cloneDeep(entity.Date);
				entity.Date = tmp; // Set entity.Date, for triggering watchFn of watchFilter['Date'] in platformSourceWindowControllerService.
				// We do this because when entity.Date.StartDate or entity.Date.EndDate is changed, changed of entity.Date has not been triggered.
			};
			var row = {
				//gid: 'selectionfilter',
				rid: 'Date',
				label: '*Date',
				label$tr$: 'cloud.common.entityDate',
				type: 'composite',
				//sortOrder: 1,
				composite: [{
					model: 'StartDate',
					type: 'dateutc',
					//fill: true,
					change: dateChanged
				}, {
					model: 'EndDate',
					type: 'dateutc',
					//fill: false,
					change: dateChanged
				}]
			};
			return row;
		};

		this.providePpsLogReasonFkRowConfig = function providePpsLogReasonFkRowConfig() {
			return basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.ppslogreason', '',
				{
					//gid: 'selectionfilter',
					rid: 'PpsLogReasonFk',
					label: '*Log Reason',
					label$tr$: 'productionplanning.common.logLayout.reasonDescription',
					//model: 'PpsLogReasonFk',
					//sortOrder: 2
				}, false, {required: false});
		};

		this.providePpsEntityFkRowConfig = function providePpsEntityFkRowConfig(uuid) {
			var ppsEntity = ppsCommonContainerInformationService.getPpsEntityByGuid(uuid);
			var filterKey = ppsEntity2FilterKeyTable[ppsEntity];
			var rowConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.ppsentity', '',
				{
					rid: 'PpsEntityFk',
					label: '*PPS Entity',
					label$tr$: 'productionplanning.common.logLayout.ppsEntityDescription',
					change: function ppsEntityFkChanged(entity) {
						entity.RecordType = null;
					},
				}, false, {required: false});
			rowConfig.options.filterKey = filterKey;
			return rowConfig;
		};

		this.provideColumnNameRowConfig = function provideColumnNameRowConfig(uuid) {

			function getColumns(uiService, schemaOption, isPropertyMappedToDbColumn, translationService) {
				var loggableCols = [];
				var columns = uiService.getStandardConfigForListView().columns;
				columns.forEach(function (col) {
					//if (col.field.toLowerCase() === col.id) {
					var field = col.field === 'DescriptionInfo' ? 'DescriptionInfo.Translated' : col.field;
					if (isPropertyMappedToDbColumn(schemaOption, field)) {
						loggableCols.push({
							field: field,
							name: col.name,
							name$tr$: col.name$tr$,
							name$tr$param$: col.name$tr$param$
						});
					}
					//}
				});

				// translate columns name
				platformTranslateService.registerModule(translationService.data.allUsedModules, true).then(function () {
					loggableCols.forEach(function (col) {
						var tResult = col.name$tr$ ? $translate.instant(col.name$tr$, col.name$tr$param$) : col.name;
						if (tResult !== col.name$tr$) {
							col.name = tResult;
						}
					});
				});

				return loggableCols;
			}

			// remark: code of function getColumns() is copied from pps-common-log-source-filter-service.js

			var schemaOption, uiService, translationService,
				helper = $injector.get('ppsCommonLoggingHelper');
			var ppsEntity = ppsCommonContainerInformationService.getPpsEntityByGuid(uuid);
			if (ppsEntity === ppsEntityConstant.PPSItem) {
				schemaOption = {typeName: 'PPSItemDto', moduleSubModule: 'ProductionPlanning.Item'};
				uiService = $injector.get('productionplanningItemUIStandardService');
				translationService = $injector.get('productionplanningItemTranslationService');
				$injector.get(columnNameLookupServiceName).setCache(
					{lookupType: columnNameLookupServiceName}, getColumns(uiService, schemaOption, helper.isPropertyMappedToDbColumn, translationService));
			} else if (ppsEntity === ppsEntityConstant.TransportRequisition) {
				schemaOption = {typeName: 'RequisitionDto', moduleSubModule: 'TransportPlanning.Requisition'};
				uiService = $injector.get('transportplanningRequisitionUIStandardService');
				translationService = $injector.get('transportplanningRequisitionTranslationService');
				$injector.get(columnNameLookupServiceName).setCache(
					{lookupType: columnNameLookupServiceName}, getColumns(uiService, schemaOption, helper.isPropertyMappedToDbColumn, translationService));
			}

			var row = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
				gridLess: true,
				dataServiceName: columnNameLookupServiceName,
				valMember: 'field',
				dispMember: 'name',
				showClearButton: true
			});
			row.rid = 'ColumnName';
			row.label = '*Column Name';
			row.label$tr$ = 'productionplanning.common.logLayout.columnName';

			return row;
		};

		this.provideRecordTypeRowConfig = function provideRecordTypeRowConfig() {
			var lookupInfo = getEntityTypeLookupInfo();
			var row = {
				rid: 'RecordType',
				label: '*Type',
				label$tr$: 'cloud.common.entityType',
				type: 'directive',
				directive: 'pps-dynamic-grid-and-form-lookup',
				options: {
					isTextEditable: false,
					dependantField: 'PpsEntityFk',
					lookupInfo: lookupInfo,
					grid: false,
					dynamicLookupMode: true,
					showClearButton: true
				}

			};
			return row;
		};

		function getEntityTypeLookupInfo(key) {
			if (typeof key === 'number') { // convert ddTable ID to TABLE_NAME
				return lookupInfos[key];
			}
			return lookupInfos;
		}

		var lookupInfos = createEntityTypeLookupInfos();

		function createEntityTypeLookupInfos() {
			let result = {};

			function createSpecifiedEventTypeLookupInfo(filterKey) {
				return {
					lookup: {
						directive: 'productionplanning-common-event-type-lookup',
						options: {
							showClearButton: true,
							displayMember: 'DescriptionInfo.Translated',
							lookupOptions: {
								filterKey: filterKey
							},
							filterKey: filterKey
						},
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'DescriptionInfo.Translated',
							lookupType: 'EventType',
							version: 3
						}
					}
				};
			}
			result[ppsEntityConstant.GenericEvent] = createSpecifiedEventTypeLookupInfo(null);
			result[ppsEntityConstant.TransportRequisition] = createSpecifiedEventTypeLookupInfo('pps-common-trsreq-eventtype-filter');
			result[ppsEntityConstant.EngineeringTask] = createSpecifiedEventTypeLookupInfo('pps-common-engtask-eventtype-filter');
			result[ppsEntityConstant.PPSProductionSet] = createSpecifiedEventTypeLookupInfo('pps-common-prodset-eventtype-filter');

			function createGeneralLookupInfo(lookupGridCfg){
				let options = lookupGridCfg.editorOptions.lookupOptions;
				options.filterKey = null;
				return {
					lookup: {
						directive: lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive,
						options: options,
						formatter: lookupGridCfg.formatter,
						formatterOptions: lookupGridCfg.formatterOptions
					}
				};
			}
			let lookupGridCfg = basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppsitemtype', null, {
				showIcon: true
			}).grid;
			result[ppsEntityConstant.PPSItem] = createGeneralLookupInfo(lookupGridCfg);

			let clerkRolelookupGridCfg = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCustomClerkRoleLookupDataService',
				cacheEnable: true
			}).grid;
			result[ppsEntityConstant.EngineeringTask2Clerk] = createGeneralLookupInfo(clerkRolelookupGridCfg);

			Object.getOwnPropertyNames(result).forEach(function (pName) {
				result[pName].column = 'EntityType';
			});

			return result;
		}

		function createOptionsForLookup(layoutName, propName) {
			var lookupGridCfg = $injector.get(layoutName).overloads[propName].grid;
			return {
				directive: lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive,
				options: lookupGridCfg.editorOptions.lookupOptions,
				formatter: lookupGridCfg.formatter,
				formatterOptions: lookupGridCfg.formatterOptions
			};
		}
	}

})(angular);