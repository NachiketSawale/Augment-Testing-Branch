/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerViewerRegistryService
	 * @function
	 *
	 * @description This service manages a list of currently active 3D viewers. It provides update notifications of that
	 *              list and allows to access the viewers via a uniform interface.
	 */
	angular.module('model.viewer').factory('modelViewerViewerRegistryService',
		modelViewerViewerRegistryService);

	modelViewerViewerRegistryService.$inject = ['_', '$q', 'PlatformMessenger',
		'modelViewerModelSelectionService', 'modelViewerSimulationService',
		'$translate', 'modelEvaluationRulesetGroupDataService',
		'modelEvaluationRulesetResultCacheService'];

	function modelViewerViewerRegistryService(_, $q, PlatformMessenger,
		modelSelectionService, modelViewerSimulationService,
		$translate, modelEvaluationRulesetGroupDataService,
		modelEvaluationRulesetResultCacheService) {

		const service = {};

		const privateState = {
			viewerApplyFilterMethods: {},
			registeredViewers: [],
			onViewersChangedMessenger: new PlatformMessenger(),
			onViewerReadinessChanged: new PlatformMessenger()
		};

		/**
		 * @ngdoc method
		 * @name copyAction
		 * @methodOf modelViewerViewerRegistryService
		 * @description Copies a function with a given name from one object to another object.
		 * @param {Object} src The source object.
		 * @param {Object} dest The destination object.
		 * @param {String} name The name of the function.
		 * @throws if there is no function called `name` in `src`.
		 */
		function copyAction(src, dest, name) {
			if (angular.isFunction(src[name])) {
				dest[name] = src[name];
			} else {
				throw new Error('Action ' + name + ' was not found in the source object.');
			}
		}

		/**
		 * @ngdoc method
		 * @name ViewerInfo
		 * @constructor
		 * @methodOf ViewerInfo
		 * @description Initializes a new instance. A `ViewerInfo` instance provides a publicly accessible interface
		 *              to an active 3D viewer.
		 * @param {String} id The ID of the viewer.
		 * @param {String} displayName A translation identifier for a displayable name of the viewer.
		 * @param {String} numberedDisplayName A translation identifier for a displayable name of the viewer that
		 *                                     includes a placeholder named `name` for inserting the number (or an
		 *                                     equivalent identifier).
		 * @param {Object} actions An object that provides a set of methods that can be used to control the viewer
		 *                         from the outside.
		 */
		service.ViewerInfo = function (id, displayName, numberedDisplayName, actions) {
			this.id = id;
			this.displayName = displayName;
			this.numberedDisplayName = numberedDisplayName;
			const that = this;
			this.getDisplayName = function () {
				if (that.name) {
					return $translate.instant(that.numberedDisplayName, {
						name: that.name
					});
				} else {
					return $translate.instant('model.viewer.hoops.title');
				}
			};
			copyAction(actions, this, 'showCamPos');
			copyAction(actions, this, 'setTemporaryManipulationOperator');
			copyAction(actions, this, 'unsetTemporaryManipulationOperator');
			copyAction(actions, this, 'reload');
			copyAction(actions, this, 'getSelectabilityInfo');
			copyAction(actions, this, 'getFilterEngine');
			copyAction(actions, this, 'getCurrentCamPos');
			copyAction(actions, this, 'takeSnapshot');
			copyAction(actions, this, 'getCuttingPlane');
			copyAction(actions, this, 'setCuttingPlane');
			copyAction(actions, this, 'getCuttingActive');
			copyAction(actions, this, 'setCuttingActive');
			copyAction(actions, this, 'setCuttingInactive');

			this._lastFilterSettings = {
				includedPartIds: []
			};
		};

		/**
		 * @ngdoc method
		 * @name ViewerOwnerAccessor
		 * @constructor
		 * @methodOf ViewerOwnerAccessor
		 * @description Initializes a new instance. A `ViewerOwnerAccessor` provides a control interface for
		 *              modifying some properties of a viewer. It should be accessed only by the viewer itself to
		 *              inform other modules about the properties of the viewer.
		 * @param {ViewerInfo} viewerInfo A `ViewerInfo` object that contains some information about the viewer.
		 * @param {Object} actions An object that provides a set of methods that can be used to control the viewer.
		 */
		function ViewerOwnerAccessor(viewerInfo, actions) {
			this.info = viewerInfo;
			copyAction(actions, this, 'setSelection');
			copyAction(actions, this, 'updateNumber');

			let isReady = false;
			viewerInfo.isReady = function () {
				return isReady;
			};

			let showModelByDefault = null;

			const doApplyFilter = function () {
			};

			this.setShowModelByDefault = function (showModel) {
				if (showModel !== showModelByDefault) {
					showModelByDefault = showModel;
					doApplyFilter();
				}
			};

			this.setIsReady = function (ready) {
				if (isReady !== ready) {
					isReady = ready;

					if (isReady) {
						actions.initialize();
					}

					doApplyFilter();
					privateState.onViewerReadinessChanged.fire(viewerInfo);
				}
			};

			this.refresh = function () {
				return doApplyFilter(false, true);
			};

			privateState.viewerApplyFilterMethods[viewerInfo.id] = doApplyFilter;
			doApplyFilter();
		}

		modelSelectionService.onSelectedModelChanged.register(function () {
			privateState.registeredViewers.forEach(function (v) {
				privateState.viewerApplyFilterMethods[v.info.id]();
			});
		});

		/**
		 * @ngdoc function
		 * @name registerViewer
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Registers a 3D viewer.
		 * @param {ViewerInfo} viewer An object describing the viewer.
		 * @param {Object} actions An object that provides a set of methods that can be used to control the viewer.
		 * @returns {ViewerOwnerAccessor} An object that provides some level of control over the published viewer
		 *                                definition.
		 */
		service.registerViewer = function (viewer, actions) {
			const result = new ViewerOwnerAccessor(viewer, actions);
			privateState.registeredViewers.push(result);
			updateViewerNumbers();
			privateState.onViewersChangedMessenger.fire();
			return result;
		};

		/**
		 * @ngdoc function
		 * @name unregisterViewer
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Unregisters a 3D viewer.
		 * @param {String} viewerId The unique ID of the viewer supplied upon registration.
		 */
		service.unregisterViewer = function (viewerId) {
			const viewerIdx = _.findIndex(privateState.registeredViewers, function (v) {
				return v.info.id === viewerId;
			});
			if (viewerIdx >= 0) {
				privateState.registeredViewers.splice(viewerIdx, 1);
				updateViewerNumbers();
				privateState.onViewersChangedMessenger.fire();
			}
			delete privateState.viewerApplyFilterMethods[viewerId];
		};

		/**
		 * @ngdoc function
		 * @name updateViewerNumbers
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Updates the graphical and textual numbers of all registered viewers.
		 */
		function updateViewerNumbers() {
			privateState.registeredViewers.forEach(function (v, index) {
				v.info.name = (index + 1) + '';
				v.info.iconClass = index < 9 ? 'control-icons ico-n' + (index + 1) : null;
				v.info.addIconClass = index < 9 ? 'control-icons ico-n' + (index + 1) + '-add' : null;
				v.updateNumber(v.info.name, v.info.iconClass);
			});
		}

		/**
		 * @ngdoc function
		 * @name getViewers
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Retrieves the registered 3D viewers.
		 * @returns {Array<ViewerInfo>} An array of `ViewerInfo` objects that match the filter restrictions, if any.
		 */
		service.getViewers = function () {
			return _.map(privateState.registeredViewers, function (viewer) {
				return viewer.info;
			});
		};

		/**
		 * @ngdoc function
		 * @name createViewerActionButtons
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Creates an action button (for use within a grid column) for each viewer.
		 * @param {Object|Function} settings An object with the following properties:
		 *                            execute: A function that will be invoked when the button is pressed.
		 *                            disabled: Optionally, a value or function to disable the button.
		 *                            include: Optionally, a predicate that can be used to filter viewers.
		 *                            customData: Optionally, an object that will be merged into the button
		 *                                        definition.
		 *                                   Alternatively, just an execution function as described above.
		 * @returns {Array<Object>} An array of action button definitions.
		 */
		service.createViewerActionButtons = function (settings) {
			let actualSettings;
			if (angular.isFunction(settings)) {
				actualSettings = {
					execute: settings
				};
			} else {
				actualSettings = settings;
			}

			let relevantViewers = privateState.registeredViewers;

			if (angular.isFunction(actualSettings.include)) {
				relevantViewers = _.filter(relevantViewers, function (viewer) {
					return actualSettings.include(viewer.info);
				});
			}

			return _.map(relevantViewers, function (viewer) {
				let result = {
					toolTip: viewer.info.getDisplayName(),
					icon: viewer.info.iconClass,
					callbackFn: function () {
						actualSettings.execute(viewer.info);
					},
					readonly: actualSettings.disabled || false
				};
				if (actualSettings.customData) {
					result = _.merge(result, actualSettings.customData);
				}
				return result;
			});
		};

		/**
		 * @ngdoc function
		 * @name isViewerActive
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Checks whether at least one viewer is active.
		 * @returns {Boolean} A value that indicates whether at least one viewer is currently active.
		 */
		service.isViewerActive = function () {
			return Boolean(privateState.registeredViewers.length);
		};

		const viewerWrappers = [];

		/**
		 * @ngdoc function
		 * @name wrapperUnsupportedFunc
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Throws an error to indicate that the function is unsupported by viewer wrappers.
		 * @throws {Error} The function is invoked.
		 */
		const wrapperUnsupportedFunc = function () {
			throw new Error('This function is not supported by viewer wrappers.');
		};

		/**
		 * @ngdoc function
		 * @name getViewerWrapper
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Returns a `ViewerInfo` object that forwards method calls to the (optionally filtered) set of
		 *              currently active viewers.
		 * @returns {ViewerInfo} A `ViewerInfo` object. Note that the `id` and `displayName` properties of this
		 *                       object will not contain a value. You must invoke the `detach` method once the
		 *                       wrapper is no longer needed.
		 */
		service.getViewerWrapper = function () {
			const actions = {
				showCamPos: function (camPos) {
					this.forEachRelevantViewer(function (v) {
						v.showCamPos(camPos);
					});
				},
				setTemporaryManipulationOperator: function (operatorId, activationData) {
					this.forEachRelevantViewer(function (v) {
						v.setTemporaryManipulationOperator(operatorId, activationData);
					});
				},
				unsetTemporaryManipulationOperator: function () {
					this.forEachRelevantViewer(function (v) {
						v.unsetTemporaryManipulationOperator();
					});
				},
				getFilterId: wrapperUnsupportedFunc,
				getOdsId: wrapperUnsupportedFunc,
				reload: function () {
					this.forEachRelevantViewer(function (v) {
						v.reload();
					});
				},
				getSelectabilityInfo: function () {
					throw new Error('Selectability info is not supported on a viewer wrapper.');
				},
				getFilterEngine: function () {
					throw new Error('A viewer wrapper does not have a filter engine object.');
				},
				getCurrentCamPos() {
					throw new Error('A viewer wrapper cannot return a single camera position.');
				},
				takeSnapshot() {
					throw new Error('A viewer wrapper cannot take a single snapshot.');
				},
				getCuttingPlane() {
					throw new Error('A viewer wrapper cannot return a single cutting plane.');
				},
				setCuttingPlane: function (cuttingPlanes) {
					this.forEachRelevantViewer(function (v) {
						v.setCuttingPlane(cuttingPlanes);
					});
				},
				getCuttingActive() {
					throw new Error('A viewer wrapper canot return a single active value.');
				},
				setCuttingActive() {
					this.forEachRelevantViewer(function (v) {
						v.setCuttingActive();
					});
				},
				setCuttingInactive() {
					this.forEachRelevantViewer(function (v) {
						v.setCuttingInactive();
					});
				}
			};

			const result = new service.ViewerInfo(null, null, null, actions);
			result.forEachRelevantViewer = function (f) {
				service.getViewers().forEach(function (v) {
					f(v);
				});
			};

			result.detach = function () {
				const index = viewerWrappers.findIndex(function (item) {
					return item === result;
				});
				if (index >= 0) {
					viewerWrappers.splice(index, 1);
				}
			};

			viewerWrappers.push(result);

			return result;
		};

		service.onViewersChanged = {
			register: function (handler) {
				privateState.onViewersChangedMessenger.register(handler);
			},
			unregister: function (handler) {
				privateState.onViewersChangedMessenger.unregister(handler);
			}
		};

		/**
		 * @ngdoc function
		 * @name registerViewerReadinessChanged
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Registers an event handler that is fired whenever the readiness of a viewer changes.
		 *              It will receive a `ViewerInfo` object as an argument. The event is not fired when a
		 *              viewer container is added or removed.
		 * @param {Function} handler The event handler.
		 */
		service.registerViewerReadinessChanged = function (handler) {
			privateState.onViewerReadinessChanged.register(handler);
		};

		/**
		 * @ngdoc function
		 * @name unregisterViewerReadinessChanged
		 * @function
		 * @methodOf modelViewerViewerRegistryService
		 * @description Unregisters an event handler registered with `registerViewerReadinessChanged`.
		 * @param {Function} handler The event handler.
		 */
		service.unregisterViewerReadinessChanged = function (handler) {
			privateState.onViewerReadinessChanged.unregister(handler);
		};

		modelEvaluationRulesetGroupDataService.registerSelectionChanged(function processRulesetGroupSelectionChange() {
			const selGroup = modelEvaluationRulesetGroupDataService.getSelected();
			const selModelId = modelSelectionService.getSelectedModelId();
			if (selGroup && selModelId) {
				modelEvaluationRulesetResultCacheService.prepareResultsForGroup(selModelId, selGroup.Id);
			}
		});

		return service;
	}
})(angular);
