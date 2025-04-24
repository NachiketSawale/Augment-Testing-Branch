/**
 * Created by lid on 7/4/2017.
 */

/*global angular */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	/**
     * @ngdoc service
     * @name ppsCommonHeaderStructureImageProcessor
     * @function
     *
     * @description
     * The ppsCommonHeaderStructureImageProcessor adds appropriate images to header structure tree.
     */

	angular.module(moduleName).factory('ppsCommonHeaderStructureImageProcessor', [function () {

		var service = {};

		service.processItem = function processItem(entity) {
			if (entity) {

				entity.image = 'ico-folder-assemblies';
			}
		};

		return service;
	}]);
})(angular);