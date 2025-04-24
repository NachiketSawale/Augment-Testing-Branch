/**
 * Created by xia on 7/25/2019.
 */

(function (angular) {
	/* global _, globals */
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupConfigFactory', ['$q', '$log', '$http','$injector',
		function ($q, $log, $http,$injector) {

			var configCacheOfModule = {};
			var configCacheOfProject = {};
			var configCacheOfCustomize = {};

			/* add initialize function to service */
			var configTypeOfModule = ['Project', 'ConstructionSystem', 'Material', 'ActivityCriteria', 'Employee'];

			function initConfigCacheOfModule() {
				_.forEach(configTypeOfModule, function (item) {
					configCacheOfModule[item] = null;
				});
			}

			initConfigCacheOfModule();

			function setConfig(config, target) {
				if (config) {
					target.configuration = config.data.Configuration;
					target.configurationType = config.data.Type;
					target.configurationAssign = config.data.Assignments;
				}
			}

			function setCostGroupCats(costGroupCats, target) {
				if (costGroupCats) {
					target.licCostGroupCats = costGroupCats.data.LicCostGroupCats;
					target.prjCostGroupCats = costGroupCats.data.PrjCostGroupCats;
				}
			}

			function getConfiguration(moduleType, projectId,ConfigModuleName,lineitemcontextFk) {
				var target;
				if (moduleType === 'Project') {
					target = configCacheOfProject[projectId] ? configCacheOfProject[projectId] : (configCacheOfProject[projectId] = {});
				} else if (moduleType === 'Customize') {
					target = configCacheOfCustomize[projectId] ? configCacheOfCustomize[projectId] : (configCacheOfCustomize[projectId] = {});
				} else {
					target = configCacheOfModule[moduleType] ? configCacheOfModule[moduleType] : (configCacheOfModule[moduleType] = {});
				}
				var defer = $q.defer();
				var param  ={
					ConfigModuleName:ConfigModuleName,
					ConfigModuleType:moduleType,
					ProjectId:projectId
				};

				if(moduleType ==='Customize'){
					$injector.get('basicCostGroupCatalogByLineItemContextLookupDataService').setLineItemContextId(lineitemcontextFk);
				}

				$q.all({
					config: $http.post(globals.webApiBaseUrl + 'basics/customize/projectcatalogconfiguration/getconfiguration', {
						ModuleType: moduleType,
						ProjectId: projectId
					}),

					costGroupCats: $http.post(globals.webApiBaseUrl + 'basics/costgroupcat/listbyconfig',param)
				}).then(function (response) {
					setConfig(response.config, target);
					setCostGroupCats(response.costGroupCats, target);
					defer.resolve(target);
				});
				return defer.promise;
			}

			function loadConfigAsync(moduleType, projectId,configModuleName,lineitemcontextFk) {
				if (moduleType === 'Project') {
					if (configCacheOfProject[projectId]) {
						return $q.when(configCacheOfProject[projectId]);
					} else {
						return getConfiguration(moduleType, projectId,configModuleName);
					}
				} else if (moduleType === 'Customize') {
					if (configCacheOfCustomize[projectId]) {
						return $q.when(configCacheOfCustomize[projectId]);
					} else {
						return getConfiguration(moduleType, projectId,configModuleName,lineitemcontextFk);
					}
				} else {
					if (configCacheOfModule[moduleType]) {
						return $q.when(configCacheOfModule[moduleType]);
					} else {
						return getConfiguration(moduleType,-1,configModuleName);
					}
				}
			}

			function resetConfigCache() {
				configCacheOfProject = {};
				configCacheOfCustomize = {};
				initConfigCacheOfModule();
			}

			var factoryService = {};

			factoryService.createService = function (moduleTypeValue, projectIdValue) {
				var service = {};
				var projectId = projectIdValue;
				var moduleType = moduleTypeValue;
				var hasLoadCostGroupCats = false;

				service.clear = function () {
					resetConfigCache();
					hasLoadCostGroupCats = false;
				};

				service.loadConfig = function (ConfigModuleName,lineitemcontextFk) {
					return loadConfigAsync(moduleType, projectId,ConfigModuleName,lineitemcontextFk);
				};

				service.initialize = function (projectFk,ConfigModuleName,lineitemcontextFk) {
					service.clear();
					if (projectFk) {
						projectId = projectFk;
					}
					return service.loadConfig(ConfigModuleName,lineitemcontextFk);
				};

				service.setProjectId = function (value) {
					projectId = value;
				};

				return service;
			};

			return factoryService;
		}]);
})(angular);
