/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsEndpointService
	 * @function
	 *
	 * @description Retrieves a server-side endpoint for the HOOPS 3D viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsEndpointService',
		modelViewerHoopsEndpointService);

	modelViewerHoopsEndpointService.$inject = ['$http', '$window', '$q', 'Communicator',
		'platformPermissionService', 'permissions', 'modelViewerModelSelectionService',
		'modelViewerHoopsVersion'];

	function modelViewerHoopsEndpointService($http, $window, $q, Communicator,
		platformPermissionService, permissions, modelViewerModelSelectionService,
		modelViewerHoopsVersion) {

		const service = {};

		function concatWithSlash(first, second) {
			if (!first.endsWith('/')) {
				first = first + '/';
			}
			if (second.startsWith('/')) {
				second = second.substring(1);
			}
			return first + second;
		}

		/**
		 * @ngdoc function
		 * @name retrieveInstanceUri
		 * @function
		 * @methodOf modelViewerHoopsEndpointService
		 * @description Retrieves the endpoint instance URI that the HOOPS 3D viewer can connect to. The service
		 *              respects the current user's permissions and will not retrieve a server-side rendering
		 *              endpoint URL if the user does not have the permission for server-side rendering.
		 * @param {Communicator.RendererType} rendererType The renderer type to use.
		 * @returns {Promise<String>} The instance URI of the viewer endpoint, or `null` if no instance URI could be
		 *                            retrieved.
		 * @throws {Error} If an invalid `rendererType` is supplied.
		 */
		service.retrieveInstanceUri = function (rendererType) {
			const selModelId = modelViewerModelSelectionService.getSelectedModelId();
			return $http.post(globals.webApiBaseUrl + 'model/viewer/hoops/connect', {
				ModelId: selModelId,
				RenderingMode: (function encodeRendererType(rendererType) {
					switch (rendererType) {
						case Communicator.RendererType.Server:
							return 'ssr';
						case Communicator.RendererType.Client:
							return 'csr';
						default:
							throw new Error('Unsupported renderer type: ' + rendererType);
					}
				})(rendererType),
				SoftwareVersion: modelViewerHoopsVersion
			}).then(function (response) {
				if (response.data) {
					if (response.data.Success) {
						return {
							uri: (function prepareUrl(urlSuffix, proxy) {
								let urlPrefix = proxy || $window.location.origin + globals.baseUrl;
								urlPrefix = urlPrefix.replace(/^http/i, 'ws');
								return concatWithSlash(urlPrefix, urlSuffix);
							})(response.data.Endpoint.Url, response.data.Proxy),
							serviceId: response.data.Endpoint.Id
						};
					} else {
						throw new Error('Connection request failed on server: ' + response.data.Message);
					}
				}
				return null;
			}, function (reason) {
				throw new Error('Connection request failed: ' + reason);
			});
		};

		return service;
	}
})(angular);
