(function (angular) {

	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc service
	 * @name procurementCommonDataNewDataService
	 * @function
	 *
	 * @description Provides data buffer
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonDataNewDataService',
		['platformDataServiceFactory', 'procurementCommonDataServiceFactory', 'ServiceDataProcessArraysExtension', 'procurementCommonDataImageProcessor','procurementContextService',
			function (dataServiceFactory, procurementCommonDataServiceFactory, ServiceDataProcessArraysExtension, imageProcessor, procurementContextService) {

				/* var updated = new Messenger(); */
				function constructorFn(parentDataService, getAllReq) {

					// properties
					// registered service containers
					var services = {},
						// service configuration
						serviceOption = {
							hierarchicalLeafItem: {
								module: angular.module('procurement.common'),
								httpRead: {
									route: globals.webApiBaseUrl + 'procurement/common/data/', usePostForRead: true,
									initReadData: function (readData) {
										readData.mainItemId = parentDataService.getSelected().PrcHeaderFk || -1;
										readData.mainItemIds = getAllReq && getAllReq();
									}
								},
								dataProcessor: [new ServiceDataProcessArraysExtension(['Children']), imageProcessor('DataFk', getAllReq ? function (item) {
									return item.PrcHeaderFk !== parentDataService.getSelected().PrcHeaderFk;
								} : false)],
								presenter: {
									tree: {
										parentProp: 'DataFk', childProp: 'Children'
									}
								},
								entityRole: {
									leaf: {
										itemName: 'PrcData',
										parentService: parentDataService
									}
								}
							}
						};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

					serviceContainer.service.treePresOpt = serviceContainer.data.treePresOpt;

					// read service from serviceContainer
					var dataService = serviceContainer.service;

					dataService.canDelete = function () {
						return false;
					};
					dataService.canCreateChild = function () {
						return false;
					};
					dataService.canCreate = function () {
						return false;
					};

					var registerUpdateWatch;
					/**
					 * register a service , use this method when notifyChanged called by the service
					 * tree structure will not updated only change the count of the corresponding node
					 * @param type node type
					 * @param service service instance
					 * @param childType child type when there has children
					 */
					dataService.registerWithChange = function registerWithUpdate(type, service, childType) {
						// enable update tell program whether to update the tree structure
						services[type] = {self: service, enableUpdate: false, childType: childType};
						registerUpdateWatch(type);
					};

					/**
					 * register a service , use this method when notifyChanged called by the service
					 * tree structure will updated by the items passed in.
					 * @param type
					 * @param service
					 * @param childType
					 */
					dataService.registerWithUpdate = function registerWithUpdate(type, service, childType) {
						// enable update tell program whether to update the tree structure
						services[type] = {self: service, enableUpdate: true, childType: childType};
						registerUpdateWatch(type);
					};

					/**
					 * set mapper to data-container, only item has id can work in data-container
					 * when use registerWithUpdate 'Description' field is need!
					 * example:
					 * 1. change mapper: registerNodeMapper('HEADER',function(item){return {Id:item.PrcTextTypeFk};}
					 * 1. update mapper: registerNodeMapper('ATTACHMENT',unction(item){return {Id:item.Id,Description:item.OriginalName;}}
					 * @param type node type
					 * @param mapper node data mapper method
					 */
					dataService.registerNodeMapper = function registerNodeMapper(type, mapper) {
						services[type].mapper = mapper;
					};

					/**
					 * register datasource watchs, when get insert or delete update the tree.
					 * @param type
					 */
					registerUpdateWatch = function registerUpdateWatch(type) {
						var service = services[type];
						if (service.self.registerListLoaded) {
							service.self.registerListLoaded(function () {
								dataService.notifyChanged(type);
							});
						}
					};

					/**
					 * user service.mapper to get the related data list
					 * @param type node type
					 * @returns {*} mapped list
					 */
					var getMapperData = function getMapperData(type) {
						var mapper = services[type].mapper;
						var list = services[type].self.getList();
						if (mapper) {
							return list.map(mapper);
						} else {
							return list;
						}
					};

					var ensure;

					/**
					 * notify changes to data-container
					 * usage:
					 * 1. pass a count => notifyChanged('CONTRACT',10);
					 * 2. pass children => notifyChanged('HEADER',{nodes:children,type:'HEADERTEXT'});
					 * @param type type of the node
					 * @param param children node list or count of the type (param=10 or param = {data:nodes,type:'HEADERTEXT'})
					 */
					dataService.notifyChanged = function notifyChanged(type, param) {
						var service = services[type];
						// when param is undefined, get the ensure parameters by dataService itself
						if (angular.isUndefined(param)) {
							if (service.childType) {
								ensure(type, getMapperData(type));
							} else {
								ensure(type, service.self.getList().length);
							}
						} else {
							ensure(type, param);
						}
					};

					var ensureNode;
					var ensureChildren;
					var recalculate;
					/**
					 *ensure the node count
					 * @param type type of the node
					 * @param param children node list or count of the type
					 */
					ensure = function (type, param) {
						var hasChildren, count;
						// when param is undefined, set it equals to itemsource's length.
						if (angular.isDefined(param)) {
							hasChildren = angular.isArray(param);
							count = hasChildren ? param.length : param;
						} else {
							count = services[type].self.getList().length;
						}
						// ensure node's count or node's children
						if (hasChildren) {
							ensureChildren(type, param);
						} else {
							ensureNode(type, count);
						}
						recalculate();
					};

					/**
					 * ensure node's count property same to count param
					 * @param type node type
					 * @param count node count
					 */
					ensureNode = function ensureNode(type, count) {
						var node = _.filter(dataService.getList(), {Type: type})[0] || {};
						node.Count = count;
					};

					/**
					 * ensure child node's Count property is same to count param
					 * @param type child node type
					 * @param id child id
					 * @param count child count
					 */
					var ensureChildNode = function ensureChildNode(type, id, count) {
						var node = _.filter(dataService.getList(), {Type: type, Id: id})[0];
						node.Count = count;
					};

					var createChildren;

					/**
					 * ensure children nodes are save as the tree, update the tree display when children updated
					 * @param type data type
					 * @param children data items from services
					 */
					ensureChildren = function ensureChildren(type, children) {
						var node, index;
						node = _.filter(dataService.getList(), {Type: type})[0];
						if (!node) {
							return;
						}

						// update the id as item.Id +100, we use the id in this way.
						children = children.map(function (item) {
							if (item) {
								item.Id += 100;
							}
							return item;
						});

						if (services[type] && services[type].enableUpdate) {
							// replace the children
							node.Children = createChildren(node, children);
							// node.nodeInfo.collapsed = node.Count;
						} else if (node.Children) {
							// update children
							for (index = 0; index < node.Children.length; index++) {
								var child = node.Children[index];
								var count = _.filter(children, {Id: child.Id}).length || 0;
								ensureChildNode(child.Type, child.Id, count);
							}
						}
					};

					/**
					 * create new children list
					 * @param parent parent node
					 * @param children children nodes
					 * @returns {Array} new children nodes can displayed in tree
					 */
					createChildren = function createChildren(parent, children) {
						var items = [], index;

						for (index = 0; index < children.length; index++) {
							var child = children[index];
							items[index] = {
								Id: child.Id,
								Type: services[parent.Type].childType,
								DataFk: parent.Id,
								Count: 1,
								Description: child.Description,
								Children: []
							};
						}
						return items;
					};
					var calculateNode;
					/**
					 * recalculate Count property of the tree nodes
					 * @param nodes nodes to be recalculated, when nodes is undefined, the whole will be recalculated.
					 */
					recalculate = function (nodes) {
						nodes = nodes || dataService.getTree();

						// set node.count equals to the sum of child's count
						for (var index = 0; index < nodes.length; index++) {
							var node = nodes[index];
							if (node.Children && node.Children.length > 0) {
								recalculate(node.Children);
								calculateNode(node);
							}
						}
						dataService.gridRefresh();
					};

					/**
					 * calculate specify node's count from it's children
					 * @param node
					 */
					calculateNode = function calculateNode(node) {
						node.Count = _.reduce(node.Children, function (total, item) {
							// noinspection JSUnusedAssignment
							return total += item.Count;
						}, 0);
					};
					return dataService;
				}

				return procurementCommonDataServiceFactory.createService(constructorFn, 'procurementCommonDataNewDataService');
			}]);
})(angular);