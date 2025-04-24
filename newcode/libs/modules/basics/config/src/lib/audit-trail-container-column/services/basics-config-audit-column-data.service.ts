/*
 * 
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { BasicsConfigAuditColumnComplete } from '../model/basics-config-audit-column-complete.class';
import { BasicsConfigAuditContainerComplete } from '../../aud-container/model/basics-config-audit-container-complete.class';

import { IAudColumnEntity } from '../model/entities/aud-column-entity.interface';
import { IAudContainerEntity } from '../../aud-container/model/entities/aud-container-entity.interface';

import { BasicsConfigAuditContainerDataService } from '../../aud-container/services/basics-config-audit-container-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Basics config audit column data service.
 */
export class BasicsConfigAuditColumnDataService extends DataServiceFlatNode<IAudColumnEntity, BasicsConfigAuditColumnComplete,IAudContainerEntity, BasicsConfigAuditContainerComplete >{

	public constructor(basicsConfigAuditContainerDataService:BasicsConfigAuditContainerDataService) {
		const options: IDataServiceOptions<IAudColumnEntity>  = {
			apiUrl: 'basics/config/audittrail',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listcontainercols',
				usePost: false,
				prepareParam: (ident) => {
                    return {
                        mainItemId: ident.pKey1,
                    };
                },
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IAudColumnEntity,IAudContainerEntity, BasicsConfigAuditContainerComplete>>{
				role: ServiceRole.Node,
				itemName: 'AudColumn',
				parent: basicsConfigAuditContainerDataService,
			},
		};

		super(options);
	}
	
}





