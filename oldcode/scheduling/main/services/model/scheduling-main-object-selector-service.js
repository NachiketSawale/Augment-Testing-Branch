/* global globals */
/*
 * $Id: scheduling-main-object-selector-service.js 634480 2021-04-28 12:48:05Z sprotte $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling.main.schedulingMainObjectSelectorService
	 * @function
	 *
	 * @description Registers object selectors related to the Scheduling module.
	 */
	angular.module('scheduling.main').service('schedulingMainObjectSelectorService', SchedulingMainObjectSelectorService);

	SchedulingMainObjectSelectorService.$inject = ['$http', '_', 'modelViewerSelectorService', 'modelViewerModelSelectionService',
		'schedulingSchedulePinnableEntityService', 'estimateMainPinnableEntityService', 'modelViewerObjectTreeService',
		'modelViewerModelIdSetService', 'modelSimulationTimelineRequestService', '$translate', '$timeout',
		'platformWizardDialogService'];

	function SchedulingMainObjectSelectorService($http, _, modelViewerSelectorService, modelViewerModelSelectionService,
		schedulingSchedulePinnableEntityService, estimateMainPinnableEntityService, modelViewerObjectTreeService,
		modelViewerModelIdSetService, modelSimulationTimelineRequestService, $translate, $timeout,
		platformWizardDialogService) {

		this.schedulingCategoryId = 'scheduling';
		this.selectorName = 'scheduling.main.modelObjectSelectors';

		this.initialize = _.noop;

		modelViewerSelectorService.registerCategory({
			id: this.schedulingCategoryId,
			name: this.selectorName + '.category'
		});

		modelViewerSelectorService.registerSelector({
			name: this.selectorName + '.selectUnassigned.name',
			category: this.schedulingCategoryId,
			isAvailable: function () {
				return !!schedulingSchedulePinnableEntityService.getPinned() && !!modelViewerModelSelectionService.getSelectedModel();
			},
			getObjects: function () {
				var selectedModel = modelViewerModelSelectionService.getSelectedModel();
				if (selectedModel) {
					var data = {
						ScheduleId: schedulingSchedulePinnableEntityService.getPinned(),
						EstimateId: estimateMainPinnableEntityService.getPinned(),
						ModelId: selectedModel.info.modelId
					};
					return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity2model/assigned', data).then(function (response) {
						var result = { objectIds: [] };
						var treeInfo = modelViewerObjectTreeService.getTree();
						if (treeInfo) {
							result.objectIds = treeInfo.invertObjectIds(modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds(), true);
						}
						return result;
					});
				} else {
					return { objectIds: [] };
				}
			}
		});

		modelViewerSelectorService.registerSelector({
			name: 'scheduling.main.modelObjectSelectors.selectByVisType.name',
			category: this.schedulingCategoryId,
			isAvailable: function () {
				return true;
			},
			getObjects: function (settings) {
				var allObjectIds = new modelViewerModelIdSetService.MultiModelIdSet();
				settings.visTypes.items.forEach(function (vtItem) {
					if (vtItem.isIncluded && (vtItem.ObjectCount > 0)) {
						allObjectIds.assign(vtItem.extractedElementIds);
					}
				});

				return {
					objectIds: allObjectIds
				};
			},
			createWizardSteps: function (modelPrefix) {
				return [modelSimulationTimelineRequestService.createSelectionWizardStep(modelPrefix, {
					topDescription$tr$: 'scheduling.main.modelObjectSelectors.selectByVisType.selectTimelineDesc'
				}), {
					id: 'retrieveObjectsStep',
					title: $translate.instant('scheduling.main.modelObjectSelectors.selectByVisType.retrieveObjectsByVisType'),
					loadingMessage: $translate.instant('scheduling.main.modelObjectSelectors.selectByVisType.retrieveObjectsByVisTypeDesc'),
					disallowBack: true,
					disallowNext: true,
					canFinish: false,
					prepareStep: function (info) {
						var simSettings = _.get(info.model, modelPrefix + 'simulation');
						var tlRequest = simSettings.getSelectedTimelineRequest();
						if (tlRequest) {
							return $http.post(globals.webApiBaseUrl + 'scheduling/main/activity2model/byVisType', {
								TimelineRequest: tlRequest,
								ModelId: modelViewerModelSelectionService.getSelectedModelId()
							}).then(function (response) {
								_.set(info.model, modelPrefix + 'visTypes', {
									items: _.map(response.data, function (g) {
										g.extractedElementIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(g.ElementIds).useSubModelIds();
										g.ObjectCount = g.extractedElementIds.totalCount();
										return g;
									}),
									selectionListConfig: {
										idProperty: 'Id',
										multiSelect: true,
										checkListProperty: 'isIncluded',
										columns: [{
											id: 'desc',
											field: 'DescriptionInfo.Translated',
											name: $translate.instant('cloud.common.entityDescription'),
											formatter: 'description',
											sortable: true,
											width: 250
										}, {
											id: 'objCount',
											field: 'ObjectCount',
											name: $translate.instant('scheduling.main.modelObjectSelectors.selectByVisType.objCount'),
											formatter: 'integer',
											sortable: true,
											width: 150
										}]
									}
								});

								info.scope.$evalAsync(function () {
									info.step.disallowNext = false;
									$timeout(function () {
										info.commands.goToNext();
									});
								});
							});
						} else {
							throw new Error('No timeline selected.');
						}
					}
				}, _.assign(platformWizardDialogService.createListStep({
					title: $translate.instant('scheduling.main.modelObjectSelectors.selectByVisType.selVisTypes'),
					topDescription: $translate.instant('scheduling.main.modelObjectSelectors.selectByVisType.selVisTypesDesc'),
					model: modelPrefix + 'visTypes'
				}), {
					disallowBack: true
				})];
			}
		});
	}
})();