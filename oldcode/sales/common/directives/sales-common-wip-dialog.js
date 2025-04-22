/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	angular.module('sales.common').directive('salesCommonWipDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'SalesWip',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '336a73b7378d4a31af088b1de82616d5',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'sales.wip.entityWipCode' },
					{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation',  name$tr$: 'cloud.common.entityDescription' }
					// TODO:
					// more columns...?
				],
				title: { name: 'Assign A Wip', name$tr$: 'sales.common.dialogTitleAssignWip' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);

	angular.module('sales.common').directive('salesCommonWipDialogV2', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				version: 2,
				lookupType: 'SalesWipV2',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '9d290e62073c46e9bb92ade7394b8728',
				columns: [
					{ id: 'Code', field: 'Code', name: 'Code', width: 180, formatter: 'code', name$tr$: 'sales.wip.entityWipCode' },
					{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation',  name$tr$: 'cloud.common.entityDescription' }
					// TODO:
					// more columns...?
				],
				title: { name: 'Assign A Wip', name$tr$: 'sales.common.dialogTitleAssignWip' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);

})();
