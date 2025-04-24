/*globals angular */
(function (angular) {
	'use strict';

	function eventDialogLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'basicsWorkflowEventLookUp',
			valueMember: 'uuid',
			displayMember: 'description',
			dialogUuid: '53866c849a874407be399e80a34b7ced',
			uuid: 'C9613FD678FB47C5A3EED8B4DC8D0543',
			columns: [
				{id: 'description', field: 'description', name: 'Description'},
				{id: 'uuid', field: 'uuid', name: 'Uuid'}
			],
			width: 500,
			height: 200,
			title: {name: 'Assign Event', name$tr$: 'basics.workflow.entity.lookup.title'},
			showClearButton: true
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}

	eventDialogLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	angular.module('basics.workflow').directive('basicsWorkflowEventDialogLookup', eventDialogLookup);

})(angular);
