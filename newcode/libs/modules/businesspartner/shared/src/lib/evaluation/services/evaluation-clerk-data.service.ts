/*
 * Copyright(c) RIB Software GmbH
*/

import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {IBasicsClerkEntity} from '@libs/basics/shared';
import {inject} from '@angular/core';
import {get} from 'lodash';
import {MODULE_INFO} from '../model/entity-info/module-info.model';
import {EvaluationCommonService} from './evaluation-common.service';
import {EvaluationDetailService} from './evaluation-detail.service';
import { IEvaluationClerkDataCreateParam, IEventEmitterParam } from '@libs/businesspartner/interfaces';

export class EvaluationClerkDataService<PT extends object> extends DataServiceFlatLeaf<IBasicsClerkEntity, IBasicsClerkEntity, PT> {
	private readonly commonService: EvaluationCommonService = inject(EvaluationCommonService);
	private readonly evaluationDetailService: EvaluationDetailService = inject(EvaluationDetailService) ;

	private readonly moduleName: string = MODULE_INFO.businesspartnerMainModuleName;

	public constructor(public params: IEvaluationClerkDataCreateParam) {
		const option: IDataServiceOptions<IBasicsClerkEntity> = {
			apiUrl: 'businesspartner/main/evaluationclerk',
			createInfo: {
				endPoint: 'createclerk',
				usePost: true,
				prepareParam: ident => {
					return this.getRequestData();
				}
			},
			readInfo: {
				endPoint: 'listclerk',
				usePost: true,
				prepareParam: ident => {
					return this.getRequestData();
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkEntity, IBasicsClerkEntity, PT>>{
				role: ServiceRole.Leaf,
				itemName: params.options.itemName,
				parent: params.parentService,
			},
		};

		super(option);

		if (params.options.moduleName) {
			this.moduleName = params.options.moduleName;
		}

		this.commonService.onEvalClerkValidationMessenger.subscribe(value => {
			this.onClerkValidationHandler(value);
		});
	}

	// public getEvalClerkDataService(): IEvaluationClerkDataCreateParam{
	// 	return {
	// 		serviceDescriptor: this.permissionService.getPermission(EvaluationPermissionEnum.EVAL),
	// 		parentService: this.evaluationDetailService,
	// 		qualifier: this.commonService.adaptorService.getModuleName(),
	// 		itemName: 'Evaluation2Clerk',
	// 		options
	//
	// 		canLoad: (isEvalGrpOrSubGrpClerkOn: boolean) => {
	// 			return !isEvalGrpOrSubGrpClerkOn;
	// 		},
	// 	};
	// }

	public getRequestData() {
		let mainItemId = 0;
		const parentItem = this.params.parentService.getSelection()[0];
		let qualifierTemp = this.params.qualifier;
		if (parentItem) {
			mainItemId = get(parentItem, 'Id') as unknown as number;
			const isEvaluationSubGroupData = get(parentItem, 'IsEvaluationSubGroupData') as unknown as boolean;
			if (isEvaluationSubGroupData) {
				mainItemId = mainItemId * -1;
				qualifierTemp = 'businesspartner.main.evalsubgroupdata.clerk';
			}
		}
		return {
			Qualifier: qualifierTemp,
			MainItemId: mainItemId
		};
	}

	private onClerkValidationHandler(value: IEventEmitterParam<boolean>) {
		let result = true;

		const list = this.getList();
		if (Array.isArray(list) && list.length > 0) {
			result = !this.hasError(list);
		}
		//
		// if (result) {
		// 	var parentItem = parentService.getSelected();
		// 	var parentItemId = parentItem ? parentItem.Id : null;
		// 	var cache = data.cache;
		// 	if (cache) {
		// 		for (var prop in cache) {
		// 			if (Object.prototype.hasOwnProperty.call(cache, prop)) {
		// 				if (parentItemId && parentItem === prop) {
		// 					continue;
		// 				}
		// 				result = !hasError(cache[prop].loadedItems);
		// 			}
		// 		}
		// 	}
		// }

		value.result = result;
	}

	private hasError(list: IBasicsClerkEntity[]) {
		const hasError = false;
		// _.forEach(list, function (item) {
		// 	if (item.__rt$data && item.__rt$data.errors) {
		// 		for (var property in item.__rt$data.errors) {
		// 			if (Object.prototype.hasOwnProperty.call(item.__rt$data.errors, property) && item.__rt$data.errors[property]) {
		// 				hasError = true;
		// 				break;
		// 			}
		// 		}
		// 	}
		// });
		return hasError;
	}

	public override isParentFn(parentKey: IBasicsClerkEntity, entity: IBasicsClerkEntity): boolean {
		return entity.MainItemFk === parentKey.Id;
	}
}
