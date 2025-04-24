/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IActionEntity, IProjectMainActionComplete } from '@libs/project/interfaces';
import { IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { ProjectMainActionComplete } from '../model/project-main-action-complete.class';


@Injectable({
	providedIn: 'root'
})

export class ProjectMainActionDataService extends DataServiceFlatNode<IActionEntity, IProjectMainActionComplete,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService : ProjectMainDataService) {
	const options: IDataServiceOptions<IActionEntity>  = {
		apiUrl: 'project/main/action',
		readInfo: <IDataServiceEndPointOptions>{
			endPoint: 'listByParent',
			usePost: true,
			prepareParam: ident => {
				return {
					filter: '',
					PKey1: ident.pKey1
				};
			}
		},
		updateInfo: <IDataServiceEndPointOptions>{
			endPoint: 'update'
		},
		deleteInfo: <IDataServiceEndPointOptions>{
			endPoint: 'multidelete'
		},
		roleInfo: <IDataServiceChildRoleOptions<IActionEntity,IProjectEntity, IProjectComplete>>{
			role: ServiceRole.Node,
			itemName: 'Action',
			parent: projectMainDataService,
		},
	};

	super(options);

	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: IProjectMainActionComplete[], deleted: IActionEntity[]) {

		if (modified && modified.length > 0) {
			complete.ActionToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ActionToDelete = deleted;
		}
	}
	public override createUpdateEntity(modified: IActionEntity | null): ProjectMainActionComplete {
		const complete = new ProjectMainActionComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Action = modified;
		}

		return complete;
	}

	protected override onLoadSucceeded(loaded: { [key: string]: IActionEntity[] }): IActionEntity[] {
		const result: IActionEntity[] = [];

		if (loaded && loaded['dtos'] && loaded['dtos'].length > 0) {
			result.push(...loaded['dtos']);
		}
		return result;
	}

	protected override provideCreatePayload(): { Pkey1: number } {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				Pkey1: parentSelection.Id
			};
		}
		throw new Error('please select a project action first');
	}

	protected override onCreateSucceeded(created: IActionEntity): IActionEntity {
		return created;
	}

}





