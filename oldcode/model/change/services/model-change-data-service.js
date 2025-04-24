/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.change';

	angular.module(moduleName).factory('modelChangeDataService', modelChangeDataService);

	modelChangeDataService.$inject = ['_', 'platformDataServiceFactory', 'modelViewerModelSelectionService', '$timeout',
		'modelViewerStandardFilterService'];

	function modelChangeDataService(_, platformDataServiceFactory, modelViewerModelSelectionService, $timeout,
		modelViewerStandardFilterService) {

		const state = {
			modelId: null,
			changeSetId: null,
			isChangeSetDetermined: () => _.isInteger(state.modelId) && _.isInteger(state.changeSetId)
		};

		const modelChangeServiceOption = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'modelChangeDataService',
				entityNameTranslationID: 'model.main.entityChange',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/change/',
					endRead: 'filtered',
					extendSearchFilter: function extendSearchFilter(filterRequest) {
						if (state.isChangeSetDetermined()) {
							filterRequest.furtherFilters = [
								{Token: 'MDL_MODEL', Value: state.modelId},
								{Token: 'MDL_CHANGESET', Value: state.changeSetId}
							];
						} else {
							filterRequest.furtherFilters = [
								{Token: 'MDL_MODEL', Value: -1},
								{Token: 'MDL_CHANGESET', Value: -1}
							];
						}
					},
					usePostForRead: true
				},
				actions: {
					create: false,
					delete: false
				},
				dataProcessor: [{
					processItem: function doProcessItem(change) {
						change.CompoundId = change.ModelFk + '/' + change.ChangeSetFk + '/' + change.Id;
						change.Value = '';
						change.ValueCmp = '';
					}
				}],
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
							isActive: false
						},
						showProjectContext: false,
						withExecutionHints: false
					}
				},
				entityRole: {
					root: {
						codeField: null,
						descField: 'DisplayName',
						itemName: 'Change',
						moduleName: 'cloud.desktop.moduleDisplayNameModelChange',
						useIdentification: true
					}
				},
				entitySelection: {
					supportsMultiSelection: true
				},
				filterByViewer: true
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(modelChangeServiceOption, this);
		const service = serviceContainer.service;

		service.registerListLoaded(modelViewerStandardFilterService.updateMainEntityFilter);
		service.registerSelectedEntitiesChanged(modelViewerStandardFilterService.updateMainEntityFilter);

		let isInitialized = false;

		service.selectAfterNavigation = function (changeSet) {
			state.modelId = changeSet.ModelFk;
			state.changeSetId = changeSet.Id;
			if (isInitialized) {
				service.load();
			}
		};

		service.getChangeSetId = function () {
			return state.isChangeSetDetermined() ? {
				modelId: state.modelId,
				changeSetId: state.changeSetId
			} : null;
		};

		$timeout(function () {
			if (state.isChangeSetDetermined()) {
				service.load();
			}
			isInitialized = true;
		});

		return service;
	}
})(angular);
