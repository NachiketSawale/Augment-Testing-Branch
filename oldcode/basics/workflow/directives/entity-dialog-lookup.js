/*globals angular */
(function (angular) {
	'use strict';

	function entityDialogLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'basicsWorkflowEntitiesLookUp',
			valueMember: 'Id',
			displayMember: 'EntityName',
			uuid: '18b5cf99031f4b01b3fa2cb3a9453020',
			columns: [
				{id: 'name', field: 'EntityName', name: 'EntityName'},
				{id: 'moduleName', field: 'ModuleName', name: 'ModuleName'},
				{id: 'id', field: 'Id', name: 'Id'}
			],
			width: 500,
			height: 200,
			title: {name: 'Assign Entity', name$tr$: 'basics.workflow.entity.lookup.title'},
			showClearButton: true
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}

	entityDialogLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsWorkflowMasterDataService'];

	angular.module('basics.workflow').directive('basicsWorkflowEntityDialogLookup', entityDialogLookup);

})(angular);
