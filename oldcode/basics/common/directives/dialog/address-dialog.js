(function (angular) {

	'use strict';

	const moduleName = 'basics.common';

	/** @namespace $scope.currentItem.AddressModified */
	/** @namespace item.Recordstate */
	/* jshint -W072 */ // too many parameters.
	angular.module(moduleName).directive('basicsCommonAddressDialog', ['basicsCommonInputDialogDirectiveFactory', 'basicsCommonAddressDialogOption', 'basicsCommonAddressDialogHandler',
		function (createDirective, basicsCommonAddressDialogOption, basicsCommonAddressDialogHandler) {

			const defaults = basicsCommonAddressDialogOption.getOptions();

			return createDirective(defaults, basicsCommonAddressDialogHandler.handler);
		}
	]);

})(angular);