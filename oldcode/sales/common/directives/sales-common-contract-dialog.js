/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	angular.module('sales.common').directive('salesCommonContractDialog', ['_', 'BasicsLookupdataLookupDirectiveDefinition', 'platformContextService', 'basicsCommonUtilities',
		function (_, BasicsLookupdataLookupDirectiveDefinition, platformContextService, basicsCommonUtilities) {

			var defaults = {
				lookupType: 'SalesContract',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'ED07FE8D5D4B4C1F8FE0BBE97EE9A8A7',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'cloud.common.entityCode' },
					{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation',  name$tr$: 'cloud.common.entityDescription' }
					// TODO:
					// more columns...?
				],
				title: { name: 'Assign Sales Contract', name$tr$: 'sales.common.dialogTitleAssignContract' }
			};

			// restrict requests to current company
			defaults.buildSearchString = function (searchValue) {
				var searchFields = _.map(defaults.columns, 'field');
				var searchFilter = basicsCommonUtilities.buildSearchFilter(searchFields, searchValue);

				var companyId = platformContextService.getContext().clientId;
				return 'CompanyFk=' + companyId + (_.isEmpty(searchValue) ? '' : ' AND ' + searchFilter);
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);

	angular.module('sales.common').directive('salesCommonContractDialogV2', ['_', 'BasicsLookupdataLookupDirectiveDefinition',
		function (_, BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				version: 2,
				lookupType: 'SalesContractV2',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '5f8065306a4e4e968e58d99109324e80',
				columns: [
					{
						id: 'ordStatusFk',
						field: 'OrdStatusFk',
						name$tr$: 'cloud.common.entityState',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.orderstatus',
							displayMember: 'Description',
							valueMember: 'Id',
							imageSelector: 'platformStatusIconService'
						},
						width: 110
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						width: 180,
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 300,
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
					// TODO:
					// more columns...?
				],
				title: { name: 'Assign Sales Contract', name$tr$: 'sales.common.dialogTitleAssignContract' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);

})();
