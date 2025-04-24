/**
 * Created by MYH on 07.11.2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureTransferCostgroupLookupService', ['_', '$q', 'controllingStructureTransferDataToBisDataService', 'basicsCostGroupCatalogConfigDataService',
		function (_, $q, controllingStructureTransferDataToBisDataService, basicsCostGroupCatalogConfigDataService) {

			var lookData = {
				projectId: null,
				costGroupCatalogList: []
			};

			var service = {};
			var projectCostGroupCatalogService = null;

			function getCostGroupCatalogList(projectId) {
				var configModuleName = 'Estimate';

				projectCostGroupCatalogService = basicsCostGroupCatalogConfigDataService.getProjectCostGroupCatalogService(projectId);

				return projectCostGroupCatalogService.loadConfig(configModuleName);
			}

			function setControllingCostGroupCatalogs(data) {
				if (!data) {return;}

				var configurationAssign = data.configurationAssign ? data.configurationAssign : [];
				var enterpriseCostGroupCatalogList = [];
				var isControllingCatalog = function (costGroupCatalog , isProject) {
					var config = _.find(configurationAssign, function (item) {
						return isProject ? (item.Code === costGroupCatalog.Code) : (item.CostGroupCatalogFk === costGroupCatalog.Id);
					});

					return config && config.IsControlling;
				};

				if (data.licCostGroupCats) {
					_.forEach(data.licCostGroupCats, function (c) {
						if (isControllingCatalog(c)) {
							enterpriseCostGroupCatalogList.push(c);
						}
					});
				}
				if (data.prjCostGroupCats) {
					_.forEach(data.prjCostGroupCats, function (d) {
						if (isControllingCatalog(d,true)) {
							d.IsProjectCatalog = true;
							enterpriseCostGroupCatalogList.push(d);
						}
					});
				}

				lookData.costGroupCatalogList = enterpriseCostGroupCatalogList;
			}

			service.getList = function () {
				var defer = $q.defer();
				var prjId = controllingStructureTransferDataToBisDataService.getProjectId();
				if (lookData.costGroupCatalogList.length !== 0 && lookData.projectId === prjId) {
					defer.resolve(lookData.costGroupCatalogList);
				} else {
					lookData.projectId = prjId;
					getCostGroupCatalogList(prjId).then(function (data) {
						setControllingCostGroupCatalogs(data);
						defer.resolve(lookData.costGroupCatalogList);
					});
				}

				return defer.promise;
			};

			service.getListAsync = function () {
				return service.getList();
			};

			service.getItemById = function (value) {
				var item = null;
				if (lookData.costGroupCatalogList.length > 0) {
					item = _.find(lookData.costGroupCatalogList, {Code: value});
				}

				return item;
			};

			service.getItemByIdAsync = function (value) {
				return service.getList().then(function () {
					return service.getItemById(value);
				});
			};

			service.getItemByKey = function (value) {
				return service.getItemById(value);
			};

			service.getItemByKeyAsync = function (/* value */) {
				return service.getItemByIdAsync();
			};

			service.reLoad = function reLoad() {
				lookData.costGroupCatalogList.length = 0;
				projectCostGroupCatalogService.clear();
				lookData.projectId = -1;

				return service.getList();
			};

			return service;
		}
	]);

})(angular);
