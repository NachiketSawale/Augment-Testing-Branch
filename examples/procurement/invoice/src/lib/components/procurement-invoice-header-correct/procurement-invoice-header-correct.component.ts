import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { PlatformCommonModule, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { FieldType, FieldValidationInfo, getCustomDialogDataToken, IFormConfig, UiCommonModule } from '@libs/ui/common';
import { BasicsSharedDataValidationService, BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { NgIf } from '@angular/common';
import { CorrectInvoiceType, IInvHeaderCorrectEntity, IInvHeaderEntity, IInvoiceCorrectValidateResult } from '../../model';
import { firstValueFrom } from 'rxjs';
import { ProcurementInvoiceHeaderDataService } from '../../header/procurement-invoice-header-data.service';
import { isNil } from 'lodash';
import { ValidationInfo } from '@libs/platform/data-access';

export const CORRECT_TYPE_TOKEN = new InjectionToken<CorrectInvoiceType>('CORRECT_TYPE_TOKEN');

@Component({
	selector: 'procurement-invoice-header-correct',
	standalone: true,
	imports: [PlatformCommonModule, UiCommonModule, NgIf],
	templateUrl: './procurement-invoice-header-correct.component.html',
	styleUrl: './procurement-invoice-header-correct.component.css',
})
export class ProcurementInvoiceHeaderCorrectComponent implements OnInit {
	protected configurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly http = inject(PlatformHttpService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly invoiceService = inject(ProcurementInvoiceHeaderDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<string, ProcurementInvoiceHeaderCorrectComponent>());

	public code: string = '';
	public autoGenerateCode: boolean = false;
	public messageText: string = '';
	public newItem?: IInvHeaderEntity = undefined;
	public updateEntities: IInvHeaderEntity[] = [];
	public currentItem: IInvHeaderCorrectEntity = { Code: '', Id: 0 };
	public showCodeInput: boolean = false;
	public correctSuccess: boolean = false;
	public cannotCorrect: boolean = false;
	public isLoading = false;
	public hasError = false;
	public correctType: CorrectInvoiceType = inject(CORRECT_TYPE_TOKEN);

	public formConfig: IFormConfig<IInvHeaderCorrectEntity> = {
		formId: 'invoice.header.correct.form',
		showGrouping: false,
		addValidationAutomatically: true,
		rows: [
			{
				id: 'invoiceCode',
				label: {
					key: 'procurement.invoice.header.code',
				},
				type: FieldType.Code,
				model: 'Code',
				validator: (info) => this.validateCode(info),
			},
		],
	};

	public onOKBtnClicked() {
		if (this.correctSuccess) {
			this.handleCorrectSuccess();
		} else {
			const selectedItem = this.invoiceService.getSelectedEntity();
			if (selectedItem) {
				this.correctInvoice(selectedItem);
			}
		}
	}

	public okBtnVisible() {
		return !this.cannotCorrect;
	}

	public okBtnDisabled(): boolean {
		return this.isLoading || this.hasError;
	}

	public canCelBtnClicked() {
		this.dialogWrapper.close();
	}

	public cancelBtnVisible() {
		return !this.correctSuccess;
	}

	public cancelBtnDisabled() {
		return this.isLoading;
	}

	public async ngOnInit() {
		const selectedItem = this.invoiceService.getSelectedEntity();
		if (selectedItem) {
			await this.initializeSelectedItem(selectedItem);
			await this.validateInvoiceCorrection(selectedItem);
		}
	}

	private async validateInvoiceCorrection(selectedItem: IInvHeaderEntity) {
		this.isLoading = true;
		const res = await this.fetchValidationResult(selectedItem);
		this.handleValidationResult(res, selectedItem);
	}

	private async correctInvoice(selectedItem: IInvHeaderEntity) {
		this.isLoading = true;
		const params = {
			SelectedInvoice: selectedItem,
			type: this.correctType,
			NewInvoiceCode: this.currentItem.Code,
		};
		const res = await this.http.post<{ newEntity: IInvHeaderEntity; updateEntities: IInvHeaderEntity[] }>('procurement/invoice/header/correct', params);
		if (res) {
			this.newItem = res.newEntity;
			this.updateEntities = res.updateEntities;
			this.messageText = this.translationService.instant('procurement.invoice.correctSuccess', { code: this.newItem.Code }).text;

			this.isLoading = false;
			this.showCodeInput = false;
			this.correctSuccess = true;
		}
	}

	private async validateCode(info: FieldValidationInfo<IInvHeaderCorrectEntity>) {
		const validatInfo = new ValidationInfo(info.entity, info.value, 'Code');
		let result = this.validationUtils.isUnique(this.invoiceService, validatInfo, this.invoiceService.getList());
		if (!result.valid) {
			this.hasError = true;
			return result;
		}

		result = await this.validationUtils.isAsyncUnique(validatInfo, 'procurement/contract/header/isunique');
		if (!result.valid) {
			this.hasError = true;
			return result;
		}
		return result;
	}

	private handleCorrectSuccess() {
		let needUpdateEntities: IInvHeaderEntity[] = [];
		if (this.updateEntities.length) {
			needUpdateEntities = this.getNeedUpdateEntities();
		}
		if (needUpdateEntities.length) {
			this.updateAndSelectEntities(needUpdateEntities);
		} else {
			this.insertAndSelectAItem(this.newItem);
		}
		this.dialogWrapper.close();
	}

	private getNeedUpdateEntities(): IInvHeaderEntity[] {
		const list = this.invoiceService.getList();
		return list.filter((e) => !!this.updateEntities.find((i) => i.Id === e.Id));
	}

	private updateAndSelectEntities(entities: IInvHeaderEntity[]) {
		this.invoiceService.select(entities);
		this.invoiceService.refreshOnlySelected(entities).then(() => {
			this.insertAndSelectAItem(this.newItem);
		});
	}

	private insertAndSelectAItem(item?: IInvHeaderEntity) {
		if (isNil(item)) {
			return;
		}
		this.invoiceService.append(item);
		this.invoiceService.select([item]);
		this.invoiceService.readonlyProcessor.process(item);
	}

	private async initializeSelectedItem(selectedItem: IInvHeaderEntity) {
		const prcConfig = await firstValueFrom(this.configurationLookupService.getItemByKey({ id: selectedItem.PrcConfigurationFk }));
		if (prcConfig) {
			this.code = this.invoiceService.getNumberDefaultText(selectedItem);
			this.currentItem.Code = this.code;
			this.autoGenerateCode = this.invoiceService.shouldGenerateNumber(selectedItem);
		}
	}

	private async fetchValidationResult(selectedItem: IInvHeaderEntity): Promise<IInvoiceCorrectValidateResult> {
		const params = {
			invoiceHeaderId: selectedItem.Id,
			type: this.correctType,
		};
		return this.http.get<IInvoiceCorrectValidateResult>('procurement/invoice/header/validateinvoiceforcorrect', { params });
	}

	private handleValidationResult(res: IInvoiceCorrectValidateResult, selectedItem: IInvHeaderEntity) {
		if (res.Result) {
			this.processSuccessfulValidation(selectedItem);
		} else {
			this.processFailedValidation(res);
		}
	}

	private processSuccessfulValidation(selectedItem: IInvHeaderEntity) {
		if (this.autoGenerateCode) {
			this.correctInvoice(selectedItem);
		} else {
			this.showCodeInput = true;
			this.isLoading = false;
		}
	}

	private processFailedValidation(res: IInvoiceCorrectValidateResult) {
		if (!isNil(res.Message)) {
			this.messageText = res.Message;
		}
		this.cannotCorrect = true;
		this.isLoading = false;
	}
}
