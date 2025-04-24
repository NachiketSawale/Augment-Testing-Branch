/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const myModule = angular.module('model.administration');

	/**
	 * @ngdoc service
	 * @name modelAdministrationDataTreeNodeDataService
	 * @description Provides methods to access, create and update data tree levels.
	 */
	myModule.service('modelAdministrationDataTreeNodeDataService',
		ModelAdministrationDataTreeNodeDataService);

	ModelAdministrationDataTreeNodeDataService.$inject = ['platformDataServiceFactory',
		'modelAdministrationDataTreeDataService', '_',
		'modelAdministrationDataTreeLevelLookupDataService'];

	function ModelAdministrationDataTreeNodeDataService(platformDataServiceFactory,
		modelAdministrationDataTreeDataService, _,
		modelAdministrationDataTreeLevelLookupDataService) {

		const self = this;
		let serviceContainer;

		const state = {
			isLoaded: false
		};

		const serviceOption = {
			hierarchicalLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationDataTreeNodeDataService',
				entityNameTranslationID: 'model.administration.dataTree.dataTreeNode',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/datatreenode/',
					endRead: 'list',
					usePostForRead: false
				},
				actions: {
					delete: false,
					create: false
				},
				presenter: {
					tree: {
						parentProp: 'DataTreeNodeFk',
						childProp: 'Children',
						incorporateDataRead: function (readData, data) {
							if (_.isArray(readData)) {
								return serviceContainer.data.handleReadSucceeded(readData, data);
							}

							const levelsById = {};
							readData.Levels.forEach(function (lvl) {
								levelsById[lvl.Id] = lvl;
							});

							const itemsById = {};
							readData.Nodes.forEach(function (item) {
								itemsById[item.Id] = item;
								if (!_.isArray(item.Children)) {
									item.Children = [];
								}
								item.nodeInfo = {
									collapsed: false,
									lastElement: false,
									children: false
								};

								if (_.isNumber(item.DataTreeLevelFk)) {
									item.level = levelsById[item.DataTreeLevelFk];
								}
							});

							const rootItems = [];
							readData.Nodes.forEach(function (item) {
								const parent = itemsById[item.DataTreeNodeFk];
								if (parent) {
									parent.nodeInfo.children = true;
									item.nodeInfo.level = parent.nodeInfo.level + 1;
									parent.Children.push(item);
								} else {
									item.nodeInfo.level = 0;
									rootItems.push(item);
								}
							});

							state.isLoaded = true;

							return serviceContainer.data.handleReadSucceeded(rootItems, data);
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'DataTreeNodes',
						parentService: modelAdministrationDataTreeDataService
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(serviceOption, self);

		serviceContainer.service.reloadTree = _.debounce(function () {
			if (state.isLoaded) {
				modelAdministrationDataTreeLevelLookupDataService.resetCache().then(function () {
					return serviceContainer.service.load();
				});
			}
		}, {
			wait: 100,
			maxWait: 1000
		});
	}
})(angular);
