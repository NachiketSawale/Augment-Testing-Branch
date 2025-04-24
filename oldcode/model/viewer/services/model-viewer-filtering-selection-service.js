/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerFilteringSelectionService
	 * @function
	 *
	 * @description Connects data services (usually for main entities) to the object selection service in order to
	 *              temporarily filter the entities in the data service based upon the selected model objects.
	 */
	angular.module('model.viewer').factory('modelViewerFilteringSelectionService', ['_',
		'modelViewerCompositeModelObjectSelectionService', '$timeout', 'modelViewerStandardFilterService', '$q',
		function (_, modelViewerCompositeModelObjectSelectionService, $timeout, modelViewerStandardFilterService, $q) {
			var service = {};

			var isFirstCall = true;

			function normalizeConfig(config) {
				return _.assign({
					modelParamName: 'selModelId',
					objectParamName: 'selModelObjectIds',
					modelPropName: 'SelectedModelId',
					objectPropName: 'SelectedModelObjectIds',
					suppressModelId: false,
					additionalData: {}
				}, _.isObject(config) ? config : {});
			}

			function FilterByViewerManager(dataService, config) {
				this._dataService = dataService;
				this._isActive = false;
				this._isNewlyDeactivated = false;
				this._currentPendingUpdate = null;
				this._buttons = [];

				this.config = normalizeConfig(config);

				var that = this;
				modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(function () {
					selectionUpdate(that);
				});
			}

			service.FilterByViewerManager = FilterByViewerManager;

			FilterByViewerManager.prototype.isActive = function () {
				return this._isActive;
			};

			FilterByViewerManager.prototype.setActive = function (newValue) {
				var actualNewValue = !!newValue;
				if (this._isActive !== actualNewValue) {
					this._isActive = actualNewValue;
					this._buttons.forEach(function (buttonInfo) {
						buttonInfo.toggleFilteringSelectionBtn.value = actualNewValue;
						if (_.isFunction(buttonInfo.updateTools)) {
							buttonInfo.updateTools();
						}
					});
					if (!actualNewValue) {
						this._isNewlyDeactivated = true;
					}
					updateState(this);
					selectionUpdate(this);
				}
			};

			FilterByViewerManager.prototype.addButton = function (buttonInfo) {
				this._buttons.push(buttonInfo);
				updateState(this);
			};

			FilterByViewerManager.prototype.removeButton = function (buttonInfo) {
				this._buttons.splice(this._buttons.indexOf(buttonInfo), 1);
				updateState(this);
			};

			function selectionUpdate(manager) {
				if (_.isEmpty(manager._buttons) || (!manager._isActive && !manager._isNewlyDeactivated)) {
					return;
				}
				manager._isNewlyDeactivated = false;

				if (manager._currentPendingUpdate) {
					$timeout.cancel(manager._currentPendingUpdate);
				}
				manager._currentPendingUpdate = $timeout(function () {
					var readyForReload = $q.when(null);
					if (manager._isActive) {
						for (var currentService = manager._dataService; currentService; currentService = currentService.parentService()) {
							if (currentService.isRoot) {
								readyForReload = currentService.update();
								break;
							}
						}
					}

					readyForReload.then(function () {
						manager._dataService.updateByModelObjects(!manager._isActive);
					});
				}, 800);
			}

			function updateState(manager) {
				if (manager._isActive && !_.isEmpty(manager._buttons)) {
					modelViewerStandardFilterService.getFilterById('mainEntity').lock();
				} else {
					if (isFirstCall) {
						isFirstCall = false;
					} else {
						modelViewerStandardFilterService.getFilterById('mainEntity').unlock();
					}
					if (manager._currentPendingUpdate) {
						$timeout.cancel(manager._currentPendingUpdate);
						manager._currentPendingUpdate = null;
					}
				}
			}

			return service;
		}]);
})(angular);
