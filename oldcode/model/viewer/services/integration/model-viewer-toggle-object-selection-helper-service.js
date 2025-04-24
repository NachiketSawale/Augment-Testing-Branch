/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerToggleObjectSelectionHelperService
	 * @function
	 *
	 * @description Provides functionality for selecting model objects based on
	 * a selection from a data service.
	 */
	angular.module('model.viewer').factory('modelViewerToggleObjectSelectionHelperService',
		modelViewerToggleObjectSelectionHelperService);

	modelViewerToggleObjectSelectionHelperService.$inject = ['_', '$injector', '$q',
		'platformObservableService', 'modelViewerModelSelectionService',
		'modelViewerCompositeModelObjectSelectionService', 'modelViewerModelIdSetService'];

	function modelViewerToggleObjectSelectionHelperService(_, $injector, $q,
		platformObservableService, modelViewerModelSelectionService,
		modelViewerCompositeModelObjectSelectionService, modelViewerModelIdSetService) {

		return {
			initializeObservable: function (config) {
				const actualConfig = _.assign({
					observableName: 'updateModelSelection'
				}, _.isObject(config) ? config : {});

				if (_.isString(actualConfig.dataService)) {
					actualConfig.dataService = $injector.get(actualConfig.dataService);
				}
				if (!_.isObject(actualConfig.dataService)) {
					throw new Error('No data service specified.');
				}

				if (!_.isFunction(actualConfig.retrieveObjectIds)) {
					if (_.isFunction(actualConfig.dataService.retrieveModelObjectIds)) {
						actualConfig.retrieveObjectIds = function (info) {
							return actualConfig.dataService.retrieveModelObjectIds(info);
						};
					} else {
						throw new Error('No retrieveObjectIds function supplied in config and no retrieveModelObjectIds function found on data service.');
					}
				}

				actualConfig.dataService[actualConfig.observableName] = platformObservableService.createObservableBoolean({
					initialValue: Boolean(actualConfig.initialValue)
				});
				actualConfig.dataService[actualConfig.observableName].uiHints = {
					id: 'toggleObjectSelection',
					caption$tr$: actualConfig.titleKey,
					iconClass: 'tlb-icons ico-view-select'
				};

				function updateModelSelectionIfRequired() {
					if (actualConfig.dataService[actualConfig.observableName].getValue()) {
						const selModelId = modelViewerModelSelectionService.getSelectedModelId();
						if (selModelId) {
							const selItems = actualConfig.dataService.getSelectedEntities();

							if (selItems.length > 0) {
								return $q.when(actualConfig.retrieveObjectIds({
									items: selItems,
									modelId: selModelId
								})).then(function (objectIds) {
									if (_.isString(objectIds)) {
										objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(objectIds);
									}
									objectIds = objectIds.useSubModelIds();

									modelViewerCompositeModelObjectSelectionService.setSelectedObjectIds(objectIds);
								});
							}
						}
					}
				}

				actualConfig.dataService[actualConfig.observableName].registerValueChanged(updateModelSelectionIfRequired);
				actualConfig.dataService.registerSelectedEntitiesChanged(updateModelSelectionIfRequired);
			}
		};
	}
})(angular);