import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';

import { inject } from '@angular/core';

import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { IEstimateMainRelLineItem } from '../../model/interfaces/estimate-main-rel-line-item.interface';
import { EstimateMainResourceService } from '../../containers/resource/estimate-main-resource-data.service';
import { EstimateMainContextService } from '@libs/estimate/shared';

export class EstimateMainRefLineItemService {
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly http = inject(HttpClient);

	private selectedLineItemId: number | null = null;
	private resourcesOfSelectedLineItem: IEstResourceEntity[] | null = [];

	public constructor(private estimateMainResourceService: EstimateMainResourceService) {
	}

	public getRefBaseResources(item: IEstLineItemEntity, isBaseCopyReq: boolean, skipCheckLineItem: boolean = false): Promise<IEstResourceEntity[]> {
		const data = {
			'estHeaderFk': item.EstHeaderFk,
			'estLineItemFk': item.Id,
			'estBaseLineItemFk': item.EstLineItemFk,
			'projectId': this.estimateMainContextService.getSelectedProjectId(),
			'skipCheckLineItem': skipCheckLineItem
		};

		return new Promise((resolve) => {
			this.http.post<IEstimateMainRelLineItem>(this.configurationService.webApiBaseUrl + 'estimate/main/resource/getbaselineitem', data).subscribe(result => {
				this.selectedLineItemId = item.Id;
				this.resourcesOfSelectedLineItem = result.EstBaseResources ? _.filter(result.EstBaseResources, function(item) {
					return item.EstResourceFk === null;
				}) : [];

				//TODO: waiting for estimateMainDynamicUserDefinedColumnService
				// let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
				// if(result && result.EstBaseItemUserDefinedColVal){
				// 	estimateMainDynamicUserDefinedColumnService.resolveRefLineitem(item, result.EstBaseItemUserDefinedColVal);
				// }
				//
				// if(!skipCheckLineItem){
				// 	let userDefinedColumnTableIds = $injector.get('userDefinedColumnTableIds');
				// 	let updatedComplete = {
				// 		UserDefinedColumnValueToDelete : [{
				// 			'TableId':userDefinedColumnTableIds.EstimateLineItem,
				// 			'Pk1':item.EstHeaderFk,
				// 			'Pk2': item.Id
				// 		}]
				// 	};
				// 	estimateMainDynamicUserDefinedColumnService.handleUpdateDone(updatedComplete);
				// }

				// if(result && result.ResourceUserDefinedColVal && result.ResourceUserDefinedColVal.length > 0  && result.EstBaseResources && result.EstBaseResources.length > 0){
				// 	let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
				// 	estimateMainResourceDynamicUserDefinedColumnService.resolveRefResource(resourcesOfSelectedLineItem, result.ResourceUserDefinedColVal);
				// }

				if (result.EstBaseItem && result.EstBaseItem.Id) {
					const baseItem = result.EstBaseItem;
					if (isBaseCopyReq) {
						this.replaceRefItem(item, baseItem);
					}

					//estimateMainResourceService.clearModifications();
					// if(result.EstBaseResources && result.EstBaseResources.length >0){
					// 	item.EstResources = [];
					// }
					resolve(this.resourcesOfSelectedLineItem);
				} else {
					resolve([]);
				}
			});
		});
	}

