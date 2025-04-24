/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangeSetSummaryDataService
	 * @function
	 *
	 * @description Retrieves summary data about a model change set.
	 */
	angular.module('model.changeset').factory('modelChangeSetSummaryDataService', modelChangeSetSummaryDataService);

	modelChangeSetSummaryDataService.$inject = ['_', '$translate', '$http', 'modelChangeSetDataService',
		'PlatformMessenger', 'projectMainNiceNameService', 'modelProjectNiceNameService'];

	function modelChangeSetSummaryDataService(_, $translate, $http, modelChangeSetDataService,
		PlatformMessenger, projectMainNiceNameService, modelProjectNiceNameService) {

		const service = {};

		const state = {
			infoChangedMessenger: new PlatformMessenger(),
			registeredCount: 0,
			lastData: {
				selected: false,
				loaded: false,
				summary: null
			}
		};

		function extractCanonicalChangeSetSummary(data, selectedChangeSet) {
			const actualData = angular.isObject(data) ? data : {};

			const result = {};

			// metadata

			result.isReady = selectedChangeSet.ChangeSetStatusFk === 3;

			result.model1NiceName = modelProjectNiceNameService.generateNiceModelNameFromEntity(selectedChangeSet.Model);
			result.model2NiceName = modelProjectNiceNameService.generateNiceModelNameFromEntity(selectedChangeSet.ComparedModel);
			if (selectedChangeSet.Model.ProjectFk !== selectedChangeSet.ComparedModel.ProjectFk) {
				result.model1NiceName = projectMainNiceNameService.joinNameWithProjectName(result.model1NiceName,
					projectMainNiceNameService.generateNiceProjectNameFromEntity(selectedChangeSet.Model.ProjectDto));
				result.model2NiceName = projectMainNiceNameService.joinNameWithProjectName(result.model2NiceName,
					projectMainNiceNameService.generateNiceProjectNameFromEntity(selectedChangeSet.ComparedModel.ProjectDto));
			}

			result.comparisonOptions = {
				modelColumns: selectedChangeSet.CompareModelColumns,
				objects: selectedChangeSet.CompareObjects,
				properties: selectedChangeSet.CompareProperties,
				openings: selectedChangeSet.ExcludeOpenings
			};

			// model column changes

			result.modelChanges = _.map(['Status', 'Code', 'Description', 'LOD', 'Type', 'Comment', 'Remark', 'LiveStatus', 'Schedule', 'EstimateHeader'],
				function (prop) {
					return {
						id: prop,
						name: $translate.instant('model.changeset.changeSetSummary.model' + prop),
						value: !!actualData['model' + prop]
					};
				});

			// changes in resources that exist in both models

			result.changedObjects = angular.isNumber(actualData.changedObjects) ? actualData.changedObjects : 0;
			result.onlyPropertyChangedObjects = angular.isNumber(actualData.onlyPropertyChangedObjects) ? actualData.onlyPropertyChangedObjects : 0;
			result.alsoPropertyChangedObjects = angular.isNumber(actualData.alsoPropertyChangedObjects) ? actualData.alsoPropertyChangedObjects : 0;
			result.changedProperties = angular.isNumber(actualData.changedProperties) ? actualData.changedProperties : 0;

			// changes specific to model 1

			result.totalObjects1 = angular.isNumber(actualData.totalObjects1) ? actualData.totalObjects1 : 0;
			result.onlyObjects1 = angular.isNumber(actualData.onlyObjects1) ? actualData.onlyObjects1 : 0;
			result.totalProperties1 = angular.isNumber(actualData.totalProperties1) ? actualData.totalProperties1 : 0;
			result.onlyProperties1 = angular.isNumber(actualData.onlyProperties1) ? actualData.onlyProperties1 : 0;
			result.onlyObjects1Properties = angular.isNumber(actualData.onlyObjects1Properties) ? actualData.onlyObjects1Properties : 0;

			// changes specific to model 2

			result.totalObjects2 = angular.isNumber(actualData.totalObjects2) ? actualData.totalObjects2 : 0;
			result.onlyObjects2 = angular.isNumber(actualData.onlyObjects2) ? actualData.onlyObjects2 : 0;
			result.totalProperties2 = angular.isNumber(actualData.totalProperties2) ? actualData.totalProperties2 : 0;
			result.onlyProperties2 = angular.isNumber(actualData.onlyProperties2) ? actualData.onlyProperties2 : 0;
			result.onlyObjects2Properties = angular.isNumber(actualData.onlyObjects2Properties) ? actualData.onlyObjects2Properties : 0;

			// computed changes

			result.unchangedObjects = result.totalObjects1 - result.onlyObjects1 - result.changedObjects;
			result.unchangedProperties = result.totalProperties1 - result.onlyProperties1 - result.onlyObjects1Properties - result.changedProperties;

			result.maxObjects = Math.max(result.totalObjects1, result.totalObjects2);
			result.maxProperties = Math.max(result.totalProperties1, result.totalProperties2);

			return result;
		}

		/**
		 * @ngdoc function
		 * @name retrieveData
		 * @function
		 * @methodOf modelChangeSetSummaryDataService
		 * @description Issues a server call to retrieve the summary data for a given change set.
		 * @param {Number} modelId The model ID.
		 * @param {Number} changeSetId The change set ID.
		 * @return {Promise<Object>} A promise that is resolved to the summary data object.
		 */
		function retrieveData(modelId, changeSetId) {
			return $http.get(globals.webApiBaseUrl + 'model/changeset/summary/get?modelId=' + modelId + '&changeSetId=' + changeSetId).then(function (response) {
				return response.data;
			});
		}

		function updateData() {
			let data = state.lastData;

			if (state.registeredCount > 0) {
				const selChangeSet = modelChangeSetDataService.getSelected();

				if (selChangeSet) {
					data = {
						selected: true,
						loaded: false,
						summary: null
					};
					retrieveData(selChangeSet.ModelFk, selChangeSet.Id).then(function (summary) {
						data = {
							selected: true,
							loaded: true,
							summary: extractCanonicalChangeSetSummary(summary, selChangeSet)
						};
						state.lastData = data;
						state.infoChangedMessenger.fire(data);
					});
				} else {
					data = {
						selected: false,
						loaded: false,
						summary: null
					};
				}
			}

			state.lastData = data;
			state.infoChangedMessenger.fire(data);
		}

		modelChangeSetDataService.registerSelectionChanged(updateData);

		service.registerInfoChanged = function (handler) {
			state.infoChangedMessenger.register(handler);
			state.registeredCount++;
			if (state.registeredCount === 1) {
				updateData();
			} else {
				handler(state.lastData);
			}
		};

		service.unregisterInfoChanged = function (handler) {
			state.infoChangedMessenger.unregister(handler);
			if (state.registeredCount > 0) {
				state.registeredCount--;
			}
		};

		return service;
	}
})(angular);
