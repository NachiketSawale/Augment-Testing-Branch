/**
 * Created by Nitsche on 09/24/2018.
 */

(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainCostCodeDataService
	 * @function
	 *
	 * @description
	 * estimateMainCostCodeDataService is the data service for gettings cost code data from server for the simulation chart's setttings service
	 */
	angular.module(moduleName).factory('estimateMainCostCodeDataService',
		['_', '$q', '$injector', '$http', 'platformRuntimeDataService',
			function (_, $q, $injector, $http, platformRuntimeDataService) {
				let service = {};
				let costCodeTree = [];

				let ImageProcessor = $injector.get('estimateChartDialogTreeRootImageProcessor');

				let processTreeData = function (node, level) {
					if (!node.nodeInfo) {
						node.nodeInfo = {};
					}

					node.nodeInfo.collapsed = true;
					node.nodeInfo.level = level;
					node.nodeInfo.children = node.Children;

					if (level > 0) {
						node.Color = null;
						platformRuntimeDataService.readonly(node, [{
							field: 'Color',
							readonly: true
						}]);
					}

					if (node.Children !== null) {
						node.nodeInfo.HasChildren = true;
						_.forEach(node.Children, function (costCode) {
							processTreeData(costCode, level + 1);
						});
					}
				};

				function createTableEntry(data, parentEntry) {
					let item = {
						item: data,
						Id: data.Id,
						Code: data.Code,
						Add : false,
						Subtract : false,
						DescriptionInfo: data.DescriptionInfo,
						Parent: data.CostCodeParentFk,
						Children: [],
						HasChildren: false
					};

					if (parentEntry) {
						parentEntry.Children.push(item);
					}
					else {
						costCodeTree.push(item);
					}
					_.forEach(data.CostCodes, function (childCostCode) {
						createTableEntry(childCostCode, item);
					});

					ImageProcessor.processItem(item); // assign the icon

					return item;
				}

				let deleteCostCodeCache = function deleteCostCodeCache () {
					costCodeTree = [];
				};

				let getCopyOfCostCodeTree = function getCopyOfCostCodeTree (){
					let copyOfCostCodeTree = [];
					angular.copy(costCodeTree,copyOfCostCodeTree);
					return copyOfCostCodeTree;
				};

				let getTreeData = function getTreeData(){
					if (costCodeTree.length === 0){
						return $http.get(globals.webApiBaseUrl + 'basics/costcodes/tree').then(function (response) {
							_.forEach(response.data, function (costCode) {
								let level = 0;
								let item = createTableEntry(costCode);
								processTreeData(item, level);

							});
							return getCopyOfCostCodeTree();
						});
					}
					return $q(function (resolve) {
						resolve(getCopyOfCostCodeTree());
					});
				};
				service.getTreeData = getTreeData;
				service.getLocalCopyOfCostCodeTree = getCopyOfCostCodeTree;
				service.deleteCostCodeCache = deleteCostCodeCache;
				return service;
			}
		]
	);
})();
