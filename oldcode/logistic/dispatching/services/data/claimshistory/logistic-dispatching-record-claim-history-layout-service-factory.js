/**
 * Created by shen on 9/17/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordClaimHistoryLayoutServiceFactory
	 * @description
	 */
	angular.module(moduleName).service('logisticDispatchingRecordClaimHistoryLayoutServiceFactory', LogisticDispatchingRecordClaimHistoryLayoutServiceFactory);

	LogisticDispatchingRecordClaimHistoryLayoutServiceFactory.$inject = ['_', '$injector', 'logisticDispatchingRecordClaimHistoryDataServiceFactory', 'logisticSettlementClaimValidationService'];

	function LogisticDispatchingRecordClaimHistoryLayoutServiceFactory(_, $injector, logisticDispatchingRecordClaimHistoryDataServiceFactory, logisticSettlementClaimValidationService) {
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
			conf.dataServiceName = logisticDispatchingRecordClaimHistoryDataServiceFactory.createDataService(templInfo);
			conf.validationServiceName = logisticSettlementClaimValidationService;
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

			gridView.columns = _.union([], gridView.columns);
			detailView.rows.push();
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
