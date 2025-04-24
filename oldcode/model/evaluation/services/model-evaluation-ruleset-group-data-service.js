/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationRulesetGroupDataService
	 * @description Provides methods to access, create and update model evaluation rule set group entities
	 */
	myModule.service('modelEvaluationRulesetGroupDataService',
		ModelEvaluationRulesetGroupDataService);

	ModelEvaluationRulesetGroupDataService.$inject = ['_', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'modelEvaluationRulesetDataService',
		'platformRuntimeDataService', '$translate', 'platformDataServiceDataProcessorExtension',
		'platformTranslateService'];

	function ModelEvaluationRulesetGroupDataService(_, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, modelEvaluationRulesetDataService,
		platformRuntimeDataService, $translate, platformDataServiceDataProcessorExtension,
		platformTranslateService) {

		const rootId = ':root:';
		const rootItem = {
			Id: rootId,
			ScopeLevel: 'g',
			Children: [],
			isRoot: true
		};

		let serviceContainer;

		function updateRootItemText() {
			rootItem.DescriptionInfo = {
				Translated: $translate.instant('model.evaluation.rulesetRootGroup')
			};
		}

		platformTranslateService.translationChanged.register(updateRootItemText);

		const self = this;
		const svcOptions = {
			hierarchicalLeafItem: {
				module: myModule,
				serviceName: 'modelEvaluationRulesetGroupDataService',
				entityNameTranslationID: 'model.evaluation.entityModelEvaluationRulesetGroup',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/evaluation/group/',
					endRead: 'all',
					usePostForRead: false
				},
				actions: {
					delete: true,
					create: 'hierarchical',
					canCreateCallBackFunc: function () {
						return modelEvaluationRulesetDataService.isInMasterModule();
					},
					canDeleteCallBackFunc: function (item) {
						return _.isNumber(item.Id) && modelEvaluationRulesetDataService.isInMasterModule();
					}
				},
				dataProcessor: [{
					processItem: function (item) {
						if (!item.isRoot && !_.isNumber(item.ModelRulesetGroupParentFk)) {
							item.ModelRulesetGroupParentFk = rootId;
						}
					},
					revertProcessItem: function (item) {
						if (!item.isRoot && !_.isNumber(item.ModelRulesetGroupParentFk)) {
							item.ModelRulesetGroupParentFk = null;
						}
					}
				}],
				presenter: {
					tree: {
						parentProp: 'ModelRulesetGroupParentFk',
						childProp: 'Children',
						incorporateDataRead: function (readData, data) {
							_.assign(rootItem, {
								DescriptionInfo: {
									Translated: $translate.instant('model.evaluation.rulesetRootGroup')
								},
								nodeInfo: {
									level: 0,
									collapsed: false,
									lastElement: false,
									children: true
								},
								Children: []
							});

							const itemsById = {};
							itemsById[rootId] = rootItem;

							readData.forEach(function (item) {
								itemsById[item.Id] = item;
								if (!_.isArray(item.Children)) {
									item.Children = [];
								}
								if (!_.isNumber(item.ModelRulesetGroupParentFk)) {
									item.ModelRulesetGroupParentFk = rootId;
								}
							});

							readData.forEach(function (item) {
								const parent = itemsById[item.ModelRulesetGroupParentFk];
								if (parent) {
									parent.Children.push(item);
									item.nodeInfo = {
										level: parent.nodeInfo.level + 1,
										collapsed: false,
										lastElement: false,
										children: true
									};
								}
							});

							platformRuntimeDataService.readonly(rootItem, _.map([
								'DescriptionInfo',
								'ScopeLevel'
							], function (fieldName) {
								return {
									field: fieldName,
									readonly: true
								};
							}));

							serviceContainer.data.isDataLoaded = true;

							return serviceContainer.data.handleReadSucceeded([rootItem], data);
						},
						handleCreateSucceeded: function (newItem) {
							if (!_.isNumber(newItem.ModelRulesetGroupParentFk)) {
								newItem.ModelRulesetGroupParentFk = rootId;
							}

							return newItem;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'RulesetGroups',
						parentService: modelEvaluationRulesetDataService
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(svcOptions, self);
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		self.unloadSubEntities = function doNothing() {
		};

		serviceContainer.data.doPrepareCreate = function (data, creationOptions) {
			const selGroup = serviceContainer.service.getSelected();
			let parentGroup = selGroup || rootItem;
			if (_.isObject(creationOptions)) {
				if (creationOptions.asSibling) {
					if (!_.isNil(selGroup.ModelRulesetGroupParentFk)) {
						const g = serviceContainer.data.getItemById(selGroup.ModelRulesetGroupParentFk, serviceContainer.data);
						if (g) {
							parentGroup = g;
						}
					}
				}
			}
			return {
				parent: parentGroup,
				PKey1: (parentGroup && _.isNumber(parentGroup.Id)) ? parentGroup.Id : null
			};
		};

		serviceContainer.service.registerSelectionChanged(function () {
			modelEvaluationRulesetDataService.update();
		});

		serviceContainer.service.mergeItemsAfterSuccessfulUpdate = function mergeItemAfterSuccessfullUpdate(response) {
			if (_.isArray(response.RulesetGroupsToSave)) {
				const responseArray = response.RulesetGroupsToSave;
				responseArray.forEach(function (newItem) {
					const oldItem = _.find(serviceContainer.data.itemList, {Id: newItem.Id});
					if (oldItem) {
						serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, serviceContainer.data);
						platformDataServiceDataProcessorExtension.doProcessItem(oldItem, serviceContainer.data);
					}
				});
			}
		};

		modelEvaluationRulesetDataService.registerRefreshRequested(function () {
			const selGroup = serviceContainer.service.getSelected();
			serviceContainer.service.load().then(function () {
				if (selGroup) {
					const newSelGroup = _.find(serviceContainer.data.itemList, {Id: selGroup.Id});
					if (newSelGroup) {
						serviceContainer.service.setSelected(newSelGroup);
					}
				}
			});
		});

		serviceContainer.service.isDataLoaded = function () {
			return !!serviceContainer.data.isDataLoaded;
		};
	}
})(angular);
