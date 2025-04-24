/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsFilterEngineService
	 * @function
	 *
	 * @description Provides a filter engine object that applies filter results to a HOOPS viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsFilterEngineService', ['_', 'modelViewerObjectIdMapService',
		'modelViewerModelSelectionService', '$q', 'modelViewerObjectTreeService', 'modelViewerModelIdSetService',
		'modelViewerHoopsHighlightingPropertyService', 'modelViewerHoopsLinkService',
		'modelAdministrationRuntimeHlSchemeService', 'modelViewerModelSettingsService',
		'modelViewerBlacklistingService', 'modelViewerSelectabilityService', 'PlatformMessenger',
		'basicsCommonDrawingUtilitiesService',
		function (_, modelViewerObjectIdMapService, modelViewerModelSelectionService, $q, modelViewerObjectTreeService,
		          modelViewerModelIdSetService, modelViewerHoopsHighlightingPropertyService,
		          modelViewerHoopsLinkService, modelAdministrationRuntimeHlSchemeService,
		          modelViewerModelSettingsService, modelViewerBlacklistingService, modelViewerSelectabilityService,
		          PlatformMessenger, basicsCommonDrawingUtilitiesService) {
			var service = {};

			function FilterProcess(engineState) {
				this.isAborted = false;
				this.allInvalid = false;
				this.invalidMeshIds = {};
				this.invalidGlobalValues = {};
				this.processingFinishedPromise = null;
				this.hwv = engineState.hwv;
				this.isPrepared = false;
				this.applyStarted = false;

				this.engineState = engineState;
			}

			FilterProcess.prototype.areAllMeshesValid = function () {
				return !this.allInvalid && !this.invalidMeshIds;
			};

			FilterProcess.prototype.areGlobalValuesValid = function () {
				return !this.allInvalid && !this.invalidGlobalValues;
			};

			FilterProcess.prototype.addInvalidationInfoFrom = function (source) {
				if (!this.allInvalid) {
					if (source.allInvalid) {
						this.allInvalid = true;
						this.invalidMeshIds = {};
					} else if (source.invalidMeshIds) {
						var that = this;
						Object.keys(source.invalidMeshIds).forEach(function (subModelId) {
							subModelId = parseInt(subModelId);
							var ownModelInvalidMeshIds = that.invalidMeshIds[subModelId];
							if (ownModelInvalidMeshIds) {
								_.assign(ownModelInvalidMeshIds, source.invalidMeshIds[subModelId]);
							} else {
								that.invalidMeshIds[subModelId] = source.invalidMeshIds[subModelId];
							}
						});
					}
				}
				_.assign(this.invalidGlobalValues, source.invalidGlobalValues);
			};

			FilterProcess.prototype.getForEachRelevantSubModelFunc = function () {
				if (this.allInvalid) {
					return function (subModelF) {
						var treeInfo = modelViewerObjectTreeService.getTree();
						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelTreeInfo = treeInfo[subModelId];
							if (modelTreeInfo) {
								var meshIds = modelTreeInfo.allMeshIds();
								if (!_.isEmpty(meshIds)) {
									subModelF(subModelId, function (meshF) {
										meshIds.forEach(function (meshId) {
											meshF(meshId);
										});
									});
								}
							}
						});
					};
				} else if (this.invalidMeshIds) {
					var that = this;
					return function (subModelF) {
						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var meshIds;
							var modelInvalidMeshIds = that.invalidMeshIds[subModelId];
							if (modelInvalidMeshIds) {
								meshIds = _.map(Object.keys(modelInvalidMeshIds), function (meshId) {
									return parseInt(meshId);
								});
								if (!_.isEmpty(meshIds)) {
									subModelF(subModelId, function (meshF) {
										meshIds.forEach(function (meshId) {
											meshF(meshId);
										});
									});
								}
							}
						});
					};
				} else {
					return function () {};
				}
			};

			FilterProcess.prototype.prepare = function (config) {
				var that = this;

				modelViewerSelectabilityService.getSelectabilityInfo(that.hwv).prepare();

				return prepareFilterData.call(this, config.activeFilter, config.staticHlSchemeId, config.forceReEvaluation).then(function filterDataPrepared () {
					that.filterData.blacklist = config.blacklist;
					that.globalDefaults = config.globalDefaults;

					that.isPrepared = true;

					if (that.isAborted) {
						return $q.reject();
					}
				});
			};

			FilterProcess.prototype.apply = function (config) {
				if (!_.isObject(this.filterData)) {
					throw new Error('Filter process has not been prepared.');
				}

				var that = this;

				that.applyStarted = true;
				that.addInvalidationInfoFrom(that.engineState);
				return doApplyFilter.call(that, config, that.filterData).then(function filterApplied () {
					return {
						process: that
					};
				});
			};

			FilterProcess.prototype.abort = function () {
				if (this.applyStarted) {
					throw new Error('The process is already applying filter settings and cannot be aborted at this time.');
				}

				this.isAborted = true;
			};

			function prepareHighlightingSchemes(activeFilter, defaultStaticHlSchemeId) {
				var ids = activeFilter.getHighlightingSchemeIds(defaultStaticHlSchemeId);
				ids.push(defaultStaticHlSchemeId);

				var result = [];
				var resultPromises = {};
				ids.forEach(function (hlSchemeId, index) {
					if (hlSchemeId.isDynamic) {
						if (!resultPromises[hlSchemeId.id]) {
							resultPromises[hlSchemeId.id] = modelAdministrationRuntimeHlSchemeService.loadDynamicScheme(hlSchemeId.id);
						}
						resultPromises[hlSchemeId.id] = resultPromises[hlSchemeId.id].then(function (hlScheme) {
							result[parseInt(index)] = hlScheme;
							return hlScheme;
						});
					} else {
						var actualId = _.isNumber(hlSchemeId.id) ? hlSchemeId.id : defaultStaticHlSchemeId;
						if (!resultPromises[actualId]) {
							resultPromises[actualId] = modelAdministrationRuntimeHlSchemeService.loadStaticScheme(actualId);
						}
						resultPromises[actualId] = resultPromises[actualId].then(function (hlScheme) {
							result[parseInt(index)] = hlScheme;
							return hlScheme;
						});
					}
				});

				return $q.all(resultPromises).then(function () {
					return result;
				});
			}

			function makeMeshStatesLayered(meshStates) {
				Object.keys(meshStates).forEach(function (subModelId) {
					subModelId = parseInt(subModelId);
					if (_.isInteger(subModelId)) {
						var modelMeshStates = meshStates[subModelId];
						if (_.isArray(modelMeshStates)) {
							modelMeshStates.forEach(function (meshId) {
								modelMeshStates[meshId] = [modelMeshStates[meshId]];
							});
						} else if (_.isObject(modelMeshStates)) {
							Object.keys(modelMeshStates).forEach(function (meshId) {
								meshId = parseInt(meshId);
								modelMeshStates[meshId] = [modelMeshStates[meshId]];
							});
						}
					}
				});

				if (_.isObject(meshStates.hints)) {
					Object.keys(meshStates.hints).forEach(function (subModelId) {
						subModelId = parseInt(subModelId);
						var modelHints = meshStates.hints[subModelId];
						if (_.isObject(modelHints)) {
							Object.keys(modelHints).forEach(function (meshId) {
								meshId = parseInt(meshId);
								modelHints[meshId] = [modelHints[meshId]];
							});
						}
					});
				}

				meshStates.isLayered = true;
				meshStates.layerCount = 1;
			}

			function prepareFilterData (activeFilter, defaultStaticHlSchemeId, forceReEvaluation) {
				var that = this; // jshint ignore:line

				var filterDataPromises = {
					meshStates: activeFilter.prepareMeshStates(forceReEvaluation),
					hlSchemes: prepareHighlightingSchemes(activeFilter, defaultStaticHlSchemeId)
				};

				return $q.all(filterDataPromises).then(function (filterData) {
					filterData.activeFilter = activeFilter;
					that.filterData = filterData;
				});
			}

			function loadMeshStates () {
				var that = this; // jshint ignore:line

				that.addInvalidationInfoFrom(that.engineState);
				if (that.areAllMeshesValid() && that.areGlobalValuesValid()) {
					that.isAborted = true;
					return;
				}
				that.engineState.setAllMeshesValid();

				that.filterData.meshStates = that.filterData.activeFilter.getMeshStates(that.allInvalid ? null : that.invalidMeshIds);
				that.filterData.blacklistState = that.filterData.blacklist.getState(that.allInvalid ? null : that.invalidMeshIds);

				if (!that.filterData.meshStates.isLayered) {
					that.filterData.meshStates = _.cloneDeep(that.filterData.meshStates);
					makeMeshStatesLayered(that.filterData.meshStates);
				}

				if (that.filterData.meshStates.layerCount !== that.filterData.hlSchemes.length - 1) {
					throw new Error('Layers in filter data and highlighting scheme count do not match.');
				}
			}

			var properties;

			function doApplyFilter (config, filterData) {
				var that = this; // jshint ignore:line

				if (modelViewerHoopsLinkService.isViewerDiscarded(that.hwv)) {
					return $q.resolve();
				}

				loadMeshStates.call(that);

				var forEachRelevantSubModel = that.getForEachRelevantSubModelFunc();

				var allChangeMaps = {
					foundAnyChanges: false
				};

				var displaySettings = modelViewerModelSettingsService.getSettingsPart('displaySettings');

				// determine changed values per highlighting property
				properties.forEach(function (propInfo) {
					var propName = propInfo.getPropertyName();

					var propChangeMap = {
						global: {},
						bySubModel: new modelViewerModelIdSetService.MultiModelIdSet()
					};
					var foundPropChange = false;
					var foundGlobalPropChange = false;

					var previousPropValues = config.previousValues[propName];
					if (!previousPropValues) {
						config.previousValues[propName] = previousPropValues = {
							global: {},
							bySubModel: {}
						};
					}

					propInfo.getGlobalValueNames().forEach(function (globalValueName) {
						if (that.allInvalid || that.invalidGlobalValues[globalValueName]) {
							var newValue = propInfo.getEffectiveGlobalValue(globalValueName, filterData.hlSchemes, {
								defaultValue: that.globalDefaults[globalValueName],
								displaySettings: displaySettings
							});

							var prevValue = previousPropValues.global[globalValueName];
							if (_.isNil(prevValue) || !propInfo.areValuesEqual(prevValue, newValue)) {
								propChangeMap.global[globalValueName] = newValue;
								previousPropValues.global[globalValueName] = newValue;
								foundGlobalPropChange = true;
							}
						}
					});

					var defaultValues = propInfo.retrieveDefaultValues(that.hwv);

					var blacklistLayerIndex = filterData.meshStates.layerCount;

					forEachRelevantSubModel(function (subModelId, forEachRelevantMeshId) {
						var modelMeshStates = filterData.meshStates[subModelId];
						if (modelMeshStates) {
							var modelHints = _.isObject(filterData.meshStates.hints) ? filterData.meshStates.hints[subModelId] : null;
							var modelChangeMap = propChangeMap.bySubModel[subModelId] = new modelViewerObjectIdMapService.ObjectIdMap();
							var modelPreviousPropValues = previousPropValues.bySubModel[subModelId];
							if (!modelPreviousPropValues) {
								previousPropValues.bySubModel[subModelId] = modelPreviousPropValues = {};
							}
							var modelDefaultValues = _.isObject(defaultValues) ? defaultValues.byMeshIds[subModelId] : null;
							var modelBlacklistState = filterData.blacklistState[subModelId];
							if (!_.isObject(modelBlacklistState)) {
								modelBlacklistState = {};
							}

							forEachRelevantMeshId(function (meshId) {
								var actualMeshStates = modelMeshStates[meshId];
								if (!_.isArray(actualMeshStates)) {
									actualMeshStates = [];
								}
								actualMeshStates[blacklistLayerIndex] = modelBlacklistState[meshId] ? 'b' : null;
								var newValue = propInfo.getEffectiveValue(_.map(actualMeshStates, function (meshState, index) {
									var modelHintsForMesh = _.isObject(modelHints) ? modelHints[meshId] : null;
									var modelHintsForIndex = _.isArray(modelHintsForMesh) ? modelHintsForMesh[index] : null;
									return {
										hlItem: _.isNil(meshState) ? null : filterData.hlSchemes[index].items[meshState],
										hints: _.isObject(modelHintsForIndex) ? modelHintsForIndex : {}
									};
								}), {
									defaultValue: _.isObject(modelDefaultValues) ? modelDefaultValues[meshId] : null,
									displaySettings: displaySettings
								});

								var prevValue = modelPreviousPropValues[meshId];
								if (_.isNil(prevValue) || !propInfo.areValuesEqual(prevValue, newValue)) {
									modelChangeMap[meshId] = newValue;
									modelPreviousPropValues[meshId] = newValue;
									foundPropChange = true;
								}
							});
						}
					});

					if (foundPropChange || foundGlobalPropChange) {
						allChangeMaps[propName] = propChangeMap;
						if (!foundPropChange) {
							propChangeMap.bySubModel = null;
						}
						if (!foundGlobalPropChange) {
							propChangeMap.global = null;
						}
						allChangeMaps.foundAnyChanges = true;
					}
				});

				if (modelViewerHoopsLinkService.isViewerDiscarded(that.hwv)) {
					return $q.resolve();
				}

				// apply found changes
				if (allChangeMaps.foundAnyChanges) {
					return that.hwv.pauseRendering().then(function () {
						var updatePromises = [];

						properties.forEach(function (propInfo) {
							var propName = propInfo.getPropertyName();
							var propChangeMap = allChangeMaps[propName];
							if (propChangeMap) {
								var changeInfo;

								var bySubModelPropChangeMap = propChangeMap.bySubModel;
								if (bySubModelPropChangeMap) {
									changeInfo = {
										viewer: that.hwv,
										changesByMeshId: bySubModelPropChangeMap
									};
									if (propInfo.requiresViewerIds()) {
										var nodesPropChangeMap = {};
										modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
											var modelPropChangeMap = bySubModelPropChangeMap[subModelId];
											if (modelPropChangeMap) {
												Object.keys(modelPropChangeMap).forEach(function (meshId) {
													meshId = parseInt(meshId);
													var nodeId = modelViewerHoopsLinkService.meshToViewerId(that.hwv, {
														subModelId: subModelId,
														meshId: meshId
													});
													if (_.isNumber(nodeId)) {
														nodesPropChangeMap[nodeId] = modelPropChangeMap[meshId];
													}
												});
											}
										});
										changeInfo.changesByViewerId = nodesPropChangeMap;
									}
									updatePromises.push($q.when(propInfo.assignValues(changeInfo, displaySettings)));
								}

								var globalPropChangeMap = propChangeMap.global;
								if (globalPropChangeMap) {
									propInfo.getGlobalValueNames().forEach(function (globalValueName) {
										var newValue = globalPropChangeMap[globalValueName];
										if (!_.isNil(newValue)) {
											changeInfo = {
												viewer: that.hwv,
												globalValueName: globalValueName,
												globalChanges: globalPropChangeMap
											};
											updatePromises.push($q.when(propInfo.assignGlobalValues(changeInfo, displaySettings)));
										}
									});
								}
							}
						});

						return $q.all(updatePromises).then(function () {
							return that.hwv.resumeRendering();
						});
					});
				} else {
					return $q.resolve();
				}
			}

			properties = modelViewerHoopsHighlightingPropertyService.getPropertyInfos();

			var filterEngineProperty = 'rib$filterEngine';

			service.getFilterEngine = function (hwv) {
				return hwv[filterEngineProperty];
			};

			var defaultConstants = {
				bgColor: new basicsCommonDrawingUtilitiesService.RgbColor(255, 255, 255),
				selColor: new basicsCommonDrawingUtilitiesService.RgbColor(255, 255, 0)
			};

			function getState(instance) {
				var result = instance.__state;
				if (!result) {
					result = instance.__state = {
						isDisposed: false,
						allInvalid: true,
						setAllMeshesValid: function () {
							this.allInvalid = false;
							this.invalidMeshIds = null;
							this.invalidGlobalValues = null;
						},
						areAllMeshesValid: function () {
							return !this.allInvalid && !this.invalidMeshIds && !this.invalidGlobalValues;
						},
						previousValues: {},
						options: {
							chunkedUpdates: false
						},
						processes: [],
						activeProcess: null,
						pendingProcess: null,
						currentProcessDeferred: null,
						removeProcess: function (process) {
							var index = _.findIndex(this.processes, function (p) {
								return p === process;
							});
							if (index >= 0) {
								this.processes.splice(index, 1);
								return true;
							} else {
								return false;
							}
						},
						blacklist: new modelViewerBlacklistingService.Blacklist(),
						onFilterUpdated: new PlatformMessenger(),
						globalDefaults: _.clone(defaultConstants)
					};
					result.blacklist.registerUser(instance);
				}
				return result;
			}

			function FilterEngine(hwv) {
				if (!hwv) {
					throw new Error('No HOOPS web viewer supplied.');
				}

				var state = getState(this);
				state.hwv = hwv;

				hwv[filterEngineProperty] = this;

				if (modelViewerModelSelectionService.getSelectedModel().info.isPreview) {
					this.applyFilter = () => $q.when();
				}
			}

			service.FilterEngine = FilterEngine;

			FilterEngine.prototype.setChunkedUpdateMode = function (value) {
				getState(this).options.chunkedUpdates = !!value;
			};

			FilterEngine.prototype.getChunkedUpdateMode = function () {
				return getState(this).options.chunkedUpdates;
			};

			FilterEngine.prototype.invalidateAllMeshes = function () {
				var state = getState(this);
				state.allInvalid = true;
				state.invalidMeshIds = null;
				finishInvalidation.call(this);
			};

			FilterEngine.prototype.invalidateMeshIds = function (meshIds) {
				var state = getState(this);
				if (!state.allInvalid) {
					if (!state.invalidMeshIds) {
						state.invalidMeshIds = modelViewerModelSelectionService.forEachSubModel(function () {
							return new modelViewerObjectIdMapService.ObjectIdMap();
						});
					}

					if (meshIds) {
						modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
							var modelMeshIds = meshIds[subModelId];
							if (_.isArray(modelMeshIds)) {
								state.invalidMeshIds[subModelId].addFromArray(modelMeshIds, true);
							} else if (_.isObject(modelMeshIds)) {
								_.assign(state.invalidMeshIds[subModelId], modelMeshIds);
							}
						});
					}
				}
				finishInvalidation.call(this);
			};

			FilterEngine.prototype.invalidateGlobalValue = function (globalValueName) {
				var state = getState(this);
				if (!state.invalidGlobalValues) {
					state.invalidGlobalValues = {};
				}
				state.invalidGlobalValues[globalValueName] = true;
				finishInvalidation.call(this);
			};

			function finishInvalidation() {
				var that = this; // jshint ignore:line

				var state = getState(that);
				if (state.processes.length <= 0) {
					that.applyFilter();
				}
			}

			FilterEngine.prototype.applyFilter = function (forceReEvaluation) {
				var state = getState(this);
				if (!state.activeFilter || !state.staticHlSchemeId) {
					return $q.resolve();
				}

				if (!state.currentProcessDeferred) {
					var deferred = $q.defer();
					state.currentProcessDeferred = {
						resolve: function () {
							deferred.resolve();
						},
						reject: function () {
							deferred.reject();
						},
						promise: deferred.promise.then(function () {
							state.currentProcessDeferred = null;
						}, function () {
							state.currentProcessDeferred = null;
							return $q.reject();
						})
					};
				}

				var newProcess = new FilterProcess(state);
				var deleteCount = (function countDeletableProcesses () {
					var result = 0;
					for (var i = state.processes.length - 1; i >= 0; i--) {
						var proc = state.processes[i];
						if (proc.applyStarted) {
							break;
						} else {
							proc.abort();
							result++;
						}
					}
					return result;
				})();
				state.processes.splice(state.processes.length - deleteCount, deleteCount, newProcess);

				var that = this;
				newProcess.prepare({
					activeFilter: state.activeFilter,
					blacklist: state.blacklist,
					staticHlSchemeId: state.staticHlSchemeId,
					globalDefaults: state.globalDefaults,
					forceReEvaluation: forceReEvaluation
				}).then(function processPreparationDone () {
				}, function processPreparationAborted () {
					state.removeProcess(newProcess);
				}).then(function applyIfRequired () {
					if (state.processes.some(function (p) {
						return p.applyStarted || !p.isPrepared;
					})) {
						return;
					}

					var firstReadyProcess = _.find(state.processes, function (p) {
						return p.isPrepared;
					});
					if (firstReadyProcess) {
						firstReadyProcess.apply({
							previousValues: state.previousValues
						}).then(function applyFinished () {
							state.removeProcess(firstReadyProcess);
							return applyIfRequired();
						});
					} else {
						if (state.currentProcessDeferred) {
							state.onFilterUpdated.fire(that);
							state.currentProcessDeferred.resolve();
						} else {
							if (!state.isDisposed) {
								console.log('WARNING: null at FilterEngine 538');
							}
						}
					}
				});

				return state.currentProcessDeferred.promise;
			};

			FilterEngine.prototype.activateFilter = function (filter) {
				if (!filter) {
					throw new Error('No filter object supplied.');
				}

				var state = getState(this);

				if (state.activeFilter !== filter) {
					if (state.activeFilter) {
						state.activeFilter.unregisterUser(this);
					}

					state.activeFilter = filter;

					filter.registerUser(this);
					this.invalidateAllMeshes();
					this.applyFilter();
				}
			};

			FilterEngine.prototype.getActiveFilter = function () {
				var state = getState(this);
				return state.activeFilter;
			};

			FilterEngine.prototype.setDefaultStaticHighlightingScheme = function (staticHlSchemeId) {
				if (!staticHlSchemeId) {
					throw new Error('No static highlighting scheme ID supplied.');
				}

				var state = getState(this);

				if (state.staticHlSchemeId !== staticHlSchemeId) {
					state.staticHlSchemeId = staticHlSchemeId;
					this.invalidateAllMeshes();
					this.applyFilter();
				}
			};

			FilterEngine.prototype.getDefaultStaticHighlightingScheme = function () {
				var state = getState(this);
				return state.staticHlSchemeId;
			};

			FilterEngine.prototype.setDefaultBackgroundColor = function (bgColor) {
				var state = getState(this);

				if (_.isArray(bgColor)) {
					if (bgColor.length >= 2) {
						state.globalDefaults.bgColor = bgColor;
					} else {
						state.globalDefaults.bgColor = defaultConstants.bgColor;
					}
				} else if (_.isObject(bgColor)) {
					state.globalDefaults.bgColor = bgColor;
				} else {
					state.globalDefaults.bgColor = defaultConstants.bgColor;
				}
				this.invalidateGlobalValue('bgColor');
				this.applyFilter();
			};

			FilterEngine.prototype.setDefaultSelectionColor = function (selColor) {
				var state = getState(this);

				if (_.isObject(selColor)) {
					state.globalDefaults.selColor = selColor;
				} else {
					state.globalDefaults.selColor = defaultConstants.selColor;
				}
				this.invalidateGlobalValue('selColor');
				this.applyFilter();
			};

			FilterEngine.prototype.getBlacklist = function () {
				var state = getState(this);
				if (!state.blacklistFacade) {
					state.blacklistFacade = state.blacklist.createFacade();
				}
				return state.blacklistFacade;
			};

			FilterEngine.prototype.registerFilterUpdated = function (handler) {
				var state = getState(this);
				state.onFilterUpdated.register(handler);
			};

			FilterEngine.prototype.unregisterFilterUpdated = function (handler) {
				var state = getState(this);
				state.onFilterUpdated.unregister(handler);
			};

			FilterEngine.prototype.dispose = function () {
				var state = getState(this);

				if (state.isDisposed) {
					return;
				}

				state.isDisposed = true;

				if (state.activeFilter) {
					state.activeFilter.unregisterUser(this);
					state.activeFilter = null;
				}
			};

			return service;
		}]);
})(angular);
