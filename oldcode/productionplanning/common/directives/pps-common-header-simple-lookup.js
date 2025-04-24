/**
 * Created by anl on 2/1/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).directive('productionplanningCommonHeaderSimpleLookup', ProductionplanningCommonHeaderSimpleLookup);

	ProductionplanningCommonHeaderSimpleLookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition'];

	function ProductionplanningCommonHeaderSimpleLookup(BasicsLookupdataLookupDirectiveDefinition) {

		var defaults = {
			lookupType: 'CommonHeaderV3',
			valueMember: 'Id',
			displayMember: 'Code',
			editable: 'false',
			columns: [
				{id: 'Code', field: 'Code', name: '*Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'Description',
					field: 'DescriptionInfo.Translated',
					name: '*Description',
					name$tr$: 'cloud.common.entityDescription'
				},
				{id: 'JobCode', field: 'JobCode', name: '*JobCode', name$tr$: 'project.costcodes.lgmJobFk'},
				{
					id: 'JobDescription',
					field: 'JobDescription',
					name: '*Job Description',
					name$tr$: 'productionplanning.mounting.jobDescription'
				}
			],
			version: 3
		};
		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
	}
})(angular);