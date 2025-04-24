(function (angular, globals) {
	'use strict';

	var moduleName = 'basics.lookupdata';

	angular.module(moduleName).directive('basicsLookupdataPackagingTypeCombobox', basicsLookupdataPackagingTypeCombobox);
	basicsLookupdataPackagingTypeCombobox.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function basicsLookupdataPackagingTypeCombobox(BasicsLookupdataLookupDirectiveDefinition){

		var options = globals.lookups.packagingTypeCombobox();
		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', options);
	}

	globals.lookups.packagingTypeCombobox = function packagingTypeCombobox(){
		return {
			version: 2,
			lookupType: 'PackagingType',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			uuid: '20240dab39234495a5fdd072c1615a4b',
			columns: [
				{ id: 'description', field: 'DescriptionInfo.Translated', name: 'Description', name$tr$: 'cloud.common.entityDescription' },
				{ id: 'defaultCapacity', field: 'DefaultCapacity', name: 'Default Capacity', name$tr$: 'basics.customize.defaultCapacity' }
			]
		};
	};

})(angular, globals);