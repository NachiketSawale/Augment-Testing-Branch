( function (angular, globals) {
	'use strict';

	/* globals  globals */

	globals.lookups.QtoStatus = function QtoStatus(){
		return {
			lookupOptions:{
				lookupType: 'QtoStatus',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				imageSelector: 'platformStatusIconService',
				width: 80,
				height: 200
			}
		};
	};

	angular.module('qto.main').directive('qtoStatusLookupService', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = globals.lookups.QtoStatus();

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions);
		}
	]);

})(angular, globals);