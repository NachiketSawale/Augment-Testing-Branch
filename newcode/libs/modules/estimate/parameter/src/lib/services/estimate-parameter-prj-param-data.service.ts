/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { EstimateParameterPrjParamComplete } from '../model/estimate-parameter-prj-param-complete.class';
import { ProjectEntity, ProjectMainDataService } from '@libs/project/shared';
import * as _ from 'lodash';
import { IEstimateParameterPrjEntity } from '../model/entities/estimate-parameter-prj-entity.interface';

export const ESTIMATE_PARAMETER_PRJ_PARAM_DATA_TOKEN = new InjectionToken<EstimateParameterPrjParamDataService>('estimateParameterPrjParamDataToken');

@Injectable({
	providedIn: 'root'
})

/**
 * Data service for the container
 */
export class EstimateParameterPrjParamDataService extends DataServiceFlatLeaf<IEstimateParameterPrjEntity, ProjectEntity, EstimateParameterPrjParamComplete> {
	private projectMainDataService = inject(ProjectMainDataService);
	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IEstimateParameterPrjEntity> = {
			apiUrl: 'estimate/parameter/prjparam',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: () => {
					const selection = projectMainDataService.getSelection()[0];
					return { projectId: selection.Id };
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				apiUrl: 'estimate/parameter/prjparam',
				endPoint: 'createnew',
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				apiUrl: 'project/main',
				endPoint: 'delete',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				apiUrl: 'project/main',
				endPoint: 'update',
			},
			roleInfo: <IDataServiceChildRoleOptions<IEstimateParameterPrjEntity, ProjectEntity, EstimateParameterPrjParamComplete>>(<unknown>{
				role: ServiceRole.Leaf,
				itemName: 'PrjEstParam',
				parent: projectMainDataService,
			}),
		};

		super(options);
	}

	protected override onLoadSucceeded(loaded: object): IEstimateParameterPrjEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}

	protected override provideLoadPayload(): object {
		const selection = this.projectMainDataService.getSelection()[0];
		return { projectId: selection.Id };
	}

	/**
	 * Implements row change functionality
	 */
	// TODO
	public rowChangeCallBack() {
		this.selectionChanged$.subscribe((res) => {
			// let selectedParam = this.getSelectedEntity();
			// TODO estimateParamDataService not ready
			// let estimateParamDataService = $injector.get('estimateParamDataService');
			// if(selectedParam){
			// 	estimateParamDataService.setSelectParam(selectedParam);
			// }
		});
	}

	/**
	 * Handles cell change functionality
	 */
	// TODO
	public cellChangeCallBack(item: IEstimateParameterPrjEntity, field: string) {
		// let modified = false;
		// TODO
		// if (field === 'ValueDetail') {
		// 	if (item.ValueType === estimateRuleParameterConstant.Text) {
		// 		item.ParameterText = item.ValueDetail;
		// 	} else {
		// 		if (!item.CalculateDefaultValue) {
		// 			estimateRuleCommonService.calculateDetails(item, col, 'ParameterValue', estimateParameterPrjParamService);
		// 		} else {
		// 			if (estimateParameterPrjParamService && _.isFunction(estimateParameterPrjParamService.getList)) {
		// 				estimateRuleCommonService.calculateReferenceParams(item, estimateParameterPrjParamService);
		// 			}
		// 		}
		// 	}
		// 	modified = true;
		// } else if (field === 'ParameterValue') {
		// 	item.ParameterValue = item.ParameterValue === '' ? 0 : item.ParameterValue;
		// 	estimateRuleCommonService.calculateDetails(item, field, null, estimateParameterPrjParamService);

		// 	modified = true;
		// } else if (field === 'ParameterText') {
		// 	if (item.ValueType !== estimateRuleParameterConstant.TextFormula) {
		// 		item.ValueDetail = item.ParameterText;
		// 	}
		// 	modified = true;
		// } else if (field === 'Code') {
		// 	modified = true;
		// }

		// if (modified) {
		// 	platformGridAPI.items.invalidate($scope.gridId, item);
		// }
		// estimateParameterPrjParamService.gridRefresh();
		// estimateMainCommonFeaturesService.fieldChanged(field, item);
	}
}
