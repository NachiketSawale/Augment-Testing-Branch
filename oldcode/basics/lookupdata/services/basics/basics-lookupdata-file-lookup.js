(function (angular) {
	'use strict';
	angular.module('basics.lookupdata').directive('basicLookupDataFileLookup', ['$http', 'BasicsLookupdataLookupDirectiveDefinition', '$q', 'basicsLookupFileService',
		function ($http, BasicsLookupdataLookupDirectiveDefinition, $q, basicsLookupFileService) {
			var defaults = {
				lookupType: 'basicLookupDataFileLookup',
				valueMember: 'Id',
				displayMember: 'OriginalName'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: {
					getList: function () {
						return null;
					},
					getItemByKey: function (key) {
						return basicsLookupFileService.getItemById(key);
					}
				}
			});
		}
	]);
})(angular);

(function (angular) {
	'use strict';
	angular.module('basics.lookupdata').factory('basicsLookupFileService', ['$http', '$q',

		function ($http, $q) {

			var serviceInterface = {
				getItemByIdAsync: function (key) {
					return $http.get(globals.webApiBaseUrl + 'basics/common/file/info/' + key).then(function (result) {
						return result.data;
					});
				},
				getItemById: function () {
					return null;
				},

				getFileHtml: function (docId) {
					var defer = $q.defer();
					$http.get(globals.webApiBaseUrl + 'basics/common/document/preview', {params: {fileArchiveDocId: docId}}).then(function (result) {
						$http.get(result.data).then(function (response) {
							defer.resolve(response.data);
						});
					});
					return defer.promise;
				}
			};
			return serviceInterface;

		}]);
})(angular);
