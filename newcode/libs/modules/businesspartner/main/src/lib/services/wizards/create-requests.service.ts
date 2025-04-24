import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import {
	createLookup,
	FieldType, IFormConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';
import { BasicsSharedCertificateStatusLookupService } from '@libs/basics/shared';
import { EntityRuntimeData } from '@libs/platform/data-access';

interface ICreateRequestsEntity{
	BusinessPartnerId: number,
	StatusFk: number | null
}

@Injectable({
	providedIn: 'root'
})
export class CreateRequestsService{
	protected readonly dataService = inject(BusinesspartnerMainHeaderDataService);
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private msgBoxService = inject(UiCommonMessageBoxService);
	private formDialogService = inject(UiCommonFormDialogService);
	private readonly translateService = inject(PlatformTranslateService);

	private createRequestsEntity:ICreateRequestsEntity = {
		BusinessPartnerId: 0,
		StatusFk: null
	};

	private createRequestsFormCfg : IFormConfig<ICreateRequestsEntity> = {
		formId: 'create-requests-form',
		showGrouping: false,
		rows: [
			{
				id: 'BusinessPartnerId',
				label: {
					text: 'Business Partner'
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({dataServiceToken: BusinessPartnerLookupService}),
				model: 'BusinessPartnerId',
				readonly: true
			},
			{
				id: 'StatusFk',
				label: {
					text: 'Status'
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({dataServiceToken: BasicsSharedCertificateStatusLookupService}),
				model: 'StatusFk',
				change: changeInfo => {
					if(!_.isNull(changeInfo.newValue) && !_.isUndefined(changeInfo.newValue) && !_.some(this.dlgOptions.buttons, {id:StandardDialogButtonId.Ok})){
						this.dlgOptions.buttons?.push({id:StandardDialogButtonId.Ok});
						this.dlgOptions.buttons = _.cloneDeep(this.dlgOptions.buttons);
					}
				}
			}
		]
	};

	private createRequestsRuntimeInfo: EntityRuntimeData<ICreateRequestsEntity> = {
		readOnlyFields:[],
		validationResults:[],
		entityIsReadOnly: false
	};

	private bottomTip = '';

	private dlgOptions = {
		id: 'create-requests',
		headerText: this.translateService.instant('businesspartner.certificate.wizard.certificateWizard.caption').text,
		formConfiguration: this.createRequestsFormCfg,
		entity: this.createRequestsEntity,
		runtime: this.createRequestsRuntimeInfo,
		customButtons: [],
		buttons: [{id:StandardDialogButtonId.Cancel}],
		showOkButton: true,//TODO:lius control btn hidden or display dynamically
		showCancelButton: true,
		bottomDescription: this.bottomTip
	};

	public async createRequests(){
		const selectedItem = this.dataService.getSelection();
		if(_.isNull(selectedItem)){
			this.msgBoxService.showMsgBox('businesspartner.main.businessPartnerMustSelect', 'Warning', 'warning');
			return;
		}
		const result = await this.formDialogService.showDialog<ICreateRequestsEntity>(this.dlgOptions);
		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.handleOk();
		}
		if(!_.isUndefined(result) && !_.isNull(result)){
			// TODO:lius this.certificateService.callRefresh()
		}
	}

	private handleOk() {
		const url = this.configService.webApiBaseUrl + 'businesspartner/certificate/createrequired/businesspartner?BusinessPartnerId='+this.createRequestsEntity.BusinessPartnerId+'&StatusFk='+this.createRequestsEntity.StatusFk;
		this.http.get(url).subscribe(res=>{
			if (!_.isNull(res) && !_.isEmpty(res)) {
				const ret = res as Array<object>;
				this.bottomTip = 'Update Successed!' + ret.length + ' items were created.';
			}else{
				this.bottomTip = 'Create Failed!';
			}
		});
	}

}