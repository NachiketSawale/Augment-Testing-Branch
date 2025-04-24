/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainViewerLegendDataService
	 * @function
	 *
	 * @description Loads model object attributes.
	 */
	angular.module('model.main').service('modelMainViewerLegendDataService', ['_', 'platformDataServiceFactory',
		'modelViewerViewerRegistryService', '$translate', 'platformObservableService',
		'modelViewerModelSelectionService', 'modelViewerCompositeModelObjectSelectionService',
		function (_, platformDataServiceFactory, modelViewerViewerRegistryService, $translate,
		          platformObservableService, modelViewerModelSelectionService,
		          modelViewerCompositeModelObjectSelectionService) {
			var idGeneratorProcessor = {
				nextId: 1,
				processItem: function (item) {
					item.Id = this.nextId;
					this.nextId++;
				}
			};

			var serviceContainer;

			var state = {
				viewers: [],
				activeViewer: null,
				menus: [],
				getActiveViewerValue: function () {
					return state.activeViewer ? ('v:' + state.activeViewer.id) : '-';
				},
				setActiveViewer: function (viewerInfo) {
					state.activeViewer = viewerInfo;
					state.menus.forEach(function (m) {
						m.updateSelection();
					});
					serviceContainer.service.load();
				}
			};

			var modelViewerLegendServiceOption = {
				hierarchicalRootItem: {
					module: angular.module('model.main'),
					serviceName: 'modelMainViewerLegendDataService',
					entityNameTranslationID: 'model.main.viewerLegend.entity',
					dataProcessor: [idGeneratorProcessor],
					httpRead: {
						route: globals.webApiBaseUrl + 'model/main/viewerlegend/',
						endRead: 'get',
						usePostForRead: true,
						initReadData: function (readData) {
							idGeneratorProcessor.nextId = 1;

							if (state.activeViewer) {
								var fe = state.activeViewer.getFilterEngine();
								if (fe) {
									_.assign(readData, {
										FallbackHighlightingSchemeFk: fe.getDefaultStaticHighlightingScheme(),
										FilterDescriptors: fe.getActiveFilter().getDescriptors()
									});
								}
							}
						}
					},
					actions: {
						delete: false,
						create: false
					},
					modification: 'none',
					presenter: {
						tree: {
							incorporateDataRead: function (result, data) {
								result.forEach(function (item) {
									item.image = 'ico-blank';
								});

								var colorGroups = _.groupBy(result, function (item) {
									return item.Color;
								});
								var treeResult = _.map(Object.keys(colorGroups), function (groupKey) {
									var group = colorGroups[groupKey];
									if (group.length === 1) {
										return group[0];
									} else {
										var cl = group[0].Color;
										var result = {
											Id: 'g' + cl,
											Color: cl,
											image: 'ico-blank',
											Text: ''
										};
										group.forEach(function (item, index) {
											item.Id = 'g' + cl + '_' + index;
											item.parentItem = result;
											item.Color = null;
										});
										result.subItems = group;
										return result;
									}
								});
								return serviceContainer.data.handleReadSucceeded(treeResult, data);
							}
						}
					}
				}
			};

			serviceContainer = platformDataServiceFactory.createService(modelViewerLegendServiceOption, this);

			function updateViewerList() {
				function doReload() {
					serviceContainer.service.load();
				}

				var prevSelectedViewer = state.activeViewer;

				state.viewers = _.filter(modelViewerViewerRegistryService.getViewers(), function (viewerInfo) {
					return viewerInfo.isReady();
				});
				if (prevSelectedViewer) {
					state.activeViewer = _.find(state.viewers, function (v) {
						return v.id === prevSelectedViewer.id;
					});
				}
				if (!state.activeViewer && (state.viewers.length > 0)) {
					state.activeViewer = state.viewers[0];
				}

				state.menus.forEach(function (m) {
					m.updateItems();
				});
				if (state.activeViewer !== prevSelectedViewer) {
					var fe;
					if (prevSelectedViewer) {
						fe = prevSelectedViewer.getFilterEngine();
						if (fe) {
							fe.unregisterFilterUpdated(doReload);
						}
					}
					if (state.activeViewer) {
						fe = state.activeViewer.getFilterEngine();
						if (fe) {
							fe.registerFilterUpdated(doReload);
						}
					}

					state.menus.forEach(function (m) {
						m.updateSelection();
					});

					loadForActiveViewer();
				}
			}

			modelViewerViewerRegistryService.onViewersChanged.register(updateViewerList);
			modelViewerViewerRegistryService.registerViewerReadinessChanged(updateViewerList);

			serviceContainer.service.registerListLoaded(function enrichLoadedList() {
				if (state.activeViewer) {
					var fe = state.activeViewer.getFilterEngine();
					if (fe) {
						var activeFilter = fe.getActiveFilter();
						if (activeFilter) {
							if (_.isArray(serviceContainer.data.itemList)) {
								var allItems = _.flatten(_.map(serviceContainer.data.itemList, function (item) {
									var mainItem = (!_.isNil(item.ObjectState) || item.RuleFk) ? [item] : [];
									var subItems = _.isArray(item.subItems) ? item.subItems : [];
									return _.concat(mainItem, subItems);
								}));

								var meshCount = activeFilter.countByMeshInfoGroup();
								var notAvailableMsg = $translate.instant('model.main.meshCountNotAvailable');

								allItems.forEach(function (item) {
									if (meshCount) {
										var count;
										if (!_.isNil(item.ObjectState)) {
											count = meshCount[item.ObjectState];
										} else if (!_.isNil(item.RuleFk)) {
											count = meshCount[item.RuleFk.PKey1 + '/' + item.RuleFk.Id];
										}
										item.MeshCount = _.isNumber(count) ? count : 0;
									} else {
										item.MeshCount = notAvailableMsg;
									}
								});
							}
						}
					}
				}
			});

			serviceContainer.service.createViewerMenu = function (config) {
				function createItems() {
					return _.map(state.viewers, function (viewerInfo) {
						return {
							id: 'v:' + viewerInfo.id,
							caption: viewerInfo.getDisplayName(),
							iconClass: viewerInfo.iconClass,
							value: 'v:' + viewerInfo.id,
							type: 'radio',
							viewerInfo: viewerInfo,
							fn: function () {
								state.setActiveViewer(viewerInfo);
							}
						};
					});
				}

				var menuController = {
					updateTools: _.isFunction(config.updateTools) ? config.updateTools : function () {
					}
				};

				var result = {
					menuItem: {
						id: 'viewerGroup',
						type: 'sublist',
						list: {
							cssClass: 'radio-group',
							showTitles: true,
							activeValue: state.getActiveViewerValue(),
							items: createItems()
						}
					},
					destroy: function () {
						_.remove(state.menus, function (m) {
							return m === menuController;
						});
					}
				};

				menuController.updateSelection = function () {
					result.menuItem.list.activeValue = state.getActiveViewerValue();
					menuController.updateTools();
				};

				menuController.updateItems = function () {
					result.menuItem.list.items = createItems();
					menuController.updateTools();
				};

				state.menus.push(menuController);

				return result;
			};

			serviceContainer.service.updateModelSelection = platformObservableService.createObservableBoolean();
			serviceContainer.service.updateModelSelection.uiHints = {
				id: 'toggleObjectSelection',
				caption$tr$: 'model.main.viewerLegend.selectMeshes',
				iconClass: 'tlb-icons ico-view-select'
			};

			function updateModelSelectionIfRequired() {
				if (serviceContainer.service.updateModelSelection.getValue()) {
					var selModelId = modelViewerModelSelectionService.getSelectedModelId();
					if (selModelId) {
						var selItems = serviceContainer.service.getSelectedEntities();
						if (!_.isEmpty(selItems)) {
							if (state.activeViewer) {
								var fe = state.activeViewer.getFilterEngine();
								if (fe) {
									var activeFilter = fe.getActiveFilter();
									if (activeFilter) { /* jshint ignore:line */ // It's not going to be better with more indirection.
										var groupIds = _.compact(_.map(selItems, function (selItem) {
											if (_.isString(selItem.ObjectState)) {
												return selItem.ObjectState;
											} else if (selItem.RuleFk) {
												return selItem.RuleFk.PKey1 + '/' + selItem.RuleFk.Id;
											} else {
												return null;
											}
										}));
										var meshIds = activeFilter.getByMeshInfoGroup(groupIds);
										meshIds = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
											var modelMeshIds = meshIds[subModelId];
											if (modelMeshIds) {
												return modelMeshIds.mapValues(Boolean);
											}
										});
										modelViewerCompositeModelObjectSelectionService.setSelectedMeshIds(meshIds);
									}
								}
							}
						}
					}
				}
			}

			serviceContainer.service.updateModelSelection.registerValueChanged(updateModelSelectionIfRequired);
			serviceContainer.service.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);

			updateViewerList();

			function loadForActiveViewer() {
				if (state.activeViewer) {
					var fe = state.activeViewer.getFilterEngine();
					if (fe) {
						if (fe.getActiveFilter()) {
							serviceContainer.service.load();
							return true;
						}
					}
				}
				serviceContainer.service.setList([]);
				return false;
			}

			loadForActiveViewer();
		}]);
})(angular);
