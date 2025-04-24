import {
	BasicsSharedCertificateTypeLookupService,
	BasicsSharedCertificateStatusLookupService
} from '@libs/basics/shared';
import {
	IBasicsCustomizeCertificateTypeEntity
} from '@libs/basics/interfaces';
import {lastValueFrom, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { PlatformConfigurationService} from '@libs/platform/common';
import {find, get, set} from 'lodash';
import {
	IDataServiceEndPointOptions,
	IEntityCreate,
	IEntityDelete,
	IEntityRuntimeDataRegistry,
	IEntitySelection,
} from '@libs/platform/data-access';
import {ProcurementShareContractLookupService} from '@libs/procurement/shared';
import {ICertificateHelperServiceOptions} from './certificate-helper-service-options.interface';
import {ServiceLocator} from '@libs/platform/common';
import {BusinesspartnerSharedCertificateValidationService} from './certificate-validation-service.class';
import { ICertificateEntity, ICertificateResponse } from '@libs/businesspartner/interfaces';

export class CertificateHelperService {
	private static certificateTypesWithAccessRight?: {[key:string]: IBasicsCustomizeCertificateTypeEntity[]}; // {hasWriteAccessResult: CertificateTypeEntity[], hasDeleteAccessResult: CertificateTypeEntity[]};
	public businessPartnerFkChangedSubscription: Subscription;
	public contractFkChangedSubscription: Subscription;
	public certificateTypeFkChangedSubscription: Subscription;
	public certificateStatusFkChangedSubscription: Subscription;

	public constructor(protected dataService: IEntityRuntimeDataRegistry<ICertificateEntity> & IEntitySelection<ICertificateEntity> & IEntityDelete<ICertificateEntity> & IEntityCreate<ICertificateEntity>,
					   validationService: BusinesspartnerSharedCertificateValidationService,
					   protected options: ICertificateHelperServiceOptions) {

		this.businessPartnerFkChangedSubscription = validationService.businessPartnerFkChangedEvent$.subscribe({
			next: (data) => {
				this.onBusinessPartnerChanged(data.entity, data.value);
			}
		});

		this.certificateStatusFkChangedSubscription = validationService.certificateStatusChangedEvent$.subscribe({
			next: (data) => {
				this.onCertificateStatusChanged(data.entity, data.value);
			}
		});

		this.certificateTypeFkChangedSubscription = validationService.certificateTypeChangedEvent$.subscribe({
			next: (data) => {
				this.onCertificateTypeChanged(data.entity, data.value);
			}
		});

		this.contractFkChangedSubscription = validationService.contractFkChangedEvent$.subscribe({
			next: (data) => {
				this.onContractChanged(data.entity, data.value);
			}
		});

		this.getCertificateTypesWithAccessRight();
		ServiceLocator.injector.get(BasicsSharedCertificateTypeLookupService).getList();
		ServiceLocator.injector.get(BasicsSharedCertificateStatusLookupService).getList();
	}

	public static readonly defaultOptions = {
		apiUrl: 'businesspartner/certificate/certificate',
		readInfo: <IDataServiceEndPointOptions>{
			usePost: false
		},
		createInfo: <IDataServiceEndPointOptions>{
			usePost: true
		},
		roleInfo: {
			itemName: 'Certificate',
		}
	};

	/*
	 * exceptDeepPathList
	 */
	public static extendOptions(
		target: object,
		source: object,
		path: string = '', exceptDeepPathList: string[] = []) {
		for (const key in source) {
			const path1 = path ? path + '.' + key : key;

			const sourceValue = get(source, key);
			if (typeof sourceValue === 'object' && !exceptDeepPathList.includes(path1)) {
				CertificateHelperService.extendOptions(target, sourceValue, path1, exceptDeepPathList);
			} else {
				set(target, path1, sourceValue);
			}
		}
	}

	protected updateReadonlyFields(entity: ICertificateEntity, typeId: number, statusId: number) {
		const typeItems = ServiceLocator.injector.get(BasicsSharedCertificateTypeLookupService).syncService?.getListSync() || [];
		const statusItems = ServiceLocator.injector.get(BasicsSharedCertificateStatusLookupService).syncService?.getListSync() || [];

		entity._typeItem = typeItems.find(e => e.Id === typeId);
		entity._statusItem = statusItems.find(e => e.Id === statusId);

		if (this.options.doUpdateReadonly) {
			this.options.doUpdateReadonly(entity, typeId);
		} else {
			this.doUpdateReadonly(entity, typeId);
		}
	}

	private doUpdateReadonly(entity: ICertificateEntity, typeId: number) {
		// todo chi: move the logic to specific module
		// if (moduleId === 'sales.billing' || moduleId === 'sales.bid') {
		// 	var allReadOnlyArr = readOnlyFields.concat(otherReadOnlyFields).map(function (field) {
		// 		return {
		// 			field: field,
		// 			readonly: true
		// 		};
		// 	});
		// 	return platformRuntimeDataService.readonly(entity, allReadOnlyArr);
		// }

		if ((!this.hasRightForCerType('hasWriteAccessResult', typeId) && entity.Version !== 0) ||
			(entity._statusItem && entity._statusItem.IsReadOnly && entity.Version !== 0) ||
			(entity.CompanyFk && entity.CompanyFk !== ServiceLocator.injector.get(PlatformConfigurationService).clientId)) {
			this.dataService.setEntityReadOnly(entity, true);
		}
		// else if (moduleId === 'sales.contract') { // todo chi: move the logic to specific module
		// 	readonlyArray.push({field: 'OrdHeaderFk', readonly: true});
		// }
	}

	public onCreateSucceeded(created: ICertificateEntity): ICertificateEntity {
		// todo chi: override this function to set businesspartnerfk in specific module (procurement.invoice, sales.contract, sales...)
		if (this.options.setInitBusinessPartnerFk) {
			this.options.setInitBusinessPartnerFk(created);
		}
		return created;
	}

	public processItem(entity: ICertificateEntity) {
		this.updateReadonlyFields(entity, entity.CertificateTypeFk, entity.CertificateStatusFk);
	}

	public onCertificateTypeChanged(entity: ICertificateEntity, value: number) {
		this.updateReadonlyFields(entity, value, entity.CertificateStatusFk);
		entity.CompanyFk = entity._typeItem && entity._typeItem.HasCompany ? ServiceLocator.injector.get(PlatformConfigurationService).clientId : null;
	}

	public onCertificateStatusChanged(entity: ICertificateEntity, value: number) {
		this.updateReadonlyFields(entity, entity.CertificateTypeFk, value);
	}

	public onContractChanged(entity: ICertificateEntity, value: number | undefined | null) {
		const contracts = ServiceLocator.injector.get(ProcurementShareContractLookupService).syncService?.getListSync() || [];
		const lookupItem = contracts.find(e => e.Id === value);
		if (lookupItem) {
			entity.ProjectFk = lookupItem.ProjectFk;
			entity.BusinessPartnerFk = lookupItem.BusinessPartnerFk;
		}
	}

	public onBusinessPartnerChanged(entity: ICertificateEntity, value: number) {
		if (entity.BusinessPartnerFk !== value) {
			entity.ConHeaderFk = null;
		}
	}

	private getCertificateTypesWithAccessRight() {
		if (CertificateHelperService.certificateTypesWithAccessRight) {
			return;
		}
		const http = ServiceLocator.injector.get(HttpClient);
		const configService = ServiceLocator.injector.get(PlatformConfigurationService);
		lastValueFrom(http.get<{ [key: string]: IBasicsCustomizeCertificateTypeEntity[] }>
		(configService.webApiBaseUrl + 'businesspartner/certificate/certificate/getaccessright2certificatetype'))
			.then(result  => {
				CertificateHelperService.certificateTypesWithAccessRight = result;
			});
	}

	public hasRightForCerType(rightType: string, typeId: number) {
		const obj = CertificateHelperService.certificateTypesWithAccessRight;
		if (obj && rightType) {
			const rightObj = obj[rightType];
			if (rightObj && typeId) {
				if (find(rightObj, {Id: typeId})) {
					return true;
				}
			}
		}
		return false;
	}

	public updateLookupCache(response: ICertificateResponse) {
		// todo chi: bp and project is missing
		if (response.ConHeader && response.ConHeader.length > 0) {
			const contractLookupService = ServiceLocator.injector.get(ProcurementShareContractLookupService);
			contractLookupService.cache.setItems(response.ConHeader);
		}
	}
}