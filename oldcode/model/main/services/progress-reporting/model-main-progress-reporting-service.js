/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainProgressReportingService
	 * @function
	 *
	 * @description Provides routines related to model object-based progress reporting.
	 */
	angular.module('model.main').factory('modelMainProgressReportingService', ['_', 'modelViewerObjectTreeService',
		'modelViewerCompositeModelObjectSelectionService', '$http', 'moment', 'estimateMainPinnableEntityService',
		'mainViewService', '$injector', 'modelViewerFilterDefinitionService', 'modelViewerModelSelectionService',
		'modelViewerObjectIdMapService', 'modelViewerModelIdSetService', '$q', 'platformModalFormConfigService',
		'platformTranslateService', 'platformDataServiceSelectionOrderService', 'platformGridDialogService',
		'platformDialogService',
		function (_, modelViewerObjectTreeService, modelViewerCompositeModelObjectSelectionService, $http, moment,
		          estimateMainPinnableEntityService, mainViewService, $injector, modelViewerFilterDefinitionService,
		          modelViewerModelSelectionService, modelViewerObjectIdMapService, modelViewerModelIdSetService, $q,
		          platformModalFormConfigService, platformTranslateService, platformDataServiceSelectionOrderService,
		          platformGridDialogService, platformDialogService) {
			var service = {};

			function getModuleConfig(moduleName) {
				switch (moduleName) {
					case 'model.main':
						return function () {
							return [{
								dataService: 'modelMainEstLineItem2ObjectService',
								propName: 'LineItemIds',
								mappingFunc: function (item) {
									return {
										PKey1: item.EstHeaderFk,
										Id: item.EstLineItemFk
									};
								}
							}];
						};
					case 'scheduling.main':
						return function () {
							return [{
								dataService: 'schedulingMainService',
								propName: 'ActivityIds',
								mappingFunc: function (item) {
									return item.Id;
								}
							}];
						};
					case 'estimate.main':
						return function () {
							return [{
								dataService: 'estimateMainService',
								propName: 'LineItemIds',
								mappingFunc: function (item) {
									return {
										PKey1: item.EstHeaderFk,
										Id: item.Id
									};
								}
							}];
						};
				}
				return null;
			}

			function pickMostRecentlySelected (configs) {
				var svcById = {};
				configs.forEach(function (svc) {
					svcById[svc.dataService] = svc;
				});

				var svcNames = platformDataServiceSelectionOrderService.orderServices(Object.keys(svcById));
				if (svcNames.length > 0) {
					return svcById[svcNames[0]];
				}
			}

			function addIds(args) {
				var moduleConfig = getModuleConfig(mainViewService.getCurrentModuleName());
				if (_.isFunction(moduleConfig)) {
					moduleConfig = moduleConfig();
				}

				if (!_.isArray(moduleConfig)) {
					throw new Error('Feature is not available in this module.');
				}

				for (var i = 0; i < moduleConfig.length; i++) {
					var cfg = moduleConfig[i];
					if (_.isArray(cfg)) {
						cfg = pickMostRecentlySelected(cfg);
					}

					cfg.dataServiceInstance = $injector.get(cfg.dataService);
					var selectedItems = cfg.dataServiceInstance.getSelectedEntities();

					if (!_.isEmpty(selectedItems)) {
						args[cfg.propName] = _.compact(_.map(selectedItems, cfg.mappingFunc));
						return true;
					}
				}

				return false;
			}

			function getProgressReportingMetaData() {
				var dlgConfig = {
					title$tr$: 'model.main.progressReporting.reportCommandTitle',
					dataItem: {
						date: moment().utc(),
						comment: ''
					},
					formConfiguration: {
						fid: 'model.main.progressReporting.metadata',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							label$tr$: 'model.main.progressReporting.date',
							type: 'dateutc',
							model: 'date',
							visible: true,
							sortOrder: 100
						}, {
							gid: 'default',
							label$tr$: 'model.main.progressReporting.comment',
							type: 'comment',
							model: 'comment',
							visible: true,
							sortOrder: 200
						}, {
							gid: 'default',
							label$tr$: 'model.main.progressReporting.ignoreItemSelection',
							type: 'boolean',
							model: 'ignoreItemSelection',
							visible: true,
							sortOrder: 250
						}, {
							gid: 'default',
							label$tr$: 'model.main.progressReporting.overwrite',
							type: 'boolean',
							model: 'overwrite',
							visible: true,
							sortOrder: 300
						}]
					}
				};

				platformTranslateService.translateObject(dlgConfig, 'title');
				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);

				return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
					if (result && result.ok) {
						return result.data;
					} else {
						return $q.reject();
					}
				});
			}

			var lazilyLoadedServices = {};
			function callRefreshOnService(serviceName) {
				var svc = lazilyLoadedServices[serviceName];
				if (!svc) {
					svc = $injector.get(serviceName);
					lazilyLoadedServices[serviceName] = svc;
				}
				svc.callRefresh();
			}

			service.reportProgress = function () {
				var selObjects = modelViewerObjectTreeService.retrieveObjectsByMode({
					objectIds: modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds()
				}, {
					treePart: 'mincl'
				});

				return getProgressReportingMetaData().then(function (metaData) {
					var args = {
						ObjectIds: selObjects.objectIds.useGlobalModelIds().toCompressedString(),
						EstHeaderId: estimateMainPinnableEntityService.getPinned(),
						Date: moment(metaData.date).format(),
						Remark: metaData.comment,
						Overwrite: metaData.overwrite
					};

					if (!metaData.ignoreItemSelection) {
						addIds(args);
					}

					return $http.post(globals.webApiBaseUrl + 'model/main/object/reportprogress', args).then(function (response) {
						if (_.isEmpty(_.get(response, 'data.ChangedQuantitiesByEstimate'))) {
							return platformDialogService.showMsgBox('model.main.progressReporting.doneEmptyResultsDesc', 'model.main.progressReporting.doneTitle', 'info');
						} else {
							updateReportedProgressFilter();
							callRefreshOnService('estimateMainLineItem2MdlObjectService');
							callRefreshOnService('estimateMainLineItemQuantityService');

							response.data.ChangedQuantitiesByEstimate.forEach(function (item) {
								item.id = item.Id.Id;
							});

							var cols = [{
								id: 'estCode',
								name$tr$: 'cloud.common.entityCode',
								formatter: 'description',
								field: 'Code',
								width: 160
							}, {
								id: 'estDescription',
								name$tr$: 'cloud.common.entityDescription',
								formatter: 'translation',
								field: 'DescriptionInfo',
								width: 220
							}, {
								id: 'count',
								name$tr$: 'model.main.progressReporting.quantityCount',
								formatter: 'integer',
								field: 'Value',
								width: 200
							}];

							return platformGridDialogService.showDialog({
								columns: cols,
								items: response.data.ChangedQuantitiesByEstimate,
								idProperty: 'id',
								tree: false,
								headerText$tr$: 'model.main.progressReporting.doneTitle',
								topDescription$tr$: 'model.main.progressReporting.doneDesc',
								isReadOnly: true,
								width: '480px'
							});
						}
					}, function operationFailed (reason) {
						return platformDialogService.showDialog({
							headerText$tr$: 'model.main.progressReporting.failedTitle',
							bodyText$tr$: 'model.main.progressReporting.failedDesc',
							bodyText$tr$param$: {
								message: reason
							},
							showOkButton: true,
							iconClass: 'error'
						}).then(function () {
							return $q.reject();
						});
					}).then(function () {
						return {
							success: true
						};
					}, function () {
						return {
							success: false
						};
					});
				}, function operationCancelled () {
					return {
						success: false
					};
				});
			};

			service.createProgressReportingButton = function () {
				if (getModuleConfig(mainViewService.getCurrentModuleName())) {
					return {
						id: 'reportProgress',
						type: 'item',
						caption: 'model.viewer.reportProgress',
						iconClass: 'tlb-icons ico-progress-reporting',
						fn: function () {
							service.reportProgress();
						},
						disabled: function () {
							return modelViewerCompositeModelObjectSelectionService.isSelectionEmpty();
						}
					};
				} else {
					return null;
				}
			};

			function ReportedProgressFilter() {
				modelViewerFilterDefinitionService.LazyFilter.call(this, function evaluateProgressReportingFilter (results) {
					var modelId = modelViewerModelSelectionService.getSelectedModelId();
					var treeInfo = modelViewerObjectTreeService.getTree();
					if (modelId && treeInfo) {
						var prms = {
							ModelId: modelId,
							EstHeaderId: estimateMainPinnableEntityService.getPinned()
						};

						$http.post(globals.webApiBaseUrl + 'model/main/object/meshesByProgress', prms).then(function reportedProgressResults (response) {
							if (_.isArray(response.data)) {
								var resultData = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
									var modelTreeInfo = treeInfo[subModelId];
									return new modelViewerObjectIdMapService.ObjectIdMap(modelTreeInfo.allMeshIds(), 'e');
								});
								response.data.forEach(function (progress) {
									var val = (function () {
										if (progress.Progress <= 0) {
											return 'n';
										} else if (progress.Progress >= 100) {
											return 'c';
										} else {
											return '%';
										}
									})();
									var ids = modelViewerModelIdSetService.createFromCompressedStringWithArrays(progress.Ids).useSubModelIds();
									resultData.assign(ids, val);
								});
								results.updateMeshStates(resultData);
							} else {
								results.excludeAll();
							}
						}, function reportedProgressResultsUnavailable () {
							results.excludeAll();
						});
					} else {
						results.excludeAll();
					}
				});
			}
			ReportedProgressFilter.prototype = Object.create(modelViewerFilterDefinitionService.LazyFilter.prototype);
			ReportedProgressFilter.prototype.constructor = ReportedProgressFilter;

			service.ReportedProgressFilter = ReportedProgressFilter;

			ReportedProgressFilter.prototype.getDescriptors = function () {
				return [{
					type: 'reportedProgress'
				}];
			};

			ReportedProgressFilter.prototype.getStateDescArguments = function () {
				return this.countByMeshState(true, true);
			};


			var modelViewerStandardFilterService = null;

			function updateReportedProgressFilter() {
				if (!modelViewerStandardFilterService) {
					modelViewerStandardFilterService = $injector.get('modelViewerStandardFilterService');
				}
				modelViewerStandardFilterService.getFilterById('reportedProgress').update();
			}

			platformDataServiceSelectionOrderService.registerOrderChanged(function () {
				updateReportedProgressFilter();
			});

			service.activateForModule = function () {
				var moduleConfig = getModuleConfig(mainViewService.getCurrentModuleName());
				if (_.isFunction(moduleConfig)) {
					moduleConfig = moduleConfig();
				}

				if (!_.isArray(moduleConfig)) {
					return;
				}

				_.flatten(moduleConfig).forEach(function (cfg) {
					platformDataServiceSelectionOrderService.watchService(cfg.dataService);
				});
			};

			return service;
		}]);
})(angular);
