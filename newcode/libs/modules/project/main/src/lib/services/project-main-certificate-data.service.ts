/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity, IProjectMainCertificateEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainCertificateDataService extends DataServiceFlatLeaf<IProjectMainCertificateEntity, IProjectEntity, IProjectComplete>{

	public constructor(parentDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectMainCertificateEntity>  = {
			apiUrl: 'project/main/project2certificate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByProject',
				usePost: false
			},
			createInfo: {
				prepareParam: () => {
					const selection = parentDataService.getSelectedEntity();
					return {
						Id: selection?.Id ?? 0
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainCertificateEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Certificates',
				parent: parentDataService,
			},
		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: IProjectMainCertificateEntity[], deleted: IProjectMainCertificateEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.CertificatesToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.CertificatesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProjectMainCertificateEntity[] {
		if (complete && complete.CertificatesToSave) {
			return complete.CertificatesToSave;
		}

		return [];
	}
}



