/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelSimulationRetrievalService
	 * @description fetches timeline data from the server
	 */
	angular.module('model.simulation').service('modelSimulationRetrievalService', ModelSimulationRetrievalService);

	ModelSimulationRetrievalService.$inject = ['$http', '$q', '$injector'];

	function ModelSimulationRetrievalService($http, $q, $injector) {
		const self = this;

		self.retrieveTimeline = function retrieveTimeline(request) {
			const modelSimulationMasterService = $injector.get('modelSimulationMasterService');
			request.Options = modelSimulationMasterService.getContextOptions();

			return $http.post(globals.webApiBaseUrl + 'model/simulation/retrieval/retrieve', request).then(function (response) {
				if (response.status === 200) {
					return response.data || [];
				} else {
					return $q.reject(response.status);
				}
			});
		};
	}
})(angular);
