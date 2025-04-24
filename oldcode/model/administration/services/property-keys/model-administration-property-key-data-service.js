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
	 * @name modelAdministrationPropertyKeyDataService
	 * @description pprovides methods to access, create and update model administration property key entities
	 */
	myModule.service('modelAdministrationPropertyKeyDataService', ModelAdministrationDataService);

	ModelAdministrationDataService.$inject = ['_', '$http', 'platformDataServiceFactory',
		'modelAdministrationDataService', 'modelAdministrationPropertyKeyTagCategoryDataService',
		'modelAdministrationPropertyKeyTagDataService', 'platformDataServiceSelectionExtension',
		'platformRuntimeDataService'];

	function ModelAdministrationDataService(_, $http, platformDataServiceFactory,
		modelAdministrationDataService, modelAdministrationPropertyKeyTagCategoryDataService,
		modelAdministrationPropertyKeyTagDataService, platformDataServiceSelectionExtension,
		platformRuntimeDataService) {

		const self = this;
		let serviceContainer;
		const modelAdministrationServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelAdministrationPropertyKeyDataService',
				entityNameTranslationID: 'model.administration.propertyKeys.entityName',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/administration/propertykey/',
					endRead: 'list',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						const prms = {};
						const selTagCat = modelAdministrationPropertyKeyTagCategoryDataService.getSelected();
						const selTags = modelAdministrationPropertyKeyTagDataService.getSelectedEntities();
						if (selTagCat) {
							if (selTagCat.Id <= 0) {
								prms.includeUntagged = true;
							} else {
								if (!_.isEmpty(selTags)) {
									prms.tagIds = _.join(_.map(selTags, function (tag) {
										return tag.Id;
									}), ':');
								} else {
									prms.categoryId = selTagCat.Id;
								}
							}
						} else {
							prms.categoryId = 0;
						}
						readData.filter = '?' + _.join(_.map(Object.keys(prms), function formatParam(key) {
							return key + '=' + prms[key];
						}), '&');
					}
				},
				dataProcessor: [{
					processItem: function (item) {
						enableDefaultValue(item, item.UseDefaultValue);
					}
				}],
				actions: {
					delete: false,
					create: false
				},
				entityRole: {
					leaf: {
						itemName: 'PropertyKeys',
						parentService: modelAdministrationDataService
					}
				},
				presenter: {
					list: {
						handleCreateSucceeded: function (newItem) {
							enableDefaultValue(newItem, newItem.UseDefaultValue);
						}
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(modelAdministrationServiceOption, self);
		serviceContainer.data.Initialised = true;

		modelAdministrationDataService.registerRefreshRequested(function () {
			serviceContainer.service.load();
		});

		serviceContainer.service.registerSelectionChanged(function () {
			modelAdministrationDataService.update();
		});

		serviceContainer.service.getValueTypeByPropertyKeyId = function (id) {
			return $http.get(globals.webApiBaseUrl + 'model/administration/propertykey/getwithvaluetype', {
				params: {
					id: id
				}
			}).then(function (response) {
				const item = response.data;
				if (item) {
					return item.ValueType;
				}
				return null;
			}, function () {
				return null;
			});
		};

		const reloadDelayed = _.debounce(function () {
			serviceContainer.service.load();
		}, {
			wait: 300,
			maxWait: 1000
		});

		modelAdministrationPropertyKeyTagCategoryDataService.registerSelectionChanged(function pkTagSelectionChanged() {
			reloadDelayed();
		});
		modelAdministrationPropertyKeyTagDataService.registerSelectionChanged(function pkTagSelectionChanged() {
			reloadDelayed();
		});

		serviceContainer.service.showAdditionalPropertyKey = function (item) {
			enableDefaultValue(item, item.UseDefaultValue);
			serviceContainer.data.itemList.push(item);

			serviceContainer.data.listLoaded.fire(serviceContainer.data.itemList);

			return platformDataServiceSelectionExtension.doSelect(item, serviceContainer.data);
		};

		serviceContainer.service.removePropertyKeys = function (pkIds) {
			if (!_.isArray(pkIds) || pkIds.size <= 0) {
				return;
			}

			const itemList = _.get(serviceContainer, 'data.itemList');
			if (_.isArray(itemList)) {
				const idsToDelete = {};
				pkIds.forEach(function (id) {
					idsToDelete[id] = true;
				});

				let itemsDeleted = false;
				for (let i = itemList.length - 1; i >= 0; i--) {
					if (idsToDelete[itemList[i].Id]) {
						itemList.splice(i, 1);
						itemsDeleted = true;
					}
				}
				if (itemsDeleted) {
					serviceContainer.data.listLoaded.fire();
				}
			}
		};

		function enableDefaultValue(pk, enabled) {
			platformRuntimeDataService.readonly(pk, [{
				field: 'DefaultValue',
				readonly: !enabled
			}, {
				field: 'BasUomDefaultFk',
				readonly: !enabled
			}]);
		}

		serviceContainer.service.enableDefaultValue = enableDefaultValue;
	}
})(angular);
