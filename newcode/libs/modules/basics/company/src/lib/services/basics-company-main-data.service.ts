/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { ICompanyEntity } from '@libs/basics/interfaces';
import { BasicsCompanyComplete } from '../model/basics-company-complete.class';


@Injectable({
	providedIn: 'root'
})

export class BasicsCompanyMainDataService extends DataServiceHierarchicalRoot<ICompanyEntity, BasicsCompanyComplete> {

	public constructor() {
		const options: IDataServiceOptions<ICompanyEntity> = {
			apiUrl: 'basics/company',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'treefiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ICompanyEntity>>{
				role: ServiceRole.Root,
				itemName: 'Companies',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: ICompanyEntity | null): BasicsCompanyComplete {
		const complete = new BasicsCompanyComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Companies = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsCompanyComplete): ICompanyEntity[] {
		if (complete.Companies === null) {
			return [];
		}

		return complete.Companies;
	}

	public override childrenOf(element: ICompanyEntity): ICompanyEntity[] {
		return element.Companies ?? [];
	}
	public override parentOf(element: ICompanyEntity): ICompanyEntity | null {
		if (element.CompanyFk === undefined) {
			return null;
		}

		const parentId = element.CompanyFk;
		const foundParent =  this.flatList().find(candidate => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}
}







