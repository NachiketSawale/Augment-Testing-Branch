/**
 * Created by baf on 2021-10-08.
 */

(function (angular) {
	'use strict';

	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory
	 * @description creates data services used in different reserved for to container
	 */
	angular.module(moduleName).service('timekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory', TimekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory);

	TimekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory.$inject = ['_', '$injector', 'timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory',
		'basicsLookupdataLookupFilterService'];

	function TimekeepingTimeAllocationReportForEmployeeAndPeriodLayoutServiceFactory(_, $injector, timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory,
		basicsLookupdataLookupFilterService) {
		let instances = {};

		let self = this;

		let filters = [
			{
				key: 'timekeeping-timesymbol-allocation-filter',
				fn: function (item,) {
						return item.IsTimeAllocation;
				}
			}];
		basicsLookupdataLookupFilterService.registerFilter(filters);


		this.getModuleInformationService = function getModuleInformationService(module) {
			let cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			let templUid = scope.getContentValue('layout');
			let templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });

			let srv = instances[templUid];
			if(_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.createConfig(templInfo.usedLayout, templInfo);
				instances[templUid] = srv;
			}

			return srv;
		};

		this.createConfig = function createConfig(templUid, templInfo) {
			let modCIS = self.getModuleInformationService(templInfo.moduleName);

			let conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templUid));
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = timekeepingTimeAllocationReportForEmployeeAndPeriodDataServiceFactory.createDataService(templInfo);
			let validationService = {};
			let valServFactory = $injector.get('timekeepingRecordingReportValidationServiceFactory');
			valServFactory.createTimekeepingReportValidationService(validationService, conf.dataServiceName);
			conf.validationServiceName = validationService;
			return conf;
		};

		this.createLayoutService = function createLayoutService(conf, templInfo, modCIS) {
			var sc = {
				conf: self.createConfiguration(conf, templInfo, modCIS),
				service: {}
			};

			sc.service.getDtoScheme = function getDtoScheme(){
				return sc.conf.dtoScheme;
			};

			sc.service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
				return sc.conf.detailLayout;
			};

			sc.service.getStandardConfigForListView = function getStandardConfigForListView() {
				return sc.conf.listLayout;
			};

			conf.standardConfigurationService = sc.service;

			return sc;
		};

		this.createConfiguration = function createConfiguration(conf, templInfo, modCIS) {
			let confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			let detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			let gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			let dtoScheme = _.cloneDeep(confServ.getDtoScheme());

			let colRe = _.remove(gridView.columns, function(item){
				return item.id === 'timesymbolfk' || item.id === 'timesymbolfkdescription' || item.id === 'timesymbolfktimesymbolgroup' || item.id === 'timesymbolfkuomfk'|| item.id === 'timesymbolfkcompanycode';
			});
			let cols = [{
				field: 'TimeSymbolFk',
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'basics-lookup-data-by-custom-data-service',
					lookupOptions: {
						additionalColumns: true,
						dataServiceName: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
						disableDataCaching: true,
						displayMember: 'Code',
						enableCache: false,
						lookupModuleQualifier: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
						uuid: 'e529982324434e69852d1ba22683f54a',
						lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
						valueMember: 'Id',
						columns: [
							{id: 'Code', field: 'Code', name: 'Code',	formatter: 'code', name$tr$: 'cloud.common.entityCode'},
							{id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation',	name$tr$: 'cloud.common.entityDescription'},
							{id: 'TimeSymbolGroup', field: 'TimeSymbolGroup.DescriptionInfo',	name: 'TimeSymbolGroup', formatter: 'translation',	name$tr$: 'cloud.common.entityTimeSymbolGroupFk'},
							{id: 'UoMFk', field: 'UoMFk', name: 'UoM', width: 100, name$tr$: 'basics.unit.entityUomFk', formatter: 'lookup', formatterOptions: {lookupType: 'uom', displayMember: 'Unit'}	},
							{id: 'CompanyCode', field: 'CompanyFk', name: 'Company Code', width: 100, name$tr$: 'cloud.common.entityCompanyCode', formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Company',
									displayMember: 'Code'
								},
								sortable: true
							}
						],
						filterKey: 'timekeeping-timesymbol-allocation-filter',
						showClearButton: true,
						isTextEditable: false,
						isClientSearch: true
					},
					lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService'
				},
				formatter: 'lookup',
				formatterOptions:{
					dataServiceName: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					displayMember: 'Code',
					lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					valueMember: 'Id',
					filterKey: 'timekeeping-timesymbol-allocation-filter',
				},
				grouping:{
					aggregateCollapsed: true,
					aggregators: [],
					getter: 'TimeSymbolFk',
					title: 'timekeeping.common.timeSymbol'
				},
				id: 'timesymbolfk',
				name: 'Time Symbol',
				name$tr$: 'timekeeping.common.timeSymbol',
				toolTip: 'Time Symbol',
				toolTip$tr$: 'timekeeping.common.timeSymbol'
			},{
				additionalColumn: {
					field: 'DescriptionInfo',
					formatter: 'translation',
					id: 'Description',
					name: '"Description',
					name$tr$: 'cloud.common.entityDescription',
				},
				field: 'TimeSymbolFk',
				formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					displayMember: 'Code',
					lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					translate: false,
					filter: function (entity) {
						if (entity) {
							return entity;
						}
					},
					valueMember: 'Id'
				},
				grouping: {
					aggregateCollapsed: true,
					aggregators: [],
					getter: 'TimeSymbolFk',
					title: 'timekeeping.common.timeSymbol'
				},
				id: 'timesymbolfkdescription',
				name: 'Time Symbol-Description',
				sortable: true,
				width:60
			},{
				additionalColumn: {
					field: 'TimeSymbolGroup.DescriptionInfo',
					formatter: 'translation',
					id: 'TimeSymbolGroup',
					name: '"TimeSymbolGroup',
					name$tr$: 'cloud.common.entityTimeSymbolGroupFk'
				},
				field: 'TimeSymbolFk',
				formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					displayMember: 'Code',
					lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					translate: false,
					filter: function (entity) {
						if (entity) {
							return entity;
						}
					},
					valueMember: 'Id'
				},
				grouping: {
					aggregateCollapsed: true,
					aggregators: [],
					getter: 'TimeSymbolFk',
					title: 'timekeeping.common.timeSymbol'
				},
				id: 'timesymbolfktimesymbolgroup',
				name: 'Time Symbol-TimeSymbolGroup',
				sortable: true,
				width:60
			},{
				additionalColumn: {
					field: 'UoMFk',
					formatter: 'lookup',
					formatterOptions:{
						displayMember: 'Unit',
						lookupType: 'uom'
					},
					id: 'UomFk',
					name: 'UoM',
					name$tr$: 'basics.unit.entityUomFk',
					width: 100
				},
				field: 'TimeSymbolFk',
				formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					displayMember: 'Code',
					lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					translate: false,
					filter: function (entity) {
						if (entity) {
							return entity;
						}
					},
					valueMember: 'Id'
				},
				grouping: {
					aggregateCollapsed: true,
					aggregators: [],
					getter: 'TimeSymbolFk',
					title: 'timekeeping.common.timeSymbol'
				},
				id: 'timesymbolfkuomfk',
				name: 'Time Symbol-UoM',
				sortable: true,
				width:60
			},{
				additionalColumn: {
					field: 'CompanyFk',
					formatter: 'lookup',
					formatterOptions:{
						displayMember: 'Code',
						lookupType: 'Company'
					},
					id: 'CompanyCode',
					name: 'Company Code',
					name$tr$: 'cloud.common.entityCompanyCode',
					width: 100
				},
				field: 'TimeSymbolFk',
				formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					displayMember: 'Code',
					lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
					translate: false,
					filter: function (entity) {
						if (entity) {
							return entity;
						}
					},
					valueMember: 'Id'
				},
				grouping: {
					aggregateCollapsed: true,
					aggregators: [],
					getter: 'TimeSymbolFk',
					title: 'timekeeping.common.timeSymbol'
				},
				id: 'timesymbolfkcompanycode',
				name: 'Time Symbol-Company Code',
				sortable: true,
				width:60
			}]
			gridView.columns = _.union(cols, gridView.columns);
			gridView.columns = _.union([{
				field: 'EmployeeFk',
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'basics-lookup-data-by-custom-data-service',
					lookupOptions: {
						additionalColumns: true,
						dataServiceName: 'timekeepingEmployeeLookupDataService',
						disableDataCaching: true,
						displayMember: 'Code',
						enableCache: false,
						lookupModuleQualifier: 'timekeepingEmployeeLookupDataService',
						uuid: 'd040410fc40f40569af16694ffc882af',
						lookupType: 'timekeepingEmployeeLookupDataService',
						valueMember: 'Id',
						columns: [{id: 'Code', field: 'Code', name: 'Code', formatter: 'code', width: 300, name$tr$: 'cloud.common.entityCode'},
							{id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', width: 300, name$tr$: 'cloud.common.entityDescription'},
							{id: 'CompanyCode', field: 'CompanyFk', name: 'Company Code', width: 100, name$tr$: 'cloud.common.entityCompanyCode'}
						]
					},
					lookupType: 'timekeepingEmployeeLookupDataService'
				},
				formatter: 'lookup',
				formatterOptions:{
					dataServiceName: 'timekeepingEmployeeLookupDataService',
					displayMember: 'Code',
					lookupType: 'timekeepingEmployeeLookupDataService',
					valueMember: 'Id'
				},
				grouping:{
					aggregateCollapsed: true,
					aggregators: [],
					getter: 'EmployeeFk',
					title: 'timekeeping.common.employee'
				},
				id: 'employeeFk',
				name: 'Employee',
				name$tr$: 'timekeeping.common.employee',
				toolTip: 'Employee',
				toolTip$tr$: 'timekeeping.common.employee'
			},{
				additionalColumn: {
					field: 'DescriptionInfo',
					formatter: 'translation',
					id: 'Description',
					name: '"Description',
					name$tr$: 'cloud.common.entityDescription',
					width: 300
				},
				field: 'EmployeeFk',
				formatter: 'lookup',
				formatterOptions: {
					dataServiceName: 'timekeepingEmployeeLookupDataService',
					displayMember: 'Code',
					lookupType: 'timekeepingEmployeeLookupDataService',
					translate: false,
					valueMember: 'Id'
				},
				grouping: {
					aggregateCollapsed: true,
					aggregators: [],
					getter: 'EmployeeFk',
					title: 'timekeeping.common.employee'
				},
				id: 'employeefkdescription',
				name: 'Employee-Description',
				sortable: true,
				width:60
			}
			], gridView.columns);
			let rowRe = _.remove(detailView.rows, function(item){
				return item.rid === 'timesymbolfk';
			});
			let row = {gid: 'basicData',
				directive: 'basics-lookupdata-lookup-composite',
				label: 'Time Symbol',
				label$tr$: 'timekeeping.common.timeSymbol',
				model: 'TimeSymbolFk',
				readonly: false,
				options: {
					descriptionMember: 'DescriptionInfo.Translated',
					lookupDirective: 'basics-lookup-data-by-custom-data-service',
					lookupOptions: {
						dataServiceName: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
						disableDataCaching: true,
						displayMember: 'Code',
						enableCache: false,
						lookupModuleQualifier: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
						lookupType: 'timekeepingTimeSymbol2GroupTimeAllocationLookupDataService',
						uuid: 'e529982324434e69852d1ba22683f54a',
						valueMember: 'Id',
						columns: [
							{id: 'Code', field: 'Code', name: 'Code',	formatter: 'code', name$tr$: 'cloud.common.entityCode'},
							{id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation',	name$tr$: 'cloud.common.entityDescription'},
							{id: 'TimeSymbolGroup', field: 'TimeSymbolGroup.DescriptionInfo',	name: 'TimeSymbolGroup', formatter: 'translation',	name$tr$: 'cloud.common.entityTimeSymbolGroupFk'},
							{id: 'UoMFk', field: 'UoMFk', name: 'UoM', width: 100, name$tr$: 'basics.unit.entityUomFk', formatter: 'lookup', formatterOptions: {lookupType: 'uom', displayMember: 'Unit'}	},
							{id: 'CompanyCode', field: 'CompanyFk', name: 'Company Code', width: 100, name$tr$: 'cloud.common.entityCompanyCode', formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Company',
									displayMember: 'Code'
								},
								sortable: true
							}
						],
						filter: function (entity) {
							if (entity) {
								return entity;
							}
						}
					}
				},
				sortOrder: detailView.rows.length,
				type: 'directive'};
			detailView.rows.push(row);
			detailView.rows.push({gid: 'basicData',
				directive: 'basics-lookupdata-lookup-composite',
				label: 'Employee',
				label$tr$: 'timekeeping.common.employee',
				model: 'EmployeeFk',
				readonly: true,
				rid: 'employeefk',
				options: {
					descriptionMember: 'DescriptionInfo.Translated',
					lookupDirective: 'basics-lookup-data-by-custom-data-service',
					lookupOptions: {
						dataServiceName: 'timekeepingEmployeeLookupDataService',
						disableDataCaching: true,
						displayMember: 'Code',
						enableCache: false,
						lookupModuleQualifier: 'timekeepingEmployeeLookupDataService',
						lookupType: 'timekeepingEmployeeLookupDataService',
						uuid: 'd040410fc40f40569af16694ffc882af',
						valueMember: 'Id',
						columns: [{id: 'Code', field: 'Code', name: 'Code', formatter: 'code', width: 300, name$tr$: 'cloud.common.entityCode'},
							{id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', width: 300, name$tr$: 'cloud.common.entityDescription'},
							{id: 'CompanyCode', field: 'CompanyFk', name: 'Company Code', width: 100, name$tr$: 'cloud.common.entityCompanyCode'}
						]
					},
				},
				sortOrder: detailView.rows.length,
				type: 'directive'});
			let layConf = {
				detailLayout: detailView,
				listLayout: gridView,
				dtoScheme: dtoScheme
			};

			return self.addNavigatorFacility(templInfo.layout, layConf, modCIS);
		};

		this.addNavigatorFacility = function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				var navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (navField !== null) {
					var fields = conf.detailLayout.rows || [];
					var field = _.find(fields, function (f) { return f.model === navField.field; });
					if (field) {
						field.navigator = navField.navigator;
					}

					fields = conf.listLayout.columns || [];
					field = _.find(fields, function (f) { return f.field === navField.field; });
					if (field) {
						field.navigator = navField.navigator;
					}
				}
			}

			return conf;
		};
	}
})(angular);
