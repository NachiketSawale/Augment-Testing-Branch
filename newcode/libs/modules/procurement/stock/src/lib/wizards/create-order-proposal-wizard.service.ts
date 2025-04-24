/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import {
	createLookup,
	FieldType,
	IFormDialogConfig,
	ILookupContext, FormStep,
	IYesNoDialogOptions,
	ServerSideFilterValueType,
	StandardDialogButtonId,
	UiCommonFormDialogService,
	UiCommonMessageBoxService,
	UiCommonMultistepDialogService, MultistepDialog,
	IFormConfig
} from '@libs/ui/common';
import { ProcurementStockTotalDataService } from '../services/procurement-stock-total-data.service';
import { IStockTotalVEntity } from '../model';
import { IStockOrderProposalEntityGenerated } from '../model/entities/stock-order-proposal-entity-generated.interface';
import { BasicsSharedClerkLookupService, BasicsSharedProcurementConfigurationLookupService, Rubric} from '@libs/basics/shared';
import { IBasicsClerkEntity, IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { ProcurementPackageLookupService } from '@libs/procurement/shared';
import { BusinessPartnerLookupService, BusinesspartnerSharedContactLookupService, BusinesspartnerSharedSubsidiaryLookupService, BusinesspartnerSharedSupplierLookupService } from '@libs/businesspartner/shared';
import { IContactLookupEntity, ISubsidiaryLookupEntity, ISupplierLookupEntity } from '@libs/businesspartner/interfaces';
import { groupBy } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class ProcurementStockCreateOrderProposalWizardService {
	private readonly translate = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly multiStepService = inject(UiCommonMultistepDialogService);
	private readonly http = inject(PlatformHttpService);
	private readonly stockTotalService = inject(ProcurementStockTotalDataService);

	public async onStartWizard() {
		const stockTotals = this.stockTotalService.getSelection();
		if (!await this.validateStockTotalSelection(stockTotals)) {
			return;
		}
		const stock2mats = stockTotals.filter(s => s.Stock2matId);
		if (stock2mats.length < stockTotals.length) {
			const options: IYesNoDialogOptions = {
				defaultButtonId: StandardDialogButtonId.Yes,
				id: 'YesNoStockTotal',
				dontShowAgain: false,
				showCancelButton: false,
				headerText: {key: 'procurement.stock.wizard.createOrderProposal.caption'},
				bodyText: this.translate.instant('procurement.stock.wizard.createOrderProposal.notYetHaveStockMessage', {number: stockTotals.length - stock2mats.length}).text,
			} as IYesNoDialogOptions;
			const result = await this.messageBoxService.showYesNoDialog(options);
			if (result && result.closingButtonId === StandardDialogButtonId.Yes) {
				this.openCreateOrderProposalDialog(stock2mats);
			}
		} else {
			this.openCreateOrderProposalDialog(stock2mats);
		}
	}

	private async validateStockTotalSelection(stockTotals: IStockTotalVEntity[] | undefined) {
		if (!stockTotals || stockTotals.length < 1) {
			await this.showInfoMsgBox('procurement.stock.wizard.createOrderProposal.selectStockTotalMessage');
			return false;
		}
		const hasNoCurrentCompany = stockTotals.filter(s => !s.IsCurrentCompany).length > 0;
		if (hasNoCurrentCompany) {
			await this.showInfoMsgBox('procurement.stock.wizard.notBelongToLoginCompanyMessage');
			return false;
		}
		const stock2mats = stockTotals.filter(s => s.Stock2matId);
		if (stock2mats.length < 1) {
			await this.showInfoMsgBox('procurement.stock.wizard.createOrderProposal.selectStockTotalMessage');
			return false;
		}
		return true;
	}

	private async saveOrderProposal(entities: IStockOrderProposalEntityGenerated[]){
		await this.http.post<IStockOrderProposalEntityGenerated[]>('procurement/stock/orderproposal/saveitems', entities);
		await this.stockTotalService.refreshAllLoaded();
	}

	private async openCreateOrderProposalDialog(stockTotals: IStockTotalVEntity[]) {
		const stock2matIds = Array.from(new Set(stockTotals.map(s => s.Stock2matId)));
		const stockOrderProposals = await this.http.post<IStockOrderProposalEntityGenerated[]>('procurement/stock/orderproposal/getitems', stock2matIds);
		if (stockOrderProposals.length === 1) {
			const dialogResult = await this.formDialogService.showDialog(this.getFormConfig(stockOrderProposals[0]));
			if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
				this.saveOrderProposal([dialogResult.value as IStockOrderProposalEntityGenerated]);
			}
		} else {
			const title = this.translate.instant('procurement.stock.wizard.createOrderProposal.caption').text;
			const wizardStepTitle = this.translate.instant('procurement.stock.wizard.createOrderProposal.wizardStepTitle').text;
			const noStockMaterials = stock2matIds.filter(s => !stockOrderProposals.some(o => o.PrjStock2MdcMaterialFk === s));
			// Map over stock order proposals to create wizard steps
			const wizardSteps = stockOrderProposals.map((item, index) => {
				const stockTotal = stockTotals.find((s) => s.Stock2matId === item.PrjStock2MdcMaterialFk);
				const stepTitle = ` ${wizardStepTitle} "${stockTotal ? `${stockTotal.CatalogCode} ${stockTotal.CatalogDescription}` : ''}"`;
				if ((!item.PrjStock2MdcMaterialFk || item.PrjStock2MdcMaterialFk === 0) && noStockMaterials.length) {
					item.PrjStock2MdcMaterialFk = noStockMaterials.shift() as number; // Use shift to get the first element
				}
				item.IsFrameworkAgreement = this.checkFrameworkAgreement(stockTotals, item.PrjStock2MdcMaterialFk) && item.IsFrameworkAgreement;
				return new FormStep(item.Id.toString(), stepTitle, this.getFormConfig(item).formConfiguration as IFormConfig<IStockOrderProposalEntityGenerated>, index.toString());
			});
			const multistepDialog = new MultistepDialog(stockOrderProposals, wizardSteps, title);
			multistepDialog.dialogOptions.buttons = [
				{
					id: 'previousStep',
					caption: { key: 'cloud.common.previousStep' },
					isVisible: (info) => info.dialog.value?.stepIndex !== 0,
					fn: (event, info) => info.dialog.value?.goToPrevious(),
				},
				{
					id: 'nextBtn',
					caption: { key: 'basics.common.button.nextStep' },
					isDisabled: (info) => info.dialog.value?.stepIndex === stock2matIds.length - 1,
					fn: (event, info) => info.dialog.value?.goToNext(),
				},
				{
					id: StandardDialogButtonId.Ok,
					caption: { key: 'basics.common.button.ok' },
					autoClose: true,
				},
				{
					id: StandardDialogButtonId.Cancel,
					caption: { key: 'basics.common.button.cancel' },
					autoClose: true,
				},
			];
			const dialogResult = await this.multiStepService.showDialog(multistepDialog);
			if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
				this.saveOrderProposal(dialogResult.value as IStockOrderProposalEntityGenerated[]);
			}
		}
	}

	/**
	* This code checks if a specific stock material ID belongs exclusively to one catalog code.
	*/
	private checkFrameworkAgreement(stockTotals: IStockTotalVEntity[], stock2matId: number): boolean {
		const catalogGroups = groupBy(stockTotals, 'CatalogCode');

		return Object.values(catalogGroups).some(stock2mats => {
			const { Stock2matId } = stock2mats[0];
			return Stock2matId === stock2matId && stock2mats.length <= 1;
		});
	}

	private getFormConfig(initialData: IStockOrderProposalEntityGenerated): IFormDialogConfig<IStockOrderProposalEntityGenerated> {
		return {
			id: 'procurement-stock-create-order-proposal',
			headerText: {
				key: 'procurement.stock.wizard.createOrderProposal.caption',
			},
			formConfiguration: {
				formId: 'stock-create-order-proposal-form',
				showGrouping: true,
				groups: [
					{groupId: 'baseGroup', header: {key: 'cloud.common.entityProperties'}, open: true},
					{groupId: 'businessPartnerGroup', header: {key: 'cloud.desktop.moduleDisplayNameBusinessPartner'}, open: true},
				],
				rows: [
					{
						groupId: 'baseGroup',
						id: 'prcConfigurationFk',
						model: 'PrcConfigurationFk',
						label: {
							key: 'procurement.orderproposals.header.ContractConfiguration',
							text: 'Contract Configuration'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
							serverSideFilter: {
								key: 'prc-con-configuration-filter',
								execute: () => {
									return {
										RubricFk: Rubric.Contract,
									};
								},
							}
						})
					},
					{
						groupId: 'baseGroup',
						id: 'prcConfigurationReqFk',
						model: 'PrcConfigurationReqFk',
						label: {
							key: 'procurement.orderproposals.header.ReqConfiguration',
							text: 'Requisition Configuration'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
							serverSideFilter: {
								key: 'prc-req-configuration-filter',
								execute: () => {
									return {
										RubricFk: Rubric.Requisition,
									};
								},
							}
						}),
					},
					{
						groupId: 'baseGroup',
						id: 'basClerkPrcFk',
						label: {
							key: 'cloud.common.entityResponsible',
							text: 'Responsible'
						},
						model: 'BasClerkPrcFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup<IStockOrderProposalEntityGenerated, IBasicsClerkEntity>({
							dataServiceToken: BasicsSharedClerkLookupService,
							showClearButton: true,
							showDescription: true,
							descriptionMember: 'Description'
						})
					},
					{
						groupId: 'baseGroup',
						id: 'basClerkReqFk',
						model: 'BasClerkReqFk',
						label: {
							key: 'cloud.common.entityRequisitionOwner',
							text: 'Requisition Owner'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup<IStockOrderProposalEntityGenerated, IBasicsClerkEntity>({
							dataServiceToken: BasicsSharedClerkLookupService,
							showClearButton: true,
							showDescription: true,
							descriptionMember: 'Description'
						})
					},
					{
						groupId: 'baseGroup',
						id: 'prcPackageFk',
						label: {
							key: 'cloud.common.entityPackageDescription',
							text: 'Package'
						},
						model: 'PrcPackageFk',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: ProcurementPackageLookupService,
							showDescription: true,
							descriptionMember: 'Description',
							serverSideFilter: {
								key: 'prc-con-package-filter-for-order-proposal',
								execute(context: ILookupContext<IProcurementPackageLookupEntity, IStockOrderProposalEntityGenerated>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
									return {ProjectFk: context.entity?.ProjectFk ?? null};
								},
							},
						})
					},
					{
						groupId: 'baseGroup',
						id: 'description',
						model: 'Description',
						label: {
							key: 'cloud.common.entityDescription',
							text: 'Description'
						},
						type: FieldType.Description
					},
					{
						groupId: 'baseGroup',
						id: 'isSuffixes',
						model: 'IsSuffixes',
						label: {
							key: 'procurement.stock.wizard.createOrderProposal.suffixesDescription',
							text: 'Suffixes Material Description'
						},
						type: FieldType.Boolean
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'bpdBusinessPartnerFk',
						model: 'BpdBusinessPartnerFk',
						label: {
							key: 'cloud.common.entityBusinessPartner',
							text: 'Business Partner'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BusinessPartnerLookupService
						}),
						readonly: initialData.IsFrameworkAgreement === true,
						//validator: () => {return null;}
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'bpdSubsidiaryFk',
						model: 'BpdSubsidiaryFk',
						label: {
							key: 'cloud.common.entitySubsidiary',
							text: 'Subsidiary'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
							showClearButton: true,
							serverSideFilter: {
								key: 'create-order-proposal-subsidiary-filter',
								execute(context: ILookupContext<ISubsidiaryLookupEntity, IStockOrderProposalEntityGenerated>) {
									return {
										BusinessPartnerFk: context.entity ? context.entity.BpdBusinessPartnerFk : null,
										SupplierFk: context.entity ? context.entity.BpdSupplierFk : null
									};
								}
							}
						})
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'bpdSupplierFk',
						model: 'BpdSupplierFk',
						label: {
							key: 'cloud.common.entitySupplierDescription',
							text: 'Supplier'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BusinesspartnerSharedSupplierLookupService,
							showClearButton: true,
							serverSideFilter: {
								key: 'create-order-proposal-supplier-filter',
								execute(context: ILookupContext<ISupplierLookupEntity, IStockOrderProposalEntityGenerated>) {
									return {
										BusinessPartnerFk: context.entity ? context.entity.BpdBusinessPartnerFk : null,
										SubsidiaryFk: context.entity ? context.entity.BpdSubsidiaryFk : null
									};
								}
							}
						})
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'bpdContactFk',
						model: 'BpdContactFk',
						label: {
							key: 'procurement.contract.ConHeaderContact',
							text: 'Contact'
						},
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BusinesspartnerSharedContactLookupService,
							showClearButton: true,
							serverSideFilter: {
								key: 'prc-con-contact-filter-for-order-proposal',
								execute(context: ILookupContext<IContactLookupEntity, IStockOrderProposalEntityGenerated>) {
									return {
										BusinessPartnerFk: context.entity ? context.entity.BpdBusinessPartnerFk : null,
										SubsidiaryFk: context.entity ? context.entity.BpdSubsidiaryFk : null
									};
								}
							}
						})
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'isLive',
						model: 'IsLive',
						label: {
							key: 'cloud.common.entityIsLive',
							text: 'IsLive'
						},
						type: FieldType.Boolean
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'leadTime',
						model: 'LeadTime',
						label: {
							key: 'procurement.orderproposals.header.LeadTime',
							text: 'Lead Time'
						},
						type: FieldType.Quantity
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'tolerance',
						model: 'Tolerance',
						label: {
							key: 'procurement.orderproposals.header.Tolerance',
							text: 'Tolerance'
						},
						type: FieldType.Quantity
					},
					{
						groupId: 'businessPartnerGroup',
						id: 'log',
						model: 'Log',
						label: {
							key: 'procurement.orderproposals.header.Log',
							text: 'Log'
						},
						type: FieldType.Comment
					}
				],
			},
			entity: initialData
		};
	}

	private async showInfoMsgBox(bodyText: string) {
		await this.messageBoxService.showMsgBox(bodyText, 'procurement.stock.wizard.createOrderProposal.caption', 'ico-info');
	}
}