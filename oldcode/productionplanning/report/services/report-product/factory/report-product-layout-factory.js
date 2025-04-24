/**
 * Created by anl on 4/2/2018.
 */



(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';

	/**
	 * @ngdoc service
	 * @name productionplanningReportProductLayoutServiceFactory
	 * @description
	 */
	angular.module(moduleName).service('productionplanningReportProductLayoutServiceFactory', ReportProductLayoutServiceFactory);

	ReportProductLayoutServiceFactory.$inject = ['_', '$injector', 'productionplanningReportProductDataServiceFactory'];

	function ReportProductLayoutServiceFactory(_, $injector, report2ProductDataServiceFactory) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, modConf, parentService, dialogConfig) {
			var templInfo = modConf;
			var templUid = templInfo.layout;

			var srv = instances[templUid];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.createConfig(templInfo.usedLayout, templInfo, parentService, dialogConfig);
				instances[templUid] = srv;
			}

			return srv;
		};

		this.createConfig = function createConfig(templUid, templInfo, parentService, dialogConfig) {
			var modCIS = self.getModuleInformationService(moduleName);

			var conf = _.clone(modCIS.getContainerInfoByGuid(templUid));
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = report2ProductDataServiceFactory.getService(templInfo, parentService, dialogConfig);
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

			conf.standardConfigurationService = sc.service;

			return sc;
		};

		this.createConfiguration = function createConfiguration(conf, templInfo, modCIS) {
			var confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			var detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			var gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			var layConf = {
				detailLayout: detailView,
				listLayout: gridView
			};

			return self.adaptLayout(templInfo.layout, layConf, modCIS);
		};

		this.adaptLayout = function adaptLayout(containerUid, conf) {
			//modify grid/detail views config
			return conf;
		};

	}
})(angular);