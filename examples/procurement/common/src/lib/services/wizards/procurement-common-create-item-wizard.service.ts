/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, OnDestroy } from '@angular/core';
import { INavigationInfo, PlatformHttpService, PlatformModuleNavigationService, PlatformTranslateService, PropertyType } from '@libs/platform/common';
import { createLookup, FieldType, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, IGridConfiguration, GridApiService, IFieldValueChangeInfo, IEditorDialogResult, IMessageBoxOptions, UiCommonMessageBoxService } from '@libs/ui/common';

import { ProjectSharedLookupService } from '@libs/project/shared';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { ProcurementInternalModule, ProcurementSharedRfqBusinesspartnerStatusLookupService, ProcurementShareRfqLookupService } from '@libs/procurement/shared';
import { ICreateQuoteEntity, IPrcRfqbiddersGroup, IQuoteItem, IQuoteResponse, ICreateItemOptions } from '@libs/procurement/interfaces';
import { Observable, of, Subject, takeUntil } from 'rxjs';

/**
 * Represent Procurement Common Create Item Wizard Service.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonCreateItemWizardService implements OnDestroy {
	/**
	 * To inject UiCommonFormDialogService
	 */
	private readonly formDialogService = inject(UiCommonFormDialogService);
	/**
	 * To inject PlatformTranslateService
	 */
	public readonly translateService = inject(PlatformTranslateService);
	/**
	 * To inject PlatformHttpService
	 */
	public readonly http = inject(PlatformHttpService);
	/**
	 * To inject GridApiService
	 */
	public readonly gridApiService = inject(GridApiService);
	/**
	 * To inject UiCommonMessageBoxService
	 */
	public readonly messageBoxService = inject(UiCommonMessageBoxService); /**
	 * To Injects PlatformModuleNavigationService
	 */
	private readonly platformModuleNavigationService = inject(PlatformModuleNavigationService);

	public readonlyBidders = false;
	public biddersGroup = false;
	public selectedBidders: IPrcRfqbiddersGroup[] = [];
	public selectedItems!: object[];
	public needCopyRfqTotals!: boolean;
	public isCreateByMaterials!: boolean;
	public isCreateByRfq!: boolean;
	public translatePrefix = 'procurement.rfq.wizard.create.quote.';
	public loading!: boolean;
	public isSelectedBidders: boolean = true;
	public destroy$ = new Subject<void>();

	/**
	 * Initialize createQuoteEntity
	 */
	public createQuoteEntity: ICreateQuoteEntity = {
		ProjectFk: null,
		RfqHeaderFk: null,
		Bidders: [],
		SupplierGroup: {
			PaymentFromSupplier: false,
			BusinessPartnerFk: null,
		},
	};

	/**
	 * Used to prepare data required in grid integration
	 */
	private createQuoteRequestedBiddersGridConfiguration: IGridConfiguration<IPrcRfqbiddersGroup> = {
		uuid: 'C19799E8307E4A1EB44FD32CEFE29D35',
		skipPermissionCheck: true,
		showColumnSearchPanel: false,
		idProperty: 'BusinessPartnerFk',
		columns: [
			{
				id: 'Selected',
				label: {
					key: 'cloud.common.entitySelected',
					text: 'Selected',
				},
				model: 'Selected',
				type: FieldType.Boolean,
				headerChkbox: true,
				width: 100,
				sortable: false,
				change: (changeInfo: IFieldValueChangeInfo<IPrcRfqbiddersGroup, PropertyType>) => {
					const isChecked = changeInfo.newValue;
					const bidderId = changeInfo.entity?.Id;
					this.createQuoteEntity.Bidders.forEach((bidder) => {
						if (bidder.Id === bidderId) {
							bidder.Selected = !!isChecked;
						}
					});
				},
			},
			{
				id: 'CopiedPrice',
				label: {
					key: 'cloud.common.updateWithQuoteData',
					text: 'Update With Quote Data',
				},
				model: 'UpdateWithQuoteData',
				type: FieldType.Boolean,
				headerChkbox: true,
				sortable: false,
				visible: true,
				width: 100,
			},
			{
				id: 'paymentFromSupplierPerBid',
				label: {
					key: 'procurement.common.UseSupplierPaymentTerm',
					text: 'Payment From Supplier Per Bid',
				},
				model: 'PaymentFromSupplierPerBid',
				type: FieldType.Boolean,
				headerChkbox: true,
				sortable: false,
				visible: true,
				width: 100,
			},
			{
				id: 'updateWithReqData',
				label: {
					key: 'procurement.common.copyRateFromRequisition',
					text: 'Copy rate from Requisition',
				},
				model: 'UpdateWithReqData',
				type: FieldType.Boolean,
				headerChkbox: true,
				width: 100,
				sortable: false,
				visible: true,
			},
			{
				id: 'bpStatus',
				label: {
					key: 'cloud.common.entityStatus',
					text: 'Status',
				},
				model: 'RfqBusinesspartnerStatusFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementSharedRfqBusinesspartnerStatusLookupService,
					displayMember: 'Description',
				}),
				width: 100,
				sortable: false,
				visible: true,
			},
			{
				id: 'bpName',
				label: {
					key: 'businesspartner.main.name1',
					text: 'Name',
				},
				type: FieldType.Lookup,
				model: 'BusinessPartnerFk',
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
				}),
				width: 180,
				sortable: false,
				visible: true,
			},
			{
				id: 'desc',
				label: {
					key: 'cloud.common.entityAddress',
					text: 'Address',
				},
				model: 'SubsidiaryFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					displayMember: 'Address',
				}),
				width: 230,
				sortable: false,
				visible: true,
			},
			{
				id: 'version',
				label: {
					key: 'procurement.quote.headerVersion',
					text: 'version',
				},
				model: 'QuoteVersion',
				type: FieldType.Integer,
				sortable: false,
				visible: true,
				width: 60,
			},
		],
	};

	/**
	 * Used to prepare data used in form configuration
	 */
	public createQuoteFormConfig: IFormConfig<ICreateQuoteEntity> = {
		formId: 'headerCreateDialog',
		showGrouping: true,
		groups: [
			{
				groupId: 1,
				header: { text: 'Basic Data', key: 'cloud.common.entityProperties' },
				visible: true,
				open: true,
				sortOrder: 1,
			},
			{
				groupId: 2,
				header: { text: 'requested Bidders', key: 'procurement.rfq.sidebar.requestedBidders' },
				visible: true,
				open: true,
				sortOrder: 2,
			},
			{
				groupId: 3,
				header: { text: 'Find Business Partner', key: 'procurement.quote.headerBusinessPartnerGroup' },
				visible: true,
				open: true,
				sortOrder: 3,
			},
		],
		rows: [
			{
				groupId: 1,
				id: 'ProjectFk',
				label: {
					text: 'Project No.',
					key: 'cloud.common.entityProjectNo',
				},
				model: 'ProjectFk',
				readonly: this.isCreateByRfq,
				visible: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					showClearButton: true,
					descriptionMember: 'ProjectName',
				}),
			},
			{
				groupId: 1,
				id: 'RfqHeaderFk',
				label: {
					text: 'RfQ Header',
					key: 'procurement.quote.headerRfqHeaderCode',
				},
				model: 'RfqHeaderFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareRfqLookupService,
					descriptionMember: 'Description',
					showDescription: true,
				}),
				change: (changeInfo) => {
					let rfqHeaderFkValue: number | null | undefined;
					if (changeInfo.newValue !== undefined && changeInfo.newValue !== null) {
						rfqHeaderFkValue = isNaN(Number(changeInfo.newValue)) ? null : Number(changeInfo.newValue);
					} else {
						rfqHeaderFkValue = null;
					}

					this.createQuoteEntity.RfqHeaderFk = rfqHeaderFkValue;

					this.updateBidders$(this.createQuoteEntity)
						.pipe(takeUntil(this.destroy$))
						.subscribe({
							next: (bidders) => this.bindBiddersToGrid(bidders),
							error: (err) => console.error('Error fetching bidders:', err),
						});
				},
				readonly: this.isCreateByRfq,
			},
			{
				groupId: 2,
				id: 'requestedBidders',
				type: FieldType.Grid,
				configuration: this.createQuoteRequestedBiddersGridConfiguration as IGridConfiguration<object>,
				model: 'requestedBidders',
				required: true,
			},
			{
				groupId: 3,
				id: 'BusinessPartnerFk',
				label: {
					text: 'Business Partner',
					key: 'businesspartner.certificate.businessPartner',
				},
				model: 'BusinessPartnerFk',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1',
				}),
			},
			{
				groupId: 3,
				id: 'payementTerm',
				label: {
					text: 'Use Supplier Payment Term',
					key: 'procurement.quote.UseSupplierPaymentTerm',
				},
				readonly: false,
				type: FieldType.Boolean,
				model: 'PaymentFromSupplier',
			},
		],
	};

	/**
	 * Method is used to hit API according to the  currItem RfqHeaderFk
	 * @param {ICreateQuoteEntity} currItem
	 * @returns Observable<IPrcRfqbiddersGroup[]>
	 */
	private updateBidders$(currItem: ICreateQuoteEntity): Observable<IPrcRfqbiddersGroup[]> {
		return currItem.RfqHeaderFk ? this.http.post$<IPrcRfqbiddersGroup[]>('procurement/quote/header/bidders', { Value: currItem.RfqHeaderFk }) : of([]);
	}

	/**
	 * Method represent the craete item for RFQ and Quote module.
	 * @param {Function} fillSelectedItem
	 * @param {Function} onCreateSucceeded
	 * @param {boolean} needCopyRfqTotals
	 * @param {boolean} isCreateByMaterials
	 * @param {boolean} hasContractItem
	 * @param  {boolean} isCreateByRfq
	 * @param {string} uuid
	 * @returns Promise<IEditorDialogResult<ICreateQuoteEntity>>
	 */
	public async createItem(
		options: ICreateItemOptions
	): Promise<IEditorDialogResult<ICreateQuoteEntity>> {
		const quoteItem: IQuoteItem = {} as IQuoteItem;
		options.fillSelectedItem(quoteItem);
		this.createQuoteEntity.ProjectFk = quoteItem.ProjectFk ?? null;
		this.createQuoteEntity.RfqHeaderFk = quoteItem.RfqHeaderFk ?? null;
		this.isCreateByRfq = options.isCreateByRfq;
		this.needCopyRfqTotals = options.needCopyRfqTotals;
		this.isCreateByMaterials = options.isCreateByMaterials;

		if (this.createQuoteEntity.RfqHeaderFk) {
			this.updateBidders$(this.createQuoteEntity)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (bidders) => this.bindBiddersToGrid(bidders),
					error: (err) => console.error('Error fetching bidders:', err),
				});
		}

		const result = await this.formDialogService.showDialog<ICreateQuoteEntity>({
			id: '',
			headerText: this.translateService.instant('procurement.quote.headerCreateDialog').text,
			formConfiguration: this.createQuoteFormConfig,
			entity: this.createQuoteEntity,
			buttons: [
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'cloud.common.ok' },
					isDisabled: (info) => {
						return !info.dialog.value?.Bidders.some((bidder) => bidder.Selected);
					},
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'ui.common.dialog.cancelBtn' },
					autoClose: true,
				},
			],
		});

		if (result?.closingButtonId === StandardDialogButtonId.Ok) {
			this.okButtonDialog(result);
		}
		return result as IEditorDialogResult<ICreateQuoteEntity>;
	}

	/**
	 * Binds fetched bidders to the grid.
	 * @param {IPrcRfqbiddersGroup[]} bidders
	 */
	private bindBiddersToGrid(bidders: IPrcRfqbiddersGroup[]): void {
		this.createQuoteEntity.Bidders = bidders;
		const gridService = this.gridApiService.get('C19799E8307E4A1EB44FD32CEFE29D35');
		gridService.items = bidders;
	}

	/**
	 * okButtonDialog method work to create quote wizard process dialog
	 * @param {IEditorDialogResult<ICreateQuoteEntity>} result
	 */
	public okButtonDialog(result: IEditorDialogResult<ICreateQuoteEntity>): void {
		this.loading = true;
		this.selectedBidders = result.value?.Bidders.filter((bidder) => bidder.Selected == true) ?? [];
		if (result) {
			if (this.createQuoteEntity) {
				this.selectedItems = this.selectedBidders.map((bidder) => ({
					Code: 'IsGenerated',
					BusinessPartnerFk: bidder.BusinessPartnerFk,
					ProjectFk: this.createQuoteEntity.ProjectFk,
					RfqHeaderFk: this.createQuoteEntity.RfqHeaderFk,
					UpdateWithQuoteData: bidder.UpdateWithQuoteData || false,
					UpdateWithReqData: bidder.UpdateWithReqData || false,
					PaymentFromSupplier: bidder.PaymentFromSupplierPerBid || false,
				}));

				if (result.value?.SupplierGroup.BusinessPartnerFk) {
					const selectedBidder = this.selectedBidders.find((bp) => bp.BusinessPartnerFk === result.value?.SupplierGroup.BusinessPartnerFk);
					if (!selectedBidder) {
						this.selectedItems = this.selectedBidders.map(() => ({
							Code: 'IsGenerated',
							BusinessPartnerFk: result.value?.SupplierGroup.BusinessPartnerFk,
							ProjectFk: this.createQuoteEntity.ProjectFk,
							RfqHeaderFk: this.createQuoteEntity.RfqHeaderFk,
							PaymentFromSupplier: this.createQuoteEntity.SupplierGroup.PaymentFromSupplier || false,
							SubsidiaryFk: result.value?.Bidders[0].SubsidiaryFk,
						}));
					}
				}
			}
			if (this.needCopyRfqTotals) {
				this.createData(this.selectedItems)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
						next: (result: IQuoteResponse[]) => {
							const newCode = result.map((r) => r.QuoteHeader.Code).join(', ');
							const message = this.translateService.instant(this.translatePrefix + 'successful').text + this.translateService.instant(this.translatePrefix + 'newCode', { newCode: newCode }).text;
							const successMessage = message;
							const entityIds = result.map((r) => r.QuoteHeader.Id);
							this.showCreationSuccessDialog(successMessage, entityIds);
							this.loading = false;
						},
						error: (err) => {
							this.loading = false;
							throw new Error(err);
						},
					});
			}
		}
		this.createQuoteEntity = {
			ProjectFk: null,
			RfqHeaderFk: null,
			Bidders: [],
			SupplierGroup: {
				PaymentFromSupplier: false,
				BusinessPartnerFk: null,
			},
		};
	}
	/**
	 * Makes an API call to retrieve the result of quote creation.
	 * @param selectedItems The data to be sent in the POST request body.
	 * @returns { Observable<IQuoteResponse[]>} An Observable of the HTTP response containing the quote creation result
	 */
	public createData(selectedItems: object[]): Observable<IQuoteResponse[]> {
		const apiUrl = 'procurement/quote/header/createviawizard';
		return this.http.post$(apiUrl, selectedItems);
	}

	/**
	 * To display success dialog after quote created
	 * @param {string} successMessage
	 * @param {number[]} entityIds
	 */
	public showCreationSuccessDialog(successMessage: string, entityIds: number[]): void {
		const navigateTitle = 'Go To Quote';
		const buttons = [
			{ id: 'gotoType', caption: { text: navigateTitle }, fn: () => this.goToModule(entityIds), autoClose: true },
			{ id: StandardDialogButtonId.Cancel, caption: { key: 'cloud.common.close' }, autoClose: true },
		];
		const msgOptions: IMessageBoxOptions = {
			headerText: this.translateService.instant(this.translatePrefix + 'title').text,
			topDescription: { text: successMessage, iconClass: 'tlb-icons ico-info ' },
			buttons: buttons,
		};
		this.messageBoxService.showMsgBox(msgOptions);
	}

	/**
	 * goToModule represent navigation to quote module
	 * @param {number[]} entityIds
	 */
	public goToModule(entityIds: number[]): void {
		const moduleName = ProcurementInternalModule.Quote;

		if (!entityIds.length) {
			return;
		}
		const entityIdentifications = entityIds.map((id) => ({ id }));
		const navigator: INavigationInfo = {
			internalModuleName: moduleName,
			entityIdentifications: entityIdentifications,
		};

		this.platformModuleNavigationService.navigate(navigator);
	}

	/**
	 * cleanup Method
	 */
	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
