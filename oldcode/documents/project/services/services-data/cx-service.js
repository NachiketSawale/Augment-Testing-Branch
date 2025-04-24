(function (angular) {
	/* global */
	'use strict';
	var moduleName = 'documents.project';
	var projectMainModule = angular.module(moduleName);
	projectMainModule.factory('cxService', ['globals','$http', '$q', function (globals,$http, $q) {
		var services = {};

		services.getCxUrl = function () {
			var defer = $q.defer();
			var url = globals.webApiBaseUrl + 'documentproject/cx/getCxUrl';
			$http.get(url).then(function (response) {
				if (response.data) {
					defer.resolve(response.data);
				}
			}, function (response) {
				defer.resolve(response.data);
			});
			return defer.promise;
		};

		services.LoginCx = function () {
			var defer = $q.defer();
			// var tempdata=JSON.parse(localStorage.getItem('cxMsg'));
			var currentTime = (new Date().getTime());
			// if(!tempdata||(tempdata&&((tempdata.expire-15*60*1000)<currentTime))){
			var url = globals.webApiBaseUrl + 'documentproject/cx/login';
			$http.get(url).then(function (response) {
				if (response.data) {
					var cxMsg = {
						key: response.data.key,
						url: response.data.url,
						expire: currentTime
					};
					localStorage.setItem('cxMsg', JSON.stringify(cxMsg));
					defer.resolve(response.data);
				}
			}, function (response) {
				defer.resolve(response.data);
			});
			return defer.promise;
		};

		services.uploadCx = function (Json) {
			var defer = $q.defer();
			var url = globals.webApiBaseUrl + 'documentproject/cx/upload';
			$http.post(url, {fileJson: Json}).then(function (response) {
				if (response.data) {
					defer.resolve(response.data);
				}
			});
			return defer.promise;
		};

		return services;
	}]);
})(angular);
