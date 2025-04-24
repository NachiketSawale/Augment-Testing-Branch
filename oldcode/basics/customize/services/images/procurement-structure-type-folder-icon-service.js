(function () {
	/* global globals */
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
	angular.module(moduleName).service('basicsCustomizeProcurementStructureTypeFolderService', BasicsCustomizeProcurementStructureTypeFolderService);

	BasicsCustomizeProcurementStructureTypeFolderService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeProcurementStructureTypeFolderService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/%%replace%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.structurefolder01', 'control-icons.svg#ico-typ-equipment'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.structurefolder02', 'control-icons.svg#ico-typ-material'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.structurefolder03', 'control-icons.svg#ico-typ-subcontractor'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.structurefolder04', 'type-icons.svg#ico-resource-folder01'),
			platformIconBasisService.createUrlIconWithId(5, 'basics.customize.structurefolder05', 'type-icons.svg#ico-resource-folder02'),
			platformIconBasisService.createUrlIconWithId(6, 'basics.customize.structurefolder06', 'type-icons.svg#ico-resource-folder03'),
			platformIconBasisService.createUrlIconWithId(7, 'basics.customize.structurefolder07', 'type-icons.svg#ico-resource-folder04'),
			platformIconBasisService.createUrlIconWithId(8, 'basics.customize.structurefolder08', 'type-icons.svg#ico-resource-folder05'),
			platformIconBasisService.createUrlIconWithId(9, 'basics.customize.structurefolder09', 'type-icons.svg#ico-resource-folder06'),
			platformIconBasisService.createUrlIconWithId(10, 'basics.customize.structurefolder10', 'type-icons.svg#ico-resource-folder07'),
			platformIconBasisService.createUrlIconWithId(11, 'basics.customize.structurefolder11', 'type-icons.svg#ico-resource-folder08'),
			platformIconBasisService.createUrlIconWithId(12, 'basics.customize.structurefolder12', 'type-icons.svg#ico-resource-folder09'),
			platformIconBasisService.createUrlIconWithId(13, 'basics.customize.structurefolder13', 'type-icons.svg#ico-resource-folder10'),
			platformIconBasisService.createUrlIconWithId(14, 'basics.customize.structurefolder14', 'type-icons.svg#ico-resource-folder11'),
			platformIconBasisService.createUrlIconWithId(15, 'basics.customize.structurefolder15', 'type-icons.svg#ico-resource-folder12'),
			platformIconBasisService.createUrlIconWithId(16, 'basics.customize.structurefolder16', 'type-icons.svg#ico-resource-folder13'),
			platformIconBasisService.createUrlIconWithId(17, 'basics.customize.structurefolder17', 'type-icons.svg#ico-resource-folder14'),
			platformIconBasisService.createUrlIconWithId(18, 'basics.customize.structurefolder18', 'type-icons.svg#ico-resource-folder15'),
			platformIconBasisService.createUrlIconWithId(19, 'basics.customize.structurefolder19', 'type-icons.svg#ico-resource-folder16'),
			platformIconBasisService.createUrlIconWithId(20, 'basics.customize.structurefolder20', 'type-icons.svg#ico-resource-folder17')
		];

		platformIconBasisService.extend(icons, this);
	}
})();
