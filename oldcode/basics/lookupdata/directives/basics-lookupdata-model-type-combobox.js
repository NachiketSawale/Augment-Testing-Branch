/**
 * Created by wui on 6/27/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataModelTypeCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'MdlType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			};

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
		}]);

})(angular);