(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.header';

	angular.module(moduleName).controller('productionplanningHeaderCreatePreliminaryItemWizardController', CreatePreliminaryItemWizardController);

	CreatePreliminaryItemWizardController.$inject = ['$injector',
		'$scope', '$options', '$translate',
		'platformModalService',
		'platformModuleNavigationService',
		'ppsHeaderCreatePreliminaryItemWizardDataService',
		'ppsHeaderPreviewPreliminaryItemDataService'];

	function CreatePreliminaryItemWizardController($injector, $scope, $options, $translate,
												   platformModalService,
												   navigationService,
												   dialogService,
												   previewService) {

		$scope.showOkButton = $scope.showCancelButton = true;
		$scope.calculationBtn = {};
		$scope.alerts = [];
		$scope.dataItem = [];
		$scope.workflowAction = !!$options.workflowAction;
		$scope.workflowSet = angular.isDefined($options.workflowSet) ? $options.workflowSet : null;


		$scope.calculationBtn.label = $translate.instant('productionplanning.header.wizard.createPreliminaryItem.calculation');
		$scope.calculationBtn.action = () => {
			dialogService.calculationPreliminaryItems();
		};

		const hasValidationError = () => {
			return !dialogService.hasNewPreliminaryItem() || dialogService.hasSiteChanged() || dialogService.hasFilterChanged() || previewService.getPreliminaryItems().length === 0 ||
			  _.filter(previewService.getPreliminaryItems(), (item) => {
				  return item.SiteFk !== 0;
			  }).length === 0;
		};

		const disableCalculation = () => {
			return !(dialogService.hasSiteChanged() || dialogService.hasFilterChanged());
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
			dialogService.setBusy(true);
			return dialogService.handleOK().then(function (response) {
				if (response.Succeeded && $scope.workflowAction) {
					result = response;
				} else {
					if (response.Succeeded) {
						let itemIds = _.map(response.Items, 'Id');
						let itemCodes = _.map(response.Items, 'Code').join(',');
						let itemInfo = {
							PuInfo: {Ids: itemIds}
						};
						let dialogOption = {
							windowClass: 'msgbox',
							iconClass: 'info',
							headerTextKey: $translate.instant('productionplanning.header.wizard.createPreliminaryItem.title'),
							bodyTextKey: itemCodes,
							customButtons: [{
								id: 'goToItem',
								caption: 'productionplanning.header.wizard.createPreliminaryItem.goToItem',
								disabled: false,
								autoClose: false,
								cssClass: 'app-icons ico-test',
								fn: function (button, event, closeFn) {
									closeFn();
									navigationService.navigate({
										moduleName: 'productionplanning.item'
									}, itemInfo, 'PuInfo.Codes');
								}
							}]
						};
						platformModalService.showDialog(dialogOption);
					} else {
						platformModalService.showErrorBox(response.ErrorMessage,
						  'productionplanning.header.wizard.createPreliminaryItem.title', 'warning');
					}
				}
			}).finally(() => {
				dialogService.setBusy(false);
				$scope.onCancel(result);
			});
		};

		$scope.onCancel = (result) => {
			$scope.$close(result);
		};

		$scope.formContainerOptions = {
			formOptions: {
				configure: dialogService.getFormConfig().formConfiguration
			},
			setTools: function () {
			}
		};

		dialogService.init($scope, $options.selectedHeader);

		_.extend($scope.modalOptions, {
			headerText: $translate.instant('productionplanning.header.wizard.createPreliminaryItem.title'),
			cancel: $scope.onCancel
		});

		$scope.$on('$destroy', function () {
			dialogService.clearContext();
		});

	}
})(angular);