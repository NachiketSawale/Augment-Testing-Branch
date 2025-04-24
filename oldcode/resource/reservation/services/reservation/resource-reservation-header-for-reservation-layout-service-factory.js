/**
 * Created by baf on 2021-10-22.
 */

(function (angular) {
	'use strict';

	const moduleName = 'resource.reservation';

	/**
	 * @ngdoc service
	 * @name resourceReservationHeaderForReservationLayoutServiceFactory
	 * @description creates data services used in different reserved for to container
	 */
	angular.module(moduleName).service('resourceReservationHeaderForReservationLayoutServiceFactory', ResourceReservationHeaderForReservationLayoutServiceFactory);

	ResourceReservationHeaderForReservationLayoutServiceFactory.$inject = ['_', '$injector', 'resourceReservationHeaderForReservationDataServiceFactory'];

	function ResourceReservationHeaderForReservationLayoutServiceFactory(_, $injector, resourceReservationHeaderForReservationDataServiceFactory) {
		let instances = {};

		let self = this;

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

		this.createConfig = function createConfig(templUid, templInfo) {
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var conf = _.cloneDeep(modCIS.getContainerInfoByGuid(templUid));
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = resourceReservationHeaderForReservationDataServiceFactory.createDataService(templInfo);
			var validationService = {};
			var valServFactory = $injector.get('resourceReservationValidationServiceFactory');
			valServFactory.createReservationValidationService(validationService, conf.dataServiceName);
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
			let confServ = _.isObject(conf.standardConfigurationService) ? conf.standardConfigurationService : $injector.get(conf.standardConfigurationService);
			let detailView = _.cloneDeep(confServ.getStandardConfigForDetailView());
			angular.forEach(detailView.rows, function(row){
				row.readonly = true;
			});
			let gridView = _.cloneDeep(confServ.getStandardConfigForListView());
			angular.forEach(gridView.columns, function(column){
				column.editor = null;
			});

			let layConf = {
				detailLayout: detailView,
				listLayout: gridView
			};

			return self.addNavigatorFacility(templInfo.usedLayout, layConf, modCIS);
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
