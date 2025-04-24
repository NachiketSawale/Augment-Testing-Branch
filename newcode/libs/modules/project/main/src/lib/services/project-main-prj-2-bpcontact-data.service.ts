/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProjectMainPrj2BPComplete, IProjectMainPrj2BPContactEntity, IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { ProjectMainPrj2BusinessPartnerDataService } from './project-main-prj-2-business-partner-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainPrj2BpContactDataService extends DataServiceFlatLeaf<IProjectMainPrj2BPContactEntity,IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete>{

	public constructor(parentDataService:ProjectMainPrj2BusinessPartnerDataService) {
		const options: IDataServiceOptions<IProjectMainPrj2BPContactEntity>  = {
			apiUrl: 'project/main/project2bpcontact',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainPrj2BPContactEntity,IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartnerContacts',
				parent: parentDataService,
			}

		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectMainPrj2BPComplete, modified: IProjectMainPrj2BPContactEntity[], deleted: IProjectMainPrj2BPContactEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.BusinessPartnerContactsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.BusinessPartnerContactsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectMainPrj2BPComplete): IProjectMainPrj2BPContactEntity[] {
		if (complete && complete.BusinessPartnerContactsToSave) {
			return complete.BusinessPartnerContactsToSave;
		}

		return [];
	}

}



