/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable, InjectionToken} from '@angular/core';
import {
	DataServiceHierarchicalNode,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {ProjectEntity, ProjectMainDataService} from '@libs/project/shared';
import {get, isNull, set} from 'lodash';
import {firstValueFrom, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';
import {ProjectEstimateRulesComplete} from '../model/project-estimate-rule-complete.class';

export const PROJECT_ESTIMATE_RULES_DATA_TOKEN = new InjectionToken<ProjectEstimateRuleDataService>('estimateProjectEstimateRulesDataToken');

@Injectable({
	providedIn: 'root'
})
export class ProjectEstimateRuleDataService extends DataServiceHierarchicalNode<IProjectEstimateRuleEntity, ProjectEstimateRulesComplete, ProjectEntity, ProjectEntity>{

	protected readonly http = inject(HttpClient);
	protected readonly configurationService = inject(PlatformConfigurationService);

	//event
	public onUpdateData = new Subject<object>();
	
	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectEstimateRuleEntity> = {
			apiUrl: 'estimate/rule/projectestimaterule',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true
			},
			createInfo:<IDataServiceEndPointOptions>{
				endPoint:'createitem',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IProjectEstimateRuleEntity>>{
				role: ServiceRole.Node,
				itemName: 'PrjEstRule',
				parent: projectMainDataService,
			},
		};
		super(options);
	}

	public override childrenOf(element: IProjectEstimateRuleEntity): IProjectEstimateRuleEntity[] {
		return element.PrjEstRules ?? [];
	}


	public override parentOf(element: IProjectEstimateRuleEntity): IProjectEstimateRuleEntity | null {
		if (element.PrjEstRuleFk == null) {
			return null;
		}

		const parentId = element.PrjEstRuleFk;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	/**
	 * Replace initReadData methods
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		const parent = this.getSelectedParent();
		return {
			projectFk: parent ? parent.Id : null,
		};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadSucceeded(loaded: object): IProjectEstimateRuleEntity[] {
		// TODO: wait estimateRuleSequenceLookupService
		// $injector.get('estimateProjectEstRuleValidationService').setMaxCodeLength(readItems.codeMaxLenght);
		// return $injector.get('estimateRuleSequenceLookupService').getListAsync().then(function () {
		// 		return serviceContainer.data.handleReadSucceeded(readItems.tree, data);
		// 	}
		// );

		const items = get(loaded, 'tree');
		if (items) {
			return items as IProjectEstimateRuleEntity[];
		}
		return [];
	}

	/**
	 * Replace initCreationData methods
	 * @protected
	 */
	public override provideCreatePayload(): object {
		const parent = this.getSelectedParent();
		const selectedItem = this.getSelectedEntity();
		return {
			projectFk: parent ? parent.Id : null,
			lastCode: selectedItem && selectedItem.Version === 0 ? selectedItem.Code : '',
			mainItemId: parent ? parent.Id : null
		};
	}

	protected override onCreateSucceeded(created: IProjectEstimateRuleEntity): IProjectEstimateRuleEntity {
		return created;
	}

	public async createDeepCopy(){
		const url = this.configurationService.webApiBaseUrl + 'estimate/rule/projectestimaterule/deepcopy';
		const response = await firstValueFrom(this.http.post(url,this.getSelectedEntity()));
		if(response){
			const copy = get(response, 'PrjEstRule') as unknown as IProjectEstimateRuleEntity;

			const creationData = {};
			if (!isNull(copy) && !isNull(copy.PrjEstRules)) {
				const items = this.getList();
				const parent = items.find((data) => {
					return data.PrjEstRuleFk === copy.PrjEstRuleFk;
				});
				set(creationData, 'parent', parent);
			}
			if(this.onCreateSucceeded && !isNull(copy)){
				this.onCreateSucceeded(copy);
			}
		}
	}

	public provideUpdateData(updateData: IProjectEstimateRuleEntity){
		this.onUpdateData.next(updateData);
		return updateData;
	}

	// TODO basicsCommonDependentService and platformModuleStateService
	// public override async delete(entities: IProjectEstimateRuleEntity[] | IProjectEstimateRuleEntity) {
	// 	if(isArray(entities)){
	// 		entities = clone(entities) as unknown as IProjectEstimateRuleEntity[];
	// 		const entityLength = entities.length;
	// 		if(entityLength > 0){
	// 			const postData = {
	// 				ProjectEstRuleIds: map(entities, 'Id'),
	// 				ProjectFk: entities[0].ProjectFk,
	// 				MdcLineItemContextFk: entities[0].MdcLineItemContextFk
	// 			};
	//
	// 			return this.http.post(this.configurationService.webApiBaseUrl + 'estimate/rule/projectestimaterule/candelete', postData).subscribe(function (response) {
	// 				let isAllRulesAssigned = false;
	// 				let missingCodes = [];
	// 				if (isArray(response) && response.length > 0) {
	// 					// If at least one ID received, some or all rules are associated.
	// 					if (response.length === entityLength) {
	// 						isAllRulesAssigned = true;
	// 					} else {
	// 						missingCodes = map(filter(entities, function (entity: IProjectEstimateRuleEntity) {
	// 							return response.indexOf(entity.Id) > -1;
	// 						}), 'Code');
	// 					}
	// 				}
	// 				if (isAllRulesAssigned) {
	// 					const modalOptions = {
	// 						headerTextKey: 'cloud.common.errorMessage',
	// 						bodyTextKey: 'estimate.rule.dialog.allRulesAssignedMessage',
	// 						iconClass: 'ico-error',
	// 						width:'800px'
	// 					};
	// 					if(entityLength === 1){
	// 						set(modalOptions,'mainItemId', entities[0].Id);
	// 						set(modalOptions,'moduleIdentifer', 'project.main.est.rules');
	// 						set(modalOptions,'showNoButton', false);
	// 						set(modalOptions,'prjectId', entities[0].ProjectFk);
	// 						set(modalOptions,'yesBtnText', 'OK');
	// 						// wait basicsCommonDependentService
	// 						// return inject('basicsCommonDependentService').showDependentDialog(modalOptions);
	// 					}else{
	// 						this.uiCommonMessageBoxService.showYesNoDialog(modalOptions);
	// 					}
	//
	// 				} else {
	// 					let message = 'estimate.rule.dialog.deleteAllSelectedRulesMessage';
	// 					if (missingCodes.length > 0) {
	// 						missingCodes = missingCodes.join(', ');
	// 						message = this.translate.instant('estimate.rule.dialog.deleteUnAssignedRulesMessage', {codes: missingCodes});
	// 					}
	// 					return this.uiCommonMessageBoxService.showYesNoDialog(message, 'estimate.rule.dialog.confirmRuleDelete', 'no');
	//
	// 				}
	// 			}).subscribe(function (result) {
	// 				if (result && result.yes) {
	// 					let filteredEntities = _.filter(entities, function (entity) {
	//
	// 						// defect 93035, Project Rule: Estimate code validation still showed while delete the project rule
	// 						// this is a common issue, below is a temporary solution for it
	// 						let itemsWithSameCode = _.filter(service.getList(), function(item){
	// 							return item.Id !== entity.Id && item.Code === entity.Code;
	// 						});
	// 						if(itemsWithSameCode && itemsWithSameCode.length > 0){
	// 							_.forEach(itemsWithSameCode, function(itemWithSameCode){
	// 								if(itemWithSameCode.__rt$data && itemWithSameCode.__rt$data.errors && itemWithSameCode.__rt$data.errors.Code){
	// 									itemWithSameCode.__rt$data = {errors: {}};
	//
	// 									let modState = platformModuleStateService.state(service.getModule());
	// 									modState.validation.issues = _.filter(modState.validation.issues, function(err) {
	// 										// return err.entity.Id !== itemWithSameCode.Id || err.model !== model;
	// 										return err.entity.Id !== itemWithSameCode.Id;
	// 									});
	// 								}
	// 							});
	// 						}
	//
	// 						return responseData.indexOf(entity.Id) === -1;
	// 					});
	// 					super.delete(filteredEntities);
	// 				}
	// 			});
	// 		}
	// 	}
	// }

	// TODO wait estimateCommonNavigationService
	// service.navigateToEstimateRule = function (item, triggerField) {
	// 	let ruleViews = ['project.main.est.rules', 'project.main.est.rule.script'];
	//
	// 	let cloudCommonGridService = $injector.get('cloudCommonGridService');
	// 	let list = [];
	// 	cloudCommonGridService.flatten(service.getList(), list, 'PrjEstRules'); // Flatten the rules into list so that, also trees (if any) are shifted to list item.
	// 	let ruleSelected = _.find(list, {Code: triggerField.Code}); // find the item.
	// 	service.setSelected(ruleSelected);  // In services set selection for item.
	// 	if (service.isSelection(ruleSelected)) {
	// 		if (triggerField.ReloadScript) {
	// 			$injector.get('estimateProjectEstRuleScriptService').load();
	// 		}
	// 	}
	//
	// 	$injector.get('estimateCommonNavigationService').navToRuleScript(triggerField, 911, '29', ruleViews, 'project.main.script');
	// };
}








