/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { PpsHeaderDataService } from './pps-header-data.service';

import { IPpsHeader2ClerkEntity } from '../model/entities/pps-header2clerk-entity.interface';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PpsHeaderComplete } from '../model/pps-header-complete.class';


@Injectable({
	providedIn: 'root'
})
export class PpsHeader2ClerkDataService extends DataServiceFlatLeaf<IPpsHeader2ClerkEntity, IPpsHeaderEntity, PpsHeaderComplete> {

	public constructor(private parentService: PpsHeaderDataService) {
		const options: IDataServiceOptions<IPpsHeader2ClerkEntity> = {
			apiUrl: 'productionplanning/header/header2Clerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listallclerks',
				usePost: false,
				prepareParam: ident => ({headerFk: ident.pKey1})
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsHeader2ClerkEntity, IPpsHeaderEntity, PpsHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Header2Clerk',
				parent: parentService,
			},
		};

		super(options);
	}

	public override canDelete(): boolean {
		const can = super.canDelete();
		if (can) {
			const selected = this.getSelection()[0];
			if (selected) {
					return selected.From === null;	
			}
		}
		return can;
	}
}
