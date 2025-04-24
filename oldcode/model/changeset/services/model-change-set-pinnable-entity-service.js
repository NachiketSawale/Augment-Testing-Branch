/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.changeset.modelChangeSetPinnableEntityService
	 * @function
	 *
	 * @description A pinning context service adapter for change sets.
	 */
	angular.module('model.changeset').factory('modelChangeSetPinnableEntityService',
		modelChangeSetPinnableEntityService);

	modelChangeSetPinnableEntityService.$inject = ['$http', 'cloudDesktopPinningContextService',
		'modelViewerModelSelectionService'];

	function modelChangeSetPinnableEntityService($http, cloudDesktopPinningContextService,
		modelViewerModelSelectionService) {

		return cloudDesktopPinningContextService.createPinnableEntityService({
			token: 'model.changeset',
			retrieveInfo: function (id) {
				return $http.get(globals.webApiBaseUrl + 'model/changeset/getsimplified?modelId=' + modelViewerModelSelectionService.getSelectedModelId() + '&changeSetId=' + id).then(function (response) {
					if (response) {
						if (response.data) {
							return response.data.DescriptionInfo.Translated;
						}
					}
					return '';
				});
			},
			dependsUpon: ['model.main']
		});
	}
})(angular);
