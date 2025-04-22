import { inject, Injectable } from '@angular/core';
import { IGeneratePaymentSchedule, ProcurementCommonGeneratePaymentScheduleValidationService, ProcurementCommonGeneratePaymentScheduleWizardService } from '@libs/procurement/common';
import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../model/entities/package-complete-entity.class';
import { PackageTotalLookupService } from '../services/lookup-services/package-total-lookup.service';
import { ProcurementPackageHeaderDataService } from '../services/package-header-data.service';
import { ProcurementPackageTotalDataService } from '../services/package-total-data.service';
import { PackagesTotalLookupService } from '../services/lookup-services/packages-total-lookup.service';
import { IClosingDialogButtonEventInfo, ICustomDialog } from '@libs/ui/common';
import { clone, cloneDeep, find, toInteger } from 'lodash';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageGeneratePaymentScheduleWizardService extends ProcurementCommonGeneratePaymentScheduleWizardService<IPrcPackageEntity, PrcPackageCompleteEntity> {
	protected constructor() {
		super(inject(ProcurementPackageHeaderDataService));
		this.validationService = new ProcurementCommonGeneratePaymentScheduleValidationService(inject(BasicsSharedDataValidationService), this.vatPercent);
		this.totalLookupService.getItemByKey$.subscribe((items) => {
			//TODO can not get entityRuntimeData to apply the validation
			//this.validationService.validateTotalCost();
		});
	}

	private totalDataService = inject(ProcurementPackageTotalDataService);

	protected selectedTotal() {
		const selectedTotal = this.getTotalByConfiguration(this.totalDataService);
		if (selectedTotal) {
			return { Id: selectedTotal.Id, ValueNetOc: selectedTotal.ValueNetOc, GrossOc: selectedTotal.GrossOc ?? 0 };
		}
		return { Id: 0, ValueNetOc: 0, GrossOc: 0 };
	}

	protected totalLookupService = inject(PackageTotalLookupService); //as UiCommonLookupReadonlyDataService<object, object>;
	protected totalsLookupService = inject(PackagesTotalLookupService);

	//= inject(PackageTotalLookupService) as UiCommonLookupReadonlyDataService<object, object>;
	protected validationService: ProcurementCommonGeneratePaymentScheduleValidationService;

	protected override async beforeOpenDialogFn() {
		if (this.multipleSelection) {
			const list = await this.totalDataService.getSameTotalsFromPackages(this.formEntity?.Ids ?? []);

			if (list && list.length && this.formEntity) {
				this.formEntity.MultipleTotalType = list[0].TotalKindFk ?? -1;
			}

			//TODO validation
		}
	}

	protected override getInitValue(): IGeneratePaymentSchedule {
		const initValue = super.getInitValue();
		if (this.selectedLead) {
			initValue.StartWork = this.selectedLead.PlannedStart ?? null;
			initValue.EndWork = this.selectedLead.PlannedEnd ?? null;
			initValue.ExchangeRate = this.selectedLead.ExchangeRate;
		}
		return initValue;
	}

	protected Ok(info: IClosingDialogButtonEventInfo<ICustomDialog<IGeneratePaymentSchedule, { isLoading: boolean }>, void>): void {
		info.dialog.body.isLoading = true;
		if (!info.dialog.value) {
			return;
		}
		info.dialog.value.OcPercent = this.ocPercent();
		const currentItem = cloneDeep(info.dialog.value);
		currentItem.RadioType = toInteger(currentItem.RadioType) as unknown as string;
		currentItem.Repeat = toInteger(currentItem.Repeat) as unknown as string;
		if (this.multipleSelection) {
			const items: IGeneratePaymentSchedule[] = [];
			this.totalDataService.getSameTotalsFromPackages(currentItem.Ids ?? []).then((totals) => {
				if (totals && totals.length && this.selectedLeads) {
					this.selectedLeads.forEach((s) => {
						const i = clone(currentItem);
						const total = find(totals, { TotalKindFk: currentItem.MultipleTotalType, HeaderFk: s.Id });
						//i.HeaderFk = s.PrcHeaderFk;
						if (total) {
							i.TotalCost = total.ValueNetOc;
							i.TotalOcGross = total.GrossOc ?? 0;
						}
						i.StartWork = s.PlannedStart || null;
						i.EndWork = s.PlannedEnd || null;
						items.push(i);
					});
					this.http.post('procurement/common/paymentchedule/saveentities', items).then(() => {
						info.dialog.body.isLoading = false;
						info.dialog.close();
						this.showSuccessDialog();
					});
				}
			});
		} else {
			this.http.post('procurement/common/paymentchedule/save', currentItem).then(() => {
				info.dialog.body.isLoading = false;
				info.dialog.close();
				this.showSuccessDialog();
			});
		}
	}

	protected getTotalPromise() {
		return this.totalDataService.getSameTotalsFromPackages(this.formEntity?.Ids ?? []);
	}
}
