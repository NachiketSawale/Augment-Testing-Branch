(function (angular, globals) {
	'use strict';
	const moduleName = 'procurement.rfq';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.rfqHeaderLookup = function rfqHeaderLookup() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'RfqHeaderLookup',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '041033c2ed5c4af192edf95647e762fd',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						width: 120,
						searchable: true
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 200,
						searchable: true
					},
					{
						id: 'rfqstatusfk',
						field: 'StatusFk',
						name: 'Status',
						name$tr$: 'cloud.common.entityState',
						sortable: true,
						width: 85,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'rfqStatus',
							displayMember: 'Description',
							imageSelector: 'platformStatusIconService'
						},
						searchable: false
					},
					{
						id: 'projectno',
						field: 'ProjectNo',
						name: 'ProjectNo',
						name$tr$: 'cloud.common.entityProjectNo',
						sortable: true,
						width: 85,
						searchable: true
					},
					{
						id: 'projectname',
						field: 'ProjectName',
						name: 'ProjectName',
						name$tr$: 'cloud.common.entityProjectName',
						sortable: true,
						width: 85,
						searchable: true
					},
					{
						id: 'projectname2',
						field: 'ProjectName2',
						name: 'ProjectName2',
						name$tr$: 'cloud.common.entityProjectName2',
						sortable: true,
						width: 85,
						searchable: true
					},
					{
						id: 'clerkprccode',
						field: 'ClerkPrcCode',
						name: 'ClerkPrcOwner',
						name$tr$: 'cloud.common.entityResponsible',
						sortable: true,
						width: 85,
						searchable: true
					},
					{
						id: 'clerkprcdescription',
						field: 'ClerkPrcDescription',
						name: 'ClerkPrcDescription',
						name$tr$: 'cloud.common.entityResponsibleDescription',
						sortable: true,
						width: 85,
						searchable: true
					},
					{
						id: 'clerkreqfk',
						field: 'ClerkReqCode',
						name: 'ClerkReqOwner',
						name$tr$: 'cloud.common.entityRequisitionOwner',
						sortable: true,
						width: 85,
						searchable: true
					},
					{
						id: 'clerkreqdescription',
						field: 'ClerkReqDescription',
						name: 'ClerkReqDescription',
						name$tr$: 'businesspartner.main.entityClerkReqDescription',
						sortable: true,
						searchable: true
					}
				],
				title: {name: 'Assign RfQ Header', name$tr$: 'cloud.common.dialogTitleRfQHeader'}
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.rfq.directive:procurementRfqHeaderDialog
	 * @element div
	 * @restrict A
	 * @description
	 * Header lookup.
	 *
	 */
	angular.module(moduleName).directive('procurementRfqHeaderDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.rfqHeaderLookup().lookupOptions);
		}]);

	globals.lookups['RfqHeader'] = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'RfqHeader',
				valueMember: 'Id',
				displayMember: 'Code',
				columns: []
			}
		};
	};
})(angular, globals);