/**
 * Created by henkel on 26.11.2014.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name mtwoControlTowerConfigurationImageProcessor
	 * @function
	 *
	 * @description
	 * The mtwoControlTowerConfigurationImageProcessor adds path to images for companies depending on there type.
	 */

	angular.module('mtwo.controltowerconfiguration').factory('mtwoControlTowerConfigurationImageProcessor', [function () {

		var service = {};

		service.processItem = function processItem(Powerbiitem) {
			// itemType { WorkSpace = 0,Dashboard = 1, Report = 2,Dataset = 3,WorkBook = 4}
			if (Powerbiitem) {
				switch (Powerbiitem.Itemtype) {
					case 0: // This is a Dashboard
						Powerbiitem.image = 'ico-power-bi-workspace';
						break;
					case 1: // This is a Dashboard
						Powerbiitem.image = 'ico-power-bi-dashboard';
						break;
					case 2: // This is a Report
						Powerbiitem.image = 'ico-power-bi-record';
						break;

				}
			}
		};
		return service;

	}]);
})(angular);
