/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectComplete, IProjectEntity, IProjectMainBillToEntity } from '@libs/project/interfaces';
import { ProjectMainBillToReadonlyProcessorService } from './project-main-bill-to-readonly-processor.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainBillToDataService extends DataServiceFlatLeaf<IProjectMainBillToEntity, IProjectEntity, IProjectComplete>{

	public constructor(parentDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectMainBillToEntity>  = {
			apiUrl: 'project/main/billto',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainBillToEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BillTos',
				parent: parentDataService,
			},

		};

		super(options);
		this.processor.addProcessor(new ProjectMainBillToReadonlyProcessorService(this));
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: IProjectMainBillToEntity[], deleted: IProjectMainBillToEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.BillTosToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.BillTosToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProjectMainBillToEntity[] {
		if (complete && complete.BillTosToSave) {
			return complete.BillTosToSave;
		}

		return [];
	}
}



