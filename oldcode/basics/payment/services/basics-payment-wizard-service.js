(function (angular) {
	'use strict';

	var moduleName = 'basics.payment';
	angular.module(moduleName).service('basicsPaymentSidebarWizardService', BasicsPaymentSidebarWizardService);

	BasicsPaymentSidebarWizardService.$inject = ['basicsPaymentMainService', 'basicsCommonChangeStatusService', 'platformSidebarWizardCommonTasksService'];

	function BasicsPaymentSidebarWizardService(basicsPaymentMainService, basicsCommonChangeStatusService, platformSidebarWizardCommonTasksService) {

		var disablePayment = function disablePayment() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(basicsPaymentMainService, 'Disable Payment', 'basics.payment.disablePaymentTermTitle', 'Code',
				'basics.payment.disablePaymentTermDone', 'basics.payment.paymentTermAlreadyDisabled', 'paym', 1);
		};
		this.disablePayment = disablePayment().fn;

		var enablePayment = function enablePayment() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(basicsPaymentMainService, 'Enable Payment', 'basics.payment.enablePaymentTermTitle', 'Code',
				'basics.payment.enablePaymentTermDone', 'basics.payment.paymentTermAlreadyEnabled', 'paym', 2);
		};

		this.enablePayment = enablePayment().fn;


	}
})(angular);