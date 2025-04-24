
(function (angular) {

	'use strict';

	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).factory('constructionSystemMasterGroupFilterService', ['constructionSystemMasterFilterServiceProvider', function (constructionSystemMasterFilterServiceProvider) {


		var service = constructionSystemMasterFilterServiceProvider.getFilterService('constructionSystemMasterGroupFilterService');

		return service;

	}]);

})(angular);