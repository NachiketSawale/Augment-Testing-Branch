/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsLoadingService
	 * @function
	 *
	 * @description Loads a model in a HOOPS viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsLoadingService', ['_', '$q', 'Communicator',
		'modelViewerHoopsEndpointService', 'modelViewerHoopsLinkService', 'modelViewerHoopsRuntimeDataService',
		'$timeout', '$translate', 'moment', '$log',
		function (_, $q, Communicator, modelViewerHoopsEndpointService, modelViewerHoopsLinkService,
		          modelViewerHoopsRuntimeDataService, $timeout, $translate, moment, $log) {
			var service = {};

			var defaultBackgroundColor = new Communicator.Color(255, 255, 255);

			var modelInstanceUrl;

			/**
			 * @ngdoc function
			 * @name loadModel
			 * @function
			 * @methodOf modelViewerHoopsLoadingService
			 * @description Loads or unloads a model indicated by its name.
			 * @param {Scope} scope The scope that will be accessed by the web viewer.
			 * @param {Model} model The model descriptor for the model to load.
			 * @param {Object} config Optionally, an object with some configuration settings for the function.
			 * @return {Object} An object that allows to cancel the loading process and that contains a promise that
			 *                  will be resolved once loading has concluded.
			 */
			service.loadModel = function (scope, model, config) {
				var invocationInfo = {
					viewer: null,
					id: moment().valueOf().toString(16).substr(-6),
					aborted: false,
					shouldAbort: function () {
						if (this.aborted) {
							return true;
						}
						if (this.viewer) {
							if (modelViewerHoopsLinkService.isViewerDiscarded(this.viewer)) {
								return true;
							}
						}
						return false;
					}
				};

				var actualConfig;

				function logVerbose(message) {
					if (actualConfig.verboseLogging) {
						$log.info('model loader ' + invocationInfo.id + ' | ' + message);
					}
				}

				actualConfig = _.assign({
					viewerProperty: 'viewer',
					modelNameProperty: 'modelName',
					handlersPropertyName: 'viewerHandlers',
					viewerInitProperty: 'viewerInitData',
					rendererType: Communicator.RendererType.Client,
					streamingMode: Communicator.StreamingMode.Interactive,
					verboseLogging: true,
					showLoadingInfo: function () {
					},
					shutdownViewer: function () {
						var v = scope[this.viewerProperty];
						if (v) {
							v = v();
							modelViewerHoopsLinkService.setViewerActive(v, false);
							modelViewerHoopsLinkService.markViewerAsDiscarded(v);
							v.shutdown();
							scope[this.viewerProperty] = null;
						}
					}
				}, angular.isObject(config) ? config : {});

				logVerbose('Invoked' + (globals.isMobileApp ? '[M]' : '') + ': ' + (model ? model.getDebugInfo() : '<null>'));

				var loadingDeferred = $q.defer();
				var targetUrlDeferred = $q.defer();

				scope[actualConfig.modelNameProperty] = model ? '_empty' : null;
				if (model) {
					if (model.isFullyImported()) {
						actualConfig.showLoadingInfo($translate.instant('model.viewer.loading.model', {
							name: model.getNiceName()
						}));

						var prepareViewerInitPromise;
						if (model.info.modelUri) {
							logVerbose('SCS model URL found = ' + model.info.modelUri);

							prepareViewerInitPromise = $q.when({
								modelUri: model.info.modelUri
							});
						} else {
							logVerbose('Contacting server for ' + (function () {
								switch (actualConfig.rendererType) {
									case Communicator.RendererType.Client:
										return 'client-side';
									case Communicator.RendererType.Server:
										return 'server-side';
									default:
										return 'unknown';
								}
							})() + ' rendering.');
							prepareViewerInitPromise = modelViewerHoopsEndpointService.retrieveInstanceUri(actualConfig.rendererType, true).then(function (instanceUri) {
								if (instanceUri) {
									modelInstanceUrl = instanceUri.uri;
									logVerbose('Retrieved instance URI = ' + instanceUri.uri + ' (service ID: ' + instanceUri.serviceId + ')');

									if (invocationInfo.shouldAbort()) {
										logVerbose('Aborted after retrieval of instance URI.');

										loadingDeferred.reject({
											viewer: invocationInfo.viewer
										});
										return $q.reject();
									}

									return {
										instanceUri: instanceUri.uri,
										rendererType: actualConfig.rendererType,
										streamingMode: actualConfig.streamingMode
									};
								} else {
									logVerbose('Empty instance URI received.');

									loadingDeferred.reject({
										viewer: invocationInfo.viewer
									});
								}
							}, function () {
								logVerbose('Unable to retrieve instance URI.');

								loadingDeferred.reject({
									viewer: invocationInfo.viewer
								});
							});
						}

						prepareViewerInitPromise.then(function (viewerInitData) {
							scope[actualConfig.handlersPropertyName] = {
								viewerCreated: function (v) {
									logVerbose('Viewer component created (version ' + v.getViewerVersionString() + ')');

									var origShowLoadingInfo = actualConfig.showLoadingInfo;
									actualConfig.showLoadingInfo = function () {
										if (!invocationInfo.shouldAbort()) {
											origShowLoadingInfo.apply(this, arguments);
										}
									};

									invocationInfo.viewer = v;
								},
								sceneReady: function () {
									logVerbose('Scene ready.');
								},
								modelStructureReady: function () {
									logVerbose('Model structure ready (format version ' + invocationInfo.viewer.getFormatVersionString() + ')');

									if (globals.isMobileApp) {
										invocationInfo.viewer.operatorManager.clear();
									}

									invocationInfo.viewer.view.setBackgroundColor(defaultBackgroundColor, defaultBackgroundColor);

									return $timeout(function () {
										return 0;
									}).then(function (childCount) {
										try {
											return prepareSubModels(invocationInfo, model, logVerbose, actualConfig.showLoadingInfo).then(function () {
												logVerbose('Sub-models prepared.');

												invocationInfo.viewer.view.setBackfacesVisible(true);

												actualConfig.showLoadingInfo($translate.instant('model.viewer.loading.final'));

												return modelViewerHoopsRuntimeDataService.prepareViewer(invocationInfo.viewer).then(function () {
													logVerbose('Runtime data prepared.');

													if (invocationInfo.shouldAbort()) {
														logVerbose('Aborted after loading runtime data.');

														loadingDeferred.reject({
															viewer: invocationInfo.viewer
														});
														return;
													}

													modelViewerHoopsLinkService.setViewerActive(invocationInfo.viewer, true);

													logVerbose('Loading of geometry has concluded.');

													loadingDeferred.resolve(childCount);
												});
											}, function () {
												logVerbose('Failed to prepare sub-models.');

												actualConfig.shutdownViewer();
												loadingDeferred.reject({
													//viewer: invocationInfo.viewer
													viewer: null
												});
											});
										} catch (ex) {
											logVerbose('Exception while loading sub-models:' + _.isFunction(ex.toString) ? ex.toString() : ex);

											loadingDeferred.reject({
												viewer: invocationInfo.viewer
											});
										}
									}, function () {
										logVerbose('Waiting until model was loaded failed.');

										actualConfig.shutdownViewer();
										loadingDeferred.reject({
											//viewer: invocationInfo.viewer
											viewer: null
										});
									});
								},
								modelLoadFailure: function (name, reason) {
									logVerbose('Could not load model "' + name + '": ' + reason);

									loadingDeferred.reject({
										viewer: invocationInfo.viewer
									});
								},
								missingModel: function (modelPath) {
									logVerbose('Model "' + modelPath + '" not found.');

									loadingDeferred.reject({
										viewer: invocationInfo.viewer
									});
								},
								XHRonerror: function () {
									logVerbose('HTTP request to loadmodel failed.');

									loadingDeferred.reject({
										viewer: invocationInfo.viewer
									});
								}
							};

							if (invocationInfo.shouldAbort()) {
								logVerbose('Aborted after initialization of viewer.');

								loadingDeferred.reject({
									viewer: invocationInfo.viewer
								});
								return;
							}

							actualConfig.showLoadingInfo($translate.instant('model.viewer.loading.initViewer'));
							scope[actualConfig.viewerInitProperty] = viewerInitData;
							targetUrlDeferred.resolve();
						});
					} else {
						logVerbose('For at least one sub-model, import has not concluded.');

						loadingDeferred.reject({
							message: $translate.instant(model.info.isComposite ? 'model.viewer.loadedSubModelNotImported' : 'model.viewer.loadedModelNotImported')
						});
					}
				} else {
					actualConfig.shutdownViewer();

					loadingDeferred.resolve();
				}

				return {
					cancel: function () {
						invocationInfo.aborted = true;
					},
					promise: loadingDeferred.promise,
					targetUrlPromise: targetUrlDeferred.promise
				};
			};

			function getInclusionId(viewer, rootId, inclusionIdMap) {
				var mdl;

				function findInclusionid() {
					var result = null;

					var childIds = mdl.getNodeChildren(rootId);
					_.reverse(childIds).some(function (id) {
						var scInstanceKey = mdl.getSCInstanceKey(id);
						if (angular.isArray(scInstanceKey) && (scInstanceKey.length >= 2)) {
							var inclusionIdCandidate = scInstanceKey[0];
							if ((inclusionIdCandidate !== 0) && (scInstanceKey[0] !== 1)) { // the first model always seems to receive inclusion ID 1 - make more dynamic!
								if (!inclusionIdMap.inclusionToSubModel[inclusionIdCandidate]) {
									result = inclusionIdCandidate;
									return true;
								}
							}
						}
						return false;
					});

					return result;
				}

				mdl = viewer.model;

				var idleTime = 0;

				var checkCycle = function () {
					var inclusionId = findInclusionid();
					if (inclusionId) {
						return $q.when(inclusionId);
					} else {
						if (idleTime >= 10000) {
							return $q.when(1);
							//return $q.reject({});
						} else {
							idleTime += 100;
							return $timeout(checkCycle, 100);
						}
					}
				};

				return checkCycle();
			}

			function prepareSubModels(invocationInfo, model, logVerbose, showLoadingInfo) {
				var viewer, mapProp;

				function retrieveInclusionId(subModelId, rootId) {
					var mdl;

					function recursivelyFindInclusionId(localRootId) {
						var instKey = mdl.getSCInstanceKey(localRootId);
						if (_.isArray(instKey) && (instKey.length >= 2)) {
							var incId = instKey[0];
							if (_.isNil(viewer[mapProp].inclusionToSubModel[incId])) {
								viewer[mapProp].inclusionToSubModel[incId] = subModelId;
								viewer[mapProp].subModelToInclusion[subModelId] = incId;
								return true;
							}
						}

						var childIds = mdl.getNodeChildren(localRootId);
						return childIds.some(function (childId) {
							return recursivelyFindInclusionId(childId);
						});
					}

					mdl = viewer.model;
					return $q.when(recursivelyFindInclusionId(rootId));
				}

				viewer = invocationInfo.viewer;
				mapProp = modelViewerHoopsLinkService.getSubModelsMapProperty();
				viewer[mapProp] = {
					inclusionToSubModel: {},
					subModelToInclusion: {},
					subModelToRootNode: {}
				};

				var mdl = viewer.model;
				var globalRoot = mdl.getAbsoluteRootNode();

				mdl.setViewAxes(new Communicator.Point3(0, 1, 0), new Communicator.Point3(0, 0, 1));

				logVerbose('Loading models into scene ...');

				return (function () {
					var loadPromise = $q.when(0);

					if (invocationInfo.shouldAbort()) {
						return $q.reject({
							viewer: viewer
						});
					}

					model.subModels.forEach(function (sm, index) {
						loadPromise = loadPromise.then(function (childCount) {
							if (invocationInfo.shouldAbort()) {
								return $q.reject({
									viewer: viewer
								});
							}

							logVerbose('Loading sub-model ' + sm.subModelId + ' ...');
							showLoadingInfo($translate.instant('model.viewer.loading.subModel', {
								index: index + 1,
								totalCount: model.subModels.length,
								name: sm.info.getNiceName()
							}));

							var smMatrix = _.isArray(sm.transform) ? Communicator.Matrix.createFromArray(sm.transform) : new Communicator.Matrix();

							var newNodeId = mdl.createNode(globalRoot, 'SM' + sm.subModelId, null, smMatrix);
							if (angular.isNumber(newNodeId)) {
								logVerbose('Appended sub-model root node with ID ' + newNodeId + '.');
								viewer[mapProp].subModelToRootNode[sm.subModelId] = newNodeId;
							} else {
								logVerbose('Failed to append sub-model root node.');
								return $q.reject({
									viewer: viewer
								});
							}

							if (sm.info.hasMeshes || sm.info.isPreview) {
								var loadSubtreePromise = (function loadSubtree() {
									if (!_.isEmpty(sm.info.modelUri)) {
										return mdl.loadSubtreeFromScsFile(newNodeId, sm.info.modelUri);
									} else {
										return mdl.loadSubtreeFromModel(newNodeId, sm.info.getModelName());
									}
								})();

								return loadSubtreePromise.then(function () {
									var scalingPromise;
									if (_.isNumber(sm.info.scalingFactor)) {
										var matrix = smMatrix.scale(sm.info.scalingFactor);
										scalingPromise = mdl.setNodeMatrix(newNodeId, matrix, true);
									} else {
										scalingPromise = $q.when();
									}
									return scalingPromise.then(function () {
										return newNodeId;
									});
								});
							} else {
								return newNodeId;
							}
						}).then(function (subtreeRootId) {
							if (!sm.info.hasMeshes) {
								return true;
							}
							//return waitUntilModelLoaded(mdl, globalRoot, previousChildCount).then(function (deltaChildCount) {
							return $timeout(150).then(function (/*deltaChildCount*/) {
								return retrieveInclusionId(sm.subModelId, subtreeRootId).then(function (success) {
									if (success) {
										return $q.resolve();
									} else {
										return $q.reject({
											viewer: viewer
										});
									}
								});
							}, function () {
								logVerbose('Unable to determine inclusion ID.');

								return $q.reject({
									viewer: viewer
								});
							});
						}, function () {
							logVerbose('Failed to load sub-model as a subtree.');

							return $q.reject({
								viewer: viewer
							});
						});
					});

					return loadPromise.then(function () {
						getInclusionId(viewer, globalRoot, viewer[mapProp]);
					});
				})();
			}

			service.getModelInstanceUrl = function () {
				return modelInstanceUrl;
			};

			return service;
		}]);
})(angular);
