/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProjectMainBusinessPartnerSiteEntity, IProjectMainPrj2BPComplete, IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { ProjectMainPrj2BusinessPartnerDataService } from './project-main-prj-2-business-partner-data.service';
@Injectable({
	providedIn: 'root'
})

export class ProjectMainBusinessPartnerSiteDataService extends DataServiceFlatLeaf<IProjectMainBusinessPartnerSiteEntity, IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete>{

	public constructor(parentDataService:ProjectMainPrj2BusinessPartnerDataService) {
		const options: IDataServiceOptions<IProjectMainBusinessPartnerSiteEntity>  = {
			apiUrl: 'project/main/bizpartnersite',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			createInfo: {
				prepareParam: () => {
					const selection = parentDataService.getSelectedEntity();
					return {
						Pkey1: selection?.Id ?? 0,
						PKey2: selection?.ProjectFk ?? 0,
						Pkey3: selection?.BusinessPartnerFk ?? 0,
						Id: selection?.SubsidiaryFk ?? 0
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainBusinessPartnerSiteEntity, IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BusinessPartnerSites',
				parent: parentDataService,
			},

		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectMainPrj2BPComplete, modified: IProjectMainBusinessPartnerSiteEntity[], deleted: IProjectMainBusinessPartnerSiteEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.BusinessPartnerSitesToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.BusinessPartnerSitesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectMainPrj2BPComplete): IProjectMainBusinessPartnerSiteEntity[] {
		if (complete && complete.BusinessPartnerSitesToSave) {
			return complete.BusinessPartnerSitesToSave;
		}

		return [];
	}
}



