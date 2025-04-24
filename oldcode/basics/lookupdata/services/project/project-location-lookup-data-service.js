/**
 * Created by Frank and Benjamin on 24.02.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectLocationLookupDataService
	 * @function
	 *
	 * @description
	 * projectLocationLookupDataService is the data service for all location look ups
	 */
	angular.module('basics.lookupdata').factory('projectLocationLookupDataService', ['_', '$http', '$translate', 'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension',
		'projectLocationMainImageProcessor', '$httpParamSerializer',

		function (_, $http, $translate, platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, projectLocationMainImageProcessor, $httpParamSerializer) {
			let errMessage = null;

			function getErrorMessage() {
				if(errMessage === null) {
					errMessage = $translate.instant('cloud.common.errFastRecordedCodeNotFound');
				}

				return errMessage;
			}

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'project/location/', endPointRead: 'tree' },
				filterParam: 'projectId',
				dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor],
				tree: { parentProp: 'LocationParentFk', childProp: 'Locations' },
				dataIsAlreadySorted: true,
				resolveStringValueCallback: function resolveStringValueCallbackForProjectLocation(value, options, service, entity, columnDef) {
					return $http.get(globals.webApiBaseUrl + 'project/location/fastsearch?' + $httpParamSerializer({
						project: columnDef.editorOptions.lookupOptions.filter(entity),
						code: value
					})).then(function(result) {
						let filteredLocation = _.find(result.data, location =>
							location.Code === value
						);

						if (filteredLocation) {
							return {
								apply: true,
								valid: true,
								value: filteredLocation.Id
							};
						}

						return {
							apply: true,
							valid: false,
							value: value,
							error: getErrorMessage()
						};
					});
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
