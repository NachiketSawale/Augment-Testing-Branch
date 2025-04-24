/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsCompanyICPartnerCardComplete } from '../model/basics-company-icpartner-card-complete.class';
import { ICompanyICPartnerEntity } from '@libs/basics/interfaces';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';


@Injectable({
	providedIn: 'root'
})



export class BasicsCompanyICPartnerCardDataService extends DataServiceFlatNode<ICompanyICPartnerEntity, BasicsCompanyICPartnerCardComplete,ICompanyEntity, BasicsCompanyComplete >{

	public constructor(basicsCompanyMainDataService: BasicsCompanyMainDataService) {
		const options: IDataServiceOptions<ICompanyICPartnerEntity>  = {
			apiUrl: 'basics/company/icpartner',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: () => {
					const selection = basicsCompanyMainDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id ?? 0,
						filter: ''
					};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = basicsCompanyMainDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICompanyICPartnerEntity,ICompanyEntity, BasicsCompanyComplete>>{
				role: ServiceRole.Node,
				itemName: 'CompanyICPartner',
				parent: basicsCompanyMainDataService,
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: ICompanyICPartnerEntity | null): BasicsCompanyICPartnerCardComplete {

		if (modified) {
			return {
				Id: modified.Id ?? 0,
				CompanyICPartner: modified
			} as BasicsCompanyICPartnerCardComplete;
		}
		return undefined as unknown as BasicsCompanyICPartnerCardComplete;
	}

	public override registerNodeModificationsToParentUpdate(complete: BasicsCompanyComplete, modified: BasicsCompanyICPartnerCardComplete[], deleted: ICompanyICPartnerEntity[]) {
		if (modified && modified.length > 0) {
			complete.CompanyICPartnerToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.CompanyICPartnerToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: BasicsCompanyComplete): ICompanyICPartnerEntity[] {
		return (complete && complete.CompanyICPartnerToSave)
			? complete.CompanyICPartnerToSave.map(e => e.CompanyICPartnerAcc!)
			: [];
	}

	public override isParentFn(parentKey: ICompanyEntity, entity: ICompanyICPartnerEntity): boolean {
		return entity.CompanyFk === parentKey.Id;
	}

}





