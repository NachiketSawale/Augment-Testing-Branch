/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity, IProjectMainPrj2BPComplete, IProjectMainPrj2BusinessPartnerEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';


@Injectable({
	providedIn: 'root'
})

export class ProjectMainPrj2BusinessPartnerDataService extends DataServiceFlatNode<IProjectMainPrj2BusinessPartnerEntity, IProjectMainPrj2BPComplete,IProjectEntity, IProjectComplete> {

	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectMainPrj2BusinessPartnerEntity> = {
			apiUrl: 'project/main/project2bp',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						filter: '', PKey1: ident.pKey1
					};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = projectMainDataService.getSelectedEntity();
					return {
						Id: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainPrj2BusinessPartnerEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'BusinessPartners',
				parent: projectMainDataService,
			},
		};
		super(options);
	}

	public override createUpdateEntity(modified: IProjectMainPrj2BusinessPartnerEntity | null): IProjectMainPrj2BPComplete {
		return {
			MainItemId: modified?.Id ?? 0,
			BusinessPartners: modified
		} as IProjectMainPrj2BPComplete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: IProjectMainPrj2BPComplete[], deleted: IProjectMainPrj2BusinessPartnerEntity[]) {
		if (modified && modified.length > 0) {
			complete.BusinessPartnersToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.BusinessPartnersToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProjectMainPrj2BusinessPartnerEntity[] {
		if (complete && complete.BusinessPartnersToSave) {
			return complete.BusinessPartnersToSave.flatMap(e => e.BusinessPartners ? e.BusinessPartners : []);
		} else {
			return [];
		}
	}
}

