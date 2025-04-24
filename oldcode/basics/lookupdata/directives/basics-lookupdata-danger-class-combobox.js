(function(angular, globals){

	'use strict';

	var moduleName = 'basics.lookupdata';
	angular.module(moduleName).directive('basicsLookupdataDangerClassCombobox', basicsLookupdataDangerClassCombobox);

	basicsLookupdataDangerClassCombobox.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];
	function basicsLookupdataDangerClassCombobox(BasicsLookupdataLookupDirectiveDefinition) {

		var options = globals.lookups.dangerClassCombobox();


		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', options);
	}

	globals.lookups.dangerClassCombobox = function dangerClassCombobox(){
		return {
			version: 2,
			lookupType: 'DangerClass',
			valueMember: 'Id',
			displayMember: 'Code',
			uuid: 'fdfc880e83c94b23ba76f01f1ea7a58e',
			columns: [
				{ id: 'code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode' },
				{ id: 'description', field: 'DescriptionInfo.Translated', name: 'Description', name$tr$: 'cloud.common.entityDescription' },
				{ id: 'regulationName', field: 'RegulationNameInfo.Translated', name: 'Regulation', name$tr$: 'basics.customize.regulationName' },
				{ id: 'dangerCategory', field: 'DangerCategoryInfo.Translated', name: 'Danger Category', name$tr$: 'basics.customize.dangerCategory' },
				{ id: 'hazardLabel', field: 'HazardLabelInfo.Translated', name: 'Hazard Label', name$tr$: 'basics.customize.hazardLabel' },
				{ id: 'packageGroup', field: 'PackageGroupInfo.Translated', name: 'Package Group', name$tr$: 'basics.customize.packageGroup' },
				{ id: 'tunnelRestrictionCode', field: 'TunnelRestrictionCodeInfo.Translated', name: 'Tunnel Restriction Code', name$tr$: 'basics.customize.tunnelRestrictionCode' },
				{ id: 'dangerName', field: 'DangerNameInfo.Translated', name: 'Danger Name', name$tr$: 'basics.customize.dangerName' },
			]
		};
	};
	
})(angular, globals);