/**
 * Created by wui on 6/13/2017.
 */

(function (angular) {
	'use strict';

	var modulename = 'constructionsystem.project';

	angular.module(modulename).directive('cosModelObjectFilterDefCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'modelObjectFilterDef',
				valueMember: 'id',
				displayMember: 'filterName',
				showClearButton: true,
				showCustomInputContent: true,
				formatter: function (model, lookupItem, displayValue) {
					if (lookupItem === null || lookupItem === undefined) {
						return '';
					}

					if (lookupItem.accessLevel === 'System') {
						return '<div class="filterDefdropboxIconsLeft control-icons ico-search-system-prot">' + displayValue + '</div>';
					}

					return '<div class="filterDefdropboxIconsLeft control-icons ico-search-user-prot">' + displayValue + '</div>';
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				dataProvider: 'cosModelObjectFilterDefService'
			});
		}
	]);

})(angular);