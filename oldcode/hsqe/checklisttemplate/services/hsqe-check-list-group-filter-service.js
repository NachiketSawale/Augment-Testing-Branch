(function (angular) {

	'use strict';

	var moduleName = 'hsqe.checklisttemplate';

	angular.module(moduleName).factory('hsqeCheckListGroupFilterService', ['hsqeCheckListGroupFilterServiceProvider', function (hsqeCheckListGroupFilterServiceProvider) {


		return hsqeCheckListGroupFilterServiceProvider.getFilterService('hsqeCheckListGroupFilterService');

	}]);

})(angular);