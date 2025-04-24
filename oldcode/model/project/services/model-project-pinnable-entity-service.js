/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectPinnableEntityService
	 * @function
	 * @requires $http, cloudDesktopPinningContextService
	 *
	 * @description A pinning context service adapter for models.
	 */
	angular.module('model.project').factory('modelProjectPinnableEntityService', ['$http',
		'cloudDesktopPinningContextService', '_',
		function ($http, cloudDesktopPinningContextService, _) {
			return cloudDesktopPinningContextService.createPinnableEntityService({
				token: 'model.main',
				retrieveInfo: function (id) {
					return $http.get(globals.webApiBaseUrl + 'model/project/model/name', {
						params: {
							modelId: id
						}
					}).then(function (response) {
						if (response) {
							if (response.data) {
								return cloudDesktopPinningContextService.concate2StringsWithDelimiter(response.data.Code, _.get(response.data, 'DescriptionInfo.Translated'), ' - ');
							}
						}
						return '';
					});
				}
			});
		}]);
})(angular);
