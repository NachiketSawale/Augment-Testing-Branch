/**
 * Created by wui on 9/7/2017.
 */

(function (angular) {
	'use strict';

	var modulename = 'constructionsystem.project';

	angular.module(modulename).directive('cosProjectQtoAcceptQualityCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'QtoQuality',
				valueMember: 'Id',
				displayMember: 'Description'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'cosProjectQtoAcceptQualityDataService'
			});
		}
	]);

})(angular);