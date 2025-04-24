import { AfterViewInit, Component, Inject, inject, OnInit } from '@angular/core';
import { createLookup, FieldType, IFormConfig, } from '@libs/ui/common';
import { BasicsSharedCertificateStatusLookupService } from '@libs/basics/shared';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { IBasicsCustomizeCertificateStatusEntity } from '@libs/basics/interfaces';
import { CREATE_REQUESTS_OPTIONS_TOKEN, ICreateRequests, ICreateRequestsDialogModel, ICreateRequestsOptions } from '@libs/businesspartner/interfaces';

@Component({
	selector: 'businesspartner-certificate-create-requests-dialog',
	templateUrl: './create-requests-dialog.component.html',
	styleUrls: ['./create-requests-dialog.component.scss']
})
export class BusinesspartnerCertificateCreateRequestsDialogComponent<TRequestEntity extends ICreateRequests> implements OnInit, AfterViewInit {
	private readonly http = inject(PlatformHttpService);
	private readonly translate = inject(PlatformTranslateService);
	private readonly basicsSharedCertificateStatusLookupService= inject(BasicsSharedCertificateStatusLookupService);

	private isViewInit = false;
	public readonly model:ICreateRequestsDialogModel = {
		IsSuccess:false,
		HasError:false,
		UpdateDetail:[],
		ErrorDetail:'',
		Loading:false
	};

	public readonly configuration: IFormConfig<TRequestEntity> = {
		formId: 'create-requests-form',
		showGrouping: false,
		rows: [
			{
				id: 'CertificateStatusFk',
				label: {
					key: 'businesspartner.certificate.wizard.certificateWizard.CertificateStatus',
					text: 'Status'
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCertificateStatusLookupService,
					clientSideFilter: {
						execute(item: IBasicsCustomizeCertificateStatusEntity): boolean {
							return item.Isrequest;
						}}}),
				model: 'CertificateStatusFk',
			}
		]
	};

	public constructor(@Inject(CREATE_REQUESTS_OPTIONS_TOKEN) protected options: ICreateRequestsOptions<TRequestEntity>) {
		const customRows = options.customFormRows || [];
		if (customRows.length > 0) {
			this.configuration.rows.unshift(...customRows);
		}
	}

	public isOkVisible():boolean{
		if (!this.isViewInit) {
			return true;
		} else {
			return this.options.createRequestsEntity.CertificateStatusFk !== 0;
		}
	}

	public async onOk(): Promise<void> {
		// init message
		this.model.IsSuccess = false;
		this.model.UpdateDetail = [];
		this.model.HasError = false;
		this.model.ErrorDetail = '';
		this.model.Loading=true;

		const result = await this.doCreation();
		this.model.Loading=false;

		if (result) {
			this.model.IsSuccess = true;
			this.model.UpdateDetail = result;
		} else {
			this.model.HasError = true;
			this.model.ErrorDetail = this.translate.instant('businesspartner.main.wizardCreateFail').text;
		}
	}

	public ngOnInit(): void {
		this.basicsSharedCertificateStatusLookupService.getList().subscribe(
			data=>{
				if (data){
					const defaultStatus=data.find(e=>e.IsDefault && e.Isrequest);
					if (defaultStatus){
						this.options.createRequestsEntity.CertificateStatusFk = defaultStatus.Id;
					}
				}
			}
		);
	}

	public ngAfterViewInit() {
		setTimeout(() => {
			this.isViewInit = true;
		});
	}

	private async doCreation(): Promise<string[] | null> {
		const provider = this.options.creationProvider(this.options.createRequestsEntity);
		try {
			return await this.http.get<string[]>(provider.url, {
				params: provider.params
			});
		} catch (error) {
			return null;
		} finally {
			this.model.Loading = false;
		}
	}
}