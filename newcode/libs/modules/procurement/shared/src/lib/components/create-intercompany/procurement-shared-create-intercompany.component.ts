/*
 * Copyright(c) RIB Software GmbH
 *
 * Component for managing intercompany transaction creation UI.
 * Handles form interactions, grid configurations, and data fetching.
 */
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { PlatformCommonModule, PlatformConfigurationService, PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { ColumnDef, createLookup, FieldType, FormRow, getCustomDialogDataToken, GridComponent, IFormConfig, IGridConfiguration, StandardDialogButtonId, UiCommonModule } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsCompanyPeriodLookupService, BasicsShareCompanyYearLookupService, } from '@libs/basics/shared';
import { NgIf } from '@angular/common';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ValidationResult } from '@libs/platform/data-access';
import { IInterCompanyFormData, IInterCompanyGridItem, INTER_COMPANY_REQUEST_TOKEN } from '../../model/interfaces/wizard/procurement-shared-create-intercompany.interface';

@Component({
	selector: 'procurement-shared-create-intercompany',
	standalone: true,
	imports: [PlatformCommonModule, UiCommonModule, GridComponent, NgIf],
	templateUrl: './procurement-shared-create-intercompany.component.html',
	styleUrl: './procurement-shared-create-intercompany.component.css',
})
export class ProcurementSharedCreateIntercompanyComponent {
	/**
	 * priceList Icon Container
	 */
	@ViewChild('priceListIconContainer')
	public priceListIconContainer!: ElementRef;
	protected readonly commonTranslate = 'procurement.common.wizard.createInterCompany.';
	protected readonly initData = inject(INTER_COMPANY_REQUEST_TOKEN);
	protected gridConfig: IGridConfiguration<IInterCompanyGridItem> = {
		uuid: this.initData.serviceConfig.gridId,
		columns: this.createGridColumns(),
		items: this.initData.uiEntity.SelectIcCompanyItems,
		iconClass: null,
		idProperty: 'CompanyId',
		skipPermissionCheck: true,
		enableColumnReorder: true,
		enableCopyPasteExcel: false,
	};
	protected formConfig: IFormConfig<IInterCompanyFormData> = {
		formId: 'procurement.shared.create.interCompany.form',
		showGrouping: false,
		addValidationAutomatically: true,
		rows: this.createFormRows()
	};
	private readonly companyPeriodLookupService = inject(BasicsCompanyPeriodLookupService);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly http = inject(PlatformHttpService);
	private readonly translationService = inject(PlatformTranslateService);
	private readonly dialogWrapper = inject(getCustomDialogDataToken<IInterCompanyFormData, ProcurementSharedCreateIntercompanyComponent>());

	public onOKBtnClicked() {
		this.dialogWrapper.value = this.initData.uiEntity;
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}

	public okBtnDisabled(): boolean {
		return !(this.initData.uiEntity.SelectIcCompanyItems?.some(item => item.Selected) ?? false);
	}


	private createFormRows(): FormRow<IInterCompanyFormData>[] {
		return [
			{
				id: 'CompanyId',
				label: {key: 'cloud.common.entityCompanyName'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({dataServiceToken: BasicsCompanyLookupService}),
				model: 'CompanyId',
				readonly: true,
			},
			{
				id: 'CompanyYearId',
				label: {key: this.commonTranslate + 'businessYear'},
				model: 'CompanyYearId',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsShareCompanyYearLookupService,
					serverSideFilter: {
						key: 'basics-company-companyyear-filter',
						execute: () => `CompanyFk=${this.configurationService.clientId}`,
					},
				}),
			},
			{
				id: 'CompanyPeriodId',
				label: {key: this.commonTranslate + 'businessPeriod'},
				model: 'CompanyPeriodId',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyPeriodLookupService<IInterCompanyFormData>,
					clientSideFilter: {
						execute: (item, context) => item.CompanyYearFk === context.entity?.CompanyYearId,
					},
				}),
				change: ({newValue}) => this.updatePeriodDates(newValue as number),
			},
			{
				id: 'EffectiveDate',
				label: {key: this.commonTranslate + 'effectiveDate'},
				type: FieldType.Date,
				model: 'EffectiveDate',
				validator: ({value}) =>
					value && value >= this.initData.uiEntity.StartDate && value <= this.initData.uiEntity.EndDate
						? new ValidationResult()
						: new ValidationResult(this.translationService.instant('procurement.invoice.wizard.createInterCompanyBill.effectiveDateError').text),
			},
		];
	}

	private createGridColumns(): ColumnDef<IInterCompanyGridItem>[] {
		return [
			{
				id: 'companyName',
				model: 'CompanyName',
				width: 190,
				type: FieldType.Description,
				label: {key: this.commonTranslate + 'forCompany'},
				sortable: true,
				visible: true,
				readonly: true,
			},
			...(this.initData.serviceConfig.extendColumns ?? []),
			{
				id: 'totalAmount',
				model: 'TotalAmount',
				type: FieldType.Money,
				label: {key: this.commonTranslate + 'totalAmount'},
				width: 82,
				sortable: true,
				visible: true,
				readonly: true,
			},
			{
				id: 'selected',
				model: 'Selected',
				width: 70,
				type: FieldType.Boolean,
				label: {key: this.commonTranslate + 'checked'},
				sortable: true,
				visible: true,
				headerChkbox: true,
			}
		];
	}

	private updatePeriodDates(periodId: number) {
		this.companyPeriodLookupService.getItemByKey({id: periodId}).subscribe(period => {
			const {StartDate, EndDate} = period;
			Object.assign(this.initData.uiEntity, {
				StartDate: new Date(StartDate!),
				EndDate: new Date(EndDate!),
				EffectiveDate: zonedTimeToUtc(new Date(EndDate!), 'UTC'),
			});
			this.onChangeEffectiveDate();
		});
	}

	private async onChangeEffectiveDate() {
		const response = await this.http.get<{ Main: IInterCompanyGridItem[] }>(
			`${this.initData.serviceConfig.contextUrlSuffix}getIcItems`,
			{
				params: {
					startDate: this.dateToISOString(this.initData.uiEntity.StartDate),
					endDate: this.dateToISOString(this.initData.uiEntity.EffectiveDate),
				},
			}
		);
		this.initData.uiEntity.SelectIcCompanyItems = response.Main;
		this.gridConfig = {
			...this.gridConfig,
			items: this.initData.uiEntity.SelectIcCompanyItems,
		};
	}

	private dateToISOString(date: Date) {
		return date.toISOString();//format(date, 'yyyy-mm-dd');
	}
}
