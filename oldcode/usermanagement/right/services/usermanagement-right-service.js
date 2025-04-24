/**
 * Created by sandu on 16.09.2015.
 */
(function () {

	'use strict';

	const moduleName = 'usermanagement.right';
	const configModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name usermanagementRightService
	 * @function
	 *
	 * @description
	 * data service for all right related functionality.
	 */
	configModule.factory('usermanagementRightService', usermanagementRightService);

	usermanagementRightService.$inject = ['_', 'usermanagementRightMainService', 'platformDataServiceFactory', 'globals', '$http', 'platformDataServiceSelectionExtension', 'platformCreateUuid', 'usermanagementRightModifyProcessor', 'ServiceDataProcessArraysExtension', 'platformPermissionService', 'permissions'];

	function usermanagementRightService(_, rightMainService, platformDataServiceFactory, globals, $http, platformDataServiceSelectionExtension, platformCreateUuid, usermanagementRightModifyProcessor, ServiceDataProcessArraysExtension, platformPermissionService, permissions) {
		const serviceFactoryOptions = {
			hierarchicalLeafItem: {
				module: configModule,
				serviceName: 'usermanagementRightService',
				httpCRUD: {route: globals.webApiBaseUrl + 'usermanagement/main/right/', entryRead: 'tree'},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Nodes']), usermanagementRightModifyProcessor],
				entityRole: {
					leaf: {
						itemName: 'DescriptorStructurePresenter', parentService: rightMainService
					}
				},
				entitySelection: {},
				modification: {multi: true},
				presenter: {
					tree: {
						parentProp: 'ParentGuid',
						childProp: 'Nodes',
						initCreationData: function initCreationData(creationData) {
							creationData.mainItemId = rightMainService.getSelected().Id;
						}
					}
				}
			}
		};
		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);
		const service = serviceContainer.service;

		service.insertDescriptorNodes = function (nodes) {
			const clientNodes = _.clone(service.getList());
			const treeNodes = service.getTree();
			const created = [];

			_.each(nodes, function (node) {
				if (node.Type) {
					const item = _.find(clientNodes, {Id: node.Id});

					if (!item) {
						const parents = node.Descriptor.SortOrderPath.split('/');

						if (parents.length && parents[0] === '') {
							parents.shift();
						}

						if (parents.length) {
							let parent = _.find(clientNodes, {Name: parents[0], ParentGuid: null});

							if (!parent) {
								parent = {
									Name: parents[0],
									Description: null,
									Id: platformCreateUuid(),
									ParentGuid: null,
									Type: false,
									Descriptor: null,
									Nodes: [],
									Version: 1,
									nodeInfo: {
										level: 0,
										collapsed: false,
										lastElement: false,
										children: true
									}

								};
								created.push(parent);
								clientNodes.push(parent);
								treeNodes.push(parent);
							}

							parents.shift();

							_.each(parents, function (name, index) {
								let node = _.find(parent.Nodes, {Name: name});

								if (!node) {
									node = {
										Name: name,
										Description: null,
										Id: platformCreateUuid(),
										ParentGuid: parent.Id,
										Type: false,
										Descriptor: null,
										Nodes: [],
										Version: 1,
										nodeInfo: {
											level: index + 1,
											collapsed: false,
											lastElement: false,
											children: true
										}
									};

									parent.Nodes.push(node);
									clientNodes.push(node);
									created.push(node);
								}
								parent = node;
							});

							node.Descriptor.Read = node.Descriptor.Mask & 0x01;
							node.Descriptor.Write = node.Descriptor.Mask & 0x02;
							node.Descriptor.Create = node.Descriptor.Mask & 0x04;
							node.Descriptor.Delete = node.Descriptor.Mask & 0x08;
							node.Descriptor.Execute = node.Descriptor.Mask & 0x10;
							node.Version = node.Descriptor.Version;

							parent.Nodes.push(node);
							clientNodes.push(node);
							created.push(node);
						} else {
							clientNodes.push(node);
							treeNodes.push(node);
							created.push(node);
						}
					}
				}
			});

			service.setList([]);
			service.setSelected(created[0]);

			_.each(clientNodes, function (node) {
				service.getList().push(node);
			});

			_.each(created, function (item) {
				usermanagementRightModifyProcessor.processItem(item);
				service.markItemAsModified(item);
			});

		};

		service.disableContainer = function (){
			serviceContainer.data.clearContent(serviceContainer.data);
		};

		service.enableContainer = function () {
		};

		let selectedRole = null;
		let functionalRoleFilter= true;

		service.parentService().registerSelectionChanged((unused, item) => {
			selectedRole = item;
			functionalRoleFilter = (item && item.IsFunctional) || null;
			usermanagementRightModifyProcessor.functionalRoleFilter(functionalRoleFilter);
			platformPermissionService.restrict('7699abc07ec946cfb35d3646ed63c273', item.IsSystem ? permissions.read : null);
		});

		service.parentService().registerItemModified((unused, item) => {
			if(selectedRole === item && functionalRoleFilter !== item.IsFunctional) {
				functionalRoleFilter = (item && item.IsFunctional) || null;
				usermanagementRightModifyProcessor.functionalRoleFilter(functionalRoleFilter);
				service.getList().forEach((item) => usermanagementRightModifyProcessor.processItem(item));
				service.gridRefresh();
			}
		});

		return service;
	}
})(angular);