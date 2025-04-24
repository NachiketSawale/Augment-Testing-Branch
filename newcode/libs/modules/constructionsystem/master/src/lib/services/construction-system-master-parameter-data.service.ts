/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { IBasicsUomEntity } from '@libs/basics/interfaces';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { GetHttpOptions, IEntityBase, IEntityIdentification, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ConstructionSystemMasterParameterValueDataService } from './construction-system-master-parameter-value-data.service';
import { ConstructionSystemMasterParameterValidationService } from './validations/construction-system-master-parameter-validation.service';
import { ConstructionSystemMasterParameterReadonlyProcessorService } from './processors/construction-system-master-parameter-readonly-processor.service';
import { ConstructionSystemMasterParameterFormatterProcessorService } from './processors/construction-system-master-parameter-formatter-processor.service';
import { CosMasterComplete, CosMasterParameterComplete, ICosDefaultTypeEntityEntity } from '../model/models';
import { ICosHeaderEntity, ICosParameterEntity, ICosParameterGroupEntity, ICosParameterValueEntity, ParameterDataTypes } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterDefaultTypeLookupService } from './lookup/construction-system-master-default-type-lookup.service';
import { ConstructionSystemMasterParameterGroupLookupService } from './lookup/construction-system-master-parameter-group-lookup.service';
import { ConstructionSystemMasterParameterTypeLookupService } from './lookup/construction-system-master-parameter-type-lookup.service';
import { ConstructionSystemMasterParameterValueLookupService } from './lookup/construction-system-master-parameter-value-lookup.service';

interface ICosParameterType extends IEntityIdentification, IEntityBase {
	Sorting: number;
	IsDefault: boolean;
	IsLive: boolean;
}

interface ICosMasterParameterResponse {
	CosMasterDefaultType: ICosDefaultTypeEntityEntity[];
	CosMasterParameterType: ICosParameterType[];
	CosParameterGroupLookup: ICosParameterGroupEntity[];
	CosParameterValueLookup: ICosParameterValueEntity[];
	Main: ICosParameterEntity[];
	Uom: IBasicsUomEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterDataService extends DataServiceFlatNode<ICosParameterEntity, CosMasterParameterComplete, ICosHeaderEntity, CosMasterComplete> {
	private readonly http = inject(PlatformHttpService);
	private readonly cosMasterParameterGroupLookupService = inject(ConstructionSystemMasterParameterGroupLookupService);
	private readonly basicsSharedUomLookupService = inject(BasicsSharedUomLookupService);
	private readonly cosMasterParameterTypeLookupService = inject(ConstructionSystemMasterParameterTypeLookupService);
	private readonly cosMasterDefaultTypeLookupService = inject(ConstructionSystemMasterDefaultTypeLookupService);

	public readonly parameterValidateComplete = new Subject<ICosParameterEntity | null>();
	public readonly parameterValueValidateComplete = new Subject<{ checkType: boolean; value: number }>();
	public readonly deleteValuesComplete = new Subject<{ entity: ICosParameterEntity; values: ICosParameterValueEntity[] }>();
	public readonly defaultTypeChanged = new Subject<null>();
	public readonly defaultValueChanged = new Subject<{ defaultValueEntity: ICosParameterValueEntity; isDefault: boolean }>();
	private readonly readonlyProcessor = new ConstructionSystemMasterParameterReadonlyProcessorService(this);

	public constructor(private readonly parentService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosParameterEntity> = {
			apiUrl: 'constructionsystem/master/parameter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{ endPoint: 'create', usePost: true },
			roleInfo: <IDataServiceChildRoleOptions<ICosParameterEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Node,
				itemName: 'CosParameter',
				parent: parentService,
			},
		};

		super(options);
		this.processor.addProcessor([this.readonlyProcessor, new ConstructionSystemMasterParameterFormatterProcessorService()]);
		this.parentService.headerValidateComplete.subscribe((header) => this.updateBasFormFieldFk());
		this.defaultValueChanged.subscribe((value) => this.defaultValueChangedFn(value));

		this.entitiesModified$.subscribe(() => {
			this.refreshParameters(this.getList());
		});
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to load the parameters data');
		}
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { MainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to create the parameters data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosMasterParameterResponse) {
		this.attachData(loaded);

		this.refreshParameters(loaded.Main);

		if (loaded.Main.length === 0) {
			const selectedEntity = this.parentService.getSelectedEntity();
			if (selectedEntity?.Id) {
				const paramValueDataService = ServiceLocator.injector.get(ConstructionSystemMasterParameterValueDataService);
				paramValueDataService.loadSubEntities({id: 0, pKey1: selectedEntity.Id}).then();
			}
		}

		const validationService = ServiceLocator.injector.get(ConstructionSystemMasterParameterValidationService);
		loaded.Main.forEach((item) => {
			validationService.validateVariableName(new ValidationInfo(item, item.VariableName ?? undefined, 'VariableName'));
		});

		return loaded.Main;
	}

