/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangesetProvideModelFiltersService
	 * @function
	 *
	 * @description Defines the module-specific model filters available in the Model Change Set module.
	 */
	angular.module('model.changeset').factory('modelChangesetProvideModelFiltersService',
		modelChangesetProvideModelFiltersService);

	modelChangesetProvideModelFiltersService.$inject = ['_', '$http', 'modelChangeSetDataService',
		'modelViewerFilterDefinitionService', 'modelViewerModelSelectionService', 'modelViewerObjectTreeService',
		'modelChangesetModelFilterService'];

	function modelChangesetProvideModelFiltersService(_, $http, modelChangeSetDataService,
		modelViewerFilterDefinitionService, modelViewerModelSelectionService, modelViewerObjectTreeService,
		modelChangesetModelFilterService) {

		const privateState = {
			changeSetFilter: _.assign(new modelViewerFilterDefinitionService.LazyFilter(function lazilyUpdateModelChangeSetFilter(results) {
				const selChangeSet = modelChangeSetDataService.getSelected();
				const selModel = modelViewerModelSelectionService.getSelectedModel();
				const treeInfo = modelViewerObjectTreeService.getTree();

				if (selChangeSet && selModel && treeInfo && selModel.subModels.some(function (sm) {
					return (selChangeSet.ModelFk === sm.info.modelId) || (selChangeSet.ModelCmpFk === sm.info.modelId);
				})) {
					return $http.get(globals.webApiBaseUrl + 'model/change/objectchanges?modelId=' + selChangeSet.ModelFk + '&changeSetId=' + selChangeSet.Id).then(function (response) {
						const idMap = treeInfo.createMeshIdMap('i');
						modelChangesetModelFilterService.addObjectsAsMeshesWithValue(response.data.c, '~', idMap);
						modelChangesetModelFilterService.addObjectsAsMeshesWithValue(response.data.m1, '+', idMap);
						modelChangesetModelFilterService.addObjectsAsMeshesWithValue(response.data.m2, '-', idMap);
						results.updateMeshStates(idMap);
					});
				} else {
					results.excludeAll();
				}
			}), {
				id: 'changeSet',
				translationKeyRoot: 'model.changeset.filters.changeSet'
			}),
			filterProviderFunc: function provideModelChangeSetFilters() {
				return [privateState.changeSetFilter];
			}
		};

		modelChangeSetDataService.registerSelectionChanged(function updateModelChangeSetFilters() {
			privateState.changeSetFilter.update();
		});

		return privateState.filterProviderFunc;
	}
})(angular);
