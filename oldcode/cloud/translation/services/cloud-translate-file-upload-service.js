/**
 * Created by balkanci on 12.11.2015.
 */
(function () {
	'use strict';
	const companyModule = angular.module('cloud.translation');
	companyModule.factory('cloudTranslationFileUploadService', ['cloudTranslationResourceDataService', 'platformFileUtilServiceFactory', 'globals',

		function (cloudTranslationResourceDataService, platformFileUtilServiceFactory, globals) {

			const config = {
				importUrl: globals.webApiBaseUrl + 'cloud/translation/resource/import/json',
				// no mainService selection is needed for uploading a translation file
				standAlone: 'true'
			};
			return platformFileUtilServiceFactory.getFileService(config, cloudTranslationResourceDataService);

		}]);
})(angular);