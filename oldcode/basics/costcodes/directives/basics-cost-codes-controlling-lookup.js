/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'basics.costcodes';
	angular.module(moduleName).directive('basicsCostCodesControllingLookup',
		['BasicsLookupdataLookupDirectiveDefinition', function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				lookupType: 'ControllingCostCode',
				valueMember: 'Id',
				displayMember: 'Code',
				dialogUuid: '0b8a2e058c6f406ab5db4d9c67f1c2d7',
				uuid: '050D808504D34D7C8BFDFA897637EE8A',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 70,
						name$tr$: 'cloud.common.entityCode'
					}, {
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 100,
						name$tr$: 'cloud.common.entityDescription'
					}, {
						id: 'UomFk',
						field: 'UomFk',
						name: 'Uom',
						width: 50,
						name$tr$: 'basics.costcodes.uoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'uom',
							displayMember: 'Unit'
						}
					}, {
						id: 'Comments',
						field: 'CommentText',
						name: 'Comment',
						formatter: 'comment',
						width: 100,
						name$tr$: 'cloud.common.entityComment'
					}
				],
				width: 1200,
				height: 800,
				title: {
					name: 'Controlling Cost Codes',
					name$tr$: 'basics.costcodes.controlling.controllingCostCodes'
				},
				treeOptions: {
					parentProp: 'ContrCostCodeParentFk',
					childProp: 'ContrCostCodeChildrens',
					initialState: 'expanded',
					inlineFilters: true,
					hierarchyEnabled: true
				}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
		]);
})(angular);