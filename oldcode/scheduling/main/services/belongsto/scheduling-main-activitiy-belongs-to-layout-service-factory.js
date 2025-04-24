/**
 * Created by baf on 29.12.2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityBelongsToLayoutServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('schedulingMainActivityBelongsToLayoutServiceFactory', SchedulingMainActivityBelongsToLayoutServiceFactory);

	SchedulingMainActivityBelongsToLayoutServiceFactory.$inject = ['_', '$injector', 'schedulingMainActivityBelongsToDataServiceFactory'];

	function SchedulingMainActivityBelongsToLayoutServiceFactory(_, $injector, schedulingMainActivityBelongsToDataServiceFactory) {
		var instances = {};

		var self = this;

		this.getModuleInformationService = function getModuleInformationService(module) {
			var cisName = _.camelCase(module) + 'ContainerInformationService';
			return $injector.get(cisName);
		};

		this.prepareConfig = function prepareConfig(containerUid, scope, modConf) {
			var templUid = scope.getContentValue('layoutNew');
			var estType = scope.getContentValue('estType');
			var gridType = scope.getContentValue('gridType');
			var readOnly = scope.getContentValue('readOnly');
			if(_.isNil(readOnly)){
				readOnly = true;
			}
			var templInfo = _.find(modConf.container, function(c) { return c.layoutNew === templUid; });

			var srv = instances[templUid];
			if(_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.createConfig(templInfo.layout, templInfo, estType, gridType, readOnly);
				instances[templUid] = srv;
			}

			return srv;
		};

		this.createConfig = function createConfig(templUid, templInfo, estType, gridType, readOnly) {
			var modCIS = self.getModuleInformationService(templInfo.moduleName);

			var orgConf = modCIS.getContainerInfoByGuid(templUid);
			var conf = _.cloneDeep(orgConf);
			self.createLayoutService(conf, templInfo, modCIS);
			conf.dataServiceName = schedulingMainActivityBelongsToDataServiceFactory.createDataService(templInfo, estType, gridType, orgConf.dataServiceName, conf.listConfig, readOnly, conf.standardConfigurationService);
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
			angular.forEach(layConf.detailLayout.rows, function(row){
				row.readonly = true;
			});
			layConf.detailLayout.rows = _.remove(layConf.detailLayout.rows,function(row){
				return row.rid.indexOf('activity') <= -1;
			});
			angular.forEach(layConf.listLayout.columns, function(column){
				column.readonly = true;
				if(column.editor){
					column.editor = null;
					if(column.editorOptions){
						column.editorOptions = null;
					}
				}
				if(column.id === 'prjlocationfk') {
					column.formatterOptions = {
						dataServiceName: 'projectLocationLookupDataService',
						displayMember: 'Code',
						filter: function (item) {
							if (item && item.ProjectFk) {
								return item.ProjectFk;
							}
							return null;
						}
					};
				}

			});
			layConf.listLayout.columns = _.remove(layConf.listLayout.columns,function(col){
				return col.id.indexOf('activity')<= -1;
			});
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
						field.navigator.moduleName += '-line-item-from-scheduling';
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
