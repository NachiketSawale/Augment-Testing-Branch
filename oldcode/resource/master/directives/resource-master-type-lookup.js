/**
 * Created by anl on 3/23/2017.
 */
(function (angular) {
	'use strict';

	var moduleName = 'resource.master';
	angular.module(moduleName).directive('resourceMasterTypeLookup', ResourceMasterTypeLookup);

	ResourceMasterTypeLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ResourceMasterTypeLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'ResourceMasterType',
			valueMember: 'Id',
			displayMember: 'Code',
			editable: 'false'
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
	}
})(angular);