	public getResourceCopy(item: IEstLineItemEntity, EstLineItemFk: number, isBaseCopyReq: boolean = false): Promise<IEstResourceEntity[]|null> {
		const data = {
			'estHeaderFk': item.EstHeaderFk,
			'estLineItemFk': item.Id,
			'estBaseLineItemFk': EstLineItemFk,
			'projectId': this.estimateMainContextService.getSelectedProjectId()
		};
		return new Promise(resolve => {
			this.http.post<IEstimateMainRelLineItem>(this.configurationService.webApiBaseUrl + 'estimate/main/resource/copyresource', data).subscribe(result => {
					if (result.EstBaseItem && result.EstBaseItem.Id) {

						// TODO-Walt:Copy the param, rule from the base lineItem
						// Add the rule
						// if(result.EstLineItem2EstRule){
						// 	estimateRuleFormatterService.processData(result.EstLineItem2EstRule);
						// 	estimateRuleFormatterService.addRules('EstLineItems', 'EstLineItemFk', result.EstLineItem2EstRule);
						//
						// 	item.Rule = _.uniq(_.map(result.EstLineItem2EstRule,'Code'));
						// 	item.RuleAssignment = _.map(result.EstLineItem2EstRule, function(item){ return angular.copy(item);});
						// 	if(!!item.RuleAssignment && item.RuleAssignment.length > 0){
						// 		_.forEach(item.RuleAssignment, function (item) {
						// 			item.MainId = item.PrjEstRuleFk;
						// 		});
						// 	}
						// 	estimateMainService.fireItemModified(item);
						// }

						// if(result.EstLineItemParam){
						// 	estimateParameterFormatterService.processData(result.EstLineItemParam);
						// 	estimateParameterFormatterService.addLineItemParam('EstLineItems', 'EstLineItemFk', result.EstLineItemParam);
						// }

						const baseItem = result.EstBaseItem;
						//const resList = [];
						if (isBaseCopyReq) {
							this.replaceRefItem(item, baseItem);
						}

						// Clean the deleted UDP cache
						//TODO: waiting for estimateMainDynamicUserDefinedColumnService
						// let userDefinedColumnTableIds = $injector.get('userDefinedColumnTableIds');
						// let updatedComplete = {
						// 	UserDefinedColumnValueToDelete : [{
						// 		'TableId':userDefinedColumnTableIds.EstimateLineItem,
						// 		'Pk1':item.EstHeaderFk,
						// 		'Pk2': item.Id
						// 	}]
						// };
						// let estimateMainDynamicUserDefinedColumnService = $injector.get('estimateMainDynamicUserDefinedColumnService');
						// estimateMainDynamicUserDefinedColumnService.handleUpdateDone(updatedComplete);
						//
						// if(result && result.EstBaseItemUserDefinedColVal){
						// 	estimateMainDynamicUserDefinedColumnService.resolveRefLineitem(item, result.EstBaseItemUserDefinedColVal);
						// 	estimateMainDynamicUserDefinedColumnService.updateValueList([result.EstBaseItemUserDefinedColVal]);
						// }
						//
						// estimateMainResourceService.clearModifications();
						if (result.EstBaseResources && result.EstBaseResources.length > 0) {
							// if(result && result.ResourceUserDefinedColVal && result.ResourceUserDefinedColVal.length > 0){
							// 	let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
							// 	estimateMainResourceDynamicUserDefinedColumnService.resolveRefResource(result.EstBaseResources, result.ResourceUserDefinedColVal);
							// 	estimateMainResourceDynamicUserDefinedColumnService.updateValueList(result.ResourceUserDefinedColVal);
							// }

							// resList = _.filter(result.EstBaseResources, function(item) {
							// 	return item.EstResourceFk === null;
							// });
							//item.EstResources = resList;
							//this.estimateMainResourceService.updateList(resList, false);
							//item.EstResources = [];
						}
						resolve(result.EstBaseResources);
					} else {
						resolve([]);
					}
				}
			);
		});
	}

