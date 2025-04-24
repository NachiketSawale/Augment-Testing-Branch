/**
 * Created by lcn on 5/7/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';

	angular.module(moduleName).controller('businessPartnerMainUnitgroupFormController', ['$scope', 'platformDetailControllerService', 'businessPartnerMainUnitgroupDataService', 'businessPartnerMainUnitgroupValidationService', 'businessPartnerMainUnitgroupUIStandardService', 'platformTranslateService', function ($scope, platformDetailControllerService, dataService, validationService, UIStandardService, platformTranslateService) {
		platformDetailControllerService.initDetailController($scope, dataService, validationService, UIStandardService, UIStandardService, platformTranslateService);
	}]);
})(angular);
