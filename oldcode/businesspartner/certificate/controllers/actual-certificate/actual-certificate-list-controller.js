/**
 * Created by wui on 5/20/2015.
 */

(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.certificate';

	angular.module(moduleName).controller('businesspartnerCertificateActualCertificateListController', ['$scope', '$injector', '$translate',
		'platformGridControllerService', 'businesspartnerCertificateCertificateContainerServiceFactory', 'platformModalService',
		'_',
		function ($scope, $injector, $translate, gridControllerService, certificateContainerServiceFactory, platformModalService,
			_) {

			// get environment variable from the module-container.json file
			let currentModuleName = $scope.getContentValue('currentModule');
			let parentServiceName = $scope.getContentValue('parentService');
			let translationServiceName = $scope.getContentValue('translationService');
			let parentService = parentServiceName ? $injector.get(parentServiceName) : {};
			let translationService = translationServiceName ? $injector.get(translationServiceName) : {};
			let containerService = certificateContainerServiceFactory.getContainerService(currentModuleName, parentService, translationService);
			let myGridConfig = {initCalled: false, columns: []};

			let certificate2SubsidiaryBtnConfig = {
				id: 't-certificate2Subsidiary',
				type: 'item',
				caption: $translate.instant('businesspartner.main.toolbarCertificate2Branch'),
				iconClass: 'tlb-icons ico-add-customer-company',
				disabled: function () {
					let certificateService = certificateContainerServiceFactory.getDataService(currentModuleName);
					return _.isEmpty(certificateService.getSelected());
				},
				fn: function () {
					let certificateService = certificateContainerServiceFactory.getDataService(currentModuleName);
					let certificate2SubsidiaryServiceFactory = $injector.get('businessPartnerCertificate2SubsidiaryDataServiceFactory');
					let certificate2SubsidiaryService = certificate2SubsidiaryServiceFactory.create(currentModuleName, certificateService);
					certificate2SubsidiaryService.loadSubItemList()
						.then(function () {
							let modalOptions = {
								width: '700px',
								height: '350px',
								resizeable: true,
								headerTitleText: 'businesspartner.main.certificateToSubsidiaryDailogTitle',
								templateUrl: 'businesspartner.main/partials/screen-business-partner-certificate-to-subsidiary-modal.html',
								canSave: true,
								certificateDataService: certificateService,
								certificate2SubsidiaryService: certificate2SubsidiaryService,
								moduleName: currentModuleName
							};
							platformModalService.showDialog(modalOptions);
						});
				}
			};

			gridControllerService.initListController($scope, containerService.ui, containerService.data, containerService.validation, myGridConfig);

			if (currentModuleName === 'businesspartner.main') {
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
			else if (currentModuleName === 'procurement.invoice') {
				const certificateService = certificateContainerServiceFactory.getDataService(currentModuleName);

				function onHandleParentUpdateSucceeded() {
					certificateService.load();
				}

				parentService?.onUpdateSucceeded.register(onHandleParentUpdateSucceeded);

				$scope.$on('$destroy', function () {
					parentService?.onUpdateSucceeded.unregister(onHandleParentUpdateSucceeded);
				});
			}
		}
	]);

})(angular);