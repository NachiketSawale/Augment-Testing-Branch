/*
 * Copyright(c) RIB Software GmbH
 */
import { firstValueFrom } from 'rxjs';
import { PlatformConfigurationService, PlatformDateService, PlatformHttpService, PlatformModuleNavigationService, PlatformTranslateService } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	FormRow,
	IEditorDialogResult,
	IFieldLookupOptions,
	IFormConfig,
	IGridDialogOptions,
	ILookupContext,
	IMessageBoxOptions,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonGridDialogService,
	UiCommonLookupDataFactoryService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { BasicsCompanyPeriodLookupService, BasicsShareCompanyYearLookupService, BasicsSharedTransactionTypeLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeTransactionTypeEntity, ICompanyPeriodEntity } from '@libs/basics/interfaces';
import { inject } from '@angular/core';
import { AccrualTransactionWizardOptions, IAccountValidationEntity, ICreateTransactionResponse, ITransactionContextBaseEntity } from '../../model/entities';
import { ProcurementCommonWizardUtilService } from './procurement-common-wizard-util.service';
import { EntityRuntimeData } from '@libs/platform/data-access';

/**
 * Abstract base service for creating accrual transaction wizards across procurement modules.
 * Provides common functionality for transaction initialization, UI dialog handling,
 * and server communication. Concrete implementations must provide transaction-type specific
 * configurations via subclassing.
 */

export abstract class ProcurementCommonCreateAccrualTransactionWizardService<FT extends ITransactionContextBaseEntity> {

	protected readonly http = inject(PlatformHttpService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);
	protected readonly translateService = inject(PlatformTranslateService);
	protected readonly wizardUtilService = inject(ProcurementCommonWizardUtilService);
	protected readonly formDialogService = inject(UiCommonFormDialogService);
	protected readonly lookupServiceFactory = inject(UiCommonLookupDataFactoryService);
	protected readonly configService = inject(PlatformConfigurationService);
	protected readonly companyPeriodLookupService = inject(BasicsCompanyPeriodLookupService);
	protected readonly dateService = inject(PlatformDateService);
	protected readonly wizardRuntimeData: EntityRuntimeData<FT> = {
		readOnlyFields: [],
		validationResults: [],
		entityIsReadOnly: false,
	};

	protected readonly commonTranslate = 'procurement.common.wizard.createAccrualTransaction.';

