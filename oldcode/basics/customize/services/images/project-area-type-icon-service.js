/**
 * Created by Frank Baedeker on 24/09/2021.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeProjectAreaTypeIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeProjectAreaTypeIconService', BasicsCustomizeProjectAreaTypeIconService);

	BasicsCustomizeProjectAreaTypeIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeProjectAreaTypeIconService(platformIconBasisService) {

		platformIconBasisService.setBasicPath(globals.appBaseUrl + 'cloud.style/content/images/%%replace%%');

		var icons = [
			platformIconBasisService.createUrlIconWithId(1, 'basics.customize.areaTypeTotalArea', 'control-icons.svg#ico-01gf-total-area'),
			platformIconBasisService.createUrlIconWithId(2, 'basics.customize.areaTypeDeliveryZone', 'control-icons.svg#ico-02dg-delivery-zone'),
			platformIconBasisService.createUrlIconWithId(3, 'basics.customize.areaTypeCraneDropPoint', 'control-icons.svg#ico-03cl-crane-drop-point'),
			platformIconBasisService.createUrlIconWithId(4, 'basics.customize.areaTypeFirstAid', 'control-icons.svg#ico-04fa-first-aid'),
			platformIconBasisService.createUrlIconWithId(5, 'basics.customize.areaTypeRestrooms', 'control-icons.svg#ico-05rr-restrooms'),
			platformIconBasisService.createUrlIconWithId(6, 'basics.customize.areaTypeOffice', 'control-icons.svg#ico-06oc-office'),
			platformIconBasisService.createUrlIconWithId(7, 'basics.customize.areaTypeLoadUnload', 'control-icons.svg#ico-07lu-load-unload'),
			platformIconBasisService.createUrlIconWithId(8, 'basics.customize.areaTypeEvacuationPoint', 'control-icons.svg#ico-08ep-evacuation-point'),
			platformIconBasisService.createUrlIconWithId(9, 'basics.customize.areaTypeItemDropPoint', 'control-icons.svg#ico-09it-item-drop-point'),
			platformIconBasisService.createUrlIconWithId(10, 'basics.customize.areaTypeWayPoint', 'control-icons.svg#ico-10wp-way-point'),
			platformIconBasisService.createUrlIconWithId(11, 'basics.customize.areaTypeEscapeRoute', 'control-icons.svg#ico-11er-escape-route'),
			platformIconBasisService.createUrlIconWithId(12, 'basics.customize.areaTypeWasteManagement', 'control-icons.svg#ico-12wm-waste-management')
		];

		platformIconBasisService.extend(icons, this);
	}
})();