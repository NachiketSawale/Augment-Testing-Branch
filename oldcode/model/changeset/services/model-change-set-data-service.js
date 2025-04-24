/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.changeset';

	/**
     * @ngdoc service
     * @name model.changeset.modelChangeSetDataService
     * @function
     *
     * @description Manages the list of change sets.
     */
	angular.module(moduleName).factory('modelChangeSetDataService', modelChangeSetDataService);

	modelChangeSetDataService.$inject = ['_', '$q', 'platformDataServiceFactory',
		'modelViewerModelSelectionService', '$interval', '$http', 'modelViewerStandardFilterService', '$translate',
		'modelProjectSelectedModelInfoService', 'modelChangeSetJobActionProcessor',
		'basicsCommonFileDownloadService', 'cloudDesktopSidebarService'];

	function modelChangeSetDataService(_, $q, platformDataServiceFactory, modelViewerModelSelectionService, $interval, $http,
		modelViewerStandardFilterService, $translate, modelProjectSelectedModelInfoService,
		modelChangeSetJobActionProcessor, basicsCommonFileDownloadService, cloudDesktopSidebarService) {

		const state = {
			unfinishedComparisons: [],
			activeConsumerCount: 0,
			updateRequest: null,
			waitingRequests: []
		};

		function doProcessItem(changeSet) {
			changeSet.CompoundId = changeSet.ModelFk + '/' + changeSet.Id;
			changeSet.selModelRole = (changeSet.ModelFk === modelViewerModelSelectionService.getSelectedModelId() ? 'm' : 'c');

			const isFinished = !_.isNil(changeSet.ChangeSetStatusFk) && (changeSet.ChangeSetStatusFk >= 3);
			if (!isFinished) {
				state.unfinishedComparisons.push({
					modelId: changeSet.ModelFk,
					id: changeSet.Id
				});
			}

			const canShowLog = isFinished && _.isInteger(changeSet.LogFileArchiveDocFk);
			changeSet.StoredLog = {
				actionList: [{
					toolTip: $translate.instant('model.changeset.downloadLog'),
					icon: 'tlb-icons ico-download',
					callbackFn: canShowLog ? function doDownloadLog() {
						basicsCommonFileDownloadService.download(changeSet.LogFileArchiveDocFk);
					} : null,
					readonly: !canShowLog
				}]
			};
		}

		const modelChangeSetServiceOption = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'modelChangeSetDataService',
				entityNameTranslationID: 'model.main.entityChangeSet',
				httpRead: {
					route: globals.webApiBaseUrl + 'model/changeset/',
					endRead: 'filtered',
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						const selModelId = modelViewerModelSelectionService.getSelectedModelId();
						if (selModelId) {
							filterRequest.furtherFilters = [{Token: 'MDL_MODEL', Value: selModelId}];
						}
					},
					usePostForRead: true
				},
				httpDelete: {
					route: globals.webApiBaseUrl + 'model/changeset/'
				},
				actions: {
					create: false,
					delete: true
				},
				dataProcessor: [{
					processItem: doProcessItem
				}, modelChangeSetJobActionProcessor],
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						useCurrentClient: true,
						includeNonActiveItems: false,
						showOptions: true,
						pinningOptions: {
							isActive: true,
							suppressButton: true,
							showPinningContext: [
								{token: 'project.main', show: true},
								{token: 'model.main', show: true}
							]
						},
						showProjectContext: false,
						withExecutionHints: false
					}
				},
				entityRole: {
					root: {
						codeField: null,
						descField: 'DescriptionInfo.Translated',
						itemName: 'ChangeSet',
						moduleName: 'cloud.desktop.moduleDisplayNameModelChangeSet',
						useIdentification: true
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(modelChangeSetServiceOption, this);
		const service = serviceContainer.service;

		service.registerListLoaded(function () {
			if (state.activeConsumerCount > 0) {
				enableJobStatusUpdates();
			}
		});

		function updateItemStatus(item, newStatus) {
			if (item.ChangeSetStatusFk !== newStatus) {
				item.updateStatus(newStatus);
				if (item.ChangeSetStatusFk >= 3) {
					const currentIndex = _.findIndex(state.unfinishedComparisons, {
						modelId: item.ModelFk,
						id: item.Id
					});
					if (currentIndex >= 0) {
						state.unfinishedComparisons.splice(currentIndex, 1);
					}
					$http.get(globals.webApiBaseUrl + 'model/changeset/byId', {
						params: {
							modelId: item.ModelFk,
							changeSetId: item.Id
						}
					}).then(function (response) {
						const newItem = response.data;
						if (!newItem) {
							throw new Error('Failed to load change set.');
						}

						item.ChangeCount = newItem.ChangeCount;
						item.LogFileArchiveDocFk = newItem.LogFileArchiveDocFk;
						doProcessItem(item);
						serviceContainer.data.mergeItemAfterSuccessfullUpdate(item, item, true, serviceContainer.data);
					});
				}
				return true;
			} else {
				return false;
			}
		}

		function enableJobStatusUpdates() {
			if (state.unfinishedComparisons.length > 0) {
				if (!state.updateRequest) {
					state.updateRequest = $interval(function () {
						$http.post(globals.webApiBaseUrl + 'model/changeset/getstatus', state.unfinishedComparisons).then(function (response) {
							const states = response.data;
							const items = serviceContainer.data.itemList;
							let isChanged = false;

							if (angular.isArray(states)) {
								states.forEach(function (statusInfo) {
									const item = _.find(items, {
										ModelFk: statusInfo.modelId,
										Id: statusInfo.id
									});
									if (item) {
										if (updateItemStatus(item, statusInfo.changeSetStatusFk)) {
											isChanged = true;
										}
									}
								});
							}

							if (isChanged) {
								serviceContainer.data.mergeItemAfterSuccessfullUpdate(isChanged, isChanged, true, serviceContainer.data);
								if (state.unfinishedComparisons.length <= 0) {
									disableJobStatusUpdates();
								}
							}
						});
					}, 10000);
				}
			}
		}

		function disableJobStatusUpdates() {
			if (state.updateRequest) {
				$interval.cancel(state.updateRequest);
				state.updateRequest = null;
			}
		}

		service.addActiveConsumer = function () {
			state.activeConsumerCount++;
			if (state.activeConsumerCount === 1) {
				enableJobStatusUpdates();
			}
		};

		service.removeActiveConsumer = function () {
			state.activeConsumerCount--;
			if (state.activeConsumerCount <= 0) {
				state.activeConsumerCount = 0;
				disableJobStatusUpdates();
			}
		};

		service.addChangeSet = function (cs) {
			cs.selModelRole = (cs.ModelFk === modelViewerModelSelectionService.getSelectedModelId() ? 'm' : 'c');
			serviceContainer.data.itemList.push(cs);
			modelChangeSetServiceOption.flatRootItem.dataProcessor.forEach(function (dp) {
				dp.processItem(cs);
			});
			serviceContainer.data.listLoaded.fire();
			serviceContainer.service.setSelectedEntities([cs]);
			serviceContainer.service.setSelected(cs);
		};

		service.registerSelectionChanged(modelViewerStandardFilterService.updateMainEntityFilter);

		service.getTemporaryModelId = function (modelId, changeSetId) {
			if (arguments.length <= 0) {
				const selChangeSet = service.getSelected();
				if (selChangeSet) {
					modelId = selChangeSet.ModelFk;
					changeSetId = selChangeSet.Id;
				} else {
					return $q.resolve(null);
				}
			}

			return $http.get(globals.webApiBaseUrl + 'model/changeset/tmpmodel', {
				params: {
					modelId: modelId,
					changeSetId: changeSetId
				}
			}).then(function (response) {
				return _.isNumber(response.data) ? response.data : null;
			});
		};

		service.enrichTemporaryModelInfo = function (mInfo) {
			if (mInfo) {
				if (_.isArray(mInfo.subModels)) {
					if (mInfo.subModels.length === 2) {
						mInfo._generatedNiceName = $translate.instant('model.changeset.modelNamePattern', {
							name1: mInfo.subModels[0].info.getNiceName(),
							name2: mInfo.subModels[1].info.getNiceName()
						});
						mInfo.info.getNiceName = function () {
							return mInfo._generatedNiceName;
						};
					}

					mInfo.subModels.forEach(function (smInfo, index) {
						smInfo.info.getNiceName = function () {
							return $translate.instant('model.changeset.subModelNamePattern', {
								index: index + 1,
								name: modelProjectSelectedModelInfoService.ModelInfo.prototype.getNiceName.call(this)
							});
						};
					});
				}
			}
			return mInfo;
		};

		function selectAfterNavigation(item, triggerField) {
			if (item && triggerField && triggerField === 'Ids'){
				const ids = item.Ids.split(',').map(e => parseInt(e));
				cloudDesktopSidebarService.filterSearchFromPKeys(ids);
			}
		}
		service.selectAfterNavigation = selectAfterNavigation;

		return service;
	}
})(angular);
