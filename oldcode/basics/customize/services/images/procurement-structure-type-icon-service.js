(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeProcurementStructureTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeProcurementStructureTypeIconService', BasicsCustomizeProcurementStructureTypeIconService);

	BasicsCustomizeProcurementStructureTypeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeProcurementStructureTypeIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-resource%%index%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.structuretype01'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.structuretype02'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.structuretype03'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.structuretype04'),
			platformIconBasisService.createUrlIconWithId(5, 'basics.customize.structuretype05'),
			platformIconBasisService.createUrlIconWithId(6, 'basics.customize.structuretype06'),
			platformIconBasisService.createUrlIconWithId(7, 'basics.customize.structuretype07'),
			platformIconBasisService.createUrlIconWithId(8, 'basics.customize.structuretype08'),
			platformIconBasisService.createUrlIconWithId(9, 'basics.customize.structuretype09'),
			platformIconBasisService.createUrlIconWithId(10, 'basics.customize.structuretype10'),
			platformIconBasisService.createUrlIconWithId(11, 'basics.customize.structuretype11'),
			platformIconBasisService.createUrlIconWithId(12, 'basics.customize.structuretype12'),
			platformIconBasisService.createUrlIconWithId(13, 'basics.customize.structuretype13'),
			platformIconBasisService.createUrlIconWithId(14, 'basics.customize.structuretype14'),
			platformIconBasisService.createUrlIconWithId(15, 'basics.customize.structuretype15'),
			platformIconBasisService.createUrlIconWithId(16, 'basics.customize.structuretype16'),
			platformIconBasisService.createUrlIconWithId(17, 'basics.customize.structuretype17'),
			platformIconBasisService.createUrlIconWithId(18, 'basics.customize.structuretype18'),
			platformIconBasisService.createUrlIconWithId(19, 'basics.customize.structuretype19'),
			platformIconBasisService.createUrlIconWithId(20, 'basics.customize.structuretype20'),
			platformIconBasisService.createUrlIconWithId(21, 'basics.customize.structuretype21'),
			platformIconBasisService.createUrlIconWithId(22, 'basics.customize.structuretype22'),
			platformIconBasisService.createUrlIconWithId(23, 'basics.customize.structuretype23'),
			platformIconBasisService.createUrlIconWithId(24, 'basics.customize.structuretype24'),
			platformIconBasisService.createUrlIconWithId(25, 'basics.customize.structuretype25'),
			platformIconBasisService.createUrlIconWithId(26, 'basics.customize.structuretype26'),
			platformIconBasisService.createUrlIconWithId(27, 'basics.customize.structuretype27'),
			platformIconBasisService.createUrlIconWithId(28, 'basics.customize.structuretype28'),
			platformIconBasisService.createUrlIconWithId(29, 'basics.customize.structuretype29'),
			platformIconBasisService.createUrlIconWithId(30, 'basics.customize.structuretype30')
		];

		platformIconBasisService.extend(icons, this);
	}
})();
