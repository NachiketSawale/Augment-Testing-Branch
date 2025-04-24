/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatNode } from '@libs/platform/data-access';
import { BasicsClerkDataService } from './basics-clerk-data.service';
import { IBasicsClerkEntity, IBasicsClerkAbsenceEntity, IBasicsClerkAbsenceComplete, IBasicsClerkComplete } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsClerkAbsenceDataService extends DataServiceFlatNode<IBasicsClerkAbsenceEntity, IBasicsClerkAbsenceComplete, IBasicsClerkEntity, IBasicsClerkComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsClerkAbsenceEntity> = {
			apiUrl: 'basics/clerk/absence',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkAbsenceEntity, IBasicsClerkEntity, IBasicsClerkComplete>>{
				role: ServiceRole.Node,
				itemName: 'Absences',
				parent: inject(BasicsClerkDataService)
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IBasicsClerkAbsenceEntity | null): IBasicsClerkAbsenceComplete {
		return {
			MainItemId:  modified?.Id,
			Absences: modified ?? null,
		} as IBasicsClerkAbsenceComplete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IBasicsClerkComplete, modified: IBasicsClerkAbsenceComplete[], deleted: IBasicsClerkAbsenceEntity[]) {
		if (modified && modified.length > 0) {
			complete.AbsencesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.AbsencesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IBasicsClerkComplete): IBasicsClerkAbsenceEntity[] {
		if	(complete && complete.AbsencesToSave) {
			return complete.AbsencesToSave.map(e => e.Absences!);
		}

		return [];
	}

}