	protected override onCreateSucceeded(created: ICosParameterEntity): ICosParameterEntity {
		const totalList = this.getList();
		if (totalList.length > 0) {
			const sortingValues = totalList.map((item) => item.Sorting);
			created.Sorting = Math.max(...sortingValues) + 1;
		} else {
			created.Sorting = 1;
		}

		this.validateNewEntity(created);
		return created;
	}

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosParameterEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override createUpdateEntity(modified: ICosParameterEntity | null): CosMasterParameterComplete {
		const complete = new CosMasterParameterComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CosParameter = modified;
			complete.EntitiesCount = 1;
		}
		return complete;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: CosMasterComplete, modified: CosMasterParameterComplete[], deleted: ICosParameterEntity[]) {
		if (modified.length > 0) {
			parentUpdate.CosParameterToSave = modified;
			if (modified[0]?.CosParameter) {
				// todo-allen: sub entity modified, how to get mainItemId?
				parentUpdate.MainItemId = modified[0].CosParameter.CosHeaderFk;
			}
			parentUpdate.EntitiesCount += modified.length;
		}
		if (deleted.length > 0) {
			parentUpdate.CosParameterToDelete = deleted;
			parentUpdate.MainItemId = deleted[0].CosHeaderFk;
			parentUpdate.EntitiesCount += deleted.length;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: CosMasterComplete): ICosParameterEntity[] {
		if (parentUpdate?.CosParameterToSave) {
			const result = parentUpdate.CosParameterToSave.map((e) => e.CosParameter).filter((cosParameter) => !!cosParameter);
			return result as ICosParameterEntity[];
		}
		return [];
	}

	/**
	 * Set cache items for lookup services.
	 */
	private attachData(loaded: ICosMasterParameterResponse) {
		const cosMasterParameterValueLookupService = ServiceLocator.injector.get(ConstructionSystemMasterParameterValueLookupService);
		cosMasterParameterValueLookupService.cache.setItems(loaded.CosParameterValueLookup);
		this.cosMasterParameterGroupLookupService.cache.setItems(loaded.CosParameterGroupLookup);
		this.basicsSharedUomLookupService.cache.setItems(loaded.Uom);
		this.cosMasterParameterTypeLookupService.cache.setItems(loaded.CosMasterParameterType);
		this.cosMasterDefaultTypeLookupService.cache.setItems(loaded.CosMasterDefaultType);
	}

	private defaultValueChangedFn(args: { defaultValueEntity: ICosParameterValueEntity; isDefault: boolean }) {
		const selectedItem = this.getSelectedEntity();
		if (selectedItem && args.defaultValueEntity) {
			if (args.isDefault) {
				selectedItem.DefaultValue = args.defaultValueEntity.Id;
			} else {
				selectedItem.DefaultValue = null;
			}
			this.setModified(selectedItem);
		}
	}

	private updateBasFormFieldFk() {
		const itemList = this.getList();
		for (const item of itemList) {
			item.BasFormFieldFk = null;
			this.setModified(item);
			this.updateReadOnly(item);
		}
		// serviceContainer.service.gridRefresh(); todo-allen: gridRefresh implementation not present
	}

	private updateReadOnly(item: ICosParameterEntity) {
		this.readonlyProcessor.process(item);
	}

	public async getListByHeadId(id: number) {
		const httpOptions: GetHttpOptions = { params: { mainItemId: id } };
		return await this.http.get<ICosMasterParameterResponse>('constructionsystem/master/parameter/list', httpOptions);
	}

	/**
	 * Validate the new created entity.
	 * */
	private validateNewEntity(created: ICosParameterEntity) {
		const validationService = ServiceLocator.injector.get(ConstructionSystemMasterParameterValidationService);
		validationService.validateVariableName(new ValidationInfo(created, created.VariableName ?? undefined, 'VariableName'));

		const cosParameterTypeFkField = 'CosParameterTypeFk';
		const typeId = created.CosParameterTypeFk;
		const numericTypes = [ParameterDataTypes.Integer, ParameterDataTypes.Decimal1, ParameterDataTypes.Decimal2, ParameterDataTypes.Decimal3, ParameterDataTypes.Decimal4, ParameterDataTypes.Decimal5, ParameterDataTypes.Decimal6];
		const needSetDefault = numericTypes.includes(typeId);
		if (needSetDefault) {
			created.CosParameterTypeFk = ParameterDataTypes.Text; // do not change. only to let validate enabled.
			validationService.asyncValidateCosParameterTypeFk(new ValidationInfo(created, typeId, cosParameterTypeFkField)).then((result) => {
				if (!result.valid) {
					this.addInvalid(created, {result: result, field: cosParameterTypeFkField});
				}
			});
		}
	}

	/**
	 * refresh parameter hints in script container.
	 */
	private refreshParameters(list: ICosParameterEntity[]) {
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
		// const scriptId = 'construction.system.master.script';
		// const validateScriptId = 'construction.system.master.script.validation';
		// basicsCommonScriptEditorService.addVariable(scriptId, parameterItems); // todo-allen: wait for the basicsCommonScriptEditorService to finish.
		// basicsCommonScriptEditorService.addVariable(validateScriptId, parameterItems);
	}
}
