/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { get } from 'lodash';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	IDataServiceEndPointOptions,
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import {BasicsProcurementStructureDataService} from '../procurement-structure/basics-procurement-structure-data.service';
import { PrcStructureComplete } from '../model/complete-class/prc-structure-complete.class';
import {LookupSimpleEntity } from '@libs/ui/common';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BusinesspartnerSharedCertificateTypeLookupService } from '@libs/businesspartner/shared';
import { IPrcConfiguration2CertEntity } from '../model/entities/prc-configuration-2-cert-entity.interface';
import { IPrcStructureEntity } from '@libs/basics/interfaces';


/**
 * Procurement structure certificate entity data service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsProcurementStructureCertificateDataService extends DataServiceFlatLeaf<IPrcConfiguration2CertEntity,IPrcStructureEntity,PrcStructureComplete> {
	private http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	private businessPartnerSharedCertificateTypeLookupService = inject(BusinesspartnerSharedCertificateTypeLookupService);
	private defaultConfiguration: LookupSimpleEntity | null = null;
	private defaultCertificateType: LookupSimpleEntity | null = null;

	public constructor(parentService: BasicsProcurementStructureDataService) {
		const options: IDataServiceOptions<IPrcConfiguration2CertEntity> = {
			apiUrl: 'basics/procurementstructure/certificate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createconfig2cert',
				usePost: true,
				prepareParam: ident => {
					let hasDefaultItem: boolean = false;
					if (this.defaultConfiguration !== null && this.defaultCertificateType !== null) {
						const defaultItem = this.getList().find(item => {
							return this.defaultCertificateType?.id === item.BpdCertificateTypeFk && this.defaultConfiguration?.id === item.PrcConfigHeaderFk;
						});
						hasDefaultItem = !defaultItem;
					}
					return {
						mainItemId: ident.pKey1,
						setDefault: hasDefaultItem
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPrcConfiguration2CertEntity, IPrcStructureEntity, PrcStructureComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PrcConfiguration2cert',
				parent: parentService
			}
		};
		super(options);
		this.getDefaultLookUpValue();
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		} else {
			throw new Error('There should be a selected parent catalog to load the certificate data');
		}
	}


	protected override onLoadSucceeded(loaded: object): IPrcConfiguration2CertEntity[] {
		if (loaded) {
			return get(loaded, 'Main', []);
		}
		return [];
	}

	private getDefaultLookUpValue() {
		this.http.post(`${this.configService.webApiBaseUrl}basics/procurementconfiguration/configuration/default`, {}).subscribe(response => {
			this.defaultConfiguration = response as LookupSimpleEntity;
		});
		this.businessPartnerSharedCertificateTypeLookupService.getDefaultAsync().then(response => {
			this.defaultCertificateType = response as LookupSimpleEntity;
		});
	}

	public override isParentFn(parentKey: IPrcStructureEntity, entity: IPrcConfiguration2CertEntity): boolean {
		return entity.PrcStructureFk === parentKey.Id;
	}
}
