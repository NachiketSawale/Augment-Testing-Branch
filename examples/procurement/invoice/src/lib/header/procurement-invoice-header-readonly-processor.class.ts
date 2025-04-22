/*
 * Copyright(c) RIB Software GmbH
 */
import { AsyncReadonlyFunctions, BasicsShareProcurementConfigurationToBillingSchemaLookupService, EntityReadonlyProcessorBase, ReadonlyFunctions, ReadonlyInfo } from '@libs/basics/shared';
import { IInvHeaderEntity } from '../model';
import { ProcurementInvoiceHeaderDataService } from './procurement-invoice-header-data.service';
import { ProcurementInvoiceStatusPermissionService } from '../services/procurement-invoice-status-permission.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export class ProcurementInvoiceHeaderReadonlyProcessor extends EntityReadonlyProcessorBase<IInvHeaderEntity> {
	private readonly invStatusRightSvc = inject(ProcurementInvoiceStatusPermissionService);
	private readonly prcConfig2BSchemaLookupService = inject(BasicsShareProcurementConfigurationToBillingSchemaLookupService);

	public constructor(protected dataService: ProcurementInvoiceHeaderDataService) {
		super(dataService);
	}

	public override generateReadonlyFunctions(): ReadonlyFunctions<IInvHeaderEntity> {
		return {
			BasAccassignBusinessFk: {
				shared: ['BasAccassignControlFk', 'BasAccassignAccountFk', 'BasAccassignConTypeFk'],
				readonly: this.readonlyBasAccassignBusiness,
			},
			CompanyDeferalTypeFk: {
				shared: ['DateDeferalStart'],
				readonly: this.readonlyCompanyDeferalType,
			},
			PesHeaderFk: (e) => this.readonlyPesHeaderFk(e),
			SalesTaxMethodFk: (e) => this.readonlySalesTaxMethodFk(e),
		};
	}

	public generateAsyncReadonlyFunctions(): AsyncReadonlyFunctions<IInvHeaderEntity> {
		return {
			ProgressId: async (e) => await this.readonlyProgressId(e),
		};
	}

	protected readonlyBasAccassignBusiness(info: ReadonlyInfo<IInvHeaderEntity>) {
		return !(info.item && info.item.ConHeaderFk && info.item.IsInvAccountChangeable);
	}

	protected override readonlyEntity(entity: IInvHeaderEntity): boolean {
		return this.dataService.isEntityReadonly(entity) || !!entity.IsProtectedAllFields;
	}

	protected async readonlyProgressId(info: ReadonlyInfo<IInvHeaderEntity>): Promise<boolean> {
		const entity = info.item;
		const editable = this.invStatusRightSvc.isEditableInvoiceStatus(entity.InvStatusFk);
		if (!editable) {
			return true;
		}

		const bilSchemaConfig = await firstValueFrom(this.prcConfig2BSchemaLookupService.getItemByKey({ id: entity.BillingSchemaFk }));
		return bilSchemaConfig ? !bilSchemaConfig.IsChained : false;
	}

	protected readonlyByVersion(info: ReadonlyInfo<IInvHeaderEntity>) {
		return !info.item.Version;
	}

	protected readonlyCompanyDeferalType(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		const entity = info.item;
		const invType = this.dataService.invTypeLookupService.cache.getItem({ id: entity.InvTypeFk });
		return !!invType?.Isprogress;
	}

	protected readonlyPesHeaderFk(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		const entity = info.item;
		return !this.dataService.isEditableToPes(entity.InvStatusFk);
	}

	protected readonlySalesTaxMethodFk(info: ReadonlyInfo<IInvHeaderEntity>): boolean {
		const entity = info.item;
		return !!entity.ConHeaderFk;
	}
}
