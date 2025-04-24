/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerModelSelectionService
	 * @function
	 *
	 * @description This service watches the model selection in a model selection source and manages object selection
	 *              and filtering state within that model.
	 */
	angular.module('model.viewer').factory('modelViewerModelSelectionService',
		modelViewerModelSelectionService);

	modelViewerModelSelectionService.$inject = ['$injector', 'PlatformMessenger', '$q',
		'_', 'modelViewerObjectTreeService', 'modelProjectSelectedModelInfoService'];

	function modelViewerModelSelectionService($injector, PlatformMessenger, $q,
		_, modelViewerObjectTreeService, modelProjectSelectedModelInfoService) {

		const service = {};

		// model selection ----------------------------------------------------------------

		const privateState = {
			currentItemSource: null,
			currentItemSourceData: null,
			currentModelInfo: null,
			isLoading: false,
			selectedPreviewModelId: null
		};

		// let isPaused = false; // TODO: reintroduce?

		/**
		 * @ngdoc function
		 * @name modelSelectionChanged
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Processes a change of the selected model.
		 */
		function modelSelectionChanged() {
			if (globals.isMobileApp) {
				$injector.get('viewerFilterService').reset();
			} else {
				$injector.get('modelViewerCompositeModelObjectSelectionService').resetSelection();
			}
			service.onSelectedModelChanged.fire();
		}

		/**
		 * @ngdoc function
		 * @name reevaluateSelectedModel
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Issues selection changed events and reloads any required data related to the selected
		 *              model.
		 */
		service.reevaluateSelectedModel = function () {
			if (privateState.currentItemSourceData) {
				privateState.currentItemSourceData.updateModelFunc(true);
			}
		};

		/**
		 * @ngdoc function
		 * @name completeLoadingModel
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Completes loading of any additional data and issuing any relevant notifications based upon
		 *              a given model info object.
		 * @param {Object|Promise<Object>} modelInfo A model info object, or a promise that resolves to such an
		 *                                           object.
		 */
		function completeLoadingModel(modelInfo) {
			return $q.when(modelInfo).then(function (mInfo) {
				return modelViewerObjectTreeService.loadTree(mInfo ? mInfo.info.modelId : null).then(function () {
					privateState.currentModelInfo = mInfo;
					privateState.isLoading = false;
					modelSelectionChanged();
					return true;
				});
			});
		}

		if (globals.isMobileApp) {
			privateState.currentItemSourceData = {
				selectedModelId: null,
				updateModelFunc: function (forceUpdate) {
					const modelId = service.getSelectedModelId();
					if (privateState.currentModelInfo) {
						if (privateState.currentModelInfo.info.modelId === modelId) {
							if (!forceUpdate) {
								privateState.isLoading = false;
								return;
							}
						}
					}
					privateState.currentModelInfo = null;
					if (modelId) {
						privateState.isLoading = true;
						modelSelectionChanged();

						completeLoadingModel(modelProjectSelectedModelInfoService.loadSelectedModelInfoFromId(modelId));
					} else {
						privateState.isLoading = true;
						modelViewerObjectTreeService.loadTree(null).then(function () {
							privateState.isLoading = false;
							modelSelectionChanged();
						});
					}
				},
				requiresUpdateModelFunc: function () {
					privateState.currentItemSourceData.updateModelFunc(false);
				}
			};
		}

		/**
		 * @ngdoc function
		 * @name attachToItemSource
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Establishes a connection to the current item source.
		 * @throws {Error} If the current item source identifier is not supported.
		 */
		function attachToItemSource() {
			switch (privateState.currentItemSource) {
				case 'modelDataService':
					privateState.currentItemSourceData = {
						service: $injector.get('modelProjectModelDataService'),
						service2: $injector.get('modelProjectModelVersionDataService'),
						updateModelFunc: function (forceUpdate, replacementModelId) {
							let newModelId;
							let differentSelectedModel = false;
							privateState.isLoading = true;
							const selectedModel = privateState.currentItemSourceData.service.getSelected();
							if (selectedModel) {
								newModelId = selectedModel.Id;
							}
							if (_.isInteger(replacementModelId)) {
								newModelId = replacementModelId;
							}
							if (privateState.currentModelInfo) {
								if (privateState.currentModelInfo.info.modelId !== newModelId) {
									differentSelectedModel = true;
								}
							}
							if (forceUpdate || differentSelectedModel) {
								if (privateState.currentModelInfo) {
									if (privateState.currentModelInfo.info.modelId === newModelId) {
										if (!forceUpdate) {
											privateState.isLoading = false;
											return;
										}
									}
								}
								privateState.currentModelInfo = null;
								if (newModelId) {
									const modelInfo = selectedModel && selectedModel.Id === newModelId ? modelProjectSelectedModelInfoService.loadSelectedModelInfoFromEntity(selectedModel) : modelProjectSelectedModelInfoService.loadSelectedModelInfoFromId(newModelId);
									completeLoadingModel(modelInfo);
								} else {
									privateState.isLoading = true;
									modelViewerObjectTreeService.loadTree(null).then(function () {
										privateState.isLoading = false;
										modelSelectionChanged();
									});
								}
							}
						},
						updateModelVersionFunc: function (forceUpdate) {
							if (forceUpdate) {
								privateState.currentModelInfo = null;
								let newModelId;
								const selectedModelVersion = privateState.currentItemSourceData.service2.getSelected();
								if (selectedModelVersion) {
									newModelId = selectedModelVersion.Id;
								}
								if (_.get(privateState, 'currentModelInfo.info.modelId') === newModelId) {
									if (!forceUpdate) {
										privateState.isLoading = false;
										return;
									}
								}

								if (newModelId) {
									completeLoadingModel(modelProjectSelectedModelInfoService.loadSelectedModelInfoFromEntity(selectedModelVersion));
								} else {
									privateState.isLoading = true;
									modelViewerObjectTreeService.loadTree(null).then(function () {
										privateState.isLoading = false;
										modelSelectionChanged();
									});
								}
							}
						},
						requiresUpdateModelFunc: function () {
							if (privateState.currentItemSourceData.service.getSelected()) {
								privateState.currentItemSourceData.updateModelFunc(true);
							} else {
								privateState.currentItemSourceData.updateModelFunc(false);
							}
						},
						requiresUpdateModelVersionFunc: function () {
							if (privateState.currentItemSourceData.service2.getSelected()) {
								privateState.currentItemSourceData.updateModelVersionFunc(true);
							} else {
								privateState.currentItemSourceData.updateModelVersionFunc(false);
							}
						}
					};

					{
						const modelSelChangeFunc = function () {
							privateState.selectedPreviewModelId = null;
							privateState.currentItemSourceData.requiresUpdateModelFunc();
						};
						const modelSelVerChangeFunc = function () {
							privateState.selectedPreviewModelId = null;
							privateState.currentItemSourceData.requiresUpdateModelVersionFunc();
						};

						privateState.currentItemSourceData.service.registerSelectionChanged(modelSelChangeFunc);
						privateState.currentItemSourceData.service2.registerSelectionChanged(modelSelVerChangeFunc);

						privateState.currentItemSourceData.detach = function () {
							privateState.currentItemSourceData.service.unregisterSelectionChanged(modelSelChangeFunc);
							privateState.currentItemSourceData.service2.unregisterSelectionChanged(modelSelVerChangeFunc);
						};
					}
					break;
				case 'pinnedModel':
					privateState.currentItemSourceData = {
						service: $injector.get('cloudDesktopPinningContextService'),
						updateModelFunc: function (forceUpdate) {
							const modelId = service.getSelectedModelId();
							if (privateState.currentModelInfo) {
								if (privateState.currentModelInfo.info.modelId === modelId) {
									if (!forceUpdate) {
										privateState.isLoading = false;
										return;
									}
								}
							}
							privateState.currentModelInfo = null;
							if (modelId) {
								privateState.isLoading = true;
								modelSelectionChanged();

								completeLoadingModel(modelProjectSelectedModelInfoService.loadSelectedModelInfoFromId(modelId));
							} else {
								privateState.isLoading = true;
								modelViewerObjectTreeService.loadTree(null).then(function () {
									privateState.isLoading = false;
									modelSelectionChanged();
								});
							}
						},
						requiresUpdateModelFunc: function () {
							privateState.currentItemSourceData.updateModelFunc(false);
						}
					};
					privateState.currentItemSourceData.service.onSetPinningContext.register(privateState.currentItemSourceData.requiresUpdateModelFunc);
					privateState.currentItemSourceData.service.onClearPinningContext.register(privateState.currentItemSourceData.requiresUpdateModelFunc);
					privateState.currentItemSourceData.detach = function () {
						privateState.currentItemSourceData.service.onSetPinningContext.unregister(privateState.currentItemSourceData.requiresUpdateModelFunc);
						privateState.currentItemSourceData.service.onClearPinningContext.unregister(privateState.currentItemSourceData.requiresUpdateModelFunc);
					};
					break;
				case 'changeSet':
					privateState.currentItemSourceData = {
						service: $injector.get('modelChangeSetDataService'),
						updateModelFunc: function (forceUpdate) {
							const modelChangeSetDataService = this.service;

							privateState.isLoading = true;
							modelChangeSetDataService.getTemporaryModelId().then(function (modelId) {
								if (privateState.currentModelInfo) {
									if (privateState.currentModelInfo.info.modelId === modelId) {
										if (!forceUpdate) {
											privateState.isLoading = false;
											return;
										}
									}
								}
								privateState.currentModelInfo = null;
								if (modelId) {
									privateState.isLoading = true;
									modelSelectionChanged();

									completeLoadingModel(modelProjectSelectedModelInfoService.loadSelectedModelInfoFromId(modelId).then(function (mInfo) {
										return modelChangeSetDataService.enrichTemporaryModelInfo(mInfo);
									}));
								} else {
									privateState.isLoading = true;
									modelViewerObjectTreeService.loadTree(null).then(function () {
										privateState.isLoading = false;
										modelSelectionChanged();
									});
								}

								privateState.isLoading = false;
							});
						},
						requiresUpdateModelFunc: function () {
							privateState.currentItemSourceData.updateModelFunc(false);
						}
					};
					privateState.currentItemSourceData.service.registerSelectionChanged(privateState.currentItemSourceData.requiresUpdateModelFunc);
					privateState.currentItemSourceData.detach = function () {
						privateState.currentItemSourceData.service.unregisterSelectionChanged(privateState.currentItemSourceData.requiresUpdateModelFunc);
					};
					break;
				default:
					privateState.currentItemSource = null;
					privateState.currentItemSourceData = null;
					modelViewerObjectTreeService.loadTree(null);
					throw new Error('Unsupported item source: ' + privateState.currentItemSource);
			}

			privateState.currentItemSourceData.updateModelFunc();
		}

		if (globals.isMobileApp) {
			let isInitialized = false;
			service.initialize = function () {
				if (!isInitialized) {
					isInitialized = true;
					privateState.currentItemSourceData.updateModelFunc();
				}
			};
		}

		/**
		 * @ngdoc function
		 * @name detachFromItemSource
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Removes any connection to the current item source.
		 */
		function detachFromItemSource() {
			privateState.currentItemSourceData.detach();
			privateState.currentItemSourceData = null;
		}

		if (!globals.isMobileApp) {
			/**
			 * @ngdoc function
			 * @name setItemSource
			 * @function
			 * @methodOf modelViewerModelSelectionService
			 * @description Switches to another item source.
			 * @param {String} itemSource The identifier of the new item source.
			 * @throws {Error} If `itemSource` is not supported.
			 */
			service.setItemSource = function (itemSource) {
				if (itemSource === privateState.currentItemSource) {
					return;
				}

				if (privateState.currentItemSource) {
					detachFromItemSource();
				}

				privateState.currentItemSource = itemSource;

				if (privateState.currentItemSource) {
					attachToItemSource();
				} else {
					modelSelectionChanged();
				}
			};

			/**
			 * @ngdoc function
			 * @name getItemSource
			 * @function
			 * @methodOf modelViewerModelSelectionService
			 * @description Returns the identifier of the current item source.
			 * @returns {String} The identifier of the current item source.
			 */
			service.getItemSource = function () {
				return privateState.currentItemSource;
			};
		}

		/**
		 * @ngdoc function
		 * @name getSelectedModelId
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Returns the ID of the selected model.
		 * @returns {Number} The ID of the selected model, or `null` if no model is selected.
		 */
		service.getSelectedModelId = function () {
			if (privateState.isLoading) {
				return null;
			}

			if (globals.isMobileApp) {
				return privateState.currentItemSourceData.selectedModelId;
			} else {
				switch (privateState.currentItemSource) {
					case 'modelDataService':
						return (function () {
							if (privateState.selectedPreviewModelId) {
								return privateState.selectedPreviewModelId;
							}

							const selItem = privateState.currentItemSourceData.service2.getSelected() || privateState.currentItemSourceData.service.getSelected();
							if (selItem) {
								return selItem.Id;
							} else {
								return null;
							}
						})();
					case 'pinnedModel':
						return (function () {
							const pinningCtx = privateState.currentItemSourceData.service.getContext();
							if (_.isArray(pinningCtx)) {
								const selModel = _.find(pinningCtx, function (item) {
									return item.token === 'model.main';
								});
								if (selModel) {
									return selModel.id || selModel.Id;
								} else {
									return null;
								}
							} else {
								return null;
							}
						})();
					case 'changeSet':
						return privateState.currentModelInfo ? privateState.currentModelInfo.info.modelId : null;
					default:
						return null;
				}
			}
		};

		if (globals.isMobileApp) {
			service.setSelectedModelId = function (modelId) {
				privateState.currentItemSourceData.selectedModelId = modelId;
				privateState.currentItemSourceData.updateModelFunc();
			};
		} else {
			let modelProjectModelDataService = null;

			service.setSelectedModelId = function (modelId) {
				if (!modelProjectModelDataService) {
					modelProjectModelDataService = $injector.get('modelProjectModelDataService');
				}

				modelProjectModelDataService.loadModelEntity(modelId).then(function (model) {
					switch (privateState.currentItemSource) {
						case 'modelDataService':
							(function () {
								const modelMainObjectDataService = $injector.get('modelMainObjectDataService');
								modelMainObjectDataService.selectAfterNavigation(model);
							})();
							break;
						case 'pinnedModel':
							(function () {
								const projectMainPinnableEntityService = $injector.get('projectMainPinnableEntityService');
								const modelProjectPinnableEntityService = $injector.get('modelProjectPinnableEntityService');

								const ids = {};
								modelProjectPinnableEntityService.appendId(ids, model.Id);
								if (_.isInteger(model.ProjectFk)) {
									projectMainPinnableEntityService.appendId(ids, model.ProjectFk);
								}
								modelProjectPinnableEntityService.pin(ids);
							})();
							break;
						default:
							return null;
					}
				});
			};
		}

		/**
		 * @ngdoc function
		 * @name getSelectedModel
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Returns an object with some information about the selected model.
		 * @returns {Object} An object that provides information about the currently selected model, or `null` if no
		 *                   model is selected.
		 */
		service.getSelectedModel = function () {
			if (privateState.isLoading) {
				return null;
			}

			return privateState.currentModelInfo;
		};

		service.onSelectedModelChanged = new PlatformMessenger();

		// TODO: provide new text
		/**
		 * @ngdoc function
		 * @name getEmptySelectionTextKey
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Returns the translation key for a text that expresses that no model is selected with respect
		 *              to the current item source.
		 * @returns {String} The translation key.
		 */
		service.getEmptySelectionTextKey = function () {
			switch (privateState.currentItemSource) {
				case 'modelDataService':
					return 'model.viewer.noModelListSelected';
				case 'pinnedModel':
					return 'model.viewer.noModelPinned';
				case 'changeSet':
					return 'model.changeset.changeSetSummary.noSelection';
				default:
					return null;
			}
		};

		service.pauseUpdate = function () {
			// isPaused = true;
		};

		service.resumeUpdate = function () {
			// isPaused = false;

			if (privateState.currentItemSourceData) {
				privateState.currentItemSourceData.updateModelFunc();
			}
		};

		/**
		 * @ngdoc function
		 * @name forEachSubModel
		 * @function
		 * @methodOf modelViewerModelSelectionService
		 * @description Iterates over all sub-models of the currently active model (in the case of non-composite
		 *              models, the main model is treated as a single sub-model).
		 * @param {Function} func A callback function that will be invoked once for each sub-model. It receives
		 *                        the (internal, model-specific) sub-model ID as its single parameter.
		 * @returns {ObjectIdSet} An object ID set with the return values retrieved in each operation assigned to
		 *                        properties that are named like the sub-model IDs.
		 */
		service.forEachSubModel = function (func) {
			const modelViewerModelIdSetService = $injector.get('modelViewerModelIdSetService');

			const result = new modelViewerModelIdSetService.ObjectIdSet();
			if (privateState.currentModelInfo) {
				privateState.currentModelInfo.subModels.forEach(function (sm) {
					result[sm.subModelId] = func(sm.subModelId);
				});
			}
			return result;
		};

		service.selectPreviewModel = function (modelId) {
			privateState.selectedPreviewModelId = modelId;

			// const projectMainPinnableEntityService = $injector.get('projectMainPinnableEntityService');
			const modelProjectPinnableEntityService = $injector.get('modelProjectPinnableEntityService');

			const ids = {};
			modelProjectPinnableEntityService.appendId(ids, modelId);
			modelProjectPinnableEntityService.pin(ids);
			if (privateState.currentItemSource && privateState.currentItemSource !== 'pinnedModel') {
				privateState.currentItemSourceData.updateModelFunc(true, modelId);
			}
		};

		return service;
	}
})(angular);