	public setRefLineItem (item:IEstLineItemEntity){
		if(item.EstLineItemFk && item.EstLineItemFk > 0){
			//TODO: waiting for estimateMainDynamicColumnService
			//estimateMainDynamicColumnService.setLineItemReadOnly(arg,true);
			return this.getRefBaseResources(item, true).then(function(resList){
				/* calculate quantity and cost of lineItem and resources */
				//estimateMainCommonService.calculateLineItemAndResources(item, resList);

				// clear the param , rule
				// estimateRuleFormatterService.removeRules('EstLineItems', 'EstLineItemFk', item.Id);
				// estimateParameterFormatterService.removeLineItemParam('EstLineItems', 'EstLineItemFk', item.Id);
				// item.Param = [];
				// item.Rule = [];
				// item.RuleAssignment = [];
				// estimateMainService.fireItemModified(item);
				// estimateMainResourceService.updateList(resList, true);
				// estimateMainLineItemProcessor.processItem(item);
				//
				// return estimateMainService.gridRefresh();
				return true;
			});
		}else{
			//estimateMainDynamicColumnService.setLineItemReadOnly(arg,false);
			const resources = this.estimateMainResourceService.getList();
			//this.estimateMainResourceService.setList([], true);
			if(resources && resources.length > 0){
				if(resources[0].EstLineItemFk && resources[0].EstLineItemFk > 0 && resources[0].EstLineItemFk!== item.Id){
					return this.getResourceCopy(item,resources[0].EstLineItemFk,false).then(
						function(result){

							/* calculate quantity and cost of lineItem and resources */
							//estimateMainCommonService.calculateLineItemAndResources(item, result);

							//estimateMainLineItemProcessor.setRuleReadonly(item, false);
							//refreshItems();
							return true;
						}
					);
				}else{
					return Promise.resolve(true);
				}
			}else{
				return Promise.resolve(true);
			}
		}
	}

	private replaceRefItem(item: IEstLineItemEntity, baseItem: IEstLineItemEntity) {
		// eslint-disable-next-line prefer-const
		const numPropsToCopy = ['EstAssemblyCatFk',
				'EstAssemblyFk',
				'BasUomTargetFk',
				'BasUomFk',
				'EstCostRiskFk',
				'BoqRootRef',
				'BoqItemFk',
				'BoqHeaderFk',
				'PsdActivitySchedule',
				'PsdActivityFk',
				'LicCostGroup1Fk',
				'LicCostGroup2Fk',
				'LicCostGroup3Fk',
				'LicCostGroup4Fk',
				'LicCostGroup5Fk',
				'MdcControllingUnitFk',
				'PrjCostGroup1Fk',
				'PrjCostGroup2Fk',
				'PrjCostGroup3Fk',
				'PrjCostGroup4Fk',
				'PrjCostGroup5Fk',
				'MdcWorkCategoryFk',
				'MdcAssetMasterFk',
				'PrjLocationFk',
				'PrcStructureFk',
				'PrjChangeFk',
				'SortCode01Fk',
				'SortCode02Fk',
				'SortCode03Fk',
				'SortCode04Fk',
				'SortCode05Fk',
				'SortCode06Fk',
				'SortCode07Fk',
				'SortCode08Fk',
				'SortCode09Fk',
				'SortCode10Fk'],
			strPropsToCopy = [
				'DescriptionInfo',
				'UserDefined1',
				'UserDefined2',
				'UserDefined3',
				'UserDefined4',
				'UserDefined5',
				'CommentText'];

		_.forEach(strPropsToCopy, function(prop) {
			if (prop === 'DescriptionInfo') {
				if (item.DescriptionInfo && !item.DescriptionInfo.Translated && baseItem.DescriptionInfo) {
					item.DescriptionInfo.Translated = baseItem.DescriptionInfo.Description;
					item.DescriptionInfo.Description = baseItem.DescriptionInfo.Description;
					item.DescriptionInfo.Modified = true;
				}
			} else {
				if (prop in item && _.isEmpty(_.get(item, prop))) {
					_.set(item, prop, _.get(baseItem, prop));
					//item[prop] = baseItem[prop];
				}
			}
		});

		_.forEach(numPropsToCopy, function(prop) {
			if (prop in item && (_.get(item, prop) <= 0)) {
				_.set(item, prop, _.get(baseItem, prop));
				//item[prop] = baseItem[prop];
			}
		});
	}
}