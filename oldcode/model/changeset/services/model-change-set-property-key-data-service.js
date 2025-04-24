/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangeSetPropertyKeyDataService
	 * @function
	 *
	 * @description Retrieves summary data about a model change set.
	 */
	angular.module('model.changeset').factory('modelChangeSetPropertyKeyDataService',
		modelChangeSetPropertyKeyDataService);

	modelChangeSetPropertyKeyDataService.$inject = ['_', '$translate', '$http', 'modelChangeSetDataService',
		'PlatformMessenger'];

	function modelChangeSetPropertyKeyDataService(_, $translate, $http, modelChangeSetDataService,
		PlatformMessenger) {

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

		function extractCanonicalChangeSetPropertyKeySummary(data) {
			const result = {
				items: []
			};

			result.items = _.map(data, function (d) {
				return {
					changed: d.changedCount,
					only1: d.addedCount,
					only2: d.removedCount,
					total: d.changedCount + d.addedCount + d.removedCount,
					id: d.propertyKeyFk,
					name: d.propertyName
				};
			});
			result.items = _.filter(result.items, function (d) {
				return d.total > 0;
			});
			result.items = result.items.sort(service.comparePropertyKeys);

			return result;
		}

		/**
		 * @ngdoc function
		 * @name retrieveData
		 * @function
		 * @methodOf modelChangeSetPropertyKeyDataService
		 * @description Issues a server call to retrieve the summary data for a given change set.
		 * @param {Number} modelId The model ID.
		 * @param {Number} changeSetId The change set ID.
		 * @return {Promise<Object>} A promise that is resolved to the summary data object.
		 */
		function retrieveData(modelId, changeSetId) {
			return $http.get(globals.webApiBaseUrl + 'model/changeset/summary/listpropkeys?modelId=' + modelId + '&changeSetId=' + changeSetId).then(function (response) {
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
							summary: extractCanonicalChangeSetPropertyKeySummary(summary)
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

		service.comparePropertyKeys = function (a, b) {
			if (a.total > b.total) {
				return -1;
			} else if (a.total < b.total) {
				return 1;
			} else {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			}
		};

		return service;
	}
})(angular);