	private readonly gridDialogService = inject(UiCommonGridDialogService);
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);

	protected constructor(protected config: AccrualTransactionWizardOptions) {
	}

	// Public async method called onStartWizard
	public async onStartWizard() {
		const initParam = await this.http.get<FT>(this.config.contextUrlSuffix + 'init');
		this.formatData(initParam);
		this.validateVoucherNumber(initParam);
		const dialogResult = (await this.formDialogService.showDialog<FT>({
			id: 'create-transaction-dialog',
			headerText: this.config.translateSource + 'title',
			formConfiguration: this.configureFormDialog(initParam),
			entity: initParam,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: {key: 'ui.common.dialog.okBtn'},
					isDisabled: (info) => this.okBtnDisabled(info.dialog.value)
				},
				{id: StandardDialogButtonId.Cancel, caption: {key: 'ui.common.dialog.cancelBtn'}}
			],
		})) as IEditorDialogResult<FT>;
		if (dialogResult && dialogResult.closingButtonId === StandardDialogButtonId.Ok && dialogResult.value) {
			await this.processTransactionCreation(dialogResult.value);
		}
	}

	/**
	 * Validates and assigns a voucher number if 'UseCompanyNumber' is true.
	 */
	protected validateVoucherNumber(createParam: FT) {
		if (createParam.UseCompanyNumber) {
			createParam.VoucherNo = this.translateService.instant('cloud.common.isGenerated').text;
		}
	}

	/**
	 * Formats the EffectiveDate field to ensure it's a Date object.
	 */
	protected formatData(createParam: FT) {
		if (createParam.EffectiveDate) {
			createParam.EffectiveDate = new Date(createParam.EffectiveDate);
		}
	}


	protected getAccrualModeOptions(): IFieldLookupOptions<FT> {
		throw new Error('Please override this method in subclass');
	}

	/**
	 * Generates form fields for selecting company year, company period, and other details.
	 * This method sets up lookup options and handles visibility and dependencies.
	 */
	protected generateCommonFormFields(entity: FT): FormRow<FT>[] {
		return [{
			id: 'CompanyYearId',
			model: 'CompanyYearId',
			label: {
				key: this.commonTranslate + 'entityCompanyYearServiceFk',
				text: 'Company Year',
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsShareCompanyYearLookupService,
				serverSideFilter: {
					key: 'basics-company-period-filter',
					execute: (context) => {
						return 'CompanyFk = ' + this.configService.clientId;
					},
				},
			}),
			visible: true,
		},
			{
				id: 'CompanyPeriodId',
				model: 'CompanyPeriodId',
				label: {
					key: this.commonTranslate + 'entityCompanyPeriod',
					text: 'Company Period',
				},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyPeriodLookupService,
					serverSideFilter: {
						key: 'basics-company-period-filter',
						execute: (context: ILookupContext<ICompanyPeriodEntity, FT>) => {
							if (context.entity && context.entity.CompanyYearId !== null) {
								return 'CompanyYearFk = ' + (context.entity?.CompanyYearId as number);
							} else {
								return {};
							}
						},
					},
				}),
				change: () => this.updateEffectiveDateAndNarrative(entity),
				visible: true,
			},
			{
				id: 'EffectiveDate',
				model: 'EffectiveDate',
				label: {
					key: this.commonTranslate + 'effectiveDate',
					text: 'Effective Date',
				},
				type: FieldType.Date,
				readonly: true, //TODO seems for date control readonly is not working. https://rib-40.atlassian.net/browse/DEV-21187
				visible: true,
			},
			{
				id: 'VoucherNo',
				model: 'VoucherNo',
				label: {
					key: this.commonTranslate + 'voucherNo',
					text: 'Voucher No',
				},
				type: FieldType.Code,
				required: true,
				readonly: entity.UseCompanyNumber,
			}];

	}

	protected okBtnDisabled(entity: FT | undefined) {
		return true;
	}

	/**
	 * Updates the EffectiveDate and PostingNarrative fields based on selected CompanyPeriodId.
	 * This method fetches data from a lookup service and updates the fields dynamically.
	 */
	private async updateEffectiveDateAndNarrative(data: FT) {
		const companyPeriodItem = await firstValueFrom(this.companyPeriodLookupService.getItemByKey({id: data.CompanyPeriodId as number}));
		if (companyPeriodItem?.EndDate) {
			data.EffectiveDate = new Date(companyPeriodItem.EndDate);
			data.PostingNarrative = this.dateService.formatUTC(data.EffectiveDate, 'dd/MM/yyyy') + this.translateService.instant(this.commonTranslate + 'accruals').text;
			if (data.Abbreviation) {
				data.PostingNarrative = `${data.Abbreviation} ${data.PostingNarrative}`;
			}
		}
	}

	/**
	 * Handles the transaction creation process by sending data to the server.
	 * Displays loading indicators and processes server responses accordingly.
	 */
	private async processTransactionCreation(createParam: FT) {
		this.wizardUtilService.showLoadingDialog('procurement.common.processing');
		let response: ICreateTransactionResponse = {SuccessCount: 0};
		try {
			response = await this.http.post<ICreateTransactionResponse>(this.config.contextUrlSuffix + 'create', createParam);
		} catch (error) {
			console.error('Error occurred:', error);
		} finally {
			this.wizardUtilService.closeLoadingDialog();
		}

		if (response.AccountValidations && response.AccountValidations.length > 0) {
			this.showMessageGridDialog(response.AccountValidations);
		} else {
			this.showMessageBoxDialog(response);
		}
	}

	private configureFormDialog(entity: FT) {
		return {
			showGrouping: false,
			rows: [
				{
					id: 'TransactionTypeId',
					model: 'TransactionTypeId',
					label: {
						key: this.commonTranslate + 'transactionType',
						text: 'Transaction Type',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup<FT, IBasicsCustomizeTransactionTypeEntity>({
						dataServiceToken: BasicsSharedTransactionTypeLookupService,
						showClearButton: true,
					}),
					readonly: true,
					visible: true,
				},
				{
					id: 'AccrualModeId',
					model: 'AccrualModeId',
					label: {
						key: this.commonTranslate + 'transactionMode',
						text: 'Transaction Mode',
					},
					type: FieldType.Lookup,
					lookupOptions: this.getAccrualModeOptions(),
				},
				...this.generateCommonFormFields(entity),
				{
					id: 'PostingNarrative',
					model: 'PostingNarrative',
					label: {
						key: this.commonTranslate + 'postingNarrative',
						text: 'Posting Narrative',
					},
					type: FieldType.Description,
					visible: true,
				},
				{
					id: 'Comment',
					model: 'Comment',
					label: {
						key: 'cloud.common.entityCommentText',
						text: 'Comment',
					},
					type: FieldType.Comment,
					visible: true,
				},
			],
		} as IFormConfig<FT>;
	}

	private showMessageGridDialog(accountValidations: IAccountValidationEntity[]) {
		const gridDialogData: IGridDialogOptions<IAccountValidationEntity> = {
			width: '40%',
			headerText: this.config.translateSource + 'title',
			windowClass: 'grid-dialog',
			gridConfig: {
				uuid: '0c998f31b5fb4957b80f1267ddfd56c5',
				columns: [
					{
						type: FieldType.Code,
						id: 'code',
						model: 'HeaderCode',
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode',
						},
						visible: true,
						sortable: true,
						width: 100,
					},
					{
						type: FieldType.Description,
						id: 'desc',
						model: 'HeaderDescription',
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription',
						},
						visible: true,
						sortable: true,
						width: 150,
					},
					{
						type: FieldType.Description,
						id: 'errorMsg',
						required: true,
						model: 'ErrorMsg',
						label: {
							text: 'Error Message',
							key: 'cloud.common.errorMessage',
						},
						visible: true,
						sortable: true,
						width: 400,
					},

				],
				idProperty: 'Id',
			},
			items: accountValidations,
			isReadOnly: true,
			selectedItems: [],
			resizeable: true,
		};
		this.gridDialogService.show(gridDialogData);
	}

	private showMessageBoxDialog(response: ICreateTransactionResponse) {
		let bodyText = this.translateService.instant(this.commonTranslate + 'noCompanyTransactionCreated').text;
		const successCount = response.SuccessCount;
		if (successCount > 0) {
			bodyText = successCount + ' ' + this.translateService.instant(this.commonTranslate + 'companyTransactionCreated').text;
		}
		const options: IMessageBoxOptions = {
			defaultButtonId: StandardDialogButtonId.Ok,
			iconClass: 'tlb-icons icon ico-info',
			id: 'showMessage',
			dontShowAgain: true,
			headerText: this.config.translateSource + 'title',
			bodyText: bodyText,
			buttons: [
				{
					caption: {key: this.commonTranslate + 'accountingJournals'},
					id: 'Navigation',
					iconClass: 'ico-goto',
					isVisible: successCount > 0,
					autoClose: true,
					fn: () => {
						if (!response.Transactions?.length) {
							return;
						}
						const companyTransHeaderIds = Array.from(
							new Set(
								response.Transactions.flatMap(t =>
									t.CompanyTransheaderFk ? [t.CompanyTransheaderFk] : []
								)
							),
							id => ({id})
						);

						this.platformModuleNavigationService.navigate({
							internalModuleName: 'basics.accountingjournals',
							entityIdentifications: companyTransHeaderIds,
						});
					}
				},
				{
					caption: {key: 'ui.common.dialog.okBtn'},
					id: StandardDialogButtonId.Ok,
					autoClose: true,
				},
			]
		};
		this.messageBoxService.showMsgBox(options);
	}
}
