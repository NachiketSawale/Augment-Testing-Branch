/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { LogisticJobDataService } from './logistic-job-data.service';
import { IJobDocumentEntity, IJobEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';
import { IIdentificationData } from '@libs/platform/common';
import { DocumentDataLeafService } from '@libs/documents/shared';


@Injectable({
	providedIn: 'root'
})

export class LogisticJobDocumentDataService extends DocumentDataLeafService<IJobDocumentEntity,IJobEntity, JobComplete >{

	public constructor(logisticJobDataService: LogisticJobDataService) {
		const options: IDataServiceOptions<IJobDocumentEntity>  = {
			apiUrl: 'logistic/job/document',
			roleInfo: <IDataServiceChildRoleOptions<IJobDocumentEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'JobDocument',
				parent: logisticJobDataService,
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
					};
				}
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
		};
		super(options);
	}
}



