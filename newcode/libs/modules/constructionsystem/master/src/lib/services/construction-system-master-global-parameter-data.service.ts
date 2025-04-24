/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IEntityBase, IEntityIdentification, ISearchResult, ServiceLocator } from '@libs/platform/common';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemSharedGlobalParameterValueLookupService, ICosGlobalParamEntity, ICosGlobalParamValueEntity, ParameterDataTypes } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterGlobalParameterReadonlyProcessorService } from './processors/construction-system-master-global-parameter-readonly-processor.service';
import { CosGlobalParamComplete } from '../model/entities/cos-global-param-complete.class';
import { Subject } from 'rxjs';
import { ConstructionSystemMasterParameterFormatterProcessorService } from './processors/construction-system-master-parameter-formatter-processor.service';
import { ConstructionSystemMasterGlobalParameterValidationService } from './validations/construction-system-master-global-parameter-vaildation.service';
import { ConstructionSystemMasterGlobalParameterGroupDataService } from './construction-system-master-global-parameter-group-data.service';

interface ICosParameterType extends IEntityIdentification, IEntityBase {
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}

interface ICosMasterGlobalParameterResponse {
	CosMasterParameterType: ICosParameterType[];
	CosGlobalParamValueLookup: ICosGlobalParamValueEntity[];
	Main: ICosGlobalParamEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterDataService extends DataServiceFlatRoot<ICosGlobalParamEntity, CosGlobalParamComplete> {
	private readonly readonlyProcessor = new ConstructionSystemMasterGlobalParameterReadonlyProcessorService(this);
	public globalParameterValidateComplete = new Subject<ICosGlobalParamEntity | null>();
	public globalParameterValueValidateComplete = new Subject<{ checkType: boolean; value: number }>();
	public deleteValuesComplete = new Subject<{ entity: ICosGlobalParamEntity; values: ICosGlobalParamValueEntity[] }>();

	public constructor() {
		const options: IDataServiceOptions<ICosGlobalParamEntity> = {
			apiUrl: 'constructionsystem/master/globalparameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				filterParam: false,
			},
			roleInfo: <IDataServiceRoleOptions<ICosGlobalParamEntity>>{
				role: ServiceRole.Root,
				itemName: 'CosGlobalParams',
			},
		};

		super(options);
		this.processor.addProcessor([this.readonlyProcessor, new ConstructionSystemMasterParameterFormatterProcessorService()]);
		this.entitiesModified$.subscribe(() => {
			this.refreshParameters(this.getList());
		});

		this.refreshAllLoaded();
	}

	protected override onCreateSucceeded(loaded: ICosGlobalParamEntity): ICosGlobalParamEntity {
		const totalList = this.getList();
		let maxSortingValue = 0;

		if (totalList.length > 0) {
			maxSortingValue = Math.max(...totalList.map((item) => item.Sorting));
		}

		loaded.Sorting = maxSortingValue + 1;

		this.validateNewEntity(loaded);
		return loaded;
	}

	protected override onLoadByFilterSucceeded(loaded: ICosMasterGlobalParameterResponse): ISearchResult<ICosGlobalParamEntity> {
		if (loaded.CosGlobalParamValueLookup && loaded.CosGlobalParamValueLookup.length > 0) {
			const parameterValueLookupService = ServiceLocator.injector.get(ConstructionSystemSharedGlobalParameterValueLookupService);
			parameterValueLookupService.cache.setList(loaded.CosGlobalParamValueLookup);
		}

		this.refreshParameters(loaded.Main);
		return { FilterResult: { ExecutionInfo: '', RecordsFound: 0, RecordsRetrieved: 0, ResultIds: [] }, dtos: loaded.Main };
	}

	public override createUpdateEntity(modified: ICosGlobalParamEntity | null): CosGlobalParamComplete {
		const complete = new CosGlobalParamComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CosGlobalParams = [modified];
			complete.EntitiesCount = 1;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: CosGlobalParamComplete): ICosGlobalParamEntity[] {
		return complete.CosGlobalParams ? complete.CosGlobalParams : [];
	}

	private validateNewEntity(newItem: ICosGlobalParamEntity) {
		const validateService = ServiceLocator.injector.get(ConstructionSystemMasterGlobalParameterValidationService);
		validateService.validateVariableName(new ValidationInfo(newItem, newItem.VariableName ?? undefined, 'VariableName'));

		const typeId = newItem.CosParameterTypeFk;
		const numericTypes = [ParameterDataTypes.Integer, ParameterDataTypes.Decimal1, ParameterDataTypes.Decimal2, ParameterDataTypes.Decimal3, ParameterDataTypes.Decimal4, ParameterDataTypes.Decimal5, ParameterDataTypes.Decimal6];
		const needSetDefault = numericTypes.includes(typeId);
		if (needSetDefault) {
			newItem.CosParameterTypeFk = ParameterDataTypes.Text; // do not change. only to let validate enabled.

			const cosParameterTypeFkField = 'CosParameterTypeFk';
			validateService.asyncValidateCosParameterTypeFk(new ValidationInfo(newItem, typeId, cosParameterTypeFkField)).then((result) => {
				if (!result.valid) {
					this.addInvalid(newItem, { result: result, field: cosParameterTypeFkField });
				}
			});
		}

		const groupService = ServiceLocator.injector.get(ConstructionSystemMasterGlobalParameterGroupDataService);
		const selectedGroupEntity = groupService.getSelectedEntity();
		if (selectedGroupEntity) {
			newItem.CosGlobalParamGroupFk = selectedGroupEntity.Id;
		}
	}

	/**
	 * refresh parameter hints in script container.
	 */
	private refreshParameters(list: ICosGlobalParamEntity[]) {
		// TODO wait for the basicsCommonScriptEditorService to finish.
		// const parameterItems = (Array.isArray(list) ? list : []).map(function (item) {
		// 	let type = 'string';
		// 	switch (item.CosParameterTypeFk) {
		// 		case ParameterDataTypes.Integer:
		// 		case ParameterDataTypes.Decimal1:
		// 		case ParameterDataTypes.Decimal2:
		// 		case ParameterDataTypes.Decimal3:
		// 		case ParameterDataTypes.Decimal4:
		// 		case ParameterDataTypes.Decimal5:
		// 		case ParameterDataTypes.Decimal6:
		// 			type = 'number';
		// 			break;
		// 		case ParameterDataTypes.Boolean:
		// 			type = 'bool';
		// 			break;
		// 		case ParameterDataTypes.Date:
		// 			type = 'Date';
		// 			break;
		// 		case ParameterDataTypes.Text:
		// 			type = 'string';
		// 			break;
		// 	}
		// 	return { name: item.VariableName, type: type, description: item.DescriptionInfo?.Translated };
		// });
		// var scriptId = 'construction.system.master.script';
		// var validateScriptId = 'construction.system.master.script.validation';
		// basicsCommonScriptEditorService.addVariable(scriptId, parameterItems);
		// basicsCommonScriptEditorService.addVariable(validateScriptId, parameterItems);
	}
}
