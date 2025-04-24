/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	/**
	 * @ngdoc directive
	 * @name transportplanningTransportRouteLookup
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 *a dialog directive for trs_route.
	 *
	 */
	angular.module(moduleName).directive('transportplanningTransportRouteLookup', lookup);

	lookup.$inject = ['BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataSimpleLookupService', 'basicsLookupdataConfigGenerator'];

	function lookup(BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataSimpleLookupService, basicsLookupdataConfigGenerator) {

		var defaults = {
			lookupType: 'TrsRoute',
			version: 3,//for new lookup master api, the value of version should be greater than 2
			valueMember: 'Id',
			displayMember: 'Code',//'DescriptionInfo.Translated'
			uuid: '20b408046cb94825a92469b37e3e1eb4',
			columns: [
				{
					id: 'TrsRteStatusFk',
					field: 'TrsRteStatusFk',
					name: 'TrsRteStatusFk',
					name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.transportrtestatus', null, {
						showIcon: true
					}).grid.formatterOptions
				},
				{id: 'Code', field: 'Code', name: 'Code', name$tr$: 'cloud.common.entityCode'},
				{
					id: 'Description',
					field: 'DescriptionInfo.Description',
					name: 'Description',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'projectfk',
					field: 'ProjectFk',
					name: 'Project No',
					name$tr$: 'productionplanning.common.prjProjectFk',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'project',
						displayMember: 'ProjectNo'
					}
				},
				{
					id: 'insertedat',
					field: 'InsertedAt',
					name: 'InsertedAt',
					name$tr$: 'cloud.common.entityInsertedAt',
					formatter: 'datetime'
				}

			],
			title: {
				name: 'transportplanning.transport.dialogTitleRoute'
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);

	}
})(angular);