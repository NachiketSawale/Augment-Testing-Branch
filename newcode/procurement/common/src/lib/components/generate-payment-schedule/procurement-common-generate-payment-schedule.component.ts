import { Component, inject, InjectionToken } from '@angular/core';
import { IGeneratePaymentSchedule } from '../../model/interfaces/wizard/generate-payment-schedule.interface';
import { FieldType, IControlContext, IFormConfig, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { BasicsSharedDataValidationService, BasicsSharedSCurveLegacyConfig } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { ProcurementCommonGeneratePaymentScheduleValidationService } from '../../services/wizards/generate-payment-schedule-validation.service';
import { DataServiceFlatRoot, IReadOnlyEntityRuntimeData, ServiceRole, ValidationInfo } from '@libs/platform/data-access';
import { gt } from 'lodash';
import { differenceInMonths, differenceInQuarters, differenceInWeeks } from 'date-fns';

export type GeneratePaymentScheduleConfig = {
	multipleSelection: boolean;
	selectedLead: unknown;
	selectedLeads: unknown[];
	validationService: ProcurementCommonGeneratePaymentScheduleValidationService;
	formConfig: IFormConfig<IGeneratePaymentSchedule>;
	formEntity: IGeneratePaymentSchedule;
	//TODO entityRuntimeData needs to be provided by dataService currently.
	entityRuntimeData: IReadOnlyEntityRuntimeData<IGeneratePaymentSchedule> | undefined;
};

export const GENERATE_PAYMENT_SCHEDULE_TOKEN = new InjectionToken<GeneratePaymentScheduleConfig>('generate-payment-schedule');

function getGeneratePaymentScheduleDataToken(): InjectionToken<GeneratePaymentScheduleConfig> {
	return GENERATE_PAYMENT_SCHEDULE_TOKEN;
}

@Component({
	selector: 'procurement-common-generate-payment-schedule',
	templateUrl: './procurement-common-generate-payment-schedule.component.html',
	styleUrl: './procurement-common-generate-payment-schedule.component.scss',
})
// TODO need extends the dataService to get the RuntimeData currently.
export class ProcurementCommonGeneratePaymentScheduleComponent extends DataServiceFlatRoot<IGeneratePaymentSchedule, object> {
	private readonly lookupDataFactory = inject(UiCommonLookupDataFactoryService);
	private readonly translateService = inject(PlatformTranslateService);
	private readonly dataToken = inject(getGeneratePaymentScheduleDataToken());
	private readonly validationService = this.dataToken.validationService;
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	private controlContextTemplate: IControlContext = { fieldId: '', readonly: this.readOnly, validationResults: [], entityContext: { totalCount: 0 }, value: '' };

	public constructor() {
		super({ apiUrl: '', roleInfo: { role: ServiceRole.Root, itemName: '' } });
	}

	public get currentItem(): IGeneratePaymentSchedule {
		return this.dataToken.formEntity;
	}

	private _isLoading: boolean = false;
	public get isLoading() {
		return this._isLoading;
	}

	public set isLoading(value: boolean) {
		this._isLoading = value;
	}

	public get readOnly() {
		return gt(this.currentItem.RadioType, '0'); // >0
	}

	protected _occurenceDisable: boolean = true;
	public get occurenceDisable() {
		return this._occurenceDisable;
	}

	public get SCurveLookupProvider() {
		return this.lookupDataFactory.fromLookupTypeLegacy('Scurve', BasicsSharedSCurveLegacyConfig);
	}

	public repeatOption = [
		{ id: 1, value: this.translateService.instant('procurement.common.wizard.generateDeliverySchedule.weekly') },
		{ id: 2, value: this.translateService.instant('procurement.common.wizard.generateDeliverySchedule.monthly') },
		{ id: 3, value: this.translateService.instant('procurement.common.wizard.generateDeliverySchedule.quarterly') },
		{ id: 4, value: this.translateService.instant('procurement.common.wizard.generateDeliverySchedule.userSpecified') },
	];

	public radioOptionChanged() {
		this.repeatOptionChanged();
		const item = this.currentItem;
		if (gt(item.RadioType, '0')) {
			// >0
			item.IsDelay = false;
		} else {
			if (!this.dataToken.multipleSelection) {
				this.validationUtils.applyValidationResult(this, {
					entity: item,
					field: 'EndWork',
					result: this.validationService.validateEndWork(new ValidationInfo<IGeneratePaymentSchedule>(item, item.EndWork ?? undefined, 'EndWork')),
				});
			}
		}
	}

	public repeatOptionChanged() {
		if (this.currentItem.Repeat === '4') {
			this._occurenceDisable = false;
			this.currentItem.Occurence = 1;
		} else {
			this._occurenceDisable = true;
			this.calculation();
		}
	}

	protected readonly FieldType = FieldType;

	public get formConfig(): IFormConfig<IGeneratePaymentSchedule> {
		return this.dataToken.formConfig;
	}

	public get entityRuntimeData(): IReadOnlyEntityRuntimeData<IGeneratePaymentSchedule> | undefined {
		return this.getEntityReadonlyRuntimeData(this.currentItem) ?? undefined;
	}

	public occurenceContext: IControlContext = {
		...this.controlContextTemplate,
		fieldId: 'occurence',
	};

	public occurenceChanged() {
		const item = this.currentItem;
		if (gt(item.RadioType, '0')) {
			if (!this.dataToken.multipleSelection) {
				this.validationUtils.applyValidationResult(this, {
					entity: item,
					field: 'EndWork',
					result: this.validationService.validateEndWork(new ValidationInfo<IGeneratePaymentSchedule>(item, item.EndWork ?? undefined, 'EndWork')),
				});
			}
		}
	}

	private calculation() {
		if (this.currentItem.StartWork && this.currentItem.EndWork && this.currentItem.Repeat !== '4') {
			const repeat = this.currentItem.Repeat;
			const startWork = this.currentItem.StartWork;
			const endWork = this.currentItem.EndWork;

			let occurence = 1;
			if (repeat === '1') {
				// weekly
				occurence = differenceInWeeks(startWork, endWork) + 1;
			} else if (repeat === '2') {
				// monthly
				occurence = differenceInMonths(startWork, endWork) + 1;
			} else {
				// quarterly
				occurence = differenceInQuarters(startWork, endWork) + 1;
			}
			this.currentItem.Occurence = occurence;
		} else {
			if (this.currentItem.StartWork === null || this.currentItem.EndWork === null) {
				this.currentItem.Occurence = 0;
			}
		}
	}
}
