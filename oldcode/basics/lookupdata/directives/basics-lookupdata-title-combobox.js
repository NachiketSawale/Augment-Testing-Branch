/**
 * Created by sus on 2014/7/22.
 */

(function (angular) { // jshint ignore:line
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataTitleCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'title',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				columns: [
					{ id: 'DescriptionInfo', field: 'DescriptionInfo.Translated',width: 100, name: 'Description', name$tr$: 'cloud.common.entityDescription' },
					{ id: 'SalutationInfo', field: 'SalutationInfo.Translated',width: 100, name: 'Description', name$tr$: 'basics.customize.salutation' },
					{ id: 'AddressTitleInfo', field: 'AddressTitleInfo.Translated',width: 100, name: 'Description', name$tr$: 'basics.customize.addresstitle' }
				],
				width:350,
				height:120
			};
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}]);

})(angular);