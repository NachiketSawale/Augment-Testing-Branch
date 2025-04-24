(function (angular) {
	'use strict';
	let moduleName = 'qto.main';
	let salesWipModule = angular.module(moduleName);
	salesWipModule.factory('qtoCommentComboboxDataService', ['_', 'globals', '$http', function (_, globals, $http) {
		
		let service = {};
		let qtoCommentList = [];
		
		service.getItemById = function (value) {
			return _.find(qtoCommentList, {Id: value});
		};
		
		service.getQtoCommentList = function (qtoHeaderFk) {
			return $http.get(globals.webApiBaseUrl + 'qto/main/header/getQtoComments?qtoHeaderFk=' + qtoHeaderFk).then(function (response) {
				qtoCommentList = _.uniqBy(response.data, 'Id');
				return _.uniqBy(qtoCommentList);
			});
		};
		
		service.clearDataCache = function clearDataCache() {
			qtoCommentList = [];
		};
		
		return service;
	}]);
})(angular);
