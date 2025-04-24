/**
 * Created by wui on 4/23/2015.
 */

(function () {
	'use strict';

	angular.module('basics.common').factory('basicsCommonMapKeyService', ['$http', '$q', 'PlatformMessenger', 'globals',
		function ($http, $q, PlatformMessenger, globals) {

			let service = {}, getMapOptionsPromise = null;

			service.key = '';

			service.mapOptions = {
				loaded: false,
				Provider: 'google',
				BingKey: '',
				GoogleKey: '',
				BaiduKey: '',
				OpenStreetQueryMode: 0, // 0=Structured query; 1=Free-form query
				showByDefault: false
			};

			service.onMapChanged = new PlatformMessenger();

			service.updateMap = function (provider) {
				if (service.mapOptions.Provider !== provider) {
					service.mapOptions.Provider = provider;
					$http.post(globals.webApiBaseUrl + 'basics/common/systemoption/updatemapprovider', {value: provider}).then(function () {
						service.onMapChanged.fire();
					});
				}
			};

			service.updateMapState = function (value) {
				if (service.mapOptions.showByDefault !== value) {
					service.mapOptions.showByDefault = value;
				}
			};

			service.getMapOptions = function () {
				const deferred = $q.defer();

				if (service.mapOptions.loaded) {
					deferred.resolve(service.mapOptions);
				} else {
					if (!getMapOptionsPromise) {
						getMapOptionsPromise = $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/map');
					}
					getMapOptionsPromise.then(function (response) {
						service.mapOptions.Provider = response.data.Provider;
						service.mapOptions.BingKey = response.data.BingKey;
						service.mapOptions.GoogleKey = response.data.GoogleKey;
						service.mapOptions.BaiduKey = response.data.BaiduKey;
						service.mapOptions.OpenStreetQueryMode = response.data.OpenStreetQueryMode;
						deferred.resolve(service.mapOptions);
					}, function () {
						deferred.reject('fail to get map options');
					}).finally(function () {
						getMapOptionsPromise = null;
						service.mapOptions.loaded = true;
					});
				}

				return deferred.promise;
			};

			service.getMapOptionsFromCache = function () {
				return service.mapOptions;
			};

			return service;

		}
	]);

})(angular);
