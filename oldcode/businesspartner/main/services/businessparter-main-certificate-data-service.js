/**
 * Created by wed on 7/13/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businesspartnerMainCertificateDataService', [
		'$injector',
		'businesspartnerCertificateCertificateContainerServiceFactory',
		'businesspartnerMainHeaderDataService',
		'businesspartnerMainTranslationService',
		function ($injector, businesspartnerCertificateCertificateContainerServiceFactory, businesspartnerMainHeaderDataService, businesspartnerMainTranslationService) {
			var currentModuleName = 'businesspartner.main';
			var containerService = businesspartnerCertificateCertificateContainerServiceFactory.getContainerService(currentModuleName, businesspartnerMainHeaderDataService, businesspartnerMainTranslationService);

			containerService.data.getItemStatus = function () {
				return businesspartnerMainHeaderDataService.getItemStatus();
			};

			containerService.data.setDataReadOnly = function (data) {
				var businesspartnerStatusRightService = $injector.get('businesspartnerStatusRightService');
				businesspartnerStatusRightService.setListDataReadonly(data, true);
			};

			return containerService.data;
		}]);

})(angular);
