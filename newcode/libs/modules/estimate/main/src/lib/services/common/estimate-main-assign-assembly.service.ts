/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { IEstContrUnitResponceData,IOverwrite } from '../../model/interfaces/estimate-main-common.interface';
import { EstimateMainCommonService } from './estimate-main-common.service';

@Injectable({
	providedIn: 'root'
})

/**
 * This service is for Assign Assembly function used in EstimateMainCommonService
 */
export class EstimateMainAssignAssemblyService {
	private estMainCommonServ = inject(EstimateMainCommonService);

	/**
	 * Assign assembly to lineitem and set properties
	 * @param lineItem Get lineitem object
	 * @param assembly Get Assembly object
	 * @param projectId Get project id
	 * @param isAssemblyToWic Check if is coming from WIC
	 * @param overwrite some flags(overwrite resource and rules)
	 * @param pastedContent when drag from assembly wic
	 * @param isNewLineItem Check if it is new
	 */
	public assignAssembly(lineItem: IEstLineItemEntity, assembly: IEstLineItemEntity, projectId: number, isAssemblyToWic: boolean, overwrite: IOverwrite, pastedContent: IEstLineItemEntity[], isNewLineItem: boolean) {
		const numPropsToCopy = [
				// foreign keys
				'BasUomFk',
				'MdcAssetMasterFk',
				'MdcWorkCategoryFk',
				'EstCostRiskFk',
				'PrcStructureFk',
				'LicCostGroup1Fk',
				'LicCostGroup2Fk',
				'LicCostGroup3Fk',
				'LicCostGroup4Fk',
				'LicCostGroup5Fk',
				// numeric values
				'CostTotal',
				'CostUnit',
				'CostUnitTarget',
				'HoursTotal',
				'HoursUnit',
				'HoursUnitTarget',
				'Co2Source',
				'Co2SourceTotal',
				'Co2Project',
				'Co2ProjectTotal',
				'Co2TotalVariance'
			];
			const boolPropsToCopy = ['IsDisabled', 'IsLumpsum'];
			const strPropsToCopy = [
				'DescriptionInfo',
				'UserDefined1',
				'UserDefined2',
				'UserDefined3',
				'UserDefined4',
				'UserDefined5',
				'CommentText',
				'CostFactorDetail1',
				'CostFactorDetail2',
				'QuantityFactorDetail1',
				'QuantityFactorDetail2',
				'QuantityDetail',
				'ProductivityFactorDetail'
			],
			factorFieldsToCopy = ['CostFactor1', 'CostFactor2', 'QuantityFactor1', 'QuantityFactor2', 'QuantityFactor3', 'QuantityFactor4', 'Quantity', 'QuantityUnitTarget', 'ProductivityFactor'];

		strPropsToCopy.forEach((prop: string) => {
			if (prop === 'DescriptionInfo') {
				if ((isAssemblyToWic && !lineItem.DescriptionInfo?.Translated) || !lineItem.DescriptionInfo?.Translated || (overwrite && overwrite.OverwriteFlag)) {
					if (lineItem.DescriptionInfo) {
						const translatedDesc = assembly.DescriptionInfo?.Translated;
						lineItem.DescriptionInfo.Translated = translatedDesc ? translatedDesc : assembly.DescriptionInfo?.Description ? assembly.DescriptionInfo.Description : '';
						lineItem.DescriptionInfo.Description = assembly.DescriptionInfo?.Description ? assembly.DescriptionInfo?.Description : '';
						lineItem.DescriptionInfo.Modified = true;
					}
				}
			} else {
				if (!lineItem[prop as keyof IEstLineItemEntity]) {
					if (!isNewLineItem || prop !== 'QuantityDetail') {
						// TODO - Can not copy readonly properties Error
						// lineItem[prop] = assembly[prop];
					}
				}
			}
		});

		if (overwrite && overwrite.OverwriteFlag && overwrite.CanRuleOverwrite) {
			//const args = { entity: lineItem };

			// TODO $parent is not supported
			// let scope = {
			// 	entity: lineItem,
			// 	$parent: {
			// 		$parent: {
			// 			config: {
			// 				formatterOptions: {
			// 					dataServiceMethod: 'getItemByRuleAsync',
			// 					dataServiceName: 'estimateRuleFormatterService',
			// 					itemName: 'EstLineItems',
			// 					itemServiceName: 'estimateMainService',
			// 					serviceName: 'basicsCustomizeRuleIconService',
			// 					validItemName: 'EstLineItems',
			// 				},
			// 			},
			// 		},
			// 	},
			// };

			// inject(EstimateRuleComplexLookupCommonService).clearAllItems(args, scope, true);

			// scope.$parent.$parent.config.formatterOptions = {
			// 	dataServiceMethod: 'getItemByParamAsync',
			// 	dataServiceName: 'estimateParameterFormatterService',
			// 	itemName: 'EstLineItems',
			// 	itemServiceName: 'estimateMainService',
			// 	serviceName: 'estimateParameterFormatterService',
			// 	validItemName: 'EstLineItems',
			// };
			// inject(EstimateRuleComplexLookupCommonService).clearAllItems(args, scope, true);
		}

		numPropsToCopy.forEach((prop: string) => {
			if (lineItem[prop as keyof IEstLineItemEntity]) {
				// TODO - Can not copy readonly properties Error
				//	lineItem[prop] = assembly[prop as keyof IEstLineItemEntity];
			}
		});

		boolPropsToCopy.forEach((prop: string) => {
			// TODO - Can not copy readonly properties Error
			// lineItem[prop] = assembly[prop as keyof IEstLineItemEntity];
		});

		factorFieldsToCopy.forEach((prop: string) => {
			// TODO - Can not copy readonly properties Error
			// if (lineItem[prop] === 1) {
			// //	lineItem[prop] = assembly[prop];
			// }
		});

		// assign controlling unit depending on assembly's ctrl group assignments
		if (lineItem.MdcControllingUnitFk !== null &&  lineItem.MdcControllingUnitFk !== undefined) {
			if ((lineItem.MdcControllingUnitFk ?? 0) <= 0) {
				this.estMainCommonServ.findControllingUnit(assembly.Id, projectId).subscribe((response: IEstContrUnitResponceData) => {
					if (response.Data && response.Data !== null) {
						lineItem.MdcControllingUnitFk = response.Data;
					}
				});
			}
		}

		// While using WIC related assembly container to overwrite line item assembly, UoM and quantity will be overwrite according to takeover quantity and the UoM of the assembly.
		if (overwrite && pastedContent) {
			// TODO - Wic2AssemblyQuantity need to add in IEstLineItemEntity
			// let takeOverQuantity = pastedContent.data && pastedContent.data.length > 0 ? pastedContent.data[0].Wic2AssemblyQuantity : null;
			// if (takeOverQuantity) {
			// 	lineItem.QuantityDetail = lineItem.Quantity = takeOverQuantity;
			// }
			lineItem.BasUomFk = assembly.BasUomFk;
		} else if (overwrite && !overwrite.HasSameUom) {
			// TODO - lineItem.QuantityDetail should be number or string
			// lineItem.QuantityDetail = lineItem.Quantity = assembly.Quantity;
			lineItem.BasUomFk = assembly.BasUomFk;
		}

		if (!isAssemblyToWic) {
			// link boqitem by assembly-wic configuration
			this.estMainCommonServ.linkBoqItemByAssembly(assembly.Id, assembly.EstHeaderFk, lineItem.EstHeaderFk, projectId).subscribe((response) => {
				// if (response.data) {
				// 	// refresh the boqitem lookup cache
				// TODO EstimateMainBoqLookupService
				// 	let estimateMainBoqLookupService = inject(EstimateMainBoqLookupService);
				// 	estimateMainBoqLookupService.forceReload().then((lookupresponse) => {
				//     let estBoqItems = lookupresponse.data;
				//     estimateMainBoqLookupService.setLookupData(estBoqItems);
				//     let output = [];
				//     inject(CloudCommonGridService).flatten(estBoqItems, output, 'BoqItems');
				//     inject(basicsLookupdataLookupDescriptorService).updateData('estboqitems', output);
				//     let leafBoqItem = this.estMainCommonServ.getLeafBoqItem(response.data);
				//     lineItem.BoqItemFk = leafBoqItem.Id;
				//     lineItem.BoqHeaderFk = leafBoqItem.BoqHeaderFk;
				// 	this.onLinkBoqItemSucceeded.fire(response.data); TODO
				// 	});
				// }
			});
		}

		// TODO EstimateMainAssemblyCategoryCopyAssemblyTemplateRuleService & EstimateMainLineItemCopyAssemblyTemplateRuleService
		// inject(EstimateMainAssemblyCategoryCopyAssemblyTemplateRuleService).assignAssemblyCategoryRules(assembly, lineItem);
		// return inject(EstimateMainLineItemCopyAssemblyTemplateRuleService).assignAssemblyRules(assembly, lineItem, isAssemblyToWic, overwrite).subscribe(() => {
		// 	return this.estMainCommonServ.getAssemblyResources(assembly, projectId, lineItem.EstHeaderFk, [lineItem.Id]);
		// });
	}
}
