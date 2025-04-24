(function (angular) {

	'use strict';

	angular.module('platform').controller('genericWizardController', WizardController);

	WizardController.$inject = ['_', '$scope', 'genericWizardService', 'genericWizardService', '$injector', 'genericWizardUseCaseConfigService'];

	function WizardController(_, $scope, wizardService, genericWizardService, $injector, genericWizardUseCaseConfigService) {

		$scope.stepInfo = {
			currentStepNum: 1,
			totalStepNum: 0,
			currentTitle: ''
		};

		// $scope.options.InstanceId is set when opening the dialog
		wizardService.getWizardInstanceById($scope.options.InstanceId).then(function (config) {
			$scope.config = config;
			$scope.config = _.merge($scope.config, $scope.options.genericWizardOptions);
			$scope.stepInfo.totalStepNum = _.filter(config.Steps, function (step) {
				return !step.Instance.IsHidden;
			}).length;
			$scope.config.DialogTitle = $scope.config.name$tr($scope.config);
		});

		$scope.$on('$destroy', function () {
			var config = genericWizardUseCaseConfigService.getUseCaseConfiguration(genericWizardService.config.Id);
			// reset buttons in useCaseObject
			_.each(config.wizardButtons, function (btn) {
				btn.disabled = false;
			});
			if (_.isFunction(config.onDestroyFunction)) {
				config.onDestroyFunction();
			}
			// do not clear data for rfq wizard as it can run plenty of minutes and needs the config for each bidder email send request
			if (!config.keepConfigData) {
				genericWizardService.clear();
			}
		});

		$scope.closeDialog = function closeDialog() {
			$injector.get('$rootScope').$emit('wz-finish', {wizardFinished: true});
		};
	}

})(angular);
