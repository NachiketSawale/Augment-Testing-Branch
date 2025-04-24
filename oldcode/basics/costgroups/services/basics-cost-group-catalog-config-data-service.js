/**
 * Created by xia on 7/17/2019.
 */
(function(angular){
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupCatalogConfigDataService', ['basicsCostGroupConfigFactory',
		function (basicsCostGroupConfigFactory) {

			var cache = {};
			var service = {};

			function getCostGroupCatalogServiceByModule(moduleType, projectId){
				var cacheKey = projectId ? moduleType + '_' + projectId : moduleType;
				return cache[cacheKey] || (cache[cacheKey] = basicsCostGroupConfigFactory.createService(moduleType, projectId));
			}

			service.getProjectCostGroupCatalogService = function(projectId){
				return getCostGroupCatalogServiceByModule('Project', projectId);
			};

			service.getConstructionSystemCostGroupCatalogService = function(projectId){
				return getCostGroupCatalogServiceByModule('ConstructionSystem', projectId);
			};

			service.getMaterialCostGroupCatalogService = function(projectId){
				return getCostGroupCatalogServiceByModule('Material', projectId);
			};

			service.getActivityCriteriaCostGroupCatalogService = function(projectId){
				return getCostGroupCatalogServiceByModule('ActivityCriteria', projectId);
			};

			service.getEmployeeCostGroupCatalogService = function(projectId){
				return getCostGroupCatalogServiceByModule('Employee', projectId);
			};

			service.getCustomizeCostGroupCatalogService = function(projectId){
				return getCostGroupCatalogServiceByModule('Customize', projectId);
			};

			return service;
		}]);
})(angular);
