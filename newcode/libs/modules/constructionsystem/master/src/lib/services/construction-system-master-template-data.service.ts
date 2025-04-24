import { Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { CosMasterTemplateComplete } from '../model/models';
import { CosMasterComplete } from '../model/entities/cos-master-complete.class';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { ICosHeaderEntity, ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { isNull, isUndefined } from 'lodash';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterTemplateDataService extends DataServiceFlatNode<ICosTemplateEntity, CosMasterTemplateComplete, ICosHeaderEntity, CosMasterComplete> {
	public readonly completeEntityCreated = new Subject<CosMasterTemplateComplete>();
	public constructor(private readonly parentService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosTemplateEntity> = {
			apiUrl: 'constructionsystem/master/template',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			createInfo: <IDataServiceEndPointOptions>{ endPoint: 'createcomplete', usePost: true },
			updateInfo: <IDataServiceEndPointOptions>{ endPoint: 'update', usePost: true },
			roleInfo: <IDataServiceChildRoleOptions<ICosTemplateEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Node,
				itemName: 'CosTemplate',
				parent: parentService,
			},
		};
		super(options);
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

	protected override onLoadSucceeded(loaded: ICosTemplateEntity[]) {
		if (loaded && loaded.length > 0) {
			const selectedEntity = this.parentService.getSelectedEntity();
			if (selectedEntity?.Id) {
				this.selectFirst();
			} else {
				//todo service.loadSubItemList(); (service: construction.system.master.parameter2template)
			}
		}
		return loaded;
	}

	protected override onCreateSucceeded(created: CosMasterTemplateComplete): ICosTemplateEntity {
		const totalList = this.getList();
		const newTemplate = created.CosTemplate;
		if (!isNull(newTemplate) && !isUndefined(newTemplate)) {
			if (totalList.length > 0) {
				const sortingValues = totalList.map((item) => item.Sorting);
				newTemplate.Sorting = Math.max(...sortingValues) + 1;
			} else {
				newTemplate.Sorting = 1;
			}
		}
		this.completeEntityCreated.next(created);
		return newTemplate as ICosTemplateEntity;
	}

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosTemplateEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}

	public override getModificationsFromUpdate(complete: CosMasterTemplateComplete): ICosTemplateEntity[] {
		if (complete.CosTemplateToSave) {
			return complete.CosTemplateToSave;
		}
		return [];
	}

	public override createUpdateEntity(modified: ICosTemplateEntity | null): CosMasterTemplateComplete {
		const complete = new CosMasterTemplateComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CosTemplate = modified;
			complete.EntitiesCount = 1;
		}
		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: CosMasterComplete, modified: CosMasterTemplateComplete[], deleted: ICosTemplateEntity[]) {
		if (modified.length > 0) {
			parentUpdate.CosTemplateToSave = modified;
			parentUpdate.MainItemId = modified[0].MainItemId;
			parentUpdate.EntitiesCount += modified.length;
		}
		if (deleted.length > 0) {
			parentUpdate.CosTemplateToDelete = deleted;
			parentUpdate.MainItemId = deleted[0].CosHeaderFk;
			parentUpdate.EntitiesCount += deleted.length;
		}
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: CosMasterComplete): ICosTemplateEntity[] {
		if (parentUpdate.CosTemplateToSave) {
			const cosTemplate: ICosTemplateEntity[] = [];
			parentUpdate.CosTemplateToSave.forEach((toSave) => {
				if (toSave.CosTemplate) {
					cosTemplate.push(toSave.CosTemplate);
				}
			});
			return cosTemplate;
		}
		return [];
	}
}
