(function () {

	'use strict';
	var moduleName = 'basics.config';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name basicsConfigGenericWizardNamingParameterListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of generic wizard naming property entities.
	 **/
	angModule.controller('basicsConfigGenericWizardNamingParameterListController', basicsConfigGenericWizardNamingParameterListController);

	basicsConfigGenericWizardNamingParameterListController.$inject = ['$scope', '$translate', 'platformGridControllerService', 'basicsConfigGenWizardNamingParameterDataService', 'basicsConfigGenericWizardNamingParameterLayoutService', 'basicsConfigGenWizardValidationService', 'platformDialogService', 'genericWizardNamingParameterConstantService', 'genericWizardUseCaseConfigService'];

	function basicsConfigGenericWizardNamingParameterListController($scope, $translate, platformGridControllerService, basicsConfigGenWizardNamingParameterDataService, basicsConfigGenericWizardNamingParameterLayoutService, basicsConfigGenWizardValidationService, platformDialogService, genericWizardNamingParameterConstantService, genericWizardUseCaseConfigService) {

		var myGridConfig = {initCalled: false, columns: []};

		platformGridControllerService.initListController($scope, basicsConfigGenericWizardNamingParameterLayoutService, basicsConfigGenWizardNamingParameterDataService, basicsConfigGenWizardValidationService, myGridConfig);
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			sort: 1,
			items: [
				{
					id: 'snpd',
					caption: 'basics.config.patternInfo',
					type: 'item',
					iconClass: 'tlb-icons ico-info',
					fn: showNamingParamDetails,
				}
			]
		});

		function showNamingParamDetails() {
			const patternInfoText = getPatternInfoText();

			platformDialogService.showDialog({
				headerText$tr$: 'basics.config.patternInfo',
				iconClass: 'info',
				bodyText: patternInfoText,
				showOkButton: false,
				resizeable: true,
				backdrop: false
			});
		}

		function getPatternInfoText() {
			let patternInfoString = '';
			let namingParameters = genericWizardNamingParameterConstantService.getGenericWizardNamingParameterConstant();

			_.forEach(namingParameters, function (param) {
				patternInfoString += `<p>${param.pattern} - ${$translate.instant(param.nameTr)}</p>`;
			});

			let rfqBidderWizardConfig = genericWizardUseCaseConfigService.getUseCaseConfiguration('61ed6ca1069d47a28707d8ce8e868167');
			let contractConfirmWizardConfig = genericWizardUseCaseConfigService.getUseCaseConfiguration('5dc8d95272b7445b89004c729c71d7df');

			patternInfoString += `<br><p>${rfqBidderWizardConfig.name$tr()}: ${_.map(genericWizardNamingParameterConstantService.getAllowedNamingParameters(rfqBidderWizardConfig.Id), 'pattern').join(', ')}<\p>`;
			patternInfoString += `<p>${contractConfirmWizardConfig.name$tr(false)}: ${_.map(genericWizardNamingParameterConstantService.getAllowedNamingParameters(contractConfirmWizardConfig.Id), 'pattern').join(', ')}<\p>`;
			return patternInfoString;
		}
	}
})();