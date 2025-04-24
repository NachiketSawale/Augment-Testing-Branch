/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerCompletionDegreeFilterService
	 * @function
	 *
	 * @description Provides a model filter to filtering model objects by the degree of
	 *   completion as reported via activities.
	 */
	angular.module('model.viewer').factory('modelViewerCompletionDegreeFilterService',
		modelViewerCompletionDegreeFilterService);

	modelViewerCompletionDegreeFilterService.$inject = ['modelViewerFilterDefinitionService',
		'modelViewerReportingPeriodService', 'modelViewerObjectTreeService',
		'modelViewerModelSelectionService', '$http', 'modelViewerObjectIdMapService',
		'modelViewerModelIdSetService', '$injector'];

	function modelViewerCompletionDegreeFilterService(modelViewerFilterDefinitionService,
		modelViewerReportingPeriodService, modelViewerObjectTreeService,
		modelViewerModelSelectionService, $http, modelViewerObjectIdMapService,
		modelViewerModelIdSetService, $injector) {

		class CompletionDegreeFilter extends modelViewerFilterDefinitionService.LazyFilter {
			constructor() {
				super(function evaluateCompletionDegreeFilter (results) {
					const modelId = modelViewerModelSelectionService.getSelectedModelId();

					if (modelId) {
						const reportingPeriod = modelViewerReportingPeriodService.getReportingPeriod();
						const treeInfo = modelViewerObjectTreeService.getTree();

						return $http.get(globals.webApiBaseUrl + 'model/main/objectCompletion/getCompletionDegree', {
							params: {
								fromDate: reportingPeriod.start.toISOString(),
								toDate: reportingPeriod.end.toISOString(),
								modelId: modelId
							}
						}).then(function (response) {
							if (Array.isArray(response.data)) {
								// assign default state 'e' to all meshes
								const resultData = modelViewerModelSelectionService.forEachSubModel(function (subModelId) {
									const modelTreeInfo = treeInfo[subModelId];
									return new modelViewerObjectIdMapService.ObjectIdMap(modelTreeInfo.allMeshIds(), 'e');
								});

								// override states as received from server
								response.data.forEach(function (resultGroup) {
									// each group matches a state; all mesh IDs from all models for the current state are retrieved
									const meshIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(resultGroup.ids).useSubModelIds();
									// the state code is assigned to all relevant mesh IDs
									resultData.assign(meshIds, resultGroup.key);
								});

								// activate results
								results.updateMeshStates(resultData);
							} else {
								results.excludeAll();
							}
						});
					} else {
						results.excludeAll();
					}
				});
			}

			getDescriptors() {
				return [{
					type: 'completionDegree'
				}];
			}

			getStateDescArguments() {
				const result = this.countByMeshState(true, true);

				const reportingPeriod = modelViewerReportingPeriodService.getReportingPeriod();
				result.reportingPeriodStart = reportingPeriod.start.format('YYYY-MM-DD');
				result.reportingPeriodEnd = reportingPeriod.end.format('YYYY-MM-DD');

				return result;
			}
		}

		let modelViewerStandardFilterService = null;

		function updateCompletionStateFilter() {
			if (!modelViewerStandardFilterService) {
				modelViewerStandardFilterService = $injector.get('modelViewerStandardFilterService');
			}
			modelViewerStandardFilterService.getFilterById('completionDegree').update();
		}

		modelViewerReportingPeriodService.registerReportingPeriodUpdated(function () {
			updateCompletionStateFilter();
		});

		return {
			CompletionDegreeFilter
		};
	}
})(angular);