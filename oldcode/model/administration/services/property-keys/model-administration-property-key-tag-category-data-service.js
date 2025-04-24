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
	 * @name modelAdministrationPropertyKeyTagCategoryDataService
	 * @description pprovides methods to access, create and update model administration property key tag category entities
	 */
	myModule.service('modelAdministrationPropertyKeyTagCategoryDataService', ModelAdministrationDataService);

	ModelAdministrationDataService.$inject = ['_', 'platformDataServiceFactory', 'platformRuntimeDataService',
		'modelAdministrationDataService', '$translate'];

	function ModelAdministrationDataService(_, platformDataServiceFactory, platformRuntimeDataService,
		modelAdministrationDataService, $translate) {

		const self = this;
		let serviceContainer;
		const modelAdministrationServiceOption = {
			hierarchicalNodeItem: {
				module: myModule,
				serviceName: 'modelAdministrationPropertyKeyTagCategoryDataService',
				entityNameTranslationID: 'model.administration.propertyKeys.entityPropertyKeyTagCategory',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/propkeytagcat/',
					endRead: 'list'
				},
				actions: {
					delete: true,
					create: 'hierarchical',
					canCreateChildCallBackFunc: function () {
						const selected = serviceContainer.service.getSelected();
						return selected && selected.Id > 0;
					},
					canDeleteCallBackFunc: function () {
						const selected = serviceContainer.service.getSelected();
						return selected && selected.Id > 0;
					}
				},
				presenter: {
					tree: {
						parentProp: 'PropertyKeyTagParentCategoryFk',
						childProp: 'Children',
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = creationData.parentId;
						},
						incorporateDataRead: function (readData, data) {
							const itemsById = {};
							readData.forEach(function (item) {
								itemsById[item.Id] = item;
								if (!_.isArray(item.Children)) {
									item.Children = [];
								}
							});

							const rootItems = [];

							readData.forEach(function (item) {
								item.nodeInfo = {
									collapsed: false,
									lastElement: false,
									children: true
								};
								if (_.isNumber(item.PropertyKeyTagParentCategoryFk)) {
									const parent = itemsById[item.PropertyKeyTagParentCategoryFk];
									if (parent) {
										parent.Children.push(item);
										item.nodeInfo.level = parent.nodeInfo.level + 1;
									}
								} else {
									rootItems.push(item);
									item.nodeInfo.level = 0;
								}
							});

							rootItems.push(createUntaggedParent());

							return serviceContainer.data.handleReadSucceeded(rootItems, data);
						}
					}
				},
				entityRole: {
					node: {
						itemName: 'PropertyKeyTagCategories',
						parentService: modelAdministrationDataService
					}
				}
			}
		};

		function createUntaggedParent() {
			const result = {
				Id: -100,
				PropertyKeyTagParentCategoryFk: null,
				DescriptionInfo: {
					Translated: $translate.instant('model.administration.propertyKeys.untagged')
				},
				nodeInfo: {
					level: 0,
					collapsed: false,
					lastElement: true,
					children: false
				}
			};

			platformRuntimeDataService.readonly(result, _.map([
				'DescriptionInfo',
				'RemarkInfo'
			], function (fieldName) {
				return {
					field: fieldName,
					readonly: true
				};
			}));

			return result;
		}

		serviceContainer = platformDataServiceFactory.createService(modelAdministrationServiceOption, self);
		serviceContainer.data.Initialised = true;

		modelAdministrationDataService.registerRefreshRequested(function () {
			serviceContainer.service.load();
		});

		serviceContainer.service.registerSelectionChanged(function () {
			modelAdministrationDataService.update();
		});
	}
})(angular);
