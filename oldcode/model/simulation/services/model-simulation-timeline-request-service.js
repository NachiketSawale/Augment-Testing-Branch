/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.simulation.modelSimulationTimelineRequestService
	 * @function
	 *
	 * @description Creates objects that can be used to request simulation timelines.
	 */
	angular.module('model.simulation').factory('modelSimulationTimelineRequestService',
		modelSimulationTimelineRequestService);

	modelSimulationTimelineRequestService.$inject = ['$injector', '$translate', '_',
		'moment', 'schedulingSchedulePinnableEntityService', 'estimateMainPinnableEntityService',
		'cloudDesktopPinningContextService', 'platformWizardDialogService', 'platformTranslateService'];

	function modelSimulationTimelineRequestService($injector, $translate, _, moment, schedulingSchedulePinnableEntityService,
		estimateMainPinnableEntityService, cloudDesktopPinningContextService, platformWizardDialogService,
		platformTranslateService) {

		const service = {};

		function TimelineRequest() {
		}

		service.TimelineRequest = TimelineRequest;

		let modelSimulationMasterService = null;
		let modelSimulationTimelineLoadingService = null;

		service.createTimelineRequestFromPinningContext = function (dateKind) {
			const scheduleId = schedulingSchedulePinnableEntityService.getPinned();
			const estimateId = estimateMainPinnableEntityService.getPinned();
			if (scheduleId || estimateId) {
				const modelSimulationMasterService = $injector.get('modelSimulationMasterService');

				return _.assign(new TimelineRequest(), {
					Schedules: scheduleId ? [{
						ScheduleId: scheduleId
					}] : null,
					Estimates: estimateId ? [estimateId] : null,
					DateKind: (function () {
						switch (dateKind) {
							case 'p':
							case 'c':
								return dateKind;
							default:
								return 'c';
						}
					})(),
					Options: modelSimulationMasterService.getContextOptions()
				});
			} else {
				return null;
			}
		};

		service.createItemList = function (includePinningContextItems) {
			function createPinningContextItem(dateKind, dateKindLong) {
				const name = $translate.instant('model.simulation.pinnedSchedAndEst', {
					dateKind: $translate.instant('model.simulation.dateKind' + dateKindLong)
				});
				return {
					id: ':pc-' + dateKind,
					getDisplayName: function () {
						return name;
					},
					getRequest: function () {
						const result = service.createTimelineRequestFromPinningContext(dateKind);
						result.Name = name;
						return result;
					},
					dependsOnPinningContext: true
				};
			}

			if (!modelSimulationMasterService) {
				modelSimulationMasterService = $injector.get('modelSimulationMasterService');
			}

			return _.concat(includePinningContextItems ? [createPinningContextItem('c', 'Current'), createPinningContextItem('p', 'Planned')] : [],
				modelSimulationMasterService.getLoadedTimelines());
		};

		service.isPinningContextSufficient = function () {
			const ctx = cloudDesktopPinningContextService.getContext();
			return _.some(ctx, function (ctxItem) {
				return (ctxItem.token === 'scheduling.main') || (ctxItem.token === 'estimate.main');
			});
		};

		service.createSelectionMenu = function (config) {
			const platformMenuListUtilitiesService = $injector.get('platformMenuListUtilitiesService');
			if (!modelSimulationMasterService) {
				modelSimulationMasterService = $injector.get('modelSimulationMasterService');
			}

			const actualConfig = _.assign({
				dropdown: false,
				updateMenu: function () {
				},
				allowAdd: true
			}, _.isObject(config) ? config : {});

			const privateState = {
				items: service.createItemList(true)
			};

			const menuContainer = platformMenuListUtilitiesService.createFlatItems({
				dropdown: false,
				iconClass: actualConfig.iconClass,
				title: actualConfig.title,
				asRadio: true,
				itemFactory: function (item) {
					return {
						id: item.id,
						caption: item.getDisplayName(),
						getRequest: function () {
							return item.getRequest();
						},
						dependsOnPinningContext: item.dependsOnPinningContext
					};
				},
				updateMenu: actualConfig.updateMenu,
				items: privateState.items
			});

			function pinningContextUpdated() {
				if (_.isArray(privateState.items)) {
					const enablePinningContextItems = service.isPinningContextSufficient();

					menuContainer.menuItem.list.items.forEach(function (mi) {
						if (mi.dependsOnPinningContext) {
							mi.disabled = !enablePinningContextItems;
							if (mi.disabled) {
								if (mi.value === menuContainer.getSelection()) {
									menuContainer.setSelection(null);
								}
							}
						}
					});
				}

				actualConfig.updateMenu();
			}

			cloudDesktopPinningContextService.onSetPinningContext.register(pinningContextUpdated);
			cloudDesktopPinningContextService.onClearPinningContext.register(pinningContextUpdated);
			pinningContextUpdated();

			function simulationsUpdated() {
				privateState.items = service.createItemList(true);
				menuContainer.updateItems(privateState.items);
			}

			modelSimulationMasterService.registerTimelineListChanged(simulationsUpdated);

			const menuItem = (function generateMenuItem() {
				if (actualConfig.dropdown) {
					if (actualConfig.allowAdd) {
						if (!modelSimulationTimelineLoadingService) {
							modelSimulationTimelineLoadingService = $injector.get('modelSimulationTimelineLoadingService');
						}

						return {
							id: 'timelineSelector',
							caption: 'model.simulation.timelineSelector',
							iconClass: 'tlb-icons ico-timeline',
							type: 'dropdown-btn',
							list: {
								showImages: true,
								items: [menuContainer.menuItem, {
									id: 'loadTimeline',
									caption: 'model.simulation.loadTimeline',
									type: 'item',
									fn: function () {
										modelSimulationTimelineLoadingService.loadTimeline().then(function (tl) {
											if (tl) {
												menuContainer.setSelection(tl.id);
											}
										});
									}
								}]
							}
						};
					} else {
						return _.assign(menuContainer.menuItem, {
							id: 'timelineSelector',
							caption: 'model.simulation.timelineSelector',
							iconClass: 'tlb-icons ico-timeline',
							type: 'dropdown-btn',
						});
					}
				} else {
					return menuContainer.menuItem;
				}
			})();

			return {
				menuItem: menuItem,
				getSelection: function () {
					const selItemId = menuContainer.getSelection();
					const selMenuItem = _.find(privateState.items, function (item) {
						return item.id === selItemId;
					});
					if (selMenuItem) {
						return selMenuItem.getRequest();
					} else {
						return null;
					}
				},
				registerSelectionChanged: function (handler) {
					menuContainer.registerSelectionChanged(handler);
				},
				unregisterSelectionChanged: function (handler) {
					menuContainer.unregisterSelectionChanged(handler);
				},
				destroy: function () {
					cloudDesktopPinningContextService.onSetPinningContext.unregister(pinningContextUpdated);
					cloudDesktopPinningContextService.onClearPinningContext.unregister(pinningContextUpdated);
					modelSimulationMasterService.unregisterTimelineListChanged(simulationsUpdated);
				}
			};
		};

		service.createSelectionWizardStep = function (modelPrefix, settings) {
			const actualSettings = _.assign({
				model: 'simulation',
				title: $translate.instant('model.simulation.timelineSelectorStep'),
				topDescription: $translate.instant('model.simulation.timelineSelectorStepDesc')
			}, _.isObject(settings) ? settings : {});

			platformTranslateService.translateObject(actualSettings, [
				'title',
				'topDescription'
			], {
				recursive: false
			});

			return _.assign(platformWizardDialogService.createListStep({
				title: actualSettings.title,
				topDescription: actualSettings.topDescription,
				model: modelPrefix + actualSettings.model
			}), {
				prepareStep: function (info) {
					_.set(info.model, modelPrefix + actualSettings.model + '.selectionListConfig', {
						columns: [{
							id: 'desc',
							field: 'name',
							name: $translate.instant('cloud.common.entityDescription'),
							formatter: 'description',
							sortable: false,
							width: 500
						}]
					});

					const modelObj = _.get(info.model, modelPrefix + actualSettings.model);
					if (!_.isArray(modelObj.items)) {
						if (!modelSimulationMasterService) {
							modelSimulationMasterService = $injector.get('modelSimulationMasterService');
						}
						modelObj.items = _.map(service.createItemList(service.isPinningContextSufficient()), function (item) {
							return {
								id: item.id,
								name: item.getDisplayName(),
								getRequest: function () {
									return item.getRequest();
								}
							};
						});

						modelObj.getSelectedTimelineRequest = function () {
							const selItem = _.find(modelObj.items, function (tl) {
								return tl.id === modelObj.selectedId;
							});
							if (selItem) {
								return selItem.getRequest();
							}
							return null;
						};
					}
				}
			});
		};

		return service;
	}
})(angular);
