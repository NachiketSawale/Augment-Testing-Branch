/**
 * Created by anl on 2/5/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).service('productionplanningActivityReservedForActivityLayoutServiceFactory', ReservedForActivityLayoutServiceFactory);

	ReservedForActivityLayoutServiceFactory.$inject = ['_', '$injector', 'productionplanningActivityReservedForActivityDataServiceFactory',
		'basicsLookupdataConfigGenerator',
		'productionplanningActivityResReservationValidationService'];

	function ReservedForActivityLayoutServiceFactory(_, $injector, reservationDataServiceFactory,
													 basicsLookupdataConfigGenerator,
													 resReservationValidationService) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf, parentService) {
			var templUid = scope.getContentValue('layout');
			var templInfo = _.find(modConf.container, function (c) {
				return c.layout === templUid;
			});

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
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = reservationDataServiceFactory.createDataService(templInfo, parentService);
			conf.validationServiceName = resReservationValidationService.getReservationValidationService(conf.dataServiceName);
			return conf;
		};

		this.createLayoutService = function createLayoutService(conf, templInfo, modCIS) {
			var sc = {
				conf: self.createConfiguration(conf, templInfo, modCIS),
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

		this.createConfiguration = function createConfiguration(conf, templInfo, modCIS) {
			var confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			var detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			//angular.forEach(detailView.rows, function (row) {
			//    row.readonly = true;
			//});
			var gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			// angular.forEach(gridView.columns, function(column){
			//     column.editor = null;
			// }
			var layConf = {
				getDtoScheme: confServ.getDtoScheme(),
				detailLayout: detailView,
				listLayout: gridView
			};

			return self.adaptLayout(templInfo.layout, layConf, modCIS);
		};

		this.adaptLayout = function adaptLayout(containerUid, conf) {
			//because in resource reservation has updated the lookup but here should use a simple lookup(original)
			var simpleLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'productionplanningMountingActivityResourceRequisitionLookupDataService',
				cacheEnable: true,
				additionalColumns: false,
				navigator: {
					moduleName: 'resource.requisition'
				}
			});
			var field = _.find(conf.detailLayout.rows || [], function (f) {
				return f.model === 'RequisitionFk';
			});
			if (field !== null) {
				field.options = simpleLookupConfig.detail.options;
				field.navigator = simpleLookupConfig.detail.navigator;
				field.directive = simpleLookupConfig.detail.directive;
			}

			field = _.find(conf.listLayout.columns || [], function (f) {
				return f.field === 'RequisitionFk';
			});
			if (field !== null) {
				field.editorOptions = simpleLookupConfig.grid.editorOptions;
				field.formatterOptions = simpleLookupConfig.grid.formatterOptions;
				field.navigator = simpleLookupConfig.grid.navigator;
			}

			return conf;
		};
	}
})(angular);