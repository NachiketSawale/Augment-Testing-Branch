/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerSelectionWizardService
	 * @function
	 *
	 * @description This service provides a wizard that can be used to bulk-select model objects based upon the
	 *              current application state.
	 */
	angular.module('model.viewer').factory('modelViewerSelectionWizardService',
		modelViewerSelectionWizardService);

	modelViewerSelectionWizardService.$inject = ['_', '$q', '$timeout', '$translate',
		'platformWizardDialogService', 'modelViewerSelectorService',
		'basicsLookupdataConfigGenerator', 'modelViewerModelSelectionService',
		'modelMainObjectSet2ObjectDataService', 'modelViewerObjectTreeService',
		'modelViewerObjectIdMapService', 'modelViewerModelIdSetService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerViewerRegistryService',
		'modelMainObjectSetDataService'];

	function modelViewerSelectionWizardService(_, $q, $timeout, $translate,
		platformWizardDialogService, modelViewerSelectorService,
		basicsLookupdataConfigGenerator, modelViewerModelSelectionService,
		modelMainObjectSet2ObjectDataService, modelViewerObjectTreeService,
		modelViewerObjectIdMapService, modelViewerModelIdSetService,
		modelViewerCompositeModelObjectSelectionService, modelViewerViewerRegistryService,
		modelMainObjectSetDataService) {

		const service = {};

		service.getMinimalObjectIds = function getMinimalObjectIds(treeInfo, objects) {
			if (objects.objectIds) {
				return treeInfo.minimizeObjectIds(objects.objectIds);
			} else {
				return treeInfo.meshToMinimalObjectIds(objects.meshIds);
			}
		};

		function countRange(objects) {
			const treeInfo = modelViewerObjectTreeService.getTree();
			const minSel = service.getMinimalObjectIds(treeInfo, objects);

			const result = {
				meshCount: 0,
				minObjectCount: minSel.totalCount(function (v) {
					return !!v;
				}),
				maxObjectCount: 0
			};

			modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
				const modelMinSel = minSel[subModelId];
				const modelTreeInfo = treeInfo[subModelId];

				if (_.isArray(modelMinSel)) {
					modelMinSel.forEach(countInSubTree);
				} else if (_.isObject(modelMinSel)) {
					Object.keys(modelMinSel).forEach(function (objectId) {
						objectId = parseInt(objectId);
						if (modelMinSel[objectId]) {
							countInSubTree(objectId);
						}
					});
				}

				function countInSubTree(rootId) {
					const subTreeRoot = modelTreeInfo.byId[rootId];
					if (subTreeRoot) {
						subTreeRoot.visitPreorder(function (obj) {
							result.maxObjectCount++;
							if (obj.hasMeshId) {
								result.meshCount++;
							}
						});
					}
				}

			});

			return result;
		}

		function createRestrictionStep() {
			const newStep = {
				id: 'restrictionStep',
				title: $translate.instant('model.viewer.selectionWz.restriction'),
				disallowBack: true,
				form: {
					fid: 'model.viewer.objectSelector.restriction',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionCheck: true,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						rid: 'treePart',
						type: 'radio',
						label: $translate.instant('model.viewer.selectionWz.treePart'),
						model: 'treePart',
						visible: true,
						sortOrder: 20,
						options: {
							valueMember: 'value',
							labelMember: 'label',
							disabledMember: 'disabled',
							groupName: 'treePartGroup',
							items: [{
								value: 'mincl',
								label$tr$: 'model.viewer.selectionWz.treePartMinimalCompositeAndLeaves'
							}, {
								value: 'minc',
								label$tr$: 'model.viewer.selectionWz.treePartMinimalComposite'
							}, {
								value: 'min',
								label$tr$: 'model.viewer.selectionWz.treePartMinimal'
							}, {
								value: 'l',
								label$tr$: 'model.viewer.selectionWz.treePartLeaves'
							}, {
								value: 'm',
								label$tr$: 'model.viewer.selectionWz.treePartMeshes'
							}, {
								value: 'a',
								label$tr$: 'model.viewer.selectionWz.treePartAll'
							}]
						}
					}]
				}
			};

			if (modelViewerViewerRegistryService.isViewerActive()) {
				const viewerItems = [{
					value: 'none',
					label$tr$: 'model.viewer.selectionWz.selMaskNone'
				}];
				modelViewerViewerRegistryService.getViewers().forEach(function (viewerInfo) {
					viewerItems.push({
						label: viewerInfo.getDisplayName(),
						value: viewerInfo.id
					});
				});

				newStep.form.rows.unshift({
					gid: 'default',
					rid: 'selMask',
					type: 'radio',
					label: $translate.instant('model.viewer.selectionWz.selMask'),
					model: 'selMask',
					visible: true,
					sortOrder: 20,
					options: {
						valueMember: 'value',
						labelMember: 'label',
						disabledMember: 'disabled',
						groupName: 'selMaskGroup',
						items: viewerItems
					}
				});
			}

			return newStep;
		}

		/**
		 * @ngdoc method
		 * @name updateWizardByDestination
		 * @function
		 * @methodOf modelViewerSelectionWizardService
		 * @description Updates the wizard based on an object set destination value.
		 * @param {String} destination A string expressing the destination of retrieved object IDs.
		 * @param {Object} wizard The wizard definition.
		 * @param {Object} model The data model object.
		 */
		function updateWizardByDestination(destination, wizard, model) {
			platformWizardDialogService.removeSteps(wizard, 'objectSetSelStep', 'newObjectSetStep');

			const idx = _.findIndex(wizard.steps, {id: 'destinationStep'});

			switch (destination) {
				case 's':
					wizard.steps[idx].disallowNext = false;
					break;
				case 'o':
					(function () {
						const newStep = {
							id: 'objectSetSelStep',
							title: $translate.instant('model.viewer.selectionWz.selObjectSet'),
							topDescription: $translate.instant('model.viewer.selectionWz.selObjectSetDesc'),
							form: {
								fid: 'model.viewer.objectSelector.objectSetSel',
								version: '1.0.0',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [{
									gid: 'default'
								}],
								rows: [
									basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
										dataServiceName: 'modelMainObjectSetLookupDataService',
										filter: function () {
											return modelViewerModelSelectionService.getSelectedModel().info.projectId;
										}
									}, {
										gid: 'default',
										rid: 'objectSetFk',
										model: 'objectSet',
										sortOrder: 1,
										type: 'integer'
									})
								]
							},
							disallowNext: true,
							watches: [{
								expression: 'objectSet',
								fn: function (info) {
									_.find(info.wizard.steps, {id: 'objectSetSelStep'}).disallowNext = !info.newValue;
								}
							}]
						};

						wizard.steps[idx].disallowNext = false;

						wizard.steps.splice(idx + 1, 0, newStep);
					})();
					break;
				case 'no':
					(function () {
						const newStep = {
							id: 'newObjectSetStep',
							title: $translate.instant('model.viewer.selectionWz.newObjectSet'),
							topDescription: $translate.instant('model.viewer.selectionWz.newObjectSetDesc'),
							form: {
								fid: 'model.viewer.objectSelector.newObjectSet',
								version: '1.0.0',
								showGrouping: false,
								skipPermissionsCheck: true,
								groups: [{
									gid: 'default'
								}],
								rows: [{
									gid: 'default',
									rid: 'name',
									label: $translate.instant('model.viewer.selectionWz.newObjectSetName'),
									model: 'objectSetName',
									sortOrder: 1,
									type: 'description'
								}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.objectsettype', 'Description', {
									gid: 'default',
									rid: 'type',
									label: $translate.instant('model.main.objectSet.objectSetType'),
									model: 'objectSetType',
									sortOrder: 2,
									type: 'integer'
								}), basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.objectsetstatus', 'Description', {
									gid: 'default',
									rid: 'type',
									label: $translate.instant('model.main.objectSet.objectSetStatus'),
									model: 'objectSetStatus',
									sortOrder: 3,
									type: 'integer'
								})]
							}
						};

						wizard.steps[idx].disallowNext = true;
						modelMainObjectSetDataService.getDefaultSettings().then(function (defSettings) {
							model.objectSetType = defSettings.ObjectSetTypeFk;
							model.objectSetStatus = defSettings.ObjectSetStatusFk;

							wizard.steps[idx].disallowNext = false;
						});

						wizard.steps.splice(idx + 1, 0, newStep);
					})();
					break;
			}
		}

		function doShowDialog(standalone) {
			const wzConfig = {
				title$tr$: 'model.viewer.selectionWz.title',
				steps: [{
					id: 'selectorStep',
					title$tr$: 'model.viewer.selectionWz.selector',
					topDescription$tr$: 'model.viewer.selectionWz.selectorDesc',
					form: {
						fid: 'model.viewer.objectSelector.list',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'list',
							type: 'directive',
							directive: 'model-viewer-object-selector-list',
							model: 'selector'
						}]
					},
					disallowNext: true,
					watches: [{
						expression: 'selector.id',
						fn: function (info) {
							const selectorStepIndex = _.findIndex(info.wizard.steps, {id: 'selectorStep'});
							const assembleObjectsStepIndex = _.findIndex(info.wizard.steps, {id: 'assembleObjectsStep'});

							if (assembleObjectsStepIndex > selectorStepIndex + 1) {
								info.wizard.steps.splice(selectorStepIndex + 1, assembleObjectsStepIndex - selectorStepIndex - 1);
							}

							if (info.newValue) {
								const selector = modelViewerSelectorService.getSelectorById(info.newValue);

								if (!info.model.__selectorSettings[selector.id]) {
									if (angular.isFunction(selector.createSettings)) {
										info.model.__selectorSettings[selector.id] = selector.createSettings() || {};
									} else {
										info.model.__selectorSettings[selector.id] = {};
									}
								}

								if (angular.isFunction(selector.createWizardSteps)) {
									const wizardSteps = selector.createWizardSteps('__selectorSettings[' + selector.id + '].');
									if (angular.isArray(wizardSteps)) {
										info.wizard.steps.splice.apply(info.wizard.steps, [selectorStepIndex + 1, 0].concat(wizardSteps));
									}
								}
							}

							const selectorStep = info.wizard.steps[selectorStepIndex];
							selectorStep.disallowNext = !info.newValue;
						}
					}]
				}, {
					id: 'assembleObjectsStep',
					title$tr$: 'model.viewer.selectionWz.assemblingObjectsList',
					loadingMessage$tr$: 'model.viewer.selectionWz.assemblingObjectsListMessage',
					disallowBack: true,
					disallowNext: true,
					canFinish: false
				}, createRestrictionStep(), {
					id: 'applyRestrictionsStep',
					title$tr$: 'model.viewer.selectionWz.applyRestrictions',
					loadingMessage$tr$: 'model.viewer.selectionWz.applyRestrictionsMessage',
					disallowBack: true,
					disallowNext: true,
					canFinish: false
				}],
				onChangeStep: function (info) {
					switch (info.step.id) {
						case 'assembleObjectsStep':
							(function () {
								const selector = modelViewerSelectorService.getSelectorById(info.model.selector.id);
								if (selector) {
									$q.when(selector.getObjects(info.model.__selectorSettings[info.model.selector.id])).then(function (objects) {
										return normalizeObjects(_.cloneDeep(objects));
									}).then(function (objects) {
										info.model.objects = objects;

										if (info.model.objects.objectIds.length <= 0) {
											info.wizard.steps.splice(info.stepIndex + 1, info.wizard.steps.length - info.stepIndex - 1, {
												title: $translate.instant('model.viewer.selectionWz.noObjects'),
												message: $translate.instant('model.viewer.selectionWz.noObjectsMessage'),
												disallowBack: true
											});
										} else {
											const countedRange = countRange(info.model.objects);
											_.find(info.wizard.steps, {id: 'restrictionStep'}).topDescription = $translate.instant('model.viewer.selectionWz.restrictionDesc', countedRange);

											info.model.destination = (selector.suggestToObjectSet || (info.model.objects.meshIds.length > 100)) ? 'no' : 's';
											updateWizardByDestination(info.model.destination, info.wizard, info.model);
										}

										info.step.disallowNext = false;
										$timeout(function () {
											info.commands.goToNext();
										});
									});
								}
							})();
							break;
						case 'applyRestrictionsStep':
							normalizeObjects(modelViewerObjectTreeService.retrieveObjectsByMode(info.model.objects, info.model)).then(function (normalizedObjects) {
								info.model.objects = normalizedObjects;

								const msgParams = {
									objectCount: info.model.objects.objectIds.totalCount(function (v) {
										return !!v;
									}),
									meshCount: info.model.objects.meshIds.totalCount(function (v) {
										return !!v;
									})
								};
								if (standalone) {
									_.find(info.wizard.steps, {id: 'destinationStep'}).topDescription = $translate.instant('model.viewer.selectionWz.destinationDesc', msgParams);
								} else {
									_.find(info.wizard.steps, {id: 'completionStep'}).message = $translate.instant('model.viewer.selectionWz.completionMessageEmbedded', msgParams);
								}

								info.step.disallowNext = false;
								$timeout(function () {
									info.commands.goToNext();
								});
							});
							break;
					}
				}
			};

			if (standalone) {
				wzConfig.steps.push({
					id: 'destinationStep',
					title$tr$: 'model.viewer.selectionWz.destination',
					disallowBack: true,
					form: {
						fid: 'model.viewer.objectSelector.destination',
						version: '1.0.0',
						showGrouping: false,
						skipPermissionsCheck: true,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'objectDestKind',
							type: 'radio',
							model: 'destination',
							visible: true,
							sortOrder: 1,
							options: {
								valueMember: 'value',
								labelMember: 'label',
								disabledMember: 'disabled',
								groupName: 'destinationGroup',
								items: [{
									value: 's',
									label$tr$: 'model.viewer.selectionWz.destSelection'
								}, {
									value: 'no',
									label$tr$: 'model.viewer.selectionWz.destNewObjectSet'
								}, {
									value: 'o',
									label$tr$: 'model.viewer.selectionWz.destObjectSet'
								}]
							}
						}]
					},
					watches: [{
						expression: 'destination',
						fn: function (info) {
							updateWizardByDestination(info.newValue, info.wizard, info.model);
						}
					}]
				}, {
					title$tr$: 'model.viewer.selectionWz.completion',
					message$tr$: 'model.viewer.selectionWz.completionMessageStandalone',
					canFinish: true
				});
			} else {
				wzConfig.steps.push({
					id: 'completionStep',
					title$tr$: 'model.viewer.selectionWz.completion',
					canFinish: true
				});
			}

			platformWizardDialogService.translateWizardConfig(wzConfig);

			const obj = {
				selector: {},
				__selectorSettings: {},
				treePart: 'mincl',
				selMask: 'none'
			};

			let wizardPromise = platformWizardDialogService.showDialog(wzConfig, obj);
			if (standalone) {
				wizardPromise = wizardPromise.then(function postProcessStandaloneDialog(result) {
					if (result.success) {
						switch (result.data.destination) {
							case 's':
								modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(result.data.objects.objectIds);
								break;
							case 'no':
								modelMainObjectSet2ObjectDataService.assignObjects({
									projectId: modelViewerModelSelectionService.getSelectedModel().info.projectId,
									objectSetCreationParams: {
										Name: result.data.objectSetName,
										TypeFk: result.data.objectSetType,
										StatusFk: result.data.objectSetStatus
									},
									objectIds: result.data.objects.objectIds.useGlobalModelIds().toCompressedString()
								});
								break;
							case 'o':
								modelMainObjectSet2ObjectDataService.assignObjects({
									projectId: modelViewerModelSelectionService.getSelectedModel().info.projectId,
									objectSetId: result.data.objectSet,
									objectIds: result.data.objects.objectIds.useGlobalModelIds().toCompressedString()
								});
								break;
						}
					}

					return result.success;
				});
			} else {
				wizardPromise = wizardPromise.then(function postProcessEmbeddedDialog(result) {
					if (result.success) {
						return {
							objectIds: result.data.objects.objectIds,
							success: true
						};
					}
					return {
						success: false
					};
				});
			}
			return wizardPromise;
		}

		/**
		 * @ngdoc method
		 * @name showDialog
		 * @function
		 * @methodOf modelViewerSelectionWizardService
		 * @description Launches a wizard for automatically selecting model objects.
		 * @return {Promise<Boolean>} A promise that resolves to a value indicating whether the wizard was
		 *                            completed successfully.
		 */
		service.showDialog = function () {
			return doShowDialog(true);
		};

		/**
		 * @ngdoc method
		 * @name showDialogEmbedded
		 * @function
		 * @methodOf modelViewerSelectionWizardService
		 * @description Launches the dialog for automatically selecting model objects in such a way that the
		 *              resulting set of object IDs is returned..
		 * @return {Promise<Object>} A promise that resolves to an object with a `success` property and, if
		 *                           the selection was confirmed, an `objectIds` property.
		 */
		service.showDialogEmbedded = function () {
			return doShowDialog(false);
		};

		/**
		 * @ngdoc method
		 * @name normalizeObjects
		 * @function
		 * @methodOf modelViewerSelectionWizardService
		 * @description Normalizes the resulting object ID list.
		 * @parameter {Object} objects An object ID list container.
		 * @return {Promise<Object>} A promise that will be resolved to the normalized object ID list container.
		 */
		function normalizeObjects(objects) {
			const result = {};
			const promises = [];

			const treeInfo = modelViewerObjectTreeService.getTree();

			if (angular.isObject(objects.meshIds)) {
				result.meshIds = objects.meshIds;
			} else {
				let meshIdPromise;
				if (angular.isObject(objects.objectIds)) {
					if (treeInfo) {
						meshIdPromise = (function () {
							const meshMap = new modelViewerModelIdSetService.ObjectIdSet(treeInfo.objectToMeshIds(objects.objectIds));
							return $q.when(meshMap.normalizeToArrays());
						})();
					} else {
						meshIdPromise = $q.when(new modelViewerModelIdSetService.ObjectIdSet());
					}
				} else {
					meshIdPromise = $q.when(new modelViewerModelIdSetService.ObjectIdSet());
				}
				promises.push(meshIdPromise.then(function (ids) {
					result.meshIds = ids;
				}));
			}

			if (angular.isObject(objects.objectIds)) {
				result.objectIds = objects.objectIds;
			} else {
				let objectIdPromise;
				if (angular.isObject(objects.meshIds)) {
					if (treeInfo) {
						objectIdPromise = (function () {
							const meshMap = new modelViewerModelIdSetService.ObjectIdSet(treeInfo.meshToMinimalObjectIds(objects.meshIds));
							return $q.when(meshMap.normalizeToArrays());
						})();
					} else {
						objectIdPromise = $q.when(new modelViewerModelIdSetService.ObjectIdSet());
					}
				} else {
					objectIdPromise = $q.when(new modelViewerModelIdSetService.ObjectIdSet());
				}
				promises.push(objectIdPromise.then(function (ids) {
					result.objectIds = ids;
				}));
			}

			return $q.all(promises).then(function () {
				return result;
			});
		}

		return service;
	}
})(angular);
