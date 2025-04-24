/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerBasicSelectorService
	 * @function
	 *
	 * @description Provides basic object selectors.
	 */
	angular.module('model.viewer').factory('modelViewerBasicSelectorService',
		modelViewerBasicSelectorService);

	modelViewerBasicSelectorService.$inject = ['_', 'modelViewerObjectTreeService',
		'modelViewerModelSelectionService', 'modelViewerSelectorService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerViewerRegistryService',
		'$translate', '$q', '$timeout'];

	function modelViewerBasicSelectorService(_, modelViewerObjectTreeService,
		modelViewerModelSelectionService, modelViewerSelectorService,
		modelViewerCompositeModelObjectSelectionService, modelViewerViewerRegistryService,
		$translate, $q, $timeout) {

		const service = {};

		modelViewerSelectorService.registerCategory({
			id: 'general',
			name: 'model.viewer.selectors.generalCategory'
		});

		modelViewerSelectorService.registerSelector({
			name: 'model.viewer.selectors.allObjects.name',
			category: 'general',
			isAvailable: function () {
				return true;
			},
			getObjects: function () {
				const treeInfo = modelViewerObjectTreeService.getTree();
				if (treeInfo) {
					const result = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
						const modelTreeInfo = treeInfo[subModelId];
						if (modelTreeInfo.tree) {
							return [modelTreeInfo.tree.id];
						} else {
							return [];
						}
					});

					return {
						objectIds: result
					};
				} else {
					throw new Error('No model tree info found.');
				}
			}
		});

		modelViewerSelectorService.registerSelector({
			name: 'model.viewer.selectors.currentSelection.name',
			category: 'general',
			suggestToObjectSet: true,
			isAvailable: function () {
				return !modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds().isEmpty();
			},
			getObjects: function () {
				return {
					objectIds: modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds()
				};
			}
		});

		modelViewerSelectorService.registerSelector({
			name: 'model.viewer.selectors.blacklist.name',
			category: 'general',
			suggestToObjectSet: true,
			isAvailable: function () {
				return modelViewerViewerRegistryService.isViewerActive();
			},
			getObjects: function (settings) {
				const chosenBlacklist = _.find(settings.blacklists, function (bl) {
					return bl.id === settings.viewerId;
				});

				return {
					meshIds: chosenBlacklist.blacklistedMeshIds
				};
			},
			createWizardSteps: function (modelPrefix) {
				const noViewerId = '-';

				return [{
					id: 'scanBlacklistsStep',
					title: 'model.viewer.selectionWz.assemblingObjectsList',
					loadingMessage: 'model.viewer.selectionWz.assemblingObjectsListMessage',
					disallowBack: true,
					disallowNext: true,
					canFinish: false,
					prepareStep: function (info) {
						$q.all(_.map(_.filter(modelViewerViewerRegistryService.getViewers(), function (viewerInfo) {
							return viewerInfo.getFilterEngine();
						}), function (viewerInfo) {
							const fe = viewerInfo.getFilterEngine();
							const blacklist = fe.getBlacklist();
							return blacklist.getMeshIds().then(function (blacklistedMeshIds) {
								return {
									id: 'v:' + viewerInfo.id,
									viewerInfo: viewerInfo,
									blacklistedMeshIds: blacklistedMeshIds,
									blacklistedMeshCount: blacklistedMeshIds.totalCount(function (v) {
										return !!v;
									})
								};
							});
						})).then(function (blacklists) {
							let viewerSelStep = null;

							function checkViewerSelected(info) {
								const selViewerId = _.get(info.model, modelPrefix + 'viewerId');
								info.scope.$evalAsync(function () {
									viewerSelStep.disallowNext = _.isNil(selViewerId) || (selViewerId === noViewerId);
								});
							}

							_.set(info.model, modelPrefix + 'blacklists', blacklists);

							let preselectedViewerId = null;
							if ((blacklists.length === 1) && (blacklists[0].blacklistedMeshCount > 0)) {
								preselectedViewerId = blacklists[0].id;
							} else {
								viewerSelStep = {
									id: 'selectBlacklistViewerStep',
									title: $translate.instant('model.viewer.selectors.blacklist.selectViewer'),
									topDescription: $translate.instant('model.viewer.selectors.blacklist.selectViewerDesc'),
									disallowBack: true,
									disallowNext: true,
									form: {
										fid: 'model.viewer.objectSelector.blacklist.viewer',
										version: '1.0.0',
										showGrouping: false,
										groups: [{
											gid: 'default'
										}],
										rows: [{
											gid: 'default',
											rid: 'viewer',
											type: 'radio',
											options: {
												valueMember: 'value',
												labelMember: 'label',
												disabledMember: 'disabled',
												groupName: 'viewerGroup',
												items: _.map(blacklists, function (bl) {
													if (!preselectedViewerId && (bl.blacklistedMeshCount > 0)) {
														preselectedViewerId = bl.viewerInfo.id;
													}

													return {
														label: $translate.instant('model.viewer.selectors.blacklist.viewerNameWithCount', {
															name: bl.viewerInfo.getDisplayName(),
															meshCount: bl.blacklistedMeshCount
														}),
														value: bl.id,
														disabled: bl.blacklistedMeshCount <= 0
													};
												})
											},
											model: modelPrefix + 'viewer'
										}]
									},
									prepareStep: checkViewerSelected,
									watches: [{
										expression: modelPrefix + 'viewerId',
										fn: checkViewerSelected
									}]
								};

								info.wizard.steps.splice(_.findIndex(info.wizard.steps, function (s) {
									return s.id === 'scanBlacklistsStep';
								}) + 1, 0, viewerSelStep);
							}
							_.set(info.model, modelPrefix + 'viewerId', preselectedViewerId ? preselectedViewerId : noViewerId);

							info.scope.$evalAsync(function () {
								info.step.disallowNext = false;
							});
							$timeout(function () {
								info.commands.goToNext();
							});
						});
					}
				}];
			},
			createSettings: function () {
				return {
					viewerId: null
				};
			}
		});

		return service;
	}
})(angular);
