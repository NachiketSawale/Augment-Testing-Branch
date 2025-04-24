/**
 * Created by baf on 28.09.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeFieldTranslateProcessor
	 * @function
	 *
	 * @description
	 * The basicsCustomizeFieldTranslateProcessor translates the field name of an entity type
	 */

	angular.module(moduleName).factory('basicsCustomizeFieldTranslateProcessor', ['platformTranslateService',

		function (platformTranslateService) {

			var service = {};

			service.processItem = function processItem(type) {
				if(type.Name) {
					type.Name$tr$ = type.Name;
					type.Name = type.DefaultName;

					platformTranslateService.translateObject(type, ['Name']);
				}
			};

			return service;

		}]);
})(angular);