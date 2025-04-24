/**
 * Created by anl on 6/12/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';
	angular.module(moduleName).directive('productionplanningEventConfigurationSequenceLookup', SequenceLookUp);

	SequenceLookUp.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function SequenceLookUp(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'EventSequence',
			valueMember: 'Id',
			displayMember: 'Description',
			uuid: '7ac2a57f0703400a9f1e9cc817a35179',
			columns: [
				{
					id: 'desc',
					field: 'Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				}
			],
			width: 500,
			height: 200,
			version: 3
		};
		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults);
	}
})(angular);