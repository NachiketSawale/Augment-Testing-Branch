/**
 * Created by Sudarshan on 2023-07-12.
 */

(function (angular) {
	'use strict';

	const moduleName = 'timekeeping.timeallocation';

	/**
	 * @ngdoc service
	 * @name timekeepingTimeAllocationBreakLayoutServiceFactory
	 * @description creates data services used in different reserved for to container
	 */
	angular.module(moduleName).service('timekeepingTimeAllocationBreakLayoutServiceFactory', TimekeepingTimeAllocationBreakLayoutServiceFactory);

	TimekeepingTimeAllocationBreakLayoutServiceFactory.$inject = ['_', '$injector', 'timekeepingTimeAllocationBreakDataServiceFactory'];

	function TimekeepingTimeAllocationBreakLayoutServiceFactory(_, $injector, timekeepingTimeAllocationBreakDataServiceFactory) {
		let instances = {};

		let self = this;

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
			conf.dataServiceName = timekeepingTimeAllocationBreakDataServiceFactory.createDataService(templInfo);
			let validationService = {};
			let valServFactory = $injector.get('timekeepingRecordingBreakValidationServiceFactory');
			valServFactory.createTimekeepingBreakValidationService(validationService, conf.dataServiceName);
			conf.validationServiceName = validationService;
			return conf;
		};

		this.createLayoutService = function createLayoutService(conf, templInfo, modCIS) {
			let sc = {
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

			// gridView.columns = _.union([{
			// 	field: 'EmployeeFk',
			// 	editor: 'lookup',
			// 	editorOptions: {
			// 		lookupDirective: 'basics-lookup-data-by-custom-data-service',
			// 		lookupOptions: {
			// 			additionalColumns: true,
			// 			dataServiceName: 'timekeepingEmployeeLookupDataService',
			// 			disableDataCaching: true,
			// 			displayMember: 'Code',
			// 			enableCache: false,
			// 			lookupModuleQualifier: 'timekeepingEmployeeLookupDataService',
			// 			uuid: 'd040410fc40f40569af16694ffc882af',
			// 			lookupType: 'timekeepingEmployeeLookupDataService',
			// 			valueMember: 'Id',
			// 			columns: [{id: 'Code', field: 'Code', name: 'Code', formatter: 'code', width: 300, name$tr$: 'cloud.common.entityCode'},
			// 				{id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', width: 300, name$tr$: 'cloud.common.entityDescription'},
			// 				{id: 'CompanyCode', field: 'CompanyFk', name: 'Company Code', width: 100, name$tr$: 'cloud.common.entityCompanyCode'}
			// 			]
			// 		},
			// 		lookupType: 'timekeepingEmployeeLookupDataService'
			// 	},
			// 	formatter: 'lookup',
			// 	formatterOptions:{
			// 		dataServiceName: 'timekeepingEmployeeLookupDataService',
			// 		displayMember: 'Code',
			// 		lookupType: 'timekeepingEmployeeLookupDataService',
			// 		valueMember: 'Id'
			// 	},
			// 	grouping:{
			// 		aggregateCollapsed: true,
			// 		aggregators: [],
			// 		getter: 'EmployeeFk',
			// 		title: 'timekeeping.common.employee'
			// 	},
			// 	id: 'employeeFk',
			// 	name: 'Employee',
			// 	name$tr$: 'timekeeping.common.employee',
			// 	toolTip: 'Employee',
			// 	toolTip$tr$: 'timekeeping.common.employee'
			// },{
			// 	additionalColumn: {
			// 		field: 'DescriptionInfo',
			// 		formatter: 'translation',
			// 		id: 'Description',
			// 		name: '"Description',
			// 		name$tr$: 'cloud.common.entityDescription',
			// 		width: 300
			// 	},
			// 	field: 'EmployeeFk',
			// 	formatter: 'lookup',
			// 	formatterOptions: {
			// 		dataServiceName: 'timekeepingEmployeeLookupDataService',
			// 		displayMember: 'Code',
			// 		lookupType: 'timekeepingEmployeeLookupDataService',
			// 		translate: false,
			// 		valueMember: 'Id'
			// 	},
			// 	grouping: {
			// 		aggregateCollapsed: true,
			// 		aggregators: [],
			// 		getter: 'EmployeeFk',
			// 		title: 'timekeeping.common.employee'
			// 	},
			// 	id: 'employeefkdescription',
			// 	name: 'Employee-Description',
			// 	sortable: true,
			// 	width:60
			// }
			// ], gridView.columns);
			// detailView.rows.push({gid: 'basicData',
			// 	directive: 'basics-lookupdata-lookup-composite',
			// 	label: 'Employee',
			// 	label$tr$: 'timekeeping.common.employee',
			// 	model: 'EmployeeFk',
			// 	readonly: true,
			// 	rid: 'employeefk',
			// 	options: {
			// 		descriptionMember: 'DescriptionInfo.Translated',
			// 		lookupDirective: 'basics-lookup-data-by-custom-data-service',
			// 		lookupOptions: {
			// 			dataServiceName: 'timekeepingEmployeeLookupDataService',
			// 			disableDataCaching: true,
			// 			displayMember: 'Code',
			// 			enableCache: false,
			// 			lookupModuleQualifier: 'timekeepingEmployeeLookupDataService',
			// 			lookupType: 'timekeepingEmployeeLookupDataService',
			// 			uuid: 'd040410fc40f40569af16694ffc882af',
			// 			valueMember: 'Id',
			// 			columns: [{id: 'Code', field: 'Code', name: 'Code', formatter: 'code', width: 300, name$tr$: 'cloud.common.entityCode'},
			// 				{id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', width: 300, name$tr$: 'cloud.common.entityDescription'},
			// 				{id: 'CompanyCode', field: 'CompanyFk', name: 'Company Code', width: 100, name$tr$: 'cloud.common.entityCompanyCode'}
			// 			]
			// 		},
			// 	},
			// 	sortOrder: detailView.rows.length,
			// 	type: 'directive'});
			let layConf = {
				detailLayout: detailView,
				listLayout: gridView,
				dtoScheme: dtoScheme
			};

			return self.addNavigatorFacility(templInfo.layout, layConf, modCIS);
		};

		this.addNavigatorFacility = function addNavigatorFacility(containerUid, conf, modCIS) {
			if (modCIS && modCIS.getNavigatorFieldByGuid) {
				let navField = modCIS.getNavigatorFieldByGuid(containerUid);
				if (navField !== null) {
					let fields = conf.detailLayout.rows || [];
					let field = _.find(fields, function (f) { return f.model === navField.field; });
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
