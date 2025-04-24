/**
 * Created by lius on 2021/12/30.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,Slick */


	let moduleName = 'businesspartner.certificate';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('certificateCertificateToSubsidiaryController',
		['$scope', '$injector', '$translate', 'platformGridAPI', 'basicsCommonDialogGridControllerService',
			'businessPartnerCertificateToSubsidiaryValidationServiceFactory',
			'_',
			'businessPartnerCertificate2SubsidiaryDialogDataService',
			function ($scope, $injector, $translate, platformGridAPI, basicsCommonDialogGridControllerService,
				businessPartnerCertificateToSubsidiaryValidationServiceFactory,
				_,
				businessPartnerCertificate2SubsidiaryDialogDataService
			) {
				let myGridConfig = {
					initCalled: false,
					columns: [],
					uuid: '20cb4e853f434d48893c684b0797d188',
					skipPermissionCheck: true
				};
				let execModuleName = $scope.modalOptions.moduleName;
				let certificateDataService = $scope.modalOptions.certificateDataService;
				let certificate2SubsidiaryService = $scope.modalOptions.certificate2SubsidiaryService;
				let dataService = businessPartnerCertificate2SubsidiaryDialogDataService.create(execModuleName, certificateDataService, certificate2SubsidiaryService);
				let validationService = businessPartnerCertificateToSubsidiaryValidationServiceFactory.create(execModuleName, dataService);
				let headerText = $scope.modalOptions.headerTitleText;

				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant(headerText)
				};

				$scope.modalOptions.cancel = function () {
					dataService.clear();
					$scope.$dismiss('cancel');
				};

				$scope.modalOptions.ok = function (result) {
					platformGridAPI.grids.commitEdit(myGridConfig.uuid);
					dataService.assertAllValidate()
						.then(function (response) {
							if (response) {
								let customResult = result || {};
								dataService.storeChanges();
								dataService.clear();
								customResult['ok'] = true; // jshint ignore:line
								$scope.$close(customResult);
							}
						});
				};

				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.refreshVersion += 1;
					};
					$scope.tools = tools;
					tools.refreshVersion = Math.random();
					tools.refresh = function () {
						tools.refreshVersion += 1;
					};
				};

				basicsCommonDialogGridControllerService.initListController(
					$scope,
					$injector.get('businesspartnerCertificateToSubsidiaryUIStandardService'),
					dataService,
					validationService,
					myGridConfig);
				platformGridAPI.grids.element('id', $scope.gridId).options.editorLock = new Slick.EditorLock();

				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item.id === 'create' || item.id === 'delete';
				});

				certificate2SubsidiaryService.registerListLoaded(onCertificate2SubsidiaryLoaded);

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
					certificate2SubsidiaryService.unregisterListLoaded(onCertificate2SubsidiaryLoaded);
					businessPartnerCertificateToSubsidiaryValidationServiceFactory.remove(execModuleName);
				});
				function onCertificate2SubsidiaryLoaded() {
					dataService.load();
				}
			}
		]);
})(angular);