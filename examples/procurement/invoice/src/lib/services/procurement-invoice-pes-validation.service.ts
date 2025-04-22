/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IInv2PESEntity } from '../model';
import { firstValueFrom } from 'rxjs';
import { IPesHeaderLookUpEntity, ProcurementBaseValidationService, ProcurementShareContractLookupService, ProcurementSharePesLookupService } from '@libs/procurement/shared';
import { IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { BasicsShareBillingSchemaLookupService } from '@libs/basics/shared';
import { ProcurementInvoiceHeaderDataService } from '../header/procurement-invoice-header-data.service';
import { ProcurementInvoiceCertificateDataService } from './procurement-invoice-certificate-data.service';
import { ProcurementInvoicePesDataService } from './procurement-invoice-pes-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceOtherValidationService extends ProcurementBaseValidationService<IInv2PESEntity> {
	private readonly billingSchemaLookupService = inject(BasicsShareBillingSchemaLookupService);
	private readonly pesLookupService = inject(ProcurementSharePesLookupService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);

	private readonly certificateService = inject(ProcurementInvoiceCertificateDataService);
	private readonly dataService = inject(ProcurementInvoicePesDataService);
	private readonly parentService = inject(ProcurementInvoiceHeaderDataService);

	protected constructor() {
		super();
		this.parentService.billingSchemaChanged$.subscribe((e) => {
			this.onParentChanged2Pes();
		});
		this.parentService.vatGroupChanged$.subscribe((e) => {
			this.onParentChanged2Pes();
		});
	}

	protected async onParentChanged2Pes(): Promise<void> {
		const itemsToValidate = this.dataService.getList().map((item) => ({
			entity: item,
			value: item.PesHeaderFk,
			field: 'PesHeaderFk',
		}));
		const promises: Promise<unknown>[] = itemsToValidate.map((info) => this.validatePesHeaderFk(info));
		await Promise.all(promises);
	}

	protected generateValidationFunctions(): IValidationFunctions<IInv2PESEntity> {
		return {
			PesHeaderFk: this.validatePesHeaderFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IInv2PESEntity> {
		return this.dataService;
	}

	protected async validatePesHeaderFk(info: ValidationInfo<IInv2PESEntity>) {
		const isUniqueSync = this.validationUtils.isUnique(this.dataService, info, this.dataService.getList());
		if (!isUniqueSync.valid) {
			return isUniqueSync;
		}
		const value = info.value as number;
		const parentSelected = this.parentService.getSelectedEntity();
		if (parentSelected?.BillingSchemaFk) {
			const billingSchema = await firstValueFrom(this.billingSchemaLookupService.getItemByKey({ id: parentSelected.BillingSchemaFk }));
			const pesLookupData = await this.http.get<IPesHeaderLookUpEntity>('procurement/invoice/pes/caculatefrominv', {
				params: {
					MainId: value,
					IsChained: billingSchema.IsChained,
					BpdVatGroupId: parentSelected?.BpdVatGroupFk || 0,
					IsChainedPes: billingSchema.IsChainedPes,
				},
			});

			if (pesLookupData) {
				info.entity.PesValueOc = pesLookupData.PesVatOc || 0;
				info.entity.PesVatOc = pesLookupData.PesVatOc || 0;
				info.entity.PesValue = pesLookupData.PesValue || 0;
				info.entity.PesVat = pesLookupData.PesVat || 0;
				info.entity.ValueGross = info.entity.PesValue + info.entity.PesVat;
				info.entity.ValueOcGross = info.entity.PesValueOc + info.entity.PesVatOc;
				await this.validateAndProcessOldPesData(info);
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	// pesOldVersionValidation rename validateAndProcessOldPesData
	private async validateAndProcessOldPesData(info: ValidationInfo<IInv2PESEntity>) {
		const invoicePes = await firstValueFrom(this.pesLookupService.getItemByKey({ id: info.value as number }));
		if (invoicePes?.PrcHeaderFk) {
			this.parentService.onCopyInvGenerals$.next({ PrcHeaderId: invoicePes.PrcHeaderFk, Code: invoicePes.Code, Description: invoicePes.Description });
			if (invoicePes.ConHeaderFk) {
				const conHeader = await firstValueFrom(this.contractLookupService.getItemByKey({ id: invoicePes.ConHeaderFk }));
				if (conHeader) {
					await this.certificateService.copyAndUpdateCertificates(conHeader, invoicePes.ConHeaderFk);
				}
			}
		}

		this.dataService.updateEntityValues([info.entity]);
		this.dataService.calculateFromPes();
		//dataService.gridRefresh();
	}
}
