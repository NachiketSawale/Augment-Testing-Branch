/**
 * Created by chi on 7/20/2018.
 */
(function(angular, globals){
	'use strict';

	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.prcMergeBoqView = function prcMergeBoqView() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'PrcMergeBoqView',
				valueMember: 'Id',
				displayMember: 'Reference',
				uuid: 'cf550e96588a4290bc89e1e5c60d0974',
				columns: [
					{
						id: 'status',
						field: 'PrcItemStatusFk',
						name: 'Status',
						name$tr$: 'cloud.common.entityStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'PrcItemStatus',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						},
						width: 100
					},
					{
						id: 'Reference',
						field: 'Reference',
						name: 'BoQ Reference',
						width: 150,
						name$tr$: 'procurement.common.boq.boqItemReference'
					},
					{
						id: 'Brief',
						field: 'BriefInfo.Translated',
						name: 'Outline Specification',
						width: 150,
						name$tr$: 'procurement.common.boq.boqItemBrief'
					},
					{
						id: 'PackageCode',
						field: 'PackageCode',
						name: 'PackageCode',
						width: 150,
						name$tr$: 'cloud.common.entityPackageCode'
					},
					{
						id: 'PackageDescription',
						field: 'PackageDescription',
						name: 'PackageDescription',
						width: 150,
						name$tr$: 'cloud.common.entityPackageDescription'
					},
					{
						id: 'ControllingCode',
						field: 'ControllingCode',
						name: 'ControllingCode',
						width: 150,
						name$tr$: 'procurement.common.boq.prcItemControllingUnit'
					},
					{
						id: 'ControllingDescription',
						field: 'DescriptionInfo.Translated',
						name: 'ControllingDescription',
						width: 150,
						name$tr$: 'procurement.common.boq.prcItemControllingUnitDes'
					}
				]// ,
				// dataProcessor: {
				//     execute: function(data){
				//         return _.uniqBy(_.filter(data, function(value){
				//             return value.BoqItemPrjBoqFk !== null && angular.isDefined(value.BoqItemPrjBoqFk);
				//         }), 'BoqItemPrjBoqFk');
				//     }
				// }
			}
		};
	};

	angular.module(moduleName).directive('procurementCommonMergedBoqLookup', procurementCommonMergedBoqLookup);

	procurementCommonMergedBoqLookup.$inject = ['_', 'BasicsLookupdataLookupDirectiveDefinition'];

	function procurementCommonMergedBoqLookup(_, BasicsLookupdataLookupDirectiveDefinition) {
		return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.prcMergeBoqView().lookupOptions);
	}
})(angular, globals);