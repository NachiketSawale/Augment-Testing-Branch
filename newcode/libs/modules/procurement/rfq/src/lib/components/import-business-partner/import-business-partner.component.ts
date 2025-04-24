/*
 * Copyright(c) RIB Software GmbH
 */
import { inject } from '@angular/core';
import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	GridComponent,
	IGridConfiguration,
	UiCommonModule,
	FieldType,
	FieldValidationInfo, createLookup, LookupEvent, UiCommonMessageBoxService
} from '@libs/ui/common';
import { PlatformCommonModule, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { CommonModule } from '@angular/common';
import { ImportBusinessPartnerWizardService } from '../../wizards/import-business-partner-wizard.service';
import {
	IRfqBusinesspartnerStatusEntity, IRfqLookupEntity,
	ProcurementSharedRfqBusinesspartnerStatusLookupService,
	ProcurementShareRfqLookupService
} from '@libs/procurement/shared';
import {
	IRfqBusinessPartnerEntity,
	IRfqBusinessPartnerResponse
} from '../../model/entities/rfq-businesspartner-entity.interface';
import { HttpClient } from '@angular/common/http';
import { ValidationResult } from '@libs/platform/data-access';
import { BusinessPartnerLookupService } from '@libs/businesspartner/shared';

@Component({
	selector: 'procurement-rfq-import-business-partner',
	standalone: true,
	imports: [FormsModule, UiCommonModule, PlatformCommonModule, CommonModule, GridComponent],
	templateUrl: './import-business-partner.component.html',
	styleUrls: ['./import-business-partner.component.scss'],
})
export class ImportBusinessPartnerComponent {
	public readonly: boolean = true;
	public selectedValue?: number;
	public rfqBusinessPartnerItems: IRfqBusinessPartnerEntity[] = [];
	protected configService = inject(PlatformConfigurationService);
	private readonly translate = inject(PlatformTranslateService);
	public rfqLookupService = inject(ProcurementShareRfqLookupService);
	protected wizardService = inject(ImportBusinessPartnerWizardService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private http = inject(HttpClient);
	public modalOptions = {
		rfqLabelText: this.translate.instant('procurement.rfq.importBp.rfqLabelText').text,
		rfqBodyLabelText: this.translate.instant('procurement.rfq.importBp.rfqBodyLabelText').text
	};

	protected gridConfig: IGridConfiguration<IRfqBusinessPartnerEntity> = {
		uuid: 'DE6AFC61AB3C488BB79592ED461CF877',
		//TODO: columns should from rfq business partner layout.
		columns: [
			{
				id: 'Selected',
				label: {
					text: 'Selected',
					key: 'cloud.common.entitySelected',
				},
				model: 'Selected',
				readonly: false,
				sortable: true,
				type: FieldType.Boolean,
				width: 35,
				visible: true,
				validator: info => this.onSelected(info)
			}, {
				id: 'businessPartnerFk',
				label: {key: 'basics.common.BusinessPartner', text: 'Business Partner'},
				model: 'BusinessPartnerFk',
				sortable: true,
				type: FieldType.Lookup,
				visible: true,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService
				})
			}, {
				id: 'RfqBusinesspartnerStatusFk',
				model: 'RfqBusinesspartnerStatusFk',
				type: FieldType.Lookup,
				label: { text: 'Status', key: 'cloud.common.entityStatus' },
				readonly: true,
				visible: true,
				sortable: true,
				lookupOptions: createLookup<IRfqBusinessPartnerEntity, IRfqBusinesspartnerStatusEntity>({
					dataServiceToken: ProcurementSharedRfqBusinesspartnerStatusLookupService
				}),
			}, {
				id: 'FirstQuoteFrom',
				model: 'FirstQuoteFrom',
				type: FieldType.Description,
				label: { text: 'First  Quote From', key: 'procurement.rfq.rfqBusinessPartnerFirstQuoteFrom' },
				readonly: true,
				visible: true,
				sortable: false,
			}, {
				id: 'SubsidiaryFk',
				model: 'SubsidiaryFk',
				type: FieldType.Lookup,
				label: { text: 'Branch', key: 'procurement.rfq.rfqBusinessPartnerFirstQuoteFrom' },
				readonly: true,
				visible: true,
				sortable: false,
				lookupOptions: createLookup<IRfqBusinessPartnerEntity, IRfqBusinesspartnerStatusEntity>({
					dataServiceToken: ProcurementSharedRfqBusinesspartnerStatusLookupService
				}),
			},
		],
		items: this.rfqBusinessPartnerItems
	};

	public onOKBtnClicked() {
		this.copyBidders({
			DestRfqHeaderId: this.selectedValue,
			SourceRfqBidderIds: this.rfqBusinessPartnerItems.map( item => item.BusinessPartnerFk)
		}).subscribe(response => {
			if (response === true) {
				this.messageBoxService.showInfoBox('procurement.rfq.importBp.success', 'procurement.rfq.importBp.title', true);
				return;
			}
		});
	}

	public okBtnDisabled(){
		return false;
	}

	public copyBidders(options: copyBiddersOptions){
		return this.http.post(this.configService.webApiBaseUrl + 'procurement/rfq/wizard/importbizpartner', options);
	}

	public async onSelectedValueChange(event: LookupEvent<IRfqLookupEntity, object>) {
		const payload = {
			Value: event,
			filter: ''
		};
		const resp = await this.http.post<IRfqBusinessPartnerResponse>(this.configService.webApiBaseUrl + 'procurement/rfq/businesspartner/getlist', payload);
		resp.subscribe(resp => {
			this.rfqBusinessPartnerItems = resp.Main;
		});
	}

	private onSelected(info: FieldValidationInfo<IRfqBusinessPartnerEntity>){
		return new ValidationResult();
	}
}

export interface copyBiddersOptions {
	DestRfqHeaderId: number | undefined;
	SourceRfqBidderIds?: number[];
}
