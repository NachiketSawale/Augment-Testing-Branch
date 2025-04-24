/**
 * Created by Shankar on 13.02.2024.
 */
(function () {
	'use strict';
	var companyModule = angular.module('basics.company');
	companyModule.factory('basicsCompanyLetterHeadService', ['globals', 'basicsCompanyMainService', 'platformFileUtilServiceFactory',

		function (globals, basicsCompanyMainService, platformFileUtilServiceFactory) {

			var config = {
				deleteUrl: globals.webApiBaseUrl + 'basics/company/letterhead/delete',
				importUrl: globals.webApiBaseUrl + 'basics/company/letterhead/importletterhead',
				getUrl: globals.webApiBaseUrl + 'basics/company/letterhead/exportletterhead',
				fileFkName: 'BlobsLetterHeaderFk',
				dtoName: 'CompanyDto'
			};
			return platformFileUtilServiceFactory.getFileService(config, basicsCompanyMainService);

		}]);
})(angular);