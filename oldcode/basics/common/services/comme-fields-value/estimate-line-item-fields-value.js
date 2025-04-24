/**
 * Created by chi on 5/30/2018.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';
	angular.module(moduleName).factory('basicsCommonEstimateLineItemFieldsValue', basicsCommonEstimateLineItemFieldsValue);
	basicsCommonEstimateLineItemFieldsValue.$inject = ['_', '$translate'];

	function basicsCommonEstimateLineItemFieldsValue(_, $translate) {
		const defaultValues = [
			{
				model: 'DescriptionInfo',
				fieldName: $translate.instant('cloud.common.entityDescription'),
				isSelect: true
			},
			{
				model: 'BasUomTargetFk',
				fieldName: $translate.instant('estimate.main.basUomTargetFk'),
				isSelect: true
			},
			{
				model: 'MdcControllingUnitFk',
				fieldName: $translate.instant('estimate.main.mdcControllingUnitFk'),
				isSelect: false
			},
			{
				model: 'BasUomFk',
				fieldName: $translate.instant('cloud.common.entityUoM'),
				isSelect: false
			},
			{
				model: 'CostUnitTarget',
				fieldName: $translate.instant('estimate.main.costUnitTarget'),
				isSelect: false
			},
			{
				model: 'MdcCostCodeFk',
				fieldName: $translate.instant('estimate.main.mdcCostCodeFk'),
				isSelect: false
			},
			{
				model: 'EstAssemblyFk',
				fieldName: $translate.instant('estimate.main.estAssemblyFk'),
				isSelect: false
			},
			{
				model: 'PsdActivityFk',
				fieldName: $translate.instant('estimate.main.psdActivityFk'),
				isSelect: false
			},
			{
				model: 'MdcAssetMasterFk',
				fieldName: $translate.instant('estimate.main.mdcAssetMasterFk'),
				isSelect: false
			},
			{
				model: 'PrjLocationFk',
				fieldName: $translate.instant('estimate.main.prjLocationFk'),
				isSelect: false
			},
			{
				model: 'EstCostRiskFk',
				fieldName: $translate.instant('estimate.main.estCostRiskFk'),
				isSelect: false
			},
			{
				model: 'PrcStructureFk',
				fieldName: $translate.instant('estimate.main.prcStructureFk'),
				isSelect: false
			},
			{
				model: 'CosInstanceFk',
				fieldName: $translate.instant('estimate.main.cosInstanceCode'),
				isSelect: false
			},
			{
				model: 'PrjChangeFk',
				fieldName: $translate.instant('estimate.main.prjChange'),
				isSelect: false
			},
			{
				model: 'LgmJobFk',
				fieldName: $translate.instant('estimate.project.lgmJobFk'),
				isSelect: false
			},
			{
				model: 'LicCostGroup1Fk',
				fieldName: $translate.instant('estimate.main.licCostGroup1Fk'),
				isSelect: false
			},
			{
				model: 'LicCostGroup2Fk',
				fieldName: $translate.instant('estimate.main.licCostGroup2Fk'),
				isSelect: false
			},
			{
				model: 'LicCostGroup3Fk',
				fieldName: $translate.instant('estimate.main.licCostGroup3Fk'),
				isSelect: false
			},
			{
				model: 'LicCostGroup4Fk',
				fieldName: $translate.instant('estimate.main.licCostGroup4Fk'),
				isSelect: false
			},
			{
				model: 'LicCostGroup5Fk',
				fieldName: $translate.instant('estimate.main.licCostGroup5Fk'),
				isSelect: false
			},
			{
				model: 'PrjCostGroup1Fk',
				fieldName: $translate.instant('estimate.main.prjCostGroup1Fk'),
				isSelect: false
			},
			{
				model: 'PrjCostGroup2Fk',
				fieldName: $translate.instant('estimate.main.prjCostGroup2Fk'),
				isSelect: false
			},
			{
				model: 'PrjCostGroup3Fk',
				fieldName: $translate.instant('estimate.main.prjCostGroup3Fk'),
				isSelect: false
			},
			{
				model: 'PrjCostGroup4Fk',
				fieldName: $translate.instant('estimate.main.prjCostGroup4Fk'),
				isSelect: false
			},
			{
				model: 'PrjCostGroup5Fk',
				fieldName: $translate.instant('estimate.main.prjCostGroup5Fk'),
				isSelect: false
			},
			{
				model: 'UserDefined1',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '1'}), /* jshint ignore: line */
				isSelect: false
			},
			{
				model: 'UserDefined2',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '2'}), /* jshint ignore: line */
				isSelect: false
			},
			{
				model: 'UserDefined3',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '3'}), /* jshint ignore: line */
				isSelect: false
			},
			{
				model: 'UserDefined4',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '4'}), /* jshint ignore: line */
				isSelect: false
			},
			{
				model: 'UserDefined5',
				fieldName: $translate.instant('cloud.common.entityUserDefined', {p_0: '5'}), /* jshint ignore: line */
				isSelect: false
			},
			{
				model: 'SortCode01Fk',
				fieldName: $translate.instant('project.structures.sortCode01'),
				isSelect: false
			},
			{
				model: 'SortCode02Fk',
				fieldName: $translate.instant('project.structures.sortCode02'),
				isSelect: false
			},
			{
				model: 'SortCode03Fk',
				fieldName: $translate.instant('project.structures.sortCode03'),
				isSelect: false
			},
			{
				model: 'SortCode04Fk',
				fieldName: $translate.instant('project.structures.sortCode04'),
				isSelect: false
			},
			{
				model: 'SortCode05Fk',
				fieldName: $translate.instant('project.structures.sortCode05'),
				isSelect: false
			},
			{
				model: 'SortCode06Fk',
				fieldName: $translate.instant('project.structures.sortCode06'),
				isSelect: false
			},
			{
				model: 'SortCode07Fk',
				fieldName: $translate.instant('project.structures.sortCode07'),
				isSelect: false
			},
			{
				model: 'SortCode08Fk',
				fieldName: $translate.instant('project.structures.sortCode08'),
				isSelect: false
			},
			{
				model: 'SortCode09Fk',
				fieldName: $translate.instant('project.structures.sortCode09'),
				isSelect: false
			},
			{
				model: 'SortCode10Fk',
				fieldName: $translate.instant('project.structures.sortCode10'),
				isSelect: false
			}
		];

		return {
			'getWithDynamicFields': getWithDynamicFields
		};

		// ////////////////////////
		function getWithDynamicFields(dynamicValues, values) {
			values = values || angular.copy(defaultValues);

			if (!angular.isArray(dynamicValues) || dynamicValues.length === 0) {
				return get(values);
			}

			_.forEach(dynamicValues, function (item) {
				values.push(createFieldsNew(item));
			});
			return get(values);
		}

		function get(values) {
			return _.map(values, function (value, key) {
				value.sId = key + 1;
				return value;
			});
		}

		function createFieldsNew(entity) {
			return {
				id: entity.Id,
				model: entity.Code,
				fieldName: entity.Code,
				isSelect: false
			};
		}
	}
})(angular);