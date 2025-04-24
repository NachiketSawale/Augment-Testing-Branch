/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';
	angular.module(moduleName).constant('projectControlsGroupingType', [
		{
			id: 'ControllingUnit',
			formatter: 'integer',
			domain: 'integer',
			field: 'controllingunit',
			name: 'Controlling Unit',
			name$tr$: 'controlling.projectcontrols.controllingUnit',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: true,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 1,
				groupColumnName: 'REL_CO',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'Activity',
			formatter: 'integer',
			domain: 'integer',
			field: 'activity',
			name: 'Activity',
			name$tr$: 'controlling.projectcontrols.activity',
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
				groupColumnName: 'REL_ACTIVITY',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'CostCode',
			formatter: 'integer',
			domain: 'integer',
			field: 'costcode',
			name: 'Cost Code',
			name$tr$: 'controlling.projectcontrols.costCode',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 3,
				groupColumnName: 'REL_COSTCODE',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'ControllingUnitCostCode',
			formatter: 'integer',
			domain: 'integer',
			field: 'controllingcostcode',
			name: 'Controlling Cost Code',
			name$tr$: 'controlling.projectcontrols.controllingUnitCostCode',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 4,
				groupColumnName: 'REL_COSTCODE_CO',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'BoQ',
			formatter: 'integer',
			domain: 'integer',
			field: 'boq',
			name: 'BoQ',
			name$tr$: 'controlling.projectcontrols.boQ',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 5,
				groupColumnName: 'REL_BOQ',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'CostGroup1',
			formatter: 'integer',
			domain: 'integer',
			field: 'costgroup1',
			name: 'Cost Group 1',
			name$tr$: 'controlling.projectcontrols.costGroup1',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 6,
				groupColumnName: 'REL_CLASSIFICATION_1',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'CostGroup2',
			formatter: 'integer',
			domain: 'integer',
			field: 'costgroup2',
			name: 'Cost Group 2',
			name$tr$: 'controlling.projectcontrols.costGroup2',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 7,
				groupColumnName: 'REL_CLASSIFICATION_2',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'CostGroup3',
			formatter: 'integer',
			domain: 'integer',
			field: 'costgroup3',
			name: 'Cost Group 3',
			name$tr$: 'controlling.projectcontrols.costGroup3',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 8,
				groupColumnName: 'REL_CLASSIFICATION_3',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'CostGroup4',
			formatter: 'integer',
			domain: 'integer',
			field: 'costgroup4',
			name: 'Cost Group 4',
			name$tr$: 'controlling.projectcontrols.costGroup4',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 9,
				groupColumnName: 'REL_CLASSIFICATION_4',
				groupType: 3,
				maxLevels: 8
			}
		},
		{
			id: 'Package',
			formatter: 'integer',
			domain: 'integer',
			field: 'package',
			name: 'Package',
			name$tr$: 'controlling.projectcontrols.package',
			width: 120,
			readonly: true,
			aggregation: false,
			isDefault: false,
			grouping: {
				generic: true,
				maxLevels: 8
			},
			metadata: {
				groupId: 10,
				groupColumnName: 'REL_PACKAGE',
				groupType: 3,
				maxLevels: 8,
				showBP: 0,
				showPackageDesc: 0
			}
		}
	]);
})(angular);