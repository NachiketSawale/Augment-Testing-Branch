/**
 * Created by henkel
 */

(function (angular) {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainUnitInstallmentProcessor
	 * @function
	 *
	 * @description
	 * service
	 */
	angular.module(moduleName).service('objectMainUnitInstallmentProcessor', ObjectMainUnitInstallmentProcessor);

	ObjectMainUnitInstallmentProcessor.$inject = ['_', '$injector', 'platformRuntimeDataService'];

	function ObjectMainUnitInstallmentProcessor(_, $injector, platformRuntimeDataService) {
		this.processItem = function processItem(unit) {
			platformRuntimeDataService.readonly(unit, [{
				field: 'BillCreationDate',
				readonly: true
			}]);
			const invoiceCreated = 2; //see database OBJ_INSTAGREESTATE
			if(unit.InstallmentAgreementStateFk === invoiceCreated){
				platformRuntimeDataService.readonly(unit, true);
			}else{
				platformRuntimeDataService.readonly(unit, false);
			}
			let unitInstallmentService = $injector.get('objectMainUnitInstallmentDataService');
			unitInstallmentService.canDelete();
		};
	}

})(angular);
