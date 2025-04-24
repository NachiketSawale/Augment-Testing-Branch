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
	 * @name modelEvaluationRuleDataService
	 * @description Provides methods to access, create and update model evaluation rule entities
	 */
	myModule.service('modelEvaluationRuleDataService', ModelEvaluationRuleDataService);

	ModelEvaluationRuleDataService.$inject = ['_', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'modelEvaluationRulesetDataService',
		'modelEvaluationRuleEditorModeService', 'modelEvaluationRule2HlItemDataService',
		'modelEvaluationRuleset2HlSchemeMappingDataService', 'platformRuntimeDataService',
		'platformPermissionService', 'PlatformMessenger', '$http',
		'platformDataServiceModificationTrackingExtension'];

	function ModelEvaluationRuleDataService(_, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, modelEvaluationRulesetDataService,
		modelEvaluationRuleEditorModeService, modelEvaluationRule2HlItemDataService,
		modelEvaluationRuleset2HlSchemeMappingDataService, platformRuntimeDataService,
		platformPermissionService, PlatformMessenger, $http,
		platformDataServiceModificationTrackingExtension) {

		const permissionIds = {
			masterRuleSets: '19038a100d844d88a44e8760da7840e2',
			projectRuleSets: 'f837fb4ed38745d5bcbe70c6540a85c2',
			projectOverrides: '8dfe483fcb6a4e7eb01e42c9de550f75'
		};

		let serviceContainer;

		function generateCompoundRuleId(item) {
			if (_.isNumber(item.ModelRulesetSuperFk)) {
				return item.ModelRulesetSuperFk + '/' + item.ModelRuleSuperFk;
			} else {
				return item.ModelRulesetFk + '/' + item.Id;
			}
		}

		const self = this;
		const modelEvaluationRuleServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelEvaluationRuleDataService',
				entityNameTranslationID: 'model.evaluation.entityModelEvaluationRule',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/evaluation/rule/',
					endRead: 'listByRuleset',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						const selected = modelEvaluationRulesetDataService.getSelected();
						let rulesetId;
						if ((selected.Version <= 0) && _.isNumber(selected.ModelRulesetSuperFk)) {
							rulesetId = selected.ModelRulesetSuperFk;
						} else {
							rulesetId = selected ? selected.Id : '0';
						}
						readData.filter = '?rulesetFk=' + rulesetId;
					}
				},
				actions: {
					delete: true,
					create: 'flat',
					canCreateCallBackFunc: function () {
						if (modelEvaluationRulesetDataService.isInMasterModule()) {
							return platformPermissionService.hasWrite(permissionIds.masterRuleSets);
						} else {
							const selRuleset = modelEvaluationRulesetDataService.getSelected();
							if (selRuleset && _.isNumber(selRuleset.ProjectFk) && (selRuleset.Version > 0)) {
								return (platformPermissionService.hasWrite(_.isNumber(selRuleset.ModelRulesetSuperFk) ? permissionIds.projectOverrides : permissionIds.projectRuleSets));
							}
							return false;
						}
					},
					canDeleteCallBackFunc: function () {
						if (modelEvaluationRulesetDataService.isInMasterModule()) {
							return platformPermissionService.hasWrite(permissionIds.masterRuleSets);
						} else {
							const selRuleset = modelEvaluationRulesetDataService.getSelected();
							const selRule = serviceContainer.service.getSelected();
							if (selRuleset && _.isNumber(selRuleset.ProjectFk)) {
								if (_.isNumber(selRuleset.ModelRulesetSuperFk)) {
									return platformPermissionService.hasWrite(permissionIds.projectOverrides) &&
										(selRule.ModelRulesetFk === selRuleset.Id);
								} else {
									return platformPermissionService.hasWrite(permissionIds.projectRuleSets);
								}
							}
							return false;
						}
					}
				},
				dataProcessor: [{
					processItem: function (item) {
						item.ModeId = modelEvaluationRuleEditorModeService.determineMode(item);
					},
					revertProcessItem: function (item) {
						modelEvaluationRuleEditorModeService.cleanEntity(item, item.ModeId);
					}
				}, {
					processItem: function (item) {
						item.compoundId = generateCompoundRuleId(item);
					},
					revertProcessItem: function (item) {
						delete item.compoundId;
					}
				}],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = modelEvaluationRulesetDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						handleCreateSucceeded: function (newData) {
							if (serviceContainer.data.itemList && (serviceContainer.data.itemList.length > 0)) {
								newData.Sorting = _.max(_.map(serviceContainer.data.itemList, function (existingItem) {
									return existingItem.Sorting;
								})) + 1;
							} else {
								newData.Sorting = 1;
							}

							const selRuleset = modelEvaluationRulesetDataService.getSelected();
							enrichItem(newData, selRuleset);
							updateItemReadOnlyState(newData, selRuleset);

							return newData;
						},
						incorporateDataRead: function (readData, data) {
							if (_.isArray(readData)) {
								const selRuleset = modelEvaluationRulesetDataService.getSelected();
								readData.forEach(function (item) {
									enrichItem(item, selRuleset);
									updateItemReadOnlyState(item, selRuleset);
								});
							}

							serviceContainer.data.isDataLoaded = true;
							return serviceContainer.data.handleReadSucceeded(readData, data);
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Rules', parentService: modelEvaluationRulesetDataService}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createService(modelEvaluationRuleServiceOption, self);
		serviceContainer.data.Initialised = true;

		let areMappingsReady = false;

		self.areMappingsReady = function () {
			return areMappingsReady;
		};

		function updateMergedHlItemMappings() {
			areMappingsReady = false;
			const rules = serviceContainer.data.itemList;
			if (_.isArray(rules)) {
				rules.forEach(function (rule) {
					const mapping = modelEvaluationRule2HlItemDataService.findMappingEntity(rule.Id);
					rule.HlItemFk = mapping ? mapping.HighlightingItemFk : null;
					serviceContainer.data.itemModified.fire(null, rule);
				});
			}
			areMappingsReady = true;
		}

		self.registerListLoaded(updateMergedHlItemMappings);
		modelEvaluationRule2HlItemDataService.registerListLoaded(updateMergedHlItemMappings);

		const originalAddUsingContainer = self.addUsingContainer;
		const originalRemoveUsingContainer = self.removeUsingContainer;

		self.addUsingContainer = function (containerId) {
			modelEvaluationRule2HlItemDataService.addUsingContainer(containerId);
			return originalAddUsingContainer.call(self, containerId);
		};
		self.removeUsingContainer = function (containerId) {
			modelEvaluationRule2HlItemDataService.removeUsingContainer(containerId);
			return originalRemoveUsingContainer.call(self, containerId);
		};

		function selectDefaultMapping() {
			const selRuleset = modelEvaluationRulesetDataService.getSelected();
			if (selRuleset && _.isNumber(selRuleset.HighlightingSchemeFk)) {
				const mappings = modelEvaluationRuleset2HlSchemeMappingDataService.getList();
				if (mappings) {
					const defaultMapping = _.find(mappings, function (m) {
						return m.HighlightingScheme.Id === selRuleset.HighlightingSchemeFk;
					});
					if (defaultMapping) {
						modelEvaluationRuleset2HlSchemeMappingDataService.setSelected(defaultMapping);
						return;
					}
				}
			}
			modelEvaluationRuleset2HlSchemeMappingDataService.setSelected(null);
		}

		self.isRuleReadOnly = function (rule, ruleset) {
			if (!rule) {
				return true;
			}

			if (modelEvaluationRulesetDataService.isInMasterModule()) {
				return !platformPermissionService.hasWrite(permissionIds.masterRuleSets);
			} else {
				if (_.isNumber(rule.ModelRuleSuperFk)) {
					return !platformPermissionService.hasWrite(permissionIds.projectOverrides);
				} else {
					const selRuleset = !_.isNil(ruleset) ? ruleset : modelEvaluationRulesetDataService.getSelected();
					if (selRuleset) {
						return !(_.isNumber(selRuleset.ProjectFk) && (!_.isNumber(selRuleset.ModelRulesetSuperFk) || (rule.ModelRulesetFk === selRuleset.Id)));
					}
				}
				return true;
			}
		};

		const permissionsInitPromise = platformPermissionService.loadPermissions([
			permissionIds.masterRuleSets,
			permissionIds.projectRuleSets,
			permissionIds.projectOverrides
		]).then(fireUpdateTools);

		const origDoReadData = serviceContainer.data.doReadData;
		serviceContainer.data.doReadData = function () {
			const args = arguments;
			return permissionsInitPromise.then(function () {
				return origDoReadData.apply(serviceContainer.data, args);
			});
		};

		modelEvaluationRulesetDataService.registerSelectionChanged(selectDefaultMapping);
		modelEvaluationRuleset2HlSchemeMappingDataService.registerListLoaded(selectDefaultMapping);

		const updateToolsEvent = {
			onUpdateTools: new PlatformMessenger(),
			handlerCount: 0
		};

		function fireUpdateTools() {
			updateToolsEvent.onUpdateTools.fire();
		}

		serviceContainer.service.fireUpdateTools = fireUpdateTools;

		serviceContainer.service.registerUpdateTools = function (handler) {
			updateToolsEvent.onUpdateTools.register(handler);
			updateToolsEvent.handlerCount++;
			if (updateToolsEvent.handlerCount === 1) {
				serviceContainer.service.registerSelectionChanged(fireUpdateTools);
			}
		};

		serviceContainer.service.unregisterUpdateTools = function (handler) {
			updateToolsEvent.onUpdateTools.unregister(handler);
			updateToolsEvent.handlerCount--;
			if (updateToolsEvent.handlerCount === 0) {
				serviceContainer.service.unregisterSelectionChanged(fireUpdateTools);
			}
		};

		function updateItemReadOnlyState(item, selRuleset) {
			if (modelEvaluationRulesetDataService.isInMasterModule()) {
				platformRuntimeDataService.readonly(item, _.map([
					'DescriptionInfo',
					'Sorting',
					'HlItemFk'
				], function (fieldName) {
					return {
						field: fieldName,
						readonly: false
					};
				}));
			} else {
				let isReadOnly = !(selRuleset && (_.isNumber(selRuleset.ProjectFk) && (!_.isNumber(selRuleset.ModelRulesetSuperFk) || _.isNumber(item.ModelRuleSuperFk) || (item.ModelRulesetFk === selRuleset.Id))));
				platformRuntimeDataService.readonly(item, _.map([
					'DescriptionInfo',
					'Sorting',
					'HlItemFk'
				], function (fieldName) {
					return {
						field: fieldName,
						readonly: isReadOnly
					};
				}));

				isReadOnly = !_.isNumber(item.ModelRuleSuperFk);
				platformRuntimeDataService.readonly(item, _.map([
					'IsDisabled'
				], function (fieldName) {
					return {
						field: fieldName,
						readonly: isReadOnly
					};
				}));
			}
		}

		serviceContainer.service.createProjectOverridesMenu = function () {
			return {
				menuItem: modelEvaluationRulesetDataService.isInMasterModule() ? null : {
					id: 'projectOverrides',
					type: 'sublist',
					list: {
						showTitles: true,
						items: [{
							id: 'override',
							caption: 'model.evaluation.projectOverride',
							type: 'item',
							iconClass: 'tlb-icons ico-local-variant',
							fn: function () {
								const overridingRuleset = modelEvaluationRulesetDataService.getSelected();
								const selRule = serviceContainer.service.getSelected();
								$http.post(globals.webApiBaseUrl + 'model/evaluation/rule/override', {
									RulesetFk: selRule.ModelRulesetFk,
									RuleFk: selRule.Id,
									OverridingRulesetFk: overridingRuleset.Id
								}).then(function (response) {
									return serviceContainer.service.setSelected(null).then(function () {
										const overridingItem = response.data;
										modelEvaluationRuleServiceOption.flatLeafItem.dataProcessor.forEach(function (dp) {
											if (_.isFunction(dp.processItem)) {
												dp.processItem(overridingItem);
											}
										});

										serviceContainer.data.mergeItemAfterSuccessfullUpdate(selRule, overridingItem, true, serviceContainer.data);
										enrichItem(selRule, overridingRuleset);
										updateItemReadOnlyState(selRule, overridingRuleset);
										serviceContainer.data.listLoaded.fire();
										return serviceContainer.service.setSelected(selRule).then(function () {
											serviceContainer.service.markItemAsModified(selRule);
											return modelEvaluationRulesetDataService.update().then(function () {
												fireUpdateTools();
											});
										});
									});
								});
							},
							disabled: function () {
								const selRuleset = modelEvaluationRulesetDataService.getSelected();
								const selRule = serviceContainer.service.getSelected();
								if (selRuleset && selRule) {
									return !(platformPermissionService.hasCreate(permissionIds.projectOverrides) &&
										_.isNumber(selRuleset.ModelRulesetSuperFk) &&
										!_.isNumber(selRule.ModelRuleSuperFk) &&
										(selRule.ModelRulesetFk !== selRuleset.Id) &&
										(selRuleset.Version > 0));
								}
								return true;
							}
						}, {
							id: 'discardOverride',
							caption: 'model.evaluation.projectOverrideDiscard',
							type: 'item',
							iconClass: 'tlb-icons ico-local-variant-discard',
							fn: function () {
								const selRule = serviceContainer.service.getSelected();
								if (_.isNumber(selRule.ModelRuleSuperFk)) {
									const callPromise = selRule.Version <= 0 ?
										$http.get(globals.webApiBaseUrl + 'model/evaluation/rule/getrule', {
											params: {
												rulesetFk: selRule.ModelRulesetSuperFk,
												ruleFk: selRule.ModelRuleSuperFk
											}
										}) :
										$http.post(globals.webApiBaseUrl + 'model/evaluation/rule/discardoverride', {
											PKey1: selRule.ModelRulesetFk,
											Id: selRule.Id
										});

									callPromise.then(function (response) {
										platformDataServiceModificationTrackingExtension.clearModificationsInLeaf(serviceContainer.service, serviceContainer.data, selRule);

										const origItem = response.data;
										modelEvaluationRuleServiceOption.flatLeafItem.dataProcessor.forEach(function (dp) {
											if (_.isFunction(dp.processItem)) {
												dp.processItem(origItem);
											}
										});
										serviceContainer.data.mergeItemAfterSuccessfullUpdate(selRule, origItem, true, serviceContainer.data);
										const selRuleset = modelEvaluationRulesetDataService.getSelected();
										enrichItem(selRule, selRuleset);
										updateItemReadOnlyState(selRule, selRuleset);
										serviceContainer.data.listLoaded.fire();
										return serviceContainer.service.setSelected(null).then(function () {
											return serviceContainer.service.setSelected(selRule).then(function () {
												return modelEvaluationRulesetDataService.update().then(function () {
													fireUpdateTools();
													return modelEvaluationRulesetDataService.processRulesetChanges([selRule.ModelRulesetFk]);
												});
											});
										});
									});
								}
							},
							disabled: function () {
								const selRule = serviceContainer.service.getSelected();
								if (selRule) {
									return !platformPermissionService.hasCreate(permissionIds.projectOverrides) ||
										!_.isNumber(selRule.ModelRuleSuperFk);
								}
								return true;
							}
						}]
					}
				},
				destroy: function () {

				}
			};
		};

		function enrichItem(rule, ruleset) {
			if (_.isNumber(rule.ModelRuleSuperFk)) {
				rule.Origin = 'po';
			} else if (_.isNumber(ruleset.ProjectFk) && (rule.ModelRulesetFk === ruleset.Id)) {
				rule.Origin = 'p';
			} else {
				rule.Origin = 'g';
			}
		}

		serviceContainer.service.registerItemModified(function () {
			if (areMappingsReady) {
				modelEvaluationRulesetDataService.autoSaveFilters();
			}
		});

		serviceContainer.service.findItemToMerge = function (item) {
			const cId = generateCompoundRuleId(item);
			return _.find(serviceContainer.data.itemList, {compoundId: cId});
		};
	}
})(angular);
