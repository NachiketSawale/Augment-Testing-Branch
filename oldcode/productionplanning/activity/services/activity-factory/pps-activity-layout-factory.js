/**
 * Created by anl on 4/11/2018.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	/**
	 * @ngdoc service
	 * @name productionplanningActivityActivityLayoutServiceFactory
	 * @description
	 */
	angular.module(moduleName).service('productionplanningActivityActivityLayoutServiceFactory', ActivityLayoutServiceFactory);

	ActivityLayoutServiceFactory.$inject = ['_', '$injector', 'productionplanningActivityActivityDataServiceFactory',
		'productionpalnningActivityActivityValidationFactory'];

	function ActivityLayoutServiceFactory(_, $injector, activityDataServiceFactory,
										activityValidationFactory) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, modConf, parentService) {
			var templInfo = modConf;
			var templUid = templInfo.layout;

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
			conf.dataServiceName = activityDataServiceFactory.getService(templInfo, parentService);
			conf.validationServiceName = activityValidationFactory.createActivityValidationService(conf.dataServiceName);
			self.createLayoutService(conf, templInfo, modCIS);
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

		this.createConfiguration = function createConfiguration(conf, templInfo) {
			let confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			let detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			let gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			let dtoScheme = _.cloneDeep(confServ.getDtoScheme());
			let layConf = {
				dtoScheme: dtoScheme,
				detailLayout: detailView,
				listLayout: gridView
			};

			return self.adaptLayout(templInfo.layout, layConf, conf);
		};

		this.adaptLayout = function adaptLayout(containerUid, layConf, conf) {
			//modify grid/detail views config
			var field = _.find(layConf.detailLayout.rows || [], function (f) {
				return f.model === 'EventTypeFk';
			});
			field.change = function(entity){
				if (entity.Version === 0) {
					var actService = conf.dataServiceName;
					actService.updateActivity(entity);
				}
			};
			return layConf;
		};
	}
})(angular);