/**
 * Created by wui on 8/13/2015.
 */

(function(angular){
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).factory('basicsLookupdataLookupDefinitionService',['$injector', 'BasicsLookupdataLookupDictionary',
		function($injector, BasicsLookupdataLookupDictionary) {
			var service = {}, definitionDictionary = new BasicsLookupdataLookupDictionary(true);

			/**
			 * run specified lookup directive factory to prepare definition for lookup service.
			 * @param directives
			 */
			service.load = function(directives) {
				directives.forEach(function (directive) {
					// run directive factory.
					$injector.get(directive + 'Directive');
				});
			};

			/**
			 * set definition of lookup type.
			 * @param definition
			 */
			service.set = function(definition) {
				if (definition && definition.lookupType) {
					definitionDictionary.update(definition.lookupType, definition);
				}
			};

			/**
			 * get definition of lookup type.
			 * @param lookupType
			 */
			service.get = function(lookupType) {
				return definitionDictionary.get(lookupType);
			};

			return service;
		}
	]);

})(angular);