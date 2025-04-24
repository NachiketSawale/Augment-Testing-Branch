/**
 * Created by rei on 22.9.2020
 */

(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	angular.module(moduleName).service('basicsCustomizeExternalDesktopTilesValidationService', BasicsCustomizeGeneralTypeValidationService);
	BasicsCustomizeGeneralTypeValidationService.$inject = ['$q', '$http', 'platformDataValidationService', 'platformRuntimeDataService', 'basicsCustomizeInstanceDataService'];

	function BasicsCustomizeGeneralTypeValidationService($q, $http, platformDataValidationService, platformRuntimeDataService, basicsCustomizeInstanceDataService) {
		var self = this;

		this.asyncValidateUrl = function (entity, value, field) {
			return asyncValidate(entity, value, field);
		};

		this.asyncValidateSsoJwtParametername = function (entity, value, field) {
			return asyncValidate(entity, value, field);
		};

		this.asyncValidateSsoJwtTemplate = function (entity, value, field) {
			return asyncValidate(entity, value, field);
		};

		/**
		 *
		 * @param entity
		 * @param value
		 * @param field
		 * @returns {*}
		 */
		function asyncValidate(entity, value, field) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, field, basicsCustomizeInstanceDataService);
			//var params= "?fieldname="+field+"&value="+value;
			var body = {fieldname: field, value: value};
			//return $http.get(globals.webApiBaseUrl + 'basics/customize/externaldesktoptiles/validatefield' +params)
			return $http.post(globals.webApiBaseUrl + 'basics/customize/externaldesktoptiles/validatefield', body)
				.then(function (response) {
					if (!!response && response.data) {
						var issues = response.data.issues;
						var failed = response.data.failed;
						if (failed) {
							var msg = issues; // ? issues.join("<br>"): ""
							return platformDataValidationService.finishAsyncValidation(
								{valid: false, error: msg},
								entity, value, field, asyncMarker, self, basicsCustomizeInstanceDataService);
						} else {
							return platformDataValidationService.finishAsyncValidation(
								{valid: true},
								entity, value, field, asyncMarker, self, basicsCustomizeInstanceDataService);
						}
					} else {
						return false;
					}
				},
				function failed(/*response*/) {
					return platformDataValidationService.finishAsyncValidation(
						{valid: false, error: 'Service Call failed.'},
						entity, value, field, asyncMarker, self, basicsCustomizeInstanceDataService);
				});
		}
	}
})(angular);
