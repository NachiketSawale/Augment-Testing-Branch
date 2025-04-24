/**
 * Created by wui on 5/8/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).controller('businesspartnerCertificateCertificateListController', ['$scope', 'platformGridControllerService',
		'businesspartnerCertificateCertificateDataService', 'businesspartnerCertificateCertificateUIStandardService', 'businesspartnerCertificateCertificateValidationService',
		'platformModalService',
		'$translate',
		'_',
		'$injector',
		function ($scope, gridControllerService, dataService, uiStandardService, certificateValidationService,
			platformModalService,
			$translate,
			_,
			$injector) {

			let myGridConfig = {initCalled: false, columns: []};

			let certificate2SubsidiaryBtnConfig = {
				id: 't-certificate2Subsidiary',
				type: 'item',
				caption: $translate.instant('businesspartner.main.toolbarCertificate2Branch'),
				iconClass: 'tlb-icons ico-add-customer-company',
				disabled: function () {
					return _.isEmpty(dataService.getSelected());
				},
				fn: function () {
					let certificate2SubsidiaryServiceFactory = $injector.get('businessPartnerCertificate2SubsidiaryDataServiceFactory');
					let certificate2SubsidiaryService = certificate2SubsidiaryServiceFactory.create(moduleName, dataService);
					certificate2SubsidiaryService.loadSubItemList()
						.then(function () {
							let modalOptions = {
								width: '700px',
								height: '350px',
								resizeable: true,
								headerTitleText: 'businesspartner.main.certificateToSubsidiaryDailogTitle',
								templateUrl: 'businesspartner.main/partials/screen-business-partner-certificate-to-subsidiary-modal.html',
								canSave: true,
								certificateDataService: dataService,
								certificate2SubsidiaryService: certificate2SubsidiaryService,
								moduleName: moduleName
							};
							platformModalService.showDialog(modalOptions);
						});
				}
			};

			gridControllerService.initListController($scope, uiStandardService, dataService, certificateValidationService, myGridConfig);

			$scope.tools.items.splice(0, 0, certificate2SubsidiaryBtnConfig);

			// Work around to fix the issue: the button disappears when using grouping.
			let superSetTools = $scope.setTools;
			$scope.setTools = function (tools, cached) {
				if (!_.some(tools.items, item => item.id === 't-certificate2Subsidiary')) {
					tools.items.splice(0, 0, certificate2SubsidiaryBtnConfig);
				}
				superSetTools(tools, cached);
				$scope.tools.items.splice(_.findIndex(tools.items, item => item.id === 't-certificate2Subsidiary'), 1);
				$scope.tools.items.splice(0, 0, certificate2SubsidiaryBtnConfig);
			};
		}
	]);

})(angular);