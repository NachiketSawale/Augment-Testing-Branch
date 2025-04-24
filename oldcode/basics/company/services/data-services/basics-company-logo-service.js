/**
 * Created by balkanci on 12.11.2015.
 */
(function () {
	'use strict';
	var companyModule = angular.module('basics.company');
	companyModule.factory('basicsCompanyLogoService', ['globals', 'basicsCompanyMainService', 'platformFileUtilServiceFactory',

		function (globals, basicsCompanyMainService, platformFileUtilServiceFactory) {

			var config = {
				deleteUrl: globals.webApiBaseUrl + 'basics/company/logo/delete',
				importUrl: globals.webApiBaseUrl + 'basics/company/logo/importlogo',
				getUrl: globals.webApiBaseUrl + 'basics/company/logo/exportlogo',
				fileFkName: 'BlobsFk',
				dtoName: 'CompanyDto'
			};
			return platformFileUtilServiceFactory.getFileService(config, basicsCompanyMainService);

		}]);
})(angular);