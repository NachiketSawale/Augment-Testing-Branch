/**
 * Created by chi on 10/11/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'procurement.common';
	angular.module(moduleName).constant('procurementCommonMasterRestrictionType', {
		wicBoq: 1,
		prjBoq: 2,
		packageBoq: 3,
		material: 4,
		contractBoq: 5
	});

	angular.module(moduleName).factory('procurementCommonMasterRestrictionCopyType', procurementCommonMasterRestrictionCopyType);

	procurementCommonMasterRestrictionCopyType.$inject = ['$translate', 'procurementCommonMasterRestrictionType'];

	function procurementCommonMasterRestrictionCopyType($translate, masterRestrictionType) {
		let copyTypes = [
			{
				Id: masterRestrictionType.wicBoq,
				Description: 'WIC BoQ',
				Description$tr$: 'procurement.common.copyTypeWicBoq'
			},
			{
				Id: masterRestrictionType.prjBoq,
				Description: 'Project BoQ',
				Description$tr$: 'procurement.common.copyTypePrjBoq'
			},
			{
				Id: masterRestrictionType.packageBoq,
				Description: 'Package BoQ',
				Description$tr$: 'procurement.common.copyTypePacBoq'
			},
			{
				Id: masterRestrictionType.material,
				Description: 'Material',
				Description$tr$: 'procurement.common.copyTypeMaterial'
			},
			{
				Id: masterRestrictionType.contractBoq,
				Description: 'Procurement Contract BoQ',
				Description$tr$: 'procurement.common.copyTypeConBoq'
			}
		];
		angular.forEach(copyTypes, function (item) {
			let translation = $translate.instant(item.Description$tr$);
			if (translation !== item.Description$tr$) {
				item.Description = translation;
			}
		});

		return copyTypes;
	}
})(angular);