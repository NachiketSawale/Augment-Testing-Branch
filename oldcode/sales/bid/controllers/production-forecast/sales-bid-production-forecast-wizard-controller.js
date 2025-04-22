(function () {
	'use strict';

	/* global angular, _ */

	let moduleName = 'sales.bid';

	angular.module(moduleName).controller('salesBidProductionForecastWizardController', ProductionForecastWizardController);

	ProductionForecastWizardController.$inject = ['$scope', '$options', '$translate',
		'platformModalService',
		'platformModuleNavigationService',
	  	'salesBidBoqStructureService',
		'salesBidProductionForecastWizardDataService'];

	function ProductionForecastWizardController($scope, $options, $translate,
												platformModalService,
												navigationService,
												salesBidBoqStructureService,
												wizardDataService) {

		$scope.showOkButton = true;
		$scope.showCancelButton = true;
		$scope.calculationBtn = {};
		$scope.alerts = [];
		$scope.dataItem = [];

		$scope.calculationBtn.label = $translate.instant('productionplanning.header.wizard.createPreliminaryItem.calculation');
		$scope.calculationBtn.action = () => {
			wizardDataService.calculationForecastItems();
		};

		const hasValidationError = () => {
			return !wizardDataService.hasNewForecastItem() || wizardDataService.hasSiteChanged() || wizardDataService.hasFilterChanged() || wizardDataService.getForecastItems().length === 0 ||
			  _.filter(wizardDataService.getForecastItems(), (item) => {
				  return item.SiteFk !== 0;
			  }).length === 0;
		};

		const disableCalculation = () => {
			return !(wizardDataService.hasSiteChanged() || wizardDataService.hasFilterChanged());
		};

		$scope.modalOptions = {
			isDisabled: function (button) {
				if (button === 'ok') {
					return hasValidationError();
				}
				if (button === 'custom1') {
					return disableCalculation();
				}
			}
		};

		$scope.onOK = () => {
			let result = {};
			wizardDataService.setBusy(true);
			return wizardDataService.handleOK().then(function (response) {
				if (response.Succeeded) {
					salesBidBoqStructureService.load();
				} else {
					platformModalService.showErrorBox(response.ErrorMessage,
					  'sales.bid.wizard.productionForecast.wizardTitle', 'warning');
				}
			}).finally(() => {
				wizardDataService.setBusy(false);
				$scope.onCancel(result);
			});
		};

		$scope.onCancel = (result) => {
			$scope.$close(result);
		};

		$scope.formContainerOptions = {
			formOptions: {
				configure: wizardDataService.getFormConfig().formConfiguration
			},
			setTools: function () {
			}
		};

		wizardDataService.init($scope, $options.bidHeader, $options.boqHeaderId);

		_.extend($scope.modalOptions, {
			headerText: $translate.instant('sales.bid.wizard.productionForecast.wizardTitle'),
			cancel: $scope.onCancel
		});

		$scope.$on('$destroy', function () {
			wizardDataService.clearContext();
		});

	}
})();