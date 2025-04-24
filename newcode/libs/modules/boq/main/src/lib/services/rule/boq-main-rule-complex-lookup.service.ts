import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({providedIn: 'root'})
export class BoqRuleComplexLookupService{
	protected readonly http = inject(PlatformHttpService);
	//TODO-BOQ: Unclear usage of the function & response type
	// private lookupData : any = {
	// 	estRuleFlatItems: [], // flat item list
	// 	estRuleItems: [],
	// 	navFrom: '',
	// 	projectId: 0,
	// 	boqHeaderId: 0
	// };

	public constructor() {
	}

	//TODO-BOQ: Unclear usage of the function & response type
	public loadLookupData() {
		// if (this.lookupData.navFrom === 'wic') {
		// 	// return this.http.get('estimate/rule/estimaterule/list').then( (response : any) =>{
		// 	// 	this.lookupData.estRuleFlatItems = _.sortBy(response.data, ['Sorting', 'Code']);
		// 	// 	//TODO-EST: estimateRuleCommonService.generateRuleCompositeList()
		// 	// 	//this.lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList({EstRulesEntities: lookupData.estRuleFlatItems}, 'isForBoq');
		// 	// 	return this.lookupData.estRuleItems;
		// 	// });
		// 	return [];
		// } else {
		// 	//TODO-EST: estimateProjectRateBookConfigDataService
		// 	//var rateBookService = $injector.get('estimateProjectRateBookConfigDataService');
		// 	//TODO-BOQ: Unclear usage of the block & response type
		// 	// let rateBookService : any;
		// 	// // the cache data is from the ruleComboService, refresh it, and check it refresh or not
		// 	// if (rateBookService) {
		// 	// 	return this.http.post('estimate/rule/projectestimaterule/compositelist', {projectFk: this.getProjectId()}).then( () =>{
		// 	// 		rateBookService.initData().then( () =>{
		// 	// 			//Inactive below code due to migration.
		// 	// 			//this.lookupData.estRuleItems = estimateRuleCommonService.generateRuleCompositeList(response.data, 'isForBoq', true);
		// 	// 			return this.lookupData.estRuleItems;
		// 	// 		});
		// 	// 	});
		// 	// }
		// }
		return [];
	}
}