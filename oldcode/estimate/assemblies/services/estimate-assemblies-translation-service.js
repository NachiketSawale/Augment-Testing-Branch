/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let estimateAssembliesModule = 'estimate.assemblies';
	let estimateProjectModule = 'estimate.project';
	let cloudCommonModule = 'cloud.common';
	let cloudTranslationModule = 'cloud.translation';
	let estimateMainModule = 'estimate.main';
	let basicsCostCodesModule = 'basics.costcodes';
	let costGroupsName = 'basics.costgroups';
	let basicsMaterialModule = 'basics.material';
	let estimateRuleModule = 'estimate.rule';
	let estimateParamModule = 'estimate.parameter';
	let basicsCustomizeModule = 'basics.customize';
	let basicsUnitModule = 'basics.unit';
	let basicsimportModule = 'basics.import';
	let businesspartnerMainModule = 'businesspartner.main';
	let basicsMaterialCatalogModule =  'basics.materialcatalog';
	let basicsCommonModule = 'basics.common';
	let projectPlantAssembly = 'project.plantassembly';
	let projectMain = 'project.main';

	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(estimateAssembliesModule).value('estimateAssembliesTranslations', {
		translationInfos: {
			'extraModules': [estimateAssembliesModule, estimateProjectModule, cloudCommonModule, cloudTranslationModule, estimateMainModule, basicsCostCodesModule, costGroupsName,
				basicsMaterialModule,
				estimateRuleModule,
				estimateParamModule,
				basicsCustomizeModule,
				basicsUnitModule,
				basicsimportModule,
				businesspartnerMainModule,
				basicsMaterialCatalogModule,
				basicsCommonModule,
				projectPlantAssembly,
				projectMain
			],
			'extraWords': {

				userDefText: { location: cloudCommonModule, identifier: 'UserdefTexts', initial: 'User Defined Text' },

				EstAssemblyCatFk : { location: estimateAssembliesModule, identifier: 'estAssemblyCat', initial: 'Assembly Category' },
				MinValue : { location: estimateAssembliesModule, identifier: 'entityMinValue', initial: 'MinValue' },
				MaxValue : { location: estimateAssembliesModule, identifier: 'entityMaxValue', initial: 'MaxValue' },
				EstAssemblyTypeFk : { location: estimateAssembliesModule, identifier: 'entityEstAssemblyTypeFk', initial: 'Assembly Type' },
				IsShowInLeading : { location: estimateAssembliesModule, identifier: 'entityIsShowInLeading', initial: 'Is Show In Leading Structure' },
				EstResourceTypeShortKey:{ location: estimateMainModule, identifier: 'estResourceTypeFk', initial: 'Resource Type' },
				IsLive : { location: estimateAssembliesModule, identifier: 'islive', initial: 'Active' },

				Reference: { location: cloudCommonModule, identifier: 'entityReference', initial: 'Reference' },
				BriefInfo: { location: cloudCommonModule, identifier: 'entityBriefInfo', initial: 'Outline Specification' },

				Filter: { location: estimateMainModule, identifier: 'filter', initial: 'Filter' },

				BasUomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				BasCurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency', initial: 'Currency' },
				BasUomTargetFk:{ location: estimateMainModule, identifier: 'basUomTargetFk', initial: 'UoM Target' },

				UoMFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				QuantityUoMFk: { location: estimateAssembliesModule, identifier: 'quantityUoM', initial: 'QuantityUoM' },

				TotalOf: { location: estimateMainModule, identifier: 'totalOf', initial: 'Total of' },
				Total: { location: estimateMainModule, identifier: 'total', initial: 'Total' },
				CurUoM: { location: estimateMainModule, identifier: 'curOrUoM', initial: 'Cur/UoM' },

				QuantityDetail:{ location: estimateMainModule, identifier: 'quantityDetail', initial: 'Quantity Detail' },
				Quantity:{ location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
				QuantityTarget:{ location: estimateMainModule, identifier: 'quantityTarget', initial: 'Quantity Target' },
				QuantityTargetDetail:{ location: estimateMainModule, identifier: 'quantityTargetDetail', initial: 'Quantity Target Detail' },

				QuantityUnitTarget:{ location: estimateMainModule, identifier: 'quantityUnitTarget', initial: 'Quantity Unit Target' },
				QuantityTotal:{ location: estimateMainModule, identifier: 'quantityTotal', initial: 'Quantity Total' },
				QuantityFactorDetail1:{ location: estimateMainModule, identifier: 'quantityFactorDetail1', initial: 'Quantity Factor Detail 1' },
				QuantityFactor1:{ location: estimateMainModule, identifier: 'quantityFactor1', initial: 'QuantityFactor1' },
				QuantityFactorDetail2:{ location: estimateMainModule, identifier: 'quantityFactorDetail2', initial: 'Quantity Factor Detail 2' },
				QuantityFactor2:{ location: estimateMainModule, identifier: 'quantityFactor2', initial: 'Quantity Factor 2' },
				QuantityFactor3:{ location: estimateMainModule, identifier: 'quantityFactor3', initial: 'Quantity Factor 3' },
				QuantityFactor4:{ location: estimateMainModule, identifier: 'quantityFactor4', initial: 'Quantity Factor 4' },
				QuantityFactorCc:{ location: estimateMainModule, identifier: 'quantityFactorCc', initial: 'Quantity Factor Cc' },

				ProductivityFactorDetail:{ location: estimateMainModule, identifier: 'productivityFactorDetail', initial: 'Productivity Factor Detail' },
				ProductivityFactor:{ location: estimateMainModule, identifier: 'productivityFactor', initial: 'Productivity Factor' },

				CostUnit:{ location: estimateMainModule, identifier: 'costUnit', initial: 'Cost Unit' },
				CostUnitTarget:{ location: estimateMainModule, identifier: 'costUnitTarget', initial: 'Cost Unit Target' },
				CostTotal:{ location: estimateMainModule, identifier: 'costTotal', initial: 'Cost Total' },
				CostFactorDetail1:{ location: estimateMainModule, identifier: 'costFactorDetail1', initial: 'Cost Factor Detail 1' },
				CostFactor1:{ location: estimateMainModule, identifier: 'costFactor1', initial: 'Cost Factor 1' },
				CostFactorDetail2:{ location: estimateMainModule, identifier: 'costFactorDetail2', initial: 'Cost Factor Detail 2' },
				CostFactor2:{ location: estimateMainModule, identifier: 'costFactor2', initial: 'Cost Factor 2' },
				CostFactorCc:{ location: estimateMainModule, identifier: 'costFactorCc', initial: 'Cost Factor Cc' },
				CostUom:{ location: estimateMainModule, identifier: 'costInternal', initial: 'Cost/UoM' },

				HoursUnit:{ location: estimateMainModule, identifier: 'hoursUnit', initial: 'Hours Unit' },
				HourFactor:{ location: estimateMainModule, identifier: 'hourFactor', initial: 'Hour Factor' },
				HoursUnitTarget:{ location: estimateMainModule, identifier: 'hoursUnitTarget', initial: 'Hours Unit Target' },
				HoursTotal:{ location: estimateMainModule, identifier: 'hoursTotal', initial: 'Hours Total' },

				MdcControllingUnitFk:{ location: estimateMainModule, identifier: 'mdcControllingUnitFk', initial: 'Controlling Unit' },
				BoqHeaderFk:{ location: estimateMainModule, identifier: 'boqHeaderFk', initial: 'BoqHeader' },
				BoqItemFk:{ location: estimateAssembliesModule, identifier: 'boqItemFk', initial: 'WIC BoQ-Item Ref.No'},
				PsdActivityFk:{ location: estimateMainModule, identifier: 'psdActivityFk', initial: 'Activity' },
				LicCostGroup1Fk:{ location: estimateMainModule, identifier: 'licCostGroup1Fk', initial: 'CostGroup 1' },
				LicCostGroup2Fk:{ location: estimateMainModule, identifier: 'licCostGroup2Fk', initial: 'CostGroup 2' },
				LicCostGroup3Fk:{ location: estimateMainModule, identifier: 'licCostGroup3Fk', initial: 'CostGroup 3' },
				LicCostGroup4Fk:{ location: estimateMainModule, identifier: 'licCostGroup4Fk', initial: 'CostGroup 4' },
				LicCostGroup5Fk:{ location: estimateMainModule, identifier: 'licCostGroup5Fk', initial: 'CostGroup 5' },

				PrjCostGroup1Fk:{ location: estimateMainModule, identifier: 'prjCostGroup1Fk', initial: 'PrjCostGroup1' },
				PrjCostGroup2Fk:{ location: estimateMainModule, identifier: 'prjCostGroup2Fk', initial: 'PrjCostGroup2' },
				PrjCostGroup3Fk:{ location: estimateMainModule, identifier: 'prjCostGroup3Fk', initial: 'PrjCostGroup3' },
				PrjCostGroup4Fk:{ location: estimateMainModule, identifier: 'prjCostGroup4Fk', initial: 'PrjCostGroup4' },
				PrjCostGroup5Fk:{ location: estimateMainModule, identifier: 'prjCostGroup5Fk', initial: 'PrjCostGroup5' },

				MdcWicFk:{ location: estimateAssembliesModule, identifier: 'mdcWicFk', initial: 'WIC Item' },
				MdcWorkCategoryFk:{ location: estimateMainModule, identifier: 'mdcWorkCategoryFk', initial: 'Work Category' },
				MdcAssetMasterFk:{ location: estimateMainModule, identifier: 'mdcAssetMasterFk', initial: 'Asset Master' },

				PrjLocationFk:{ location: estimateMainModule, identifier: 'prjLocationFk', initial: 'Location' },
				UserDefined1: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '1' }, initial: 'User Defined 1' },
				UserDefined2: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '2' }, initial: 'User Defined 2' },
				UserDefined3: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '3' }, initial: 'User Defined 3' },
				UserDefined4: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '4' }, initial: 'User Defined 4' },
				UserDefined5: { location: cloudCommonModule, identifier: 'entityUserDefined', param: { p_0: '5' }, initial: 'User Defined 5' },

				IsLumpsum:{ location: estimateMainModule, identifier: 'isLumpSum', initial: 'Is LumpSum' },
				IsDisabled:{ location: estimateMainModule, identifier: 'isDisabled', initial: 'Is Disabled' },
				IsGc:{ location: estimateMainModule, identifier: 'isGc', initial: 'General Cost'},
				IsIndirectCost :{location: estimateMainModule, identifier : 'isIndirectCost', initial:'Indirect Cost'},
				IsManual:{ location: estimateMainModule, identifier: 'isManual', initial: 'Is Manual' },

				EfficiencyFactorDetail1:{ location: estimateMainModule, identifier: 'efficiencyFactorDetail1', initial: 'Efficiency Factor Detail 1' },
				EfficiencyFactor1:{ location: estimateMainModule, identifier: 'efficiencyFactor1', initial: 'Efficiency Factor 1' },
				EfficiencyFactorDetail2:{ location: estimateMainModule, identifier: 'efficiencyFactorDetail2', initial: 'Efficiency Factor Detail 2' },
				EfficiencyFactor2:{ location: estimateMainModule, identifier: 'efficiencyFactor2', initial: 'Efficiency Factor 2' },

				QuantityReal:{ location: estimateMainModule, identifier: 'quantityReal', initial: 'Quantity Real' },
				QuantityInternal:{ location: estimateMainModule, identifier: 'quantityInternal', initial: 'Quantity Internal' },
				CostUnitSubItem:{ location: estimateMainModule, identifier: 'costUnitSubItem', initial: 'CostUnitSubItem' },
				CostUnitLineItem:{ location: estimateMainModule, identifier: 'costUnitLineItem', initial: 'CostUnitLineItem' },
				HoursUnitSubItem:{ location: estimateMainModule, identifier: 'hoursUnitSubItem', initial: 'HoursUnitSubItem' },
				HoursUnitLineItem:{ location: estimateMainModule, identifier: 'hoursUnitLineItem', initial: 'HoursUnitLineItem' },

				EstCostRiskFk:{ location: estimateMainModule, identifier: 'estCostRiskFk', initial: 'Cost Risk' },
				EstHeaderFk:{ location: estimateMainModule, identifier: 'estHeaderFk', initial: 'EstHeader' },
				EstLineItemFk:{ location: estimateMainModule, identifier: 'estLineItemFk', initial: 'EstLineItem' },
				EstResourceFk:{ location: estimateMainModule, identifier: 'estResourceFk', initial: 'EstResource' },
				EstResourceTypeFk:{ location: estimateMainModule, identifier: 'estResourceTypeFk', initial: 'Resource Type' },
				EstResourceTypeFkExtend:{ location: estimateMainModule, identifier: 'estResourceTypeFk', initial: 'Resource Type' },
				MdcCostCodeFk:{ location: estimateMainModule, identifier: 'mdcCostCodeFk', initial: 'CostCode' },
				MdcMaterialFk:{ location: estimateMainModule, identifier: 'mdcMaterialFk', initial: 'Material' },
				PrcStructureFk:{ location: estimateMainModule, identifier: 'prcStructureFk', initial: 'Procurement Structure' },
				TransferMdcCostCodeFk:{ location: estimateMainModule, identifier: 'transferMdcCostCodeFk', initial: 'Transfer Cost Code' },
				TransferMdcMaterialFk:{ location: estimateMainModule, identifier: 'transferMdcMaterialFk', initial: 'Transfer Material' },

				ControllinggroupFk: {location: estimateAssembliesModule, identifier: 'entityControllingGroupFk', initial: 'Controlling Group'},
				ControllinggroupDetailFk: {location: estimateAssembliesModule, identifier: 'entityControllingGroupDetailFk', initial: 'Group Detail'},

				BoqWicCatFk: {location: estimateAssembliesModule, identifier: 'entityBoqWicCatFk', initial: 'WIC Group'},
				BoqWicCatBoqFk: {location: estimateAssembliesModule, identifier: 'entityBoqWicCatBoqFk', initial: 'WIC Catalogues'},

				EstCostTypeFk: { location: basicsCostCodesModule, identifier: 'costType', initial: 'Cost Type' },
				EstResourceFlagFk: { location: estimateMainModule, identifier: 'resourceFlag', initial: 'Resource Flag'},

				Rule: {location: estimateRuleModule, identifier: 'rules', initial: 'Rules' },
				Param: {location: estimateParamModule, identifier: 'params', initial: 'Params' },

				CommentText:{ location: estimateMainModule, identifier: 'comment', initial: 'Comment' },
				DescriptionInfo1:{ location: estimateMainModule, identifier: 'descriptionInfo1', initial: 'Further Description' },

				MarkupCostUnit :{location: estimateMainModule, identifier : 'markupCostUnit', initial:'Markup Cost/Unit'},
				MarkupCostUnitTarget :{location: estimateMainModule, identifier : 'markupCostUnitTarget', initial:'Markup Cost/Unit Item'},
				MarkupCostTotal :{location: estimateMainModule, identifier : 'MarkupCostTotal', initial:'Markup Cost Total'},
				GrandTotal :{location: estimateMainModule, identifier : 'grandTotal', initial:'Grand Total'},
				IsCost :{location: estimateMainModule, identifier : 'isCost', initial:'Is Cost'},
				Sorting :{location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},

				DirCostUnit:{ location: estimateMainModule, identifier: 'dirCostUnit', initial: 'Dir CostUnit' },
				DirCostUnitTarget:{ location: estimateMainModule, identifier: 'dirCostUnitTarget', initial: 'Dir CostUnitTarget' },
				DirCostTotal : { location: estimateMainModule, identifier: 'dirCostTotal', initial: 'Dir CostTotal'},

				IndCostUnit:{ location: estimateMainModule, identifier: 'indCostUnit', initial: 'Ind CostUnit' },
				IndCostUnitTarget:{ location: estimateMainModule, identifier: 'indCostUnitTarget', initial: 'Ind CostUnitTarget' },
				IndCostTotal : { location: estimateMainModule, identifier: 'indCostTotal', initial: 'Ind CostTotal'},
				NoLeadQuantity:{ location: estimateMainModule, identifier: 'noLeadQuantity', initial: 'No Lead Quantity'},
				DayWorkRateUnit: { location: estimateMainModule, identifier: 'dayWorkRateUnit', initial: 'DW/T+M Rate'},
				DayWorkRateTotal: { location: estimateMainModule, identifier: 'dayWorkRateTotal', initial: 'DW/T+M Rate Total'},
				LgmJobFk: {location: estimateProjectModule, identifier: 'lgmJobFk', initial: 'Job'},
				IsDissolvable:{ location: estimateAssembliesModule, identifier: 'IsDissolvable', initial: 'Dissolvable' },

				Co2Source:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Source', initial: 'CO2/kg (Source)'},
				Co2SourceTotal:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2SourceTotal', initial: 'CO2 (Source) Total'},
				Co2Project:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2Project', initial: 'CO2/kg (Project)'},
				Co2ProjectTotal:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2ProjectTotal', initial: 'CO2 (Project) Total'},
				Co2TotalVariance:{location: basicsCommonModule, identifier: 'sustainabilty.entityCo2TotalVariance', initial: 'CO2 Total Variance'},
				Source : {location: estimateAssembliesModule, identifier: 'source', initial: 'source'},
				PlantGroupFk: {location: projectPlantAssembly, identifier: 'plantGroupFk', initial: 'Equipment Plant Group'},
				PlantFk: {location: projectPlantAssembly, identifier: 'plantFk', initial: 'Equipment Plant'},
				WorkOperationTypeFk:{ location: basicsCustomizeModule, identifier: 'entityWorkOperationTypeFk', initial:'Work Operation Type'},
				PlantAssemblyTypeFk:{ location: basicsCustomizeModule, identifier: 'plantassemblytype', initial:'Plant Assembly Type'}
			}
		}
	});

	/**
	 * @ngdoc service
	 * @name estimateAssembliesTranslationService
	 * @description provides translation for estimate assembly module
	 */
	angular.module(estimateAssembliesModule).service('estimateAssembliesTranslationService', ['platformUIBaseTranslationService', 'estimateAssembliesTranslations',
		function (platformUIBaseTranslationService, estimateAssembliesTranslations) {
			let localBuffer = {};
			platformUIBaseTranslationService.call(this, [estimateAssembliesTranslations], localBuffer);
		}

	]);

})(angular);
