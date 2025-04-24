/**
 * Created by chi on 2018/4/3.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.common';

	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('procurementCommonAddressComplexControl', procurementCommonAddressComplexControl);

	procurementCommonAddressComplexControl.$inject = ['basicsCommonInputDialogDirectiveFactory',
		'basicsCommonAddressDialogOption', 'basicsCommonAddressDialogHandler',
		'procurementCommonProjectAddressPopupOption'];

	function procurementCommonAddressComplexControl(basicsCommonInputDialogDirectiveFactory,
		basicsCommonAddressDialogOption, basicsCommonAddressDialogHandler,
		procurementCommonProjectAddressPopupOption){

		var defaults = basicsCommonAddressDialogOption.getOptions();

		var popupOptions = procurementCommonProjectAddressPopupOption.getOptions();

		defaults = angular.extend(defaults, popupOptions);

		return basicsCommonInputDialogDirectiveFactory(defaults, basicsCommonAddressDialogHandler.handler);
	}
})(angular);