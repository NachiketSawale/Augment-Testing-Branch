/**
 * Created by anl on 3/28/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.report';

	/**
	 * @ngdoc service
	 * @name productionplanningReportReportLayoutServiceFactory
	 * @description
	 */
	angular.module(moduleName).service('productionplanningReportReportLayoutServiceFactory', ReportLayoutServiceFactory);

	ReportLayoutServiceFactory.$inject = ['_', '$injector', 'productionplanningReportReportDataServiceFactory',
		'productionpalnningReportReportValidationFactory'];

	function ReportLayoutServiceFactory(_, $injector, reportDataServiceFactory,
										reportValidationFactory) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, modConf, parentService) {
			//var templUid = scope.getContentValue('layout');
			var templInfo = modConf;
			var templUid = templInfo.layout;
			// 	_.find(modConf.container, function (c) {
			// 	return c.layout === templUid;
			// });

			var srv = instances[templUid];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.createConfig(templInfo.usedLayout, templInfo, parentService);
				instances[templUid] = srv;
			}

			return srv;
		};

		this.createConfig = function createConfig(templUid, templInfo, parentService) {
			var modCIS = self.getModuleInformationService(moduleName);

			var conf = _.clone(modCIS.getContainerInfoByGuid(templUid));
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = reportDataServiceFactory.getService(templInfo, parentService);
			conf.validationServiceName = reportValidationFactory.createValidationService(conf.dataServiceName);
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

			// to trigger bulk editor
			sc.service.getDtoScheme = function () {
				return sc.conf.dtoScheme;
			};

			conf.standardConfigurationService = sc.service;

			return sc;
		};

		this.createConfiguration = function createConfiguration(conf, templInfo, modCIS) {
			let confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			let detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			let gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			let dtoScheme = _.cloneDeep(confServ.getDtoScheme());
			let layConf = {
				dtoScheme: dtoScheme,
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
