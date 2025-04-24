/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const modelEvaluationModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationRulesetDataService
	 * @function
	 *
	 * @description
	 * The root data service of the module that manages the defined rule sets.
	 */
	modelEvaluationModule.factory('modelEvaluationRulesetDataService',
		modelEvaluationRulesetDataService);

	modelEvaluationRulesetDataService.$inject = ['platformDataServiceFactory', '$injector',
		'$timeout', 'mainViewService', 'projectMainService', '_', 'PlatformMessenger',
		'cloudDesktopPinningContextService', 'platformPermissionService',
		'platformRuntimeDataService', '$http', '$rootScope', '$q',
		'platformDataServiceModificationTrackingExtension'];

	function modelEvaluationRulesetDataService(platformDataServiceFactory, $injector,
		$timeout, mainViewService, projectMainService, _, PlatformMessenger,
		cloudDesktopPinningContextService, platformPermissionService,
		platformRuntimeDataService, $http, $rootScope, $q,
		platformDataServiceModificationTrackingExtension) {

		let modelEvaluationRulesetGroupDataService = null;
		let projectMainPinnableEntityService = null;
		let platformModalService = null;

		function getActiveProjectId() {
			if (!projectMainPinnableEntityService) {
				projectMainPinnableEntityService = $injector.get('projectMainPinnableEntityService');
			}
			const pinnedProjectId = projectMainPinnableEntityService.getPinned();
			if (pinnedProjectId) {
				return pinnedProjectId;
			}
			const selProject = projectMainService.getSelected();
			if (selProject) {
				return selProject.Id;
			} else {
				return null;
			}
		}

		let serviceContainer;
		let currentModuleInfo;
		let permissionIds;

		const serviceOptions = {
			flatRootItem: {
				module: modelEvaluationModule,
				serviceName: 'modelEvaluationRulesetDataService',
				entityNameTranslationID: 'model.evaluation.rulesetEntityName',
				httpCreate: {
					route: globals.webApiBaseUrl + 'model/evaluation/ruleset/',
					endCreate: 'createruleset'
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'model/evaluation/ruleset/',
					endRead: 'filtered',
					usePostForRead: true,
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						if (!modelEvaluationRulesetGroupDataService) {
							modelEvaluationRulesetGroupDataService = $injector.get('modelEvaluationRulesetGroupDataService');
						}

						const furtherFilters = [];

						const selectedGroup = modelEvaluationRulesetGroupDataService.getSelected();
						if (selectedGroup && _.isNumber(selectedGroup.Id)) {
							furtherFilters.push({
								Token: 'MDL_RULESETGROUP',
								Value: selectedGroup.Id
							});
						}

						if (!currentModuleInfo.isMaster) {
							furtherFilters.push({
								Token: 'BAS_MODULE',
								Value: currentModuleInfo.name
							});

							const selProjectId = getActiveProjectId();
							if (_.isNumber(selProjectId)) {
								furtherFilters.push({
									Token: 'PRJ_PROJECT',
									Value: selProjectId
								});
							}
						}

						if (furtherFilters.length > 0) {
							filterRequest.furtherFilters = furtherFilters;
						}
					}
				},
				httpUpdate: {
					route: globals.webApiBaseUrl + 'model/evaluation/ruleset/',
					endUpdate: 'update'
				},
				httpDelete: {
					route: globals.webApiBaseUrl + 'model/evaluation/ruleset/',
					endDelete: 'delete'
				},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							if (!modelEvaluationRulesetGroupDataService) {
								modelEvaluationRulesetGroupDataService = $injector.get('modelEvaluationRulesetGroupDataService');
							}

							const selGroup = modelEvaluationRulesetGroupDataService.getSelected();
							if (selGroup && _.isNumber(selGroup.Id)) {
								creationData.GroupFk = selGroup.Id;
							}

							if (!currentModuleInfo.isMaster) {
								const selProjectId = getActiveProjectId();
								if (!_.isNumber(selProjectId)) {
									throw new Error('Cannot create a model evaluation rule set outside of model.evaluation without a selected project.');
								}
								creationData.ProjectFk = selProjectId;
							}
						},
						handleCreateSucceeded: function (entity) {
							updateItemReadOnlyState(entity);
							if (!currentModuleInfo.isMaster) {
								entity.InternalModuleName = currentModuleInfo.name;
							}
							enrichItem(entity);
						},
						incorporateDataRead: function (readData, data) {
							if (_.isArray(readData.dtos)) {
								readData.dtos.forEach(function (item) {
									enrichItem(item);
									updateItemReadOnlyState(item);
								});
							}

							serviceContainer.data.isDataLoaded = true;
							return serviceContainer.data.handleReadSucceeded(readData, data);
						}
					}
				},
				entityRole: {
					root: {
						codeField: null,
						descField: 'DescriptionInfo.Translated',
						itemName: 'Rulesets',
						moduleName: 'cloud.desktop.moduleDisplayNameModelEvaluationMaster',
						mainItemName: 'Ruleset',
						handleUpdateDone: function (updateData, response, data) {
							if (!modelEvaluationRulesetGroupDataService) {
								modelEvaluationRulesetGroupDataService = $injector.get('modelEvaluationRulesetGroupDataService');
							}
							modelEvaluationRulesetGroupDataService.mergeItemsAfterSuccessfulUpdate(response);

							serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
						}
					}
				},
				actions: {
					create: 'flat',
					delete: true,
					canCreateCallBackFunc: function () {
						if (currentModuleInfo.isMaster) {
							return platformPermissionService.hasCreate(permissionIds.masterRuleSets);
						} else {
							return _.isNumber(getActiveProjectId()) && platformPermissionService.hasCreate(permissionIds.projectRuleSets);
						}
					},
					canDeleteCallBackFunc: function (item) {
						if (currentModuleInfo.isMaster) {
							return platformPermissionService.hasDelete(_.isNumber(item.ProjectFk) ? permissionIds.projectRuleSets : permissionIds.masterRuleSets);
						} else {
							return _.isNumber(item.ProjectFk) && !_.isNumber(item.ModelRulesetSuperFk) && platformPermissionService.hasDelete(permissionIds.projectRuleSets);
						}
					}
				},
				sidebarSearch: {
					options: {
						moduleName: 'model.evaluation',
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						pinningOptions: {
							isActive: false
						},
						showProjectContext: false,
						withExecutionHints: false
					}
				}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		$timeout(function () {
			if (!modelEvaluationRulesetGroupDataService) {
				modelEvaluationRulesetGroupDataService = $injector.get('modelEvaluationRulesetGroupDataService');
			}
			modelEvaluationRulesetGroupDataService.registerSelectionChanged(function () {
				serviceContainer.service.load();
			});
		});

		const origShowHeaderAfterSelectionChanged = serviceContainer.data.showHeaderAfterSelectionChanged;
		serviceContainer.data.showHeaderAfterSelectionChanged = function () {
			if (mainViewService.getCurrentModuleName() === 'model.evaluation') {
				origShowHeaderAfterSelectionChanged.apply(this, arguments);
			}
		};

		currentModuleInfo = {
			name: null,
			isMaster: false
		};
		serviceContainer.service.becomeAwareOfModule = function (isMasterContainer) {
			const moduleName = isMasterContainer ? '::master::' : mainViewService.getCurrentModuleName();
			if (currentModuleInfo.name !== moduleName) {
				currentModuleInfo.name = moduleName;
				currentModuleInfo.isMaster = !!isMasterContainer;

				if (serviceContainer.data.isDataLoaded) {
					serviceContainer.service.load();
				}
			}
		};

		serviceContainer.service.isInMasterModule = function () {
			return currentModuleInfo.isMaster;
		};

		serviceContainer.service.getRulesetRelevantActiveProjectId = getActiveProjectId;

		const updateToolsEvent = {
			onUpdateTools: new PlatformMessenger(),
			handlerCount: 0
		};

		function fireUpdateTools() {
			updateToolsEvent.onUpdateTools.fire();
		}

		serviceContainer.service.registerUpdateTools = function (handler) {
			updateToolsEvent.onUpdateTools.register(handler);
			updateToolsEvent.handlerCount++;
			if (updateToolsEvent.handlerCount === 1) {
				projectMainService.registerSelectionChanged(fireUpdateTools);
				cloudDesktopPinningContextService.onSetPinningContext.register(fireUpdateTools);
				cloudDesktopPinningContextService.onClearPinningContext.register(fireUpdateTools);
				serviceContainer.service.registerSelectionChanged(fireUpdateTools);
			}
		};

		serviceContainer.service.unregisterUpdateTools = function (handler) {
			updateToolsEvent.onUpdateTools.unregister(handler);
			updateToolsEvent.handlerCount--;
			if (updateToolsEvent.handlerCount === 0) {
				projectMainService.unregisterSelectionChanged(fireUpdateTools);
				cloudDesktopPinningContextService.onSetPinningContext.unregister(fireUpdateTools);
				cloudDesktopPinningContextService.onClearPinningContext.unregister(fireUpdateTools);
				serviceContainer.service.unregisterSelectionChanged(fireUpdateTools);
			}
		};

		permissionIds = {
			masterRuleSets: '19038a100d844d88a44e8760da7840e2',
			projectRuleSets: 'f837fb4ed38745d5bcbe70c6540a85c2',
			projectOverrides: '8dfe483fcb6a4e7eb01e42c9de550f75'
		};
		$timeout(function () {
			platformPermissionService.loadPermissions([
				permissionIds.masterRuleSets,
				permissionIds.projectRuleSets,
				permissionIds.projectOverrides
			]).then(function () {
				fireUpdateTools();
			});
		});

		function updateItemReadOnlyState(item) {
			if (currentModuleInfo.isMaster) {
				platformRuntimeDataService.readonly(item, _.map([
					'DescriptionInfo',
					'ScopeLevel',
					'HighlightingSchemeFk',
					'ModelRulesetGroupFk',
					'ProjectFk'
				], function (fieldName) {
					return {
						field: fieldName,
						readonly: false
					};
				}));
			} else {
				const isReadOnly = !_.isNumber(item.ProjectFk) || _.isNumber(item.ModelRulesetSuperFk);
				platformRuntimeDataService.readonly(item, _.map([
					'DescriptionInfo',
					'ScopeLevel',
					'HighlightingSchemeFk',
					'ModelRulesetGroupFk'
				], function (fieldName) {
					return {
						field: fieldName,
						readonly: isReadOnly
					};
				}));
				platformRuntimeDataService.readonly(item, _.map([
					'ProjectFk'
				], function (fieldName) {
					return {
						field: fieldName,
						readonly: true
					};
				}));
			}
		}

		serviceContainer.service.createProjectOverridesMenu = function () {
			return {
				menuItem: currentModuleInfo.isMaster ? null : {
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
								const selRuleset = serviceContainer.service.getSelected();
								const pjId = getActiveProjectId();
								$http.post(globals.webApiBaseUrl + 'model/evaluation/ruleset/override', {
									RulesetFk: selRuleset.Id,
									ProjectFk: pjId
								}).then(function (response) {
									return serviceContainer.service.setSelected(null).then(function () {
										const overridingItem = response.data;
										serviceContainer.data.mergeItemAfterSuccessfullUpdate(selRuleset, overridingItem, true, serviceContainer.data);
										enrichItem(selRuleset);
										updateItemReadOnlyState(selRuleset);
										serviceContainer.data.listLoaded.fire();
										return serviceContainer.service.setSelected(selRuleset).then(function () {
											serviceContainer.service.markItemAsModified(selRuleset);
											return serviceContainer.service.update().then(function () {
												fireUpdateTools();
											});
										});
									});
								});
							},
							disabled: function () {
								const selRuleset = serviceContainer.service.getSelected();
								if (selRuleset) {
									return !_.isNumber(getActiveProjectId()) ||
										!platformPermissionService.hasCreate(permissionIds.projectOverrides) ||
										_.isNumber(selRuleset.ProjectFk);
								}
								return true;
							}
						}, {
							id: 'discardOverride',
							caption: 'model.evaluation.projectOverrideDiscard',
							type: 'item',
							iconClass: 'tlb-icons ico-local-variant-discard',
							fn: function () {
								const selRuleset = serviceContainer.service.getSelected();
								if (_.isNumber(selRuleset.ModelRulesetSuperFk)) {
									const callPromise = selRuleset.Version <= 0 ?
										$http.get(globals.webApiBaseUrl + 'model/evaluation/ruleset/getruleset', {
											params: {
												rulesetFk: selRuleset.ModelRulesetSuperFk
											}
										}) :
										$http.post(globals.webApiBaseUrl + 'model/evaluation/ruleset/discardoverride', {
											Id: selRuleset.Id
										});

									callPromise.then(function (response) {
										const origItem = response.data;
										serviceContainer.data.mergeItemAfterSuccessfullUpdate(selRuleset, origItem, true, serviceContainer.data);
										enrichItem(selRuleset);
										updateItemReadOnlyState(selRuleset);

										platformDataServiceModificationTrackingExtension.clearModificationsInRoot(serviceContainer.service);

										serviceContainer.data.listLoaded.fire();
										return serviceContainer.service.setSelected(null).then(function () {
											return serviceContainer.service.setSelected(selRuleset).then(function () {
												return serviceContainer.service.update().then(function () {
													fireUpdateTools();
													return processRulesetChanges([selRuleset.Id]);
												});
											});
										});
									});
								}
							},
							disabled: function () {
								const selRuleset = serviceContainer.service.getSelected();
								if (selRuleset) {
									return !platformPermissionService.hasDelete(permissionIds.projectOverrides) ||
										!_.isNumber(selRuleset.ModelRulesetSuperFk);
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

		serviceContainer.service.addProjectWarningToCreation = function (item) {
			if (!currentModuleInfo.isMaster) {
				if (platformPermissionService.hasCreate(permissionIds.masterRuleSets)) {
					const origFn = item.fn;
					item.fn = function () {
						const that = this;
						const args = arguments;

						if (!platformModalService) {
							platformModalService = $injector.get('platformModalService');
						}

						return platformModalService.showYesNoDialog('model.evaluation.createProjectRuleset', 'model.evaluation.createProjectRulesetTitle', 'yes').then(function (result) {
							if (result.yes) {
								return origFn.apply(that, args);
							}
						});
					};
				}
			}
		};

		function enrichItem(ruleset) {
			if (_.isNumber(ruleset.ModelRulesetSuperFk)) {
				ruleset.Origin = 'po';
			} else if (_.isNumber(ruleset.ProjectFk)) {
				ruleset.Origin = 'p';
			} else {
				ruleset.Origin = 'g';
			}
		}

		let modelEvaluationRulesetResultCacheService = null;
		let modelEvaluationRuleDataService = null;
		const origHandleOnUpdateSucceeded = serviceContainer.data.handleOnUpdateSucceeded;
		serviceContainer.data.handleOnUpdateSucceeded = function (updateData) {
			function getEffectiveRulesetId(ruleset) {
				return _.isNumber(ruleset.ModelRulesetSuperFk) ? ruleset.ModelRulesetSuperFk : ruleset.Id;
			}

			const changedRulesetIds = [];

			function addRulesetArrayOrValue(v) {
				if (_.isArray(v)) {
					v.forEach(function (rs) {
						changedRulesetIds.push(getEffectiveRulesetId(rs));
					});
				} else if (_.isObject(v)) {
					changedRulesetIds.push(getEffectiveRulesetId(v));
				}
			}

			function addRuleArrayOrValue(v) {
				if (_.isArray(v)) {
					v.forEach(function (r) {
						changedRulesetIds.push(r.OriginalRulesetId);
					});
				} else if (_.isObject(v)) {
					changedRulesetIds.push(v.OriginalRulesetId);
				}
			}

			addRulesetArrayOrValue(updateData.Rulesets);
			addRulesetArrayOrValue(updateData.RulesetsToSave);
			addRulesetArrayOrValue(updateData.RulesetsToDelete);

			addRuleArrayOrValue(updateData.RulesToSave);
			addRuleArrayOrValue(updateData.RulesToDelete);

			processRulesetChanges(changedRulesetIds);

			if (!modelEvaluationRuleDataService) {
				modelEvaluationRuleDataService = $injector.get('modelEvaluationRuleDataService');
			}
			modelEvaluationRuleDataService.fireUpdateTools();

			return origHandleOnUpdateSucceeded.apply(serviceContainer.data, arguments);
		};

		function processRulesetChanges(changedRulesetIds) {
			if (changedRulesetIds.length > 0) {
				changedRulesetIds = _.uniq(changedRulesetIds);

				if (!modelEvaluationRulesetResultCacheService) {
					modelEvaluationRulesetResultCacheService = $injector.get('modelEvaluationRulesetResultCacheService');
				}

				changedRulesetIds.forEach(function (rsId) {
					modelEvaluationRulesetResultCacheService.clearResults(rsId);
				});

				refreshViewers(changedRulesetIds);
			}
		}

		serviceContainer.service.processRulesetChanges = processRulesetChanges;

		let modelViewerViewerRegistryService = null;

		function refreshViewers(rulesetIds) {
			if (!_.isArray(rulesetIds) || (rulesetIds.length <= 0)) {
				return $q.resolve();
			}

			if (!modelViewerViewerRegistryService) {
				modelViewerViewerRegistryService = $injector.get('modelViewerViewerRegistryService');
			}

			const updatePromises = [];
			modelViewerViewerRegistryService.getViewers().forEach(function (v) {
				const fe = v.getFilterEngine();
				if (fe) {
					const f = fe.getActiveFilter();
					if (f) {
						const requiresUpdate = _.some(rulesetIds, function (rsId) {
							return f.dependsOnRuleset(rsId);
						});

						if (requiresUpdate) {
							updatePromises.push(f.update());
						}
					}
				}
			});
			return $q.all(updatePromises);
		}

		serviceContainer.service.forceReevaluation = function () {
			if (!modelEvaluationRulesetResultCacheService) {
				modelEvaluationRulesetResultCacheService = $injector.get('modelEvaluationRulesetResultCacheService');
			}

			modelEvaluationRulesetResultCacheService.clearResults();

			if (!modelViewerViewerRegistryService) {
				modelViewerViewerRegistryService = $injector.get('modelViewerViewerRegistryService');
			}

			const updatePromises = [];
			modelViewerViewerRegistryService.getViewers().forEach(function (v) {
				const fe = v.getFilterEngine();
				if (fe) {
					const f = fe.getActiveFilter();
					if (f) {
						if (f.dependsOnRuleset()) {
							updatePromises.push(f.update());
						}
					}
				}
			});
			return $q.all(updatePromises);
		};

		let isUpdating = false;
		$rootScope.$on('updateRequested', function () {
			if (serviceContainer.data.usingContainer.length > 0) {
				serviceContainer.service.autoSaveFilters();
			}
		});

		const debouncedUpdate = _.debounce(function () {
			if (isUpdating) {
				debouncedUpdate();
			} else {
				isUpdating = true;
				serviceContainer.service.update().then(function () {
					isUpdating = false;
				});
			}
		}, 500, {
			leading: false,
			trailing: true,
			maxWait: 1000
		});
		serviceContainer.service.autoSaveFilters = function () {
			if (!currentModuleInfo.isMaster) {
				debouncedUpdate();
			}
		};

		return serviceContainer.service;
	}
})(angular);
