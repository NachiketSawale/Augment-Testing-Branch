/**
 * Created by chi on 5/26/2023.
 */

(function (angular) {
	'use strict';
	let moduleName = 'procurement.quote';
	angular.module(moduleName).controller('procurementQuoteCreateContactWizardController', procurementQuoteCreateContactWizardController);

	procurementQuoteCreateContactWizardController.$inject = ['$scope', '$http', '$q', '$translate', 'globals', 'businessPartnerMainContactUIStandardService',
		'businessPartnerMainContactValidationService', '_', 'platformTranslateService', 'businessPartnerMainContactLayout',
		'platformRuntimeDataService'];

	function procurementQuoteCreateContactWizardController($scope, $http, $q, $translate, globals, businessPartnerMainContactUIStandardService,
		businessPartnerMainContactValidationService, _, platformTranslateService, businessPartnerMainContactLayout,
		platformRuntimeDataService) {

		$scope.modalOptions = $scope.modalOptions || {};
		$scope.modalOptions.isProcessing = false;
		$scope.modalOptions.processingInfo = 'procurement.quote.wizard.createContact.processInfo';

		let formConfig = angular.copy(businessPartnerMainContactUIStandardService.getStandardConfigForDetailView());
		// let translationService = getTranslationService();
		// translationService.translateFormConfig(formConfig);
		platformTranslateService.translateFormConfig(formConfig);
		let validationService = businessPartnerMainContactValidationService();
		delete validationService.validateSubsidiaryFk;
		delete validationService.validateAddressDescriptor;

		formConfig.groups = _.filter(formConfig.groups, function (group) {
			return group.gid !== 'itwoPortal' && group.gid !== 'entityHistory';
		});
		formConfig.rows = _.filter(formConfig.rows, function (row) {
			return row.model !== 'IsDefault' && row.model !== 'IsDefaultBaseline' && row.model !== 'IsLive';
		});

		_.forEach(formConfig.rows, function (row) {

			let rowModel = row.model.replace(/\./g, '$');

			let syncName = 'validate' + rowModel;
			let asyncName = 'asyncValidate' + rowModel;

			if (validationService[syncName]) {
				row.validator = validationService[syncName];
			}

			if (validationService[asyncName]) {
				row.asyncValidator = validationService[asyncName];
			}
		});

		formConfig.skipPermissionCheck = true;
		$scope.formOptions = {
			configure: formConfig
		};

		$scope.modalOptions.headerText = $translate.instant('procurement.quote.wizard.createContact.title');
		$scope.currentItem = $scope.modalOptions.newContact;

		$scope.canSave = canSave;
		$scope.save = save;

		// function getTranslationService() {
		// 	let localBuffer = {};
		//
		// 	function TranslationService(layouts) {
		// 		platformUIBaseTranslationService.call(this, layouts, localBuffer);
		// 	}
		//
		// 	TranslationService.prototype = Object.create(platformUIBaseTranslationService.prototype);
		// 	TranslationService.prototype.constructor = TranslationService;
		// 	let service = new TranslationService([businessPartnerMainContactLayout]);
		//
		// 	// platformUIBaseTranslationService.call(this, layouts, localBuffer);
		// 	// for container information service use   module container lookup
		// 	service.loadTranslations = function loadTranslations() {
		// 		return $q.when(false);
		// 	};
		// 	return service;
		// }

		function canSave() {
			let isValid = true;
			_.forEach(formConfig.rows, function (row) {
				if (!isValid) {
					return;
				}
				let rowModel = row.model.replace(/\./g, '$');
				isValid &= !(platformRuntimeDataService.hasError($scope.currentItem, rowModel));
			});
			return isValid;
		}

		function save() {
			$scope.modalOptions.isProcessing = true;
			$http.post(globals.webApiBaseUrl + 'businesspartner/contact/savefromwizard', $scope.currentItem).then(function (response) {
				if (!response || !response.data) {
					$scope.$close();
					$scope.modalOptions.isProcessing = false;
					return;
				}
				$scope.modalOptions.isProcessing = false;
				$scope.$close({data: response.data});
			}, function () {
				$scope.modalOptions.isProcessing = false;
				$scope.$close();
			});
		}
	}

})(angular);