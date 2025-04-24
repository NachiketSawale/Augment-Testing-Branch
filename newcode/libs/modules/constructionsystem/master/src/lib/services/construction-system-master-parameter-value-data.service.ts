/*
 * Copyright(c) RIB Software GmbH
 */

import { GetHttpOptions, PlatformHttpService } from '@libs/platform/common';
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ConstructionSystemMasterParameterDataService } from './construction-system-master-parameter-data.service';
import { ICosParameterEntity, ICosParameterValueEntity } from '@libs/constructionsystem/shared';
import { CosMasterParameterComplete } from '../model/entities/cos-master-parameter-complete.class';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterValueDataService extends DataServiceFlatLeaf<ICosParameterValueEntity, ICosParameterEntity, CosMasterParameterComplete> {
	private readonly http = inject(PlatformHttpService);

	public constructor(private parentService: ConstructionSystemMasterParameterDataService) {
		const options: IDataServiceOptions<ICosParameterValueEntity> = {
			apiUrl: 'constructionsystem/master/parametervalue',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: (ident) => {
					return { mainItemId: ident.pKey1 };
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosParameterValueEntity, ICosParameterEntity, CosMasterParameterComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CosMasterParameterValue',
				parent: parentService,
			},
		};

		super(options);

		this.parentService.parameterValidateComplete.subscribe((value) => {
			const parentItem = this.parentService.getSelectedEntity();
			if (parentItem && !parentItem.IsLookup) {
				this.deleteAll();
			}
		});

		this.parentService.deleteValuesComplete.subscribe((value) => {
			this.deleteValuesList(value.entity, value.values);
		});

		this.parentService.parameterValueValidateComplete.subscribe((value) => {
			this.updateConParameterValues(value.checkType, value.value);
		});
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent parameter to create the parameter value data');
		}
	}

	protected override onCreateSucceeded(created: ICosParameterValueEntity): ICosParameterValueEntity {
		const totalList = this.getList();
		if (totalList.length > 0) {
			const sortingValues = totalList.map((item) => item.Sorting);
			created.Sorting = Math.max(...sortingValues) + 1;
		} else {
			created.Sorting = 1;
		}
		return created;
	}

	public override isParentFn(parentKey: ICosParameterEntity, entity: ICosParameterValueEntity): boolean {
		return entity.CosParameterFk === parentKey.Id;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: CosMasterParameterComplete, modified: ICosParameterValueEntity[], deleted: ICosParameterValueEntity[]) {
		if (modified.length > 0) {
			parentUpdate.CosMasterParameterValueToSave = modified;
			if (modified[0].CosParameterFk) {
				parentUpdate.MainItemId = modified[0].CosParameterFk;
			}
			parentUpdate.EntitiesCount += modified.length;
		}
		if (deleted.length > 0) {
			parentUpdate.CosMasterParameterValueToDelete = deleted;
			if (deleted[0].CosParameterFk) {
				parentUpdate.MainItemId = deleted[0].CosParameterFk;
			}
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

	public deleteAll() {
		this.delete(this.getList());
	}

	public getListByParameterId(id: number) {
		const httpOptions: GetHttpOptions = { params: { mainItemId: id } };
		return this.http.get<ICosParameterValueEntity[]>('constructionsystem/master/parametervalue/list', httpOptions);
	}

	private deleteValues(parameterEntity: ICosParameterEntity, entity: ICosParameterValueEntity, values: ICosParameterValueEntity[]) {
		this.delete(entity);
		// todo-allen: The following code may no longer be needed.
		// platformRuntimeDataService.markAsBeingDeleted(entity);
		// const deleteParams = {};
		// deleteParams.entity = entity;
		// platformDataValidationService.removeDeletedEntityFromErrorList(entity, service);
		// platformDataServiceModificationTrackingExtension.markAsDeleted(service, entity, data);
		// data.doClearModifications(deleteParams.entity, data);

		// if (data.usesCache && parameterEntity && parameterEntity.Id) {
		// 	const cache = data.provideCacheFor(parameterEntity.Id, data);
		// 	if (cache) {
		// 		cache.loadedItems = _.filter(cache.loadedItems, function (item) {
		// 			return item.Id !== entity.Id;
		// 		});
		// 	}
		// }
	}

	private deleteValuesList(parameterEntity: ICosParameterEntity, values: ICosParameterValueEntity[]) {
		values.forEach((item) => {
			this.deleteValues(parameterEntity, item, values);
		});
	}

	/* jshint -W074 */
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
}
