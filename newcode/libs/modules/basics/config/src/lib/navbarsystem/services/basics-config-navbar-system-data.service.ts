/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IModuleEntity } from '../../modules/model/entities/module-entity.interface';
import { INavbarConfigEntity } from '../model/entities/navbar-config-entity.interface';
import { BasicsConfigComplete } from '../../modules/model/basics-config-complete.class';
import { BasicsConfigDataService } from '../../modules/services/basics-config-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Basics Config Navbar System Data Service.
 */

export class BasicsConfigNavbarSystemDataService extends DataServiceFlatLeaf<INavbarConfigEntity,IModuleEntity,BasicsConfigComplete >{

	public constructor(basicsConfigDataService:BasicsConfigDataService) {
		const options: IDataServiceOptions<INavbarConfigEntity>  = {
			apiUrl: 'basics/config/navbar',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<INavbarConfigEntity,IModuleEntity, BasicsConfigComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'NavbarConfig',
				parent: basicsConfigDataService,
			},
			entityActions: {createSupported: false, deleteSupported: false},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const selection = this.getSelectedParent();

		if (selection) {
			return {
				filter: '',
				isPortal: false,
				moduleId:selection.Id
		 };
		}
		return { moduleId: -1, isPortal: false, filter: '' };
	}

	protected override onLoadSucceeded(loaded: object): INavbarConfigEntity[] {
		return loaded as INavbarConfigEntity[];
	}
	
}

		
			





