(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	/**
	 * @ngdoc service
	 * @name transportplanningResourceReservationLayoutServiceFactory
	 * @description creates data services used in different reserved for to container
	 */
	angular.module(moduleName).service('transportplanningResourceReservationLayoutServiceFactory', TransportplanningResourceReservationLayoutServiceFactory);

	TransportplanningResourceReservationLayoutServiceFactory.$inject = ['_', '$injector', 'transportplanningRequisitionResReservationDataServiceFactory',
		'productionplanningActivityResReservationValidationService',
	    'basicsLookupdataConfigGenerator'];

	function TransportplanningResourceReservationLayoutServiceFactory(_, $injector, transportplanningRequisitionResReservationDataServiceFactory,
																	  productionplanningMountingResReservationValidationService,
                                                                      basicsLookupdataConfigGenerator) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf, parentService) {
			var templUid = scope.getContentValue('layout');
			var templInfo = _.find(modConf.container, function (c) { return c.layout === templUid; });

			var srv = instances[templUid];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.createConfig(templInfo.usedLayout, templInfo, parentService);
				instances[templUid] = srv;
			}

			return srv;
		};

		this.createConfig = function createConfig(templUid, templInfo, parentService) {
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.clone(modCIS.getContainerInfoByGuid(templUid));
			self.createLayoutService(conf, templInfo, modCIS, parentService);
			conf.dataServiceName = transportplanningRequisitionResReservationDataServiceFactory.getService(templInfo, parentService);
			conf.validationServiceName = productionplanningMountingResReservationValidationService.getReservationValidationService(conf.dataServiceName);
			return conf;
		};

		this.createLayoutService = function createLayoutService(conf, templInfo, modCIS, parentService) {
			var sc = {
				conf: self.createConfiguration(conf, templInfo, modCIS, parentService),
				service: {}
			};

			sc.service.getStandardConfigForDetailView = function getStandardConfigForDetailView() {
				return sc.conf.detailLayout;
			};

			sc.service.getStandardConfigForListView = function getStandardConfigForListView() {
				return sc.conf.listLayout;
			};

			sc.service.getDtoScheme = function getDtoScheme() {
				return sc.conf.getDtoScheme;
			};

			conf.standardConfigurationService = sc.service;

			return sc;
		};

		this.createConfiguration = function createConfiguration(conf, templInfo, modCIS, parentService) {
			var confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			confServ = $injector.get('ppsUIUtilService').extendUIService(confServ, {
				editableColumns: [],
				combineUIConfigs: [{
					UIService: $injector.get('transportplanningRequisitionTrsGoodsUIStandardServiceFactory').createNewService({}),
					columns: [{
						id: 'ontime', overload: {grid: {editor: null}, detail: {readonly: true}}
					}, {
						id: 'planningstate', overload: {grid: {editor: null}, detail: {readonly: true}}
					}
					],
				}]
			});
			var detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			var gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			var layConf = {
				getDtoScheme: _.clone(confServ.getDtoScheme()),
				detailLayout: detailView,
				listLayout: gridView
			};

			return self.adaptLayout(templInfo.layout, layConf, modCIS, parentService);
		};

		this.adaptLayout = function adaptLayout(containerUid, conf, modCIS, parentService) {
			//because in resource reservation has updated the lookup but here should use a simple lookup(original)
			var simpleLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'transportplanningRequisitionResourceRequisitionLookupDataService',
				cacheEnable: true,
				additionalColumns: false,
				navigator: {
					moduleName: 'resource.requisition'
				}
			});
			//set RequisitionFk detail
			var field = _.find(conf.detailLayout.rows || [], function (f) {
				return f.model === 'RequisitionFk';
			});
			if (field !== null) {
				field.options = simpleLookupConfig.detail.options;
				field.navigator = simpleLookupConfig.detail.navigator;
				field.directive = simpleLookupConfig.detail.directive;
			}
			//set RequisitionFk grid
			field = _.find(conf.listLayout.columns || [], function (f) {
				return f.field === 'RequisitionFk';
			});
			if (field !== null) {
				field.editorOptions = simpleLookupConfig.grid.editorOptions;
				field.formatterOptions = simpleLookupConfig.grid.formatterOptions;
				field.navigator = simpleLookupConfig.grid.navigator;
				// set filter option for fixing issue of of #113473 (by zwz 2020/9/4)
				field.formatterOptions.filter = function getFilter(entity) {
					return _.isNil(entity.TrsRequisitionFk) ? -1 : entity.TrsRequisitionFk;
				};
			}

			//set ResourceFk detail
			field = _.find(conf.detailLayout.rows || [], function (f) {
				return f.model === 'ResourceFk';
			});
			field.options.lookupOptions.additionalFilters = [{
				getAdditionalEntity : parentService.getSelected,
				siteFk : 'SiteFk'
			}];
			//set ResourceFk grid
			field = _.find(conf.listLayout.columns || [], function (f) {
				return f.field === 'ResourceFk';
			});
			field.editorOptions.lookupOptions.additionalFilters = [{
				getAdditionalEntity : parentService.getSelected,
				siteFk : 'SiteFk'
			}];

			return conf;
		};
	}
})(angular);
