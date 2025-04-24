/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';



import { IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ICertificateEntity } from '@libs/resource/interfaces';
import { ICertificateDocumentEntity } from '@libs/resource/interfaces';
import { ResourceCertificateDataService } from './resource-certificate-data.service';
import { ResourceCertificateComplete } from '../model/resource-certificate-complete.class';
import { DocumentDataLeafService } from '@libs/documents/shared';
import { IIdentificationData } from '@libs/platform/common';


export const RESOURCE_CERTIFICATE_DOCUMENT_DATA_TOKEN = new InjectionToken<ResourceCertificateDocumentDataService>('resourceCertificateDocumentDataToken');

@Injectable({
	providedIn: 'root'
})

export class ResourceCertificateDocumentDataService extends DocumentDataLeafService<ICertificateDocumentEntity,ICertificateEntity, ResourceCertificateComplete >{

	public constructor() {
		const options: IDataServiceOptions<ICertificateDocumentEntity>  = {
			apiUrl: 'resource/certificate/document',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ICertificateDocumentEntity,ICertificateEntity, ResourceCertificateComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Documents',
				parent: inject(ResourceCertificateDataService),
			},


		};

		super(options);
	}

}








