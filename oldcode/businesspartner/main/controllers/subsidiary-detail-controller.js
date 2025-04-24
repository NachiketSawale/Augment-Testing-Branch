/**
 * Created by zos on 12/25/2014.
 */
(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainSubsidiaryDetailController', ['$scope', 'platformDetailControllerService', 'platformTranslateService', 'businesspartnerMainSubsidiaryDataService', 'businessPartnerMainSubsidiaryUIStandardService', 'businesspartnerMainSubsidiaryValidationService',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($scope, platformDetailControllerService, platformTranslateService, businesspartnerMainSubsidiaryDataService, businessPartnerMainSubsidiaryUIStandardService, businesspartnerMainSubsidiaryValidationService) {
			var translateService = {
				translateFormConfig: function translateFormConfig(formConfig) {
					platformTranslateService.translateFormConfig(formConfig);
				}
			};

			platformDetailControllerService.initDetailController($scope, businesspartnerMainSubsidiaryDataService, businesspartnerMainSubsidiaryValidationService(businesspartnerMainSubsidiaryDataService),
				businessPartnerMainSubsidiaryUIStandardService, translateService);

			$scope.formOptions.configure.dirty = function (entity, model) {
				if (model === 'IsMainAddress' && !entity[model]) {
					entity[model] = !entity[model];
					(businesspartnerMainSubsidiaryDataService.gridRefresh || angular.noop())();
					return;
				}
				businesspartnerMainSubsidiaryDataService.markCurrentItemAsModified();
				(businesspartnerMainSubsidiaryDataService.gridRefresh || angular.noop())();
			};
		}]);
})(angular);