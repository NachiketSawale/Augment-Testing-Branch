/**
 * Created by reimer on 22.06.2016.
 */

(function (angular) {

	'use strict';

	/**
	 * @ngdoc directive
	 * @name basicsCharacteristicSectionCombobox
	 * @requires
	 * @description ComboBox to select a section
	 */

	var moduleName = 'basics.characteristic';

	angular.module(moduleName).directive('basicsCharacteristicSectionCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'basicsCharacteristicSectionLookup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
				url: {
					getList: 'basics/characteristic/section/list',
					getItemByKey: 'basics/characteristic/section/getbykey'
				}
			});
		}
	]);

})(angular);

