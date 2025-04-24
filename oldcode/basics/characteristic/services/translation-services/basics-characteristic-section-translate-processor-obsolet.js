/**
 * Created by reimer on 09.12.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.characteristic';

	/**
	 * @ngdoc service
	 * @name basicsCharacteristicSectionTranslateProcessor
	 * @function
	 *
	 * @description
	 * Translates section descriptions
	 */

	angular.module(moduleName).factory('basicsCharacteristicSectionTranslateProcessor', ['platformTranslateService',

		function (platformTranslateService) {

			var service = {};

			service.processItem = function processItem(type) {

				type.SectionName$tr$ = 'basics.characteristic.section.' + type.SectionName.replace(/ +/g, ''); // remove spaces!
				platformTranslateService.translateObject(type, ['SectionName']);

			};

			return service;

		}]);
})(angular);