/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ResourceCertificateComplete } from '../model/resource-certificate-complete.class';
import { ICertificateEntity } from '@libs/resource/interfaces';


export const RESOURCE_CERTIFICATE_DATA_TOKEN = new InjectionToken<ResourceCertificateDataService>('resourceCertificateDataToken');

@Injectable({
	providedIn: 'root'
})

export class ResourceCertificateDataService extends DataServiceFlatRoot<ICertificateEntity, ResourceCertificateComplete> {

	public constructor() {
		const options: IDataServiceOptions<ICertificateEntity> = {
			apiUrl: 'resource/certificate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ICertificateEntity>>{
				role: ServiceRole.Root,
				itemName: 'Certificate',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: ICertificateEntity | null): ResourceCertificateComplete {
		const complete = new ResourceCertificateComplete();
		if (modified !== null) {
			complete.CertificateId = modified.Id;
			complete.Certificates = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ResourceCertificateComplete): ICertificateEntity[] {
		if (complete.Certificates === null) {
			return [];
		}

		return complete.Certificates;
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}

}












