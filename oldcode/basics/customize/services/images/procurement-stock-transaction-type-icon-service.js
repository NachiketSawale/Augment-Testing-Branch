(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeProcurementStructureTypeFolderService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeProcurementStockTransactionTypeIconService', BasicsCustomizeProcurementStockTransactionTypeIconService);

	BasicsCustomizeProcurementStockTransactionTypeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeProcurementStockTransactionTypeIconService(platformIconBasisService) {

		var icons = [];
		// var totalIcon = 196; // Currently there are so many pictures.

		platformIconBasisService.setBasicPath('control-icons ico-stock-type-in');
		icons.push(platformIconBasisService.createCssIcon('basics.customize.stocktypein'));

		platformIconBasisService.setBasicPath('control-icons ico-stock-type-out');
		icons.push(platformIconBasisService.createCssIcon('basics.customize.stocktypeout'));

		// add default icons
		// platformIconBasisService.setBasicPath('status-icons ico-status%%index%%');
		// for (var i = 3; i <= totalIcon; i++) {
		// //format number to have two digits
		// icons.push(platformIconBasisService.createCssIcon('cloud.common.status' + _.padStart(i, 2, '0')));
		// }

		platformIconBasisService.extend(icons, this);
	}
})();
