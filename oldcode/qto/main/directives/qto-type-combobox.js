
(function (angular, globals) {
	/* global globals */
	'use strict';

	/**
     * @ngdoc directive
     * @name qtoTypeCombobox
     * @element div
     * @restrict A
     * @description
     * Configuration combobox.
     *
     */

	globals.lookups.QtoType = function QtoType(){
		return {
			lookupOptions:{
				lookupType: 'QtoType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	angular.module('qto.main').directive('qtoTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.QtoType();

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions);
		}]);

})(angular, globals);