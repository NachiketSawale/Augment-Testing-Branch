import { BusinesspartnerSharedSubEntityDialogLeafDataService } from '../../sub-entity-dialog/services/sub-entity-dialog-leaf-data.service';
import {
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
	IDataServiceOptions, IEntitySelection, IParentRole, ServiceRole
} from '@libs/platform/data-access';
import {runInInjectionContext} from '@angular/core';
import {ServiceLocator} from '@libs/platform/common';
import { ICertificate2subsidiaryEntity, ICertificateEntity } from '@libs/businesspartner/interfaces';
import { CertificateEntityComplete } from '../model/certificate-entity-complete.class';

export class BusinesspartnerSharedCertificateToSubsidiaryDataService extends BusinesspartnerSharedSubEntityDialogLeafDataService<ICertificate2subsidiaryEntity, ICertificateEntity, CertificateEntityComplete> {

	private static serviceCache: {[key: string]: BusinesspartnerSharedCertificateToSubsidiaryDataService} = {};

	public static getService(moduleName: string, parentService: IParentRole<ICertificateEntity, CertificateEntityComplete> & IEntitySelection<ICertificateEntity>) {
		if (BusinesspartnerSharedCertificateToSubsidiaryDataService.serviceCache[moduleName]) {
			return BusinesspartnerSharedCertificateToSubsidiaryDataService.serviceCache[moduleName];
		}

		const service = runInInjectionContext(ServiceLocator.injector,
			() => new BusinesspartnerSharedCertificateToSubsidiaryDataService(parentService));
		BusinesspartnerSharedCertificateToSubsidiaryDataService.serviceCache[moduleName] = service;
		return service;
	}

	protected constructor(parentService: IParentRole<ICertificateEntity, CertificateEntityComplete> & IEntitySelection<ICertificateEntity>) {
		const options: IDataServiceOptions<ICertificate2subsidiaryEntity> = {
			apiUrl: 'businesspartner/certificate/certificate2subsidiary',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'create',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<ICertificate2subsidiaryEntity, ICertificateEntity, CertificateEntityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Certificate2Subsidiary',
				parent: parentService
			}
		};
		super(options);
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}

		return {
			mainItemId: -1
		};
	}
}