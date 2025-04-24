/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { BasicsCostGroupComplete, IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ConstructionSystemMasterHeaderDataService } from './construction-system-master-header-data.service';
import { CosMasterComplete, CosObjectTemplateComplete, ICosObjectTemplateEntity } from '../model/models';

interface ICosMasterObjectTemplateResponse {
	CostGroupCats: BasicsCostGroupComplete[];
	ObjectTemplate2CostGroups: IBasicMainItem2CostGroup[];
	dtos: ICosObjectTemplateEntity[];
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterObjectTemplateDataService extends DataServiceFlatNode<ICosObjectTemplateEntity, CosObjectTemplateComplete, ICosHeaderEntity, CosMasterComplete> {
	public onCostGroupCatalogsLoaded = new Subject<[]>();

	// public costGroupCatalogs = [];

	public constructor(private readonly parentService: ConstructionSystemMasterHeaderDataService) {
		const options: IDataServiceOptions<ICosObjectTemplateEntity> = {
			apiUrl: 'constructionsystem/master/objecttemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceChildRoleOptions<ICosObjectTemplateEntity, ICosHeaderEntity, CosMasterComplete>>{
				role: ServiceRole.Node,
				itemName: 'CosObjectTemplate',
				parent: parentService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: ICosHeaderEntity, entity: ICosObjectTemplateEntity): boolean {
		return entity.CosHeaderFk === parentKey.Id;
	}

	protected override provideLoadPayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { mainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to load the object template data');
		}
	}

	protected override onLoadSucceeded(loaded: ICosMasterObjectTemplateResponse): ICosObjectTemplateEntity[] {
		// todo-allen: Wait for the basicsCostGroupAssignmentService to be implemented.
		// $injector.invoke(['basicsCostGroupAssignmentService', function (basicsCostGroupAssignmentService) {
		// 	basicsCostGroupAssignmentService.process(readData, service, {
		// 		mainDataName: 'dtos',
		// 		attachDataName: 'ObjectTemplate2CostGroups',
		// 		dataLookupType: 'ObjectTemplate2CostGroups',
		// 		identityGetter: function (entity) {
		// 			return {
		// 				Id: entity.MainItemId
		// 			};
		// 		}
		// 	});
		// }]);
		return loaded.dtos ?? [];
	}

	protected override provideCreatePayload(): object {
		const parentEntity = this.getSelectedParent();
		if (parentEntity) {
			return { MainItemId: parentEntity.Id };
		} else {
			throw new Error('There should be a selected parent master header to create the 2d object template data');
		}
	}

	protected override onCreateSucceeded(created: ICosObjectTemplateEntity): ICosObjectTemplateEntity {
		return created;
	}

	public override createUpdateEntity(modified: ICosObjectTemplateEntity | null): CosObjectTemplateComplete {
		const complete = new CosObjectTemplateComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.CosObjectTemplate = modified;
		} else if (this.hasSelection()) {
			complete.MainItemId = this.getSelectedEntity()?.Id ?? 0;
		}
		return complete;
	}

	public override canCreate(): boolean {
		return !!this.getSelectedParent() && !(this.getList().length > 0);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override getSavedEntitiesFromUpdate(parentUpdate: CosMasterComplete): ICosObjectTemplateEntity[] {
		if (parentUpdate.CosObjectTemplateToSave) {
			const cosObjectTemplate: ICosObjectTemplateEntity[] = [];
			parentUpdate.CosObjectTemplateToSave.forEach((toSave) => {
				if (toSave.CosObjectTemplate) {
					cosObjectTemplate.push(toSave.CosObjectTemplate);
				}
			});
			return cosObjectTemplate;
		}
		return [];
	}

	public override registerNodeModificationsToParentUpdate(parentUpdate: CosMasterComplete, modified: CosObjectTemplateComplete[], deleted: ICosObjectTemplateEntity[]) {
		const parentSelected = this.getSelectedParent();
		if (parentSelected) {
			parentUpdate.MainItemId = parentSelected.Id;
			if (modified && modified.length > 0) {
				parentUpdate.CosObjectTemplateToSave = modified;
			}

			if (deleted && deleted.length > 0) {
				parentUpdate.CosObjectTemplateToDelete = deleted;
			}
		}
	}
}
