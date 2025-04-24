/**
 * Created by chi on 6/20/2019.
 */
(function (angular){
	'use strict';
	var moduleName = 'project.main';

	angular.module(moduleName).factory('projectMainUpdateMaterialPriceMainService', projectMainUpdateMaterialPriceMainService);

	projectMainUpdateMaterialPriceMainService.$inject = ['_', '$translate', 'globals', 'platformModalService'];

	function projectMainUpdateMaterialPriceMainService(_, $translate, globals, platformModalService) {
		var service = {};

		var optionPage = 'optionPage';
		var quotePage = 'quotePage';
		var contractPage = 'contractPage';
		var resultPage = 'resultPage';
		var catalogMatrialPage ='catalogMatrialPage';
		var catalogPage = 'catalogPage';
		var executeUpdateFromCatalog = 'executeUpdateFromCatalog';
		var executeUpdateByMaterialCatalog = 'executeUpdateByMaterialCatalog';
		var executeUpdate = 'executeUpdate';

		var stepOptions = {
			'fromQuote': [quotePage, resultPage],
			'fromContract': [contractPage, resultPage],
			'fromCatalog': [catalogPage],
			'byMaterialCatalog':[catalogMatrialPage]
		};

		var stepsHappened = [];
		var stepsNonHappen = [];
		var currentStep = optionPage;
		var localData = {
			optionPageInfo: {
				optionSelected: 'fromCatalog',
				catalogSelect:'byMaterialItem'
			},
			quotePageInfo: null,
			contractPageInfo: null,
			variableValue: {
				count: 0
			},
			catalogMaterialPageInfo:null
		};

		var defaultModalOptions = {
			headerTextKey: $translate.instant('project.main.updateMaterialPricesTitle'),
			templateUrl: globals.appBaseUrl + 'project.main/templates/update-material-prices.html',
			resizeable: true,
			showCancelButton: true,
			width: '1250px',
			body: {
				fromQuote: $translate.instant('project.main.updateMaterialPricesFromQuote'),
				fromContract: $translate.instant('project.main.updateMaterialPricesFromContract'),
				fromMaterialCatalog: $translate.instant('project.main.updateFromMaterialCatalog'),
				fromCatalogPrjMaterialNote: $translate.instant('project.main.updatePriceFromCatalogWizard.prjMaterialNote'),
				fromCatalogMatPriceListNote: $translate.instant('project.main.updatePriceFromCatalogWizard.materialPriceListNote'),
				fromCatalogUpdateNote: $translate.instant('project.main.updatePriceFromCatalogWizard.noModifiedProjectMaterialSelectedDetail'),
				materialReadOnlyJobNote: $translate.instant('project.main.noUseJobError.filterReadOnly'),
				byMaterialItem: $translate.instant('project.main.updateByMaterialItem'),
				byMaterialCatalog: $translate.instant('project.main.updateByMaterialCatalog'),
				optionPage: {
					radioSelect: null,
					catalogSelect:null
				},
				canSearch: false,
				actionType: null,
				isFirstStep: isFirstStep,
				resetStepInfo: reset
			},
			variableValue: {}
		};

		service.showDialog = showDialog;
		return service;

		///////////////////////////////////

		function isFirstStep() {
			return stepsHappened.length === 0;
		}

		function reset() {
			currentStep = optionPage;
			localData = {
				optionPageInfo: {
					optionSelected: 'fromCatalog',
					catalogSelect:'byMaterialItem'
				},
				quotePageInfo: null,
				contractPageInfo: null,
				variableValue: {
					count: 0
				}
			};
			stepsHappened = [];
			stepsNonHappen = [];
		}

		function nextStep() {
			if (!moveStep(stepsNonHappen, stepsHappened)) {
				return;
			}
			showDialog();
		}

		function previousStep() {
			if (!moveStep(stepsHappened, stepsNonHappen)) {
				return;
			}
			showDialog();
		}

		function getNextButtonText() {
			if (currentStep === resultPage || currentStep === catalogPage || currentStep === catalogMatrialPage) {
				return $translate.instant('project.main.update');
			}
			return $translate.instant('basics.common.button.nextStep');
		}

		function initModalOptions() {

			var modalOptions = angular.copy(defaultModalOptions);
			modalOptions.body.nextButtonText = getNextButtonText();
			modalOptions.body.currentStep = currentStep;
			modalOptions.body.optionPage.radioSelect = localData.optionPageInfo.optionSelected;
			modalOptions.body.optionPage.catalogSelect = localData.optionPageInfo.catalogSelect;
			modalOptions.variableValue.count = localData.variableValue.count;

			switch (currentStep) {
				case optionPage:
					modalOptions.headerText = $translate.instant('project.main.updateMaterialPricesTitle');
					modalOptions.width = '300px';
					modalOptions.resizeable = false;
					break;
				case quotePage:
					modalOptions.headerText = $translate.instant('project.main.updateMaterialPricesFromQuoteTitle');
					modalOptions.body.canSearch = true;
					modalOptions.data = localData.quotePageInfo;
					break;
				case contractPage:
					modalOptions.headerText = $translate.instant('project.main.updateMaterialPricesFromContractTitle');
					modalOptions.body.canSearch = true;
					modalOptions.data = localData.contractPageInfo;
					break;
				case catalogPage:
					modalOptions.headerText = $translate.instant('project.main.updateFromMaterialCatalogTitle');
					modalOptions.body.actionType = executeUpdateFromCatalog;
					break;
				case resultPage:
					var previousStep = stepsHappened[stepsHappened.length - 1];
					if (previousStep === quotePage) {
						modalOptions.headerText = $translate.instant('project.main.updateMaterialPricesFromQuoteTitle');
					} else if (previousStep === contractPage) {
						modalOptions.headerText = $translate.instant('project.main.updateMaterialPricesFromContractTitle');
					} else {
						modalOptions.headerText = $translate.instant('project.main.updateFromMaterialCatalogTitle');
					}
					modalOptions.body.actionType = executeUpdate;
					modalOptions.body.previousStep = previousStep;
					break;
				case catalogMatrialPage:
					modalOptions.headerText = $translate.instant('project.main.updateMaterialPricesFromMaterialCatalogTitle');
					modalOptions.body.actionType = executeUpdateByMaterialCatalog;
					modalOptions.data = localData.catalogMaterialPageInfo;
					break;
				default:
					break;
			}
			return modalOptions;
		}

		function showDialog() {
			var modalOptions = initModalOptions(currentStep);
			platformModalService.showDialog(modalOptions).then(function (result) {
				if (!result || !result.stepStatus) {
					return;
				}
				switch (currentStep) {
					case optionPage:
						localData.optionPageInfo.optionSelected = result.data.radioSelect;
						if(localData.optionPageInfo.optionSelected==='fromCatalog' && result.data.catalogSelect==='byMaterialCatalog'){
							localData.optionPageInfo.catalogSelect =result.data.catalogSelect;
							stepsNonHappen = [];
							stepsHappened = [];
							_.forEach(stepOptions[localData.optionPageInfo.catalogSelect], function (page) {
								stepsNonHappen.unshift(page);
							});
							nextStep();
						}else {
							stepsNonHappen = [];
							stepsHappened = [];
							_.forEach(stepOptions[localData.optionPageInfo.optionSelected], function (page) {
								stepsNonHappen.unshift(page);
							});
							nextStep();
						}
						return;
					case quotePage:
						if (result.data) {
							localData.quotePageInfo = result.data;
						}
						break;
					case contractPage:
						if (result.data) {
							localData.contractPageInfo = result.data;
						}
						break;
					case resultPage:
						break;
					case catalogMatrialPage:
						if (result.data) {
							localData.catalogMaterialPageInfo = result.data;
						}
						break;
					default:
						break;
				}

				localData.variableValue = result.variableValue || {
					count: 0
				};

				if (result.stepStatus === 'next') {
					nextStep();
				}
				else if (result.stepStatus === 'previous'){
					previousStep();
				}
			});
		}

		function moveStep(outputSteps, inputSteps) {
			if (!angular.isArray(outputSteps) || outputSteps.length === 0) {
				return null;
			}

			if (!angular.isArray(inputSteps)) {
				inputSteps = [];
			}

			var output = outputSteps.pop();
			inputSteps.push(currentStep);
			currentStep = output;
			return currentStep;
		}
	}
})(angular);