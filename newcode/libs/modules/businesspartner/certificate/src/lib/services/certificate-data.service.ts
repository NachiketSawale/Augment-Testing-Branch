import {Injectable} from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceOptions,
	ServiceRole,
} from '@libs/platform/data-access';
import {
	BusinesspartnerSharedCertificateValidationService,
	CertificateEntityComplete,
	CertificateHelperService
} from '@libs/businesspartner/shared';
import {ISearchResult, ServiceLocator} from '@libs/platform/common';
import {
	BasicsSharedCertificateTypeLookupService,
	BasicsSharedCertificateStatusLookupService
} from '@libs/basics/shared';
import {cloneDeep} from 'lodash';
import { ICertificateEntity, ICertificateResponse } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerCertificateCertificateDataService extends DataServiceFlatRoot<ICertificateEntity, CertificateEntityComplete> {
	protected helperService: CertificateHelperService;
	protected validationService: BusinesspartnerSharedCertificateValidationService;

	public constructor() {
		const options = cloneDeep(CertificateHelperService.defaultOptions);
		CertificateHelperService.extendOptions(options, {
			readInfo: {
				endPoint: 'listdata',
				usePost: true
			},
			createInfo: {
				endPoint: 'createdata',
				usePost: true
			},
			deleteInfo: {
				endPoint: 'deletedatalist'
			},
			updateInfo: {
				endPoint: 'updatedata'
			},
			roleInfo: {
				role: ServiceRole.Root,
			}
		});

		super(options as IDataServiceOptions<ICertificateEntity>);
		this.validationService = BusinesspartnerSharedCertificateValidationService.getService('businesspartner.certificate.certificate', this);
		this.helperService = new CertificateHelperService(this, this.validationService, {});

		this.processor.addProcessor({
			process: (item) => this.helperService.processItem(item),
			revertProcess() {
			}
		});

		ServiceLocator.injector.get(BasicsSharedCertificateTypeLookupService).getList();
		ServiceLocator.injector.get(BasicsSharedCertificateStatusLookupService).getList();
	}

	public override createUpdateEntity(modified: ICertificateEntity | null): CertificateEntityComplete {
		const complete = new CertificateEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Certificates = [modified];
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: CertificateEntityComplete): ICertificateEntity[] {
		return [complete.Certificate || {} as ICertificateEntity];
	}

	protected override onLoadByFilterSucceeded(loaded: ICertificateResponse): ISearchResult<ICertificateEntity> {
		const filterResult = loaded.FilterResult;
		this.helperService.updateLookupCache(loaded);
		return {
			dtos: loaded.dtos,
			FilterResult: {
				ExecutionInfo: filterResult.ExecutionInfo,
				ResultIds: filterResult.ResultIds,
				RecordsFound: filterResult.RecordsFound,
				RecordsRetrieved: filterResult.RecordsRetrieved
			}
		};
	}

	protected override onCreateSucceeded(created: ICertificateEntity): ICertificateEntity {
		return this.helperService.onCreateSucceeded(created);
	}
}