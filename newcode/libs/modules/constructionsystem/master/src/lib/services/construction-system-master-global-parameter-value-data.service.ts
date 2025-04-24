/*
 * Copyright(c) RIB Software GmbH
 */

import { max, map, set } from 'lodash';
import { Injectable } from '@angular/core';

import { ICosGlobalParamValueEntity, ICosGlobalParamEntity } from '@libs/constructionsystem/shared';
import { GetHttpOptions, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import {CosGlobalParamComplete} from '../model/models';
import { ConstructionSystemMasterGlobalParameterDataService } from './construction-system-master-global-parameter-data.service';
import { ConstructionSystemMasterGlobalParameterValueFormatterProcessorService } from './processors/construction-system-master-global-parameter-value-formatter-processor.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterValueDataService extends DataServiceFlatLeaf<ICosGlobalParamValueEntity, ICosGlobalParamEntity, CosGlobalParamComplete> {
	public constructor(private readonly parentService: ConstructionSystemMasterGlobalParameterDataService) {
		const options: IDataServiceOptions<ICosGlobalParamValueEntity> = {
			apiUrl: 'constructionsystem/master/globalparametervalue',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosGlobalParamValueEntity, ICosGlobalParamEntity, CosGlobalParamComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosGlobalParamValue',
				parent: parentService,
			},
		};

		super(options);

		this.processor.addProcessor(new ConstructionSystemMasterGlobalParameterValueFormatterProcessorService());

		this.parentService.globalParameterValidateComplete.subscribe((value) => {
			const parentItem = this.getSelectedParent();
			if (parentItem && !parentItem.IsLookup) {
				this.delete(this.getList());
			}
		});

		this.parentService.deleteValuesComplete.subscribe((value) => {
			this.delete(value.values);
		});

		this.parentService.globalParameterValueValidateComplete.subscribe((value) => {
			this.updateConParameterValues(value.checkType, value.value);
		});
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent global parameter to create the global parameter value data');
		}
	}

	protected override onCreateSucceeded(created: ICosGlobalParamValueEntity): ICosGlobalParamValueEntity {
		const totalList = this.getList();
		created.Sorting = (max(map(totalList, 'Sorting')) ?? 0) + 1;
		return created;
	}

	protected override provideLoadPayload(): object {
		const selectedParent = this.getSelectedParent();
		if (selectedParent) {
			return { mainItemId: selectedParent.Id };
		} else {
			throw new Error('There should be a selected parent global parameter to load the global parameter value data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosGlobalParamValueEntity[]): ICosGlobalParamValueEntity[] {
		this.setCosParameterTypeFk(loaded);
		return loaded;
	}

	public override isParentFn(parentKey: ICosGlobalParamEntity, entity: ICosGlobalParamValueEntity): boolean {
		return entity.CosGlobalParamFk === parentKey.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: CosGlobalParamComplete): ICosGlobalParamValueEntity[] {
		return parentUpdate?.CosGlobalParamValueToSave ?? [];
	}

	public override registerModificationsToParentUpdate(parentUpdate: CosGlobalParamComplete, modified: ICosGlobalParamValueEntity[], deleted: ICosGlobalParamValueEntity[]): void {
		if (modified.length > 0) {
			parentUpdate.CosGlobalParamValueToSave = modified;
			parentUpdate.MainItemId = modified[0].CosGlobalParamFk;
			parentUpdate.EntitiesCount += modified.length;
		}
		if (deleted.length > 0) {
			parentUpdate.CosGlobalParamValueToDelete = deleted;
			parentUpdate.MainItemId = deleted[0].CosGlobalParamFk;
			parentUpdate.EntitiesCount += deleted.length;
		}
	}

	public override canCreate(): boolean {
		return this.isLookup();
	}

	public override canDelete(): boolean {
		return super.canDelete() && this.isLookup();
	}

	private isLookup() {
		return this.parentService.getSelectedEntity()?.IsLookup ?? false;
	}

	public getListByParameterId(id: number) {
		const http = ServiceLocator.injector.get(PlatformHttpService);
		const httpOptions: GetHttpOptions = { params: { mainItemId: id } };
		return http.get<ICosGlobalParamValueEntity[]>('constructionsystem/master/globalparametervalue/list', httpOptions);
	}

	private updateConParameterValues(checkType: boolean, typeId: number) {
		this.getList().forEach((item) => {
			if (checkType) {
				if (item.ParameterValue === undefined || isNaN(item.ParameterValue as number) || item.ParameterValue === '' || item.ParameterValue === null) {
					item.ParameterValue = 0;
				}
				let id: string | number = parseFloat(item.ParameterValue.toString()).toFixed(typeId);
				id = isNaN(parseFloat(id)) ? 0 : parseFloat(id);
				item.ParameterValue = id;
				this.setModified(item);
			}
		});
		// serviceContainer.service.gridRefresh(); // todo-allen
	}

	private setCosParameterTypeFk(readData: ICosGlobalParamValueEntity[]) {
		const cosParameterTypeFk = this.getSelectedParent()?.CosParameterTypeFk;
		readData.forEach((e) => {
			set(e, 'CosParameterTypeFk', cosParameterTypeFk);
		});
	}
}
