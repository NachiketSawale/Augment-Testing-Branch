/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	angular.module('awp.main').constant('awpGroupingType', [
		{
			id: 'BoQ',
			formatter: 'integer',
			domain: 'integer',
			field: 'boq',
			name: 'BoQ',
			name$tr$: 'awp.main.boQ',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 1,
				groupColumnName: 'Boq.Main.BoqItem',
				groupType: 3,
				maxLevels: 8,
				priority: 3
			}
		},
		{
			id: 'WIC.BoQ',
			formatter: 'integer',
			domain: 'integer',
			field: 'wicBoQ',
			name: 'WIC BoQ',
			name$tr$: 'awp.main.wicBoQ',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 2,
				groupColumnName: 'Boq.Main.WicBoqItem',
				groupType: 3,
				maxLevels: 8,
				priority: 3
			}
		},
		{
			id: 'Procurement.Structure',
			formatter: 'integer',
			domain: 'integer',
			field: 'prcStructure',
			name: 'Procurement Structure',
			name$tr$: 'awp.main.prcStructure',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 5
			},
			metadata: {
				groupId: 3,
				groupColumnName: 'Basics.ProcurementStructure.Structure',
				groupType: 3,
				maxLevels: 5,
				priority: 3
			}
		},
		{
			id: 'LineItem.Code',
			formatter: 'integer',
			domain: 'integer',
			field: 'code',
			name: 'Line Item Code',
			name$tr$: 'awp.main.lineItemCode',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 1
			},
			metadata: {
				groupId: 4,
				groupColumnName: 'Code',
				groupType: 1,
				maxLevels: 1,
				priority: 1
			}
		}
	]);
})(angular);