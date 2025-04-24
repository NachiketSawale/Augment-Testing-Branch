/**
 * Created by baf on 29.12.2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainRequiredByActivityLayoutServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('schedulingMainRequiredByActivityLayoutServiceFactory', SchedulingMainRequiredByActivityLayoutServiceFactory);

	SchedulingMainRequiredByActivityLayoutServiceFactory.$inject = ['_', '$injector', 'schedulingMainRequiredByActivityDataServiceFactory'];

	function SchedulingMainRequiredByActivityLayoutServiceFactory(_, $injector, schedulingMainRequiredByActivityDataServiceFactory) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			var templUid = scope.getContentValue('layout');
			var templInfo = _.find(modConf.container, function(c) { return c.layout === templUid; });

			var srv = instances[templUid];
			if(_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.createConfig(templInfo.usedLayout, templInfo);
				instances[templUid] = srv;
			}

			return srv;
		};

		this.getDataService = function getDataService(templUid) {
			var instance = instances[templUid] || {};

			return instance.dataServiceName;
		};

		this.createConfig = function createConfig(templUid, templInfo) {
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templUid));
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = schedulingMainRequiredByActivityDataServiceFactory.createDataService(templInfo);
			var validationService = {};
			var valServFactory = $injector.get('resourceRequisitionValidationServiceFactory');
			valServFactory.createRequisitionValidationService(validationService, conf.dataServiceName);
			conf.validationServiceName = validationService;
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
			var layConf = {
				detailLayout: _.cloneDeep(confServ.getStandardConfigForDetailView()),
				listLayout: _.cloneDeep(confServ.getStandardConfigForListView())
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
