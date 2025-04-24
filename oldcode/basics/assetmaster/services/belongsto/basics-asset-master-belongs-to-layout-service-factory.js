/**
 * Created by baf on 29.12.2016.
 */

(function config(angular) {
	'use strict';

	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc service
	 * @name basicsAssetMasterBelongsToLayoutServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('basicsAssetMasterBelongsToLayoutServiceFactory', BasicsAssetMasterBelongsToLayoutServiceFactory);

	BasicsAssetMasterBelongsToLayoutServiceFactory.$inject = ['_', '$injector', 'basicsAssetMasterBelongsToDataServiceFactory'];

	function BasicsAssetMasterBelongsToLayoutServiceFactory(_, $injector, basicsAssetMasterBelongsToDataServiceFactory) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			var templUid = scope.getContentValue('layout');
			var templInfo = _.find(modConf.container, function filter(c) {
				return c.layout === templUid;
			});

			var srv = instances[templUid];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.createConfig(templInfo.usedLayout, templInfo);
				instances[templUid] = srv;
			}

			return srv;
		};

		this.createConfig = function createConfig(templUid, templInfo) {
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templUid));
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = basicsAssetMasterBelongsToDataServiceFactory.createDataService(templInfo);
			conf.validationServiceName = {};
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
					var field = _.find(fields, function modelFilter(f) {
						return f.model === navField.field;
					});
					if (field) {
						field.navigator = navField.navigator;
					}

					fields = conf.listLayout.columns || [];
					field = _.find(fields, function fieldFilter(f) {
						return f.field === navField.field;
					});
					if (field) {
						field.navigator = navField.navigator;
					}
				}
			}

			return conf;
		};
	}
})(angular);
