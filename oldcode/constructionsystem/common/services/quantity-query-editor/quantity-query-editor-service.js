/**
 * Created by Jim on 3/13/2017.
 */
/* global globals */
(function (angular) {
	'use strict';
	var moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsQuantityQueryEditorService', [
		'$http', 'PlatformMessenger', 'platformContextService',
		function ($http, PlatformMessenger, platformContextService) {

			var service = {};

			service.defaultLanguageId = platformContextService.getDataLanguageId() === 0 ? 1 : platformContextService.getDataLanguageId();
			service.selectedLanguageId = service.defaultLanguageId;
			service.selectedCosMasterParameterLanguageId = service.defaultLanguageId;
			service.currentCosMasterParameterQuantityQueryTranslationEntity = null;

			service.selectedCosMasterParameter2TemplateLanguageId = service.defaultLanguageId;
			service.currentCosMasterParameter2TemplateQuantityQueryTranslationEntity = null;

			service.ribFunctionsXMLAndUomOjbectArray={};
			service.languageCodeMapLanguageIdOject=null;

			/**
			 * get the content of the RIBFunctions.xml
			 **/
			service.getRIBFunctioinsXMLAndUoM = function getRIBFunctioinsXMLAndUoM(languageCode) {
				return $http.get(
					globals.webApiBaseUrl + 'constructionsystem/master/quantityquery/getRIBFunctioinsXMLAndUoM?languageCode=' + languageCode
				).then(function (result) {
					return result.data;
				});
			};

			service.codeMirrorContentChange = new PlatformMessenger();

			return service;
		}
	]);
})(angular);