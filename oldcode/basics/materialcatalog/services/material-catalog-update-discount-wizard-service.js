(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsMaterialcatalogUpdateDiscountWizardService
	 * @description provides validation methods for materialGroupsItem
	 */
	angular.module( 'basics.materialcatalog' ).factory( 'basicsMaterialcatalogUpdateDiscountWizardService', ['$http', '$q', 'platformModalService', 'basicsMaterialCatalogDiscountGroupService','$translate',
		function ($http, $q, platformModalService, materialCatalogDiscountGroupDataService, $translate) {
			var service = {};

			service.canExecute = function () {
				return materialCatalogDiscountGroupDataService.getSelected() !== null;
			};

			service.execute = function () {

				var currentDiscountGroup = materialCatalogDiscountGroupDataService.getSelected();
				if (currentDiscountGroup) {
					$http.post( globals.webApiBaseUrl + 'basics/material/updatediscount', currentDiscountGroup ).then(
						function (response) {

							var opts = {
								backdrop: false,
								backdropClick: false,
								dialogFade: false,
								keyboard: true,
								headerText: $translate.instant('basics.materialcatalog.Wizard.Title'),
								bodyText: $translate.instant('basics.materialcatalog.Wizard.Message', response.data),
								windowClass: 'update-discount-wizard-dialog'
							};

							platformModalService.showDialog(opts);
						},
						function(response)
						{
							platformModalService.showErrorDialog(response.data);
						});
				}

			};

			return service;
		}
	]);
})(angular);
