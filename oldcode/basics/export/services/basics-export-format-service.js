(function () {
	'use strict';

	angular.module('basics.export').factory('basicsExportFormatService', ['$http',
		function ($http) {
			var service = {};
			var validExcelProfileContexts;
			var excelProfiles = [];

			service.addValidExcelProfileContexts = function(validExcelProfileContextsParam) {
				validExcelProfileContexts = ['General'];
				if (validExcelProfileContextsParam) {
					validExcelProfileContexts = validExcelProfileContexts.concat(validExcelProfileContextsParam);
				}
			};

			service.loadExcelProfiles = function() {
				return $http.get(globals.webApiBaseUrl + 'basics/common/excelprofile/profiles')
					.then(function(response) {
						excelProfiles = [];
						if (response.data) {
							_.forEach(response.data, function(excelProfile) {
								if (excelProfile.IsLive && validExcelProfileContexts.includes(excelProfile.ProfileContext)) {
									excelProfiles.push({ 'Id': excelProfile.Id, 'Description': excelProfile.DescriptionInfo.Translated, 'ProfileContext': excelProfile.ProfileContext, 'IsDefault': excelProfile.IsDefault });
								}
							});
						}
					});
			};

			service.getList = function () {
				return excelProfiles;
			};

			return service;
		}
	]);
})(angular);
