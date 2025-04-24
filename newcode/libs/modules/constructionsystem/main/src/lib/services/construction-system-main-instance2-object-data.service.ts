/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { Instance2ObjectComplete } from '../model/entities/instance-2-object-complete.class';
import { CosMainComplete } from '../model/entities/cos-main-complete.class';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { MainDataDto } from '@libs/basics/shared';
import { IInstanceHeaderEntity, IInstance2ObjectEntity, ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainJobDataService } from './construction-system-main-job-data.service';
import { ReplaySubject } from 'rxjs';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_DATA_TOKEN = new InjectionToken<ConstructionSystemMainInstance2ObjectDataService>('constructionSystemMainInstance2ObjectDataToken');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstance2ObjectDataService extends DataServiceFlatNode<IInstance2ObjectEntity, Instance2ObjectComplete, ICosInstanceEntity, CosMainComplete> {
	protected instanceHeaderDto: IInstanceHeaderEntity | null = null;
	private readonly http = inject(PlatformHttpService);
	private readonly jobService = ServiceLocator.injector.get(ConstructionSystemMainJobDataService);
	protected propertyReload$ = new ReplaySubject();
	public constructor(private parentService: ConstructionSystemMainInstanceDataService) {
		const options: IDataServiceOptions<IInstance2ObjectEntity> = {
			apiUrl: 'constructionsystem/main/instance2object',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IInstance2ObjectEntity, ICosInstanceEntity, CosMainComplete>>{
				role: ServiceRole.Node,
				itemName: 'Instance2Object',
				parent: parentService,
			},
			entityActions: { createSupported: false, deleteSupported: true },
			// filterByViewer: { todo
			// 	suppressModelId: true
			// }
		};
		super(options);
		this.jobService.onEvaluationDone.subscribe((instance) => {
			this.refreshData(instance);
		});
		this.jobService.onCalculationDone.subscribe((instance) => {
			this.refreshData(instance);
		});
		this.jobService.onAssignObjectDone.subscribe((instance) => {
			const parentSelected = this.parentService.getSelectedEntity();
			if (parentSelected) {
				const ident = this.parentService.convertSelectedToIdentification(parentSelected);
				this.loadSubEntities(ident);
			}
		});
	}

	public override isParentFn(parentKey: ICosInstanceEntity, entity: IInstance2ObjectEntity): boolean {
		return entity.InstanceFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		const modelSelectedId = this.parentService.getCurrentSelectedModelId();
		const obj = this.parentService.getSelectedEntity();
		if (obj && obj.Id && obj.InstanceHeaderFk) {
			return {
				CosInsHeaderId: obj.InstanceHeaderFk,
				InstanceId: obj.Id,
				ModelId: modelSelectedId,
				filter: '', ///where is it from
			};
		} else {
			return {
				CosInsHeaderId: -1,
				InstanceId: -1,
				ModelId: -1,
			};
		}
	}

	protected override onLoadSucceeded(loaded: object): IInstance2ObjectEntity[] {
		if (loaded) {
			const dto = new MainDataDto<IInstance2ObjectEntity>(loaded);
			return dto.Main;
		}
		return [];
	}

	/**
	 * get instance header
	 */
	public async getInstanceHeaderDto() {
		if (this.instanceHeaderDto) {
			return this.instanceHeaderDto;
		}
		const seletedEntity = this.getSelectedEntity();
		if (!seletedEntity) {
			return null;
		}
		const instanceHeaderFk = seletedEntity.InstanceHeaderFk;
		return await this.http.get<IInstanceHeaderEntity>('constructionsystem/project/instanceheader/getInstanceHeaderById', {
			params: {
				cosInsHeaderId: instanceHeaderFk,
			},
		});
	}

	public propertyReload() {
		return this.propertyReload$;
	}
	private refreshData(instance: ICosInstanceEntity) {
		const parentItem = this.parentService.getSelectedEntity();
		if (parentItem?.Id != instance.Id) {
			return;
		}
		if (!this.getSelectedEntity()) {
			return;
		}
		this.clearChildrenModification();
		this.loadChildEntities(this.getSelectedEntity()!);
	}

	public override delete(entities: IInstance2ObjectEntity[] | IInstance2ObjectEntity) {
		super.delete(entities);
		//this.parentService.sync3DViewerIfSelectedIsChecked(); //todo sync3DViewerIfSelectedIsChecked is not ready
		this.parentService.updateStatusToModified();
	}
	public convertSelectedToIdentification(selected: IInstance2ObjectEntity) {
		return this.converter.convert(selected);
	}
}
/// todo onSelectedRowsChanged event ---constructionSystemHighlightToggleService.setAssObjSelectionOnViewer(e, arg, getGridItemList($scope.gridId));
