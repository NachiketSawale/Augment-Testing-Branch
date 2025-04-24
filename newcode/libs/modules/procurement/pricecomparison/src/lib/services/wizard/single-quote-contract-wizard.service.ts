/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { Injectable } from '@angular/core';
import { IClosingDialogButtonEventInfo, IDialogButtonEventInfo } from '@libs/ui/common';
import { IDescriptionInfo, PlatformDateService, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { BasicsSharedBasCurrencyLookupService } from '@libs/basics/shared';
import { IRequisitionEntity, ProcurementShareQuoteLookupService } from '@libs/procurement/shared';
import { IReqVariantEntity } from '@libs/procurement/requisition';
import { IConHeaderEntity } from '@libs/procurement/interfaces';
import {
	CompareColumnCompositeSingleQuoteBaseResponse,
	CompareColumnCompositeSingleQuoteBoqResponse,
	CompareColumnCompositeSingleQuoteItemResponse,
	CreateContractMode,
	CustomCompareColumnComposite,
	EvaluatedItemHandleMode, ICreateContractDialogOptions,
	ReqHeaderComposite,
	ReqVariantInfo
} from '../../model/entities/wizard/custom-compare-column-composite.interface';
import { ProcurementPricecomparisonUtilService } from '../util.service';
import { CREATE_CONTRACT_WIZARD_VIEW_LOAD_OPTIONS_TOKEN, ProcurementPricecomparisonCreateContractWizardViewComponent } from '../../components/wizard/create-contract-wizard-view/create-contract-wizard-view.component';
import { IAsyncActionEditorDialog } from '../../model/entities/dialog/async-action-editor-dialog.interface';
import { ProcurementPricecomparisonCompareCommonDialogService } from '../compare-common-dialog.service';

export abstract class SingleQuoteContractWizardService<RT extends CompareColumnCompositeSingleQuoteBaseResponse = CompareColumnCompositeSingleQuoteBaseResponse> {
	protected readonly dateSvc = ServiceLocator.injector.get(PlatformDateService);
	protected readonly httpSvc = ServiceLocator.injector.get(PlatformHttpService);
	protected readonly utlSvc = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);
	protected readonly commonDlgSvc = ServiceLocator.injector.get(ProcurementPricecomparisonCompareCommonDialogService);
	protected readonly currencySvc = ServiceLocator.injector.get(BasicsSharedBasCurrencyLookupService);
	protected readonly quoteSvc = ServiceLocator.injector.get(ProcurementShareQuoteLookupService);

	protected constructor(private prepareDataUrl: string) {
	}

	protected isSingleReqHeader: boolean = false;
	protected selectedReqHeaderIds: number[] = [];
	protected readData!: RT;
	protected items: CustomCompareColumnComposite[] = [];
	protected allReqHeaders: Array<ReqHeaderComposite> = [];
	protected selectedReqHeaderId2ReqVariantIdsMap: Map<number, number[]> = new Map();
	protected reqHeaders: ReqHeaderComposite[] = [];


	protected abstract get wizardName(): string;

	protected abstract handleResponse(quoteBpId: number, normalReqHeaders: ReqHeaderComposite[]): void;

	private onLoadSucceeded(loaded: RT): CustomCompareColumnComposite[] {
		this.readData = loaded;

		this.reqHeaders = loaded.Main[0].ReqHeaders ? loaded.Main[0].ReqHeaders as ReqHeaderComposite[] : [];
		this.items = this.readData.Main.map<CustomCompareColumnComposite>((item) => {
			// add a checkbox, req-count, grand-total column to the data
			return {
				Id: item.Id.toString(),
				CompareColumnFk: item.QtnHeaderFk ? item.QtnHeaderFk.toString() : '',
				RfqHeaderId: item.RfqHeaderFk,
				QuoteHeaderId: item.Id,
				QtnHeaderFk: item.Id,
				BusinessPartnerId: item.BusinessPartnerFk,
				BusinessPartnerFk: item.BusinessPartnerFk,
				QuoteVersion: item.QuoteVersion,
				Description: item.Description ?? '',
				EvaluationResult: 0,
				BillingSchemaList: [],
				EvaluationList: [],
				IsHighlightChanges: false,
				IsDeviationRef: false,
				IsIdealBidder: false,
				IsCountInTarget: false,
				DescriptionInfo: {} as IDescriptionInfo,
				IsChecked: false,
				ReqCount: null,
				subTotal: this.utlSvc.getSubTotal(this.readData.Totals, item.Id),
				grandTotal: this.utlSvc.getGrandTotal(this.readData.Quote, this.readData.Totals, item.BusinessPartnerFk, item.QuoteVersion)
			};
		});

		this.allReqHeaders = [];
		const normalReqHeaders: ReqHeaderComposite[] = [];
		this.readData.Main.forEach((item) => {
			if (item.ReqHeaders) {
				normalReqHeaders.push(...(item.ReqHeaders as ReqHeaderComposite[]));
			}
		});

		// add an formatted date in lookup data
		this.readData.Quote = this.readData.Quote.map((item) => {
			item.DateQuotedFormatted = item.DateQuoted ? this.dateSvc.formatLocal(item.DateQuoted) : '';
			return item;
		});

		this.currencySvc.cache.setItems(this.readData.Currency);
		this.quoteSvc.cache.setItems(this.readData.Quote);

		const quoteBpId = this.readData.Quote.length > 0 && this.readData.Quote[0].BusinessPartnerFk ? this.readData.Quote[0].BusinessPartnerFk : -2;
		this.handleResponse(quoteBpId, normalReqHeaders);

		return this.items;
	}

	protected handleAllReqHeaders(
		quoteBpId: number,
		normalReqHeaders: ReqHeaderComposite[],
		predicate: (id: number, item: ReqHeaderComposite) => boolean,
		isAssigned: (variant: IReqVariantEntity, reqVariantInfo: ReqVariantInfo) => boolean,
		callbackFn: (item: ReqHeaderComposite) => void
	) {
		const reqVariantInfo = this.readData.RequisitionVariantInfo && this.readData.RequisitionVariantInfo.length > 0 ? this.readData.RequisitionVariantInfo[0] : null; // { ReqVariants: [], ReqItemVariants: [], ReqBoqVariants: [], RfqParialReqAssigneds: [] };

		normalReqHeaders.forEach((item) => {
			this.allReqHeaders.push(item);

			if (this.isSingleReqHeader) {
				const found = this.selectedReqHeaderIds.find((id) => {
					return predicate(id, item);
				});
				item.isChecked = !!found;
			} else {
				item.isChecked = true;
				this.addSelectedReqHeader(item);
			}

			if (reqVariantInfo && reqVariantInfo.ReqVariants && reqVariantInfo.ReqVariants.length > 0) {
				const variants = reqVariantInfo.ReqVariants.filter((variant) => {
					if (variant.ReqHeaderFk !== item.Id) {
						return false;
					}
					// the requisition defines variants and no partial requisition assigned is defined, show variants in the UI.
					if (!reqVariantInfo.RfqParialReqAssigneds ||
						reqVariantInfo.RfqParialReqAssigneds.length === 0 ||
						!reqVariantInfo.RfqParialReqAssigneds.some(e =>
							e.ReqHeaderFk === item.Id &&
							e.BpdBusinessPartnerFk === quoteBpId)) {
						return true;
					}

					// if there are items assigned to the variant, don't show it in UI.
					if (!isAssigned(variant, reqVariantInfo)) {
						return false;
					}

					// get variants assigned to rfq bidders
					const partials = reqVariantInfo.RfqParialReqAssigneds.filter(e =>
						e.ReqHeaderFk === item.Id &&
						e.BpdBusinessPartnerFk === quoteBpId &&
						e.ReqVariantFk === variant.Id);
					variant.isForPartialReqAssigned = partials.length > 0; // mark the variant is assigned to rfq bidder
					variant.isChecked = variant.isForPartialReqAssigned; // if variant is assigned to rfq bidder, it is always checked.

					// if there are items assigned to the variant, show it in UI.
					return variant.isForPartialReqAssigned;
				});

				// initialize variants
				variants.forEach((variant) => {
					const variantReq = _.cloneDeep(item);
					variantReq.Id = -variant.Id;
					variantReq.Code = variant.Code ?? '';
					variantReq.Description = variant.Description ?? '';
					variantReq.ReqHeaderFk = item.Id;
					variantReq.reqHeader = item;
					variantReq.isChecked = !!variant.isChecked;
					variantReq.isForPartialReqAssigned = variant.isForPartialReqAssigned;

					this.allReqHeaders.push(variantReq);
				});
			}

			callbackFn(item);
		});
	}

	/**
	 * AngularJS -> getQuote
	 */
	public getList() {
		return this.items;
	}

	public getReqHeaders() {
		return this.reqHeaders;
	}

	public getAllReqHeaders() {
		return this.allReqHeaders;
	}

	public getSelectedReqHeaderIds() {
		let list = this.selectedReqHeaderIds ? this.selectedReqHeaderIds.filter(e => e > 0) : [];
		if (this.selectedReqHeaderId2ReqVariantIdsMap.size) {
			list.push(...this.selectedReqHeaderId2ReqVariantIdsMap.keys());
			list = _.uniq(list);
		}
		return list;
	}

	public addSelectedReqHeader(value: IRequisitionEntity) {
		if (!value) {
			return;
		}
		if (value.Id > 0) { // value is reqHeader or co reqHeader
			if (!this.selectedReqHeaderIds.some(e => e === value.Id)) {
				this.selectedReqHeaderIds.push(value.Id);
			}
		} else if (value.Id < 0 && value.ReqHeaderFk && value.ReqHeaderFk > 0) { // value is reqVariant
			const selectedVariantIds = this.selectedReqHeaderId2ReqVariantIdsMap.get(value.ReqHeaderFk);
			if (selectedVariantIds) {
				if (!selectedVariantIds.some(e => e === value.Id)) {
					selectedVariantIds.push(value.Id);
				}
			} else {
				this.selectedReqHeaderId2ReqVariantIdsMap.set(value.ReqHeaderFk, [value.Id]);
			}
		}
	}

	private getSelectedReqHeaderId2ReqVariantIdsMap() {
		return this.selectedReqHeaderId2ReqVariantIdsMap;
	}

	public clearSelectedReqHeaderId2ReqVariantIdsMap() {
		this.selectedReqHeaderId2ReqVariantIdsMap.clear();
	}

	public updateSelectedReqHeaderIds(item: ReqHeaderComposite | ReqHeaderComposite[]) {
		if (_.isArray(item)) {
			_.forEach(item, (data) => {
				this.updateSelectedReqHeaderIds(data);
			});
		} else if (item) {
			if (_.isUndefined(item.Id)) {
				return;
			}
			const found = _.find(this.selectedReqHeaderIds, (id) => {
				return id === item.Id;
			});
			const childrenIds = _.map(item.Children, 'Id');
			// if the item is req or co req, and is set to not check
			if (!_.isUndefined(found) && found !== null && !item.isChecked) {
				// remove it from the selections
				this.selectedReqHeaderIds = _.filter(this.selectedReqHeaderIds, function (id) {
					return id !== found;
				});

				// loop through items' children
				_.forEach(item.Children, (child) => {
					if (child.Id > 0) { // if the child is a co req, set it to not check
						child.isChecked = false;
						// do the update actions deep into the child.
						this.updateSelectedReqHeaderIds(child);
					} else if (!child.isForPartialReqAssigned) { // if the child is a variant which is not assigned to a rfq bidder
						// TODO-DRIZZLE: To be checked.
						// set it to editable
						// platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: false}]);
					}
				});
				// remove the children ids from the selections
				this.selectedReqHeaderIds = _.difference(this.selectedReqHeaderIds, childrenIds);
			} else if ((_.isUndefined(found) || found === null) && item.isChecked && item.Id > 0) {
				this.addSelectedReqHeader(item);
				_.forEach(item.Children, (child) => {
					if (child.Id > 0) { // if the item is req or co req
						// set it to check
						child.isChecked = true;
						// do the update actions deep into the child.
						this.updateSelectedReqHeaderIds(child);
					} else if (!child.isForPartialReqAssigned) { // if the child is a variant which is not assigned to a rfq bidder
						// if the req header or co req header is checked, uncheck the specified variants
						child.isChecked = false;

						// TODO-DRIZZLE: To be checked.
						// set it to editable
						// platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
					}
				});
				// if req header or co req header is checked, remove the variants from the selections
				this.selectedReqHeaderId2ReqVariantIdsMap.delete(item.Id);
			}
			// note: if the item is a variant which is assigned to rfq bidder, don't put it to this.selectedReqHeaderId2ReqVariantIdsMap.
			if (item.Id < 0 && !item.isForPartialReqAssigned && item.reqHeader) { // if item is a variant which is not assigned to a rfq bidder
				const parentReqHeader = item.reqHeader;
				if (!item.isChecked && item.reqHeader.Children) { // if the variant is not checked
					// collect the selected variants
					const childrenSelected = item.reqHeader.Children.filter(e => {
						return e.isChecked;
					});

					if (childrenSelected && childrenSelected.length > 0) { // if there are variants selected, put them to the selections
						this.selectedReqHeaderId2ReqVariantIdsMap.set(parentReqHeader.Id, childrenSelected.map(e => -e.Id));
					} else { // if there are no variants selected,  remove the variants from the selections
						this.selectedReqHeaderId2ReqVariantIdsMap.delete(parentReqHeader.Id);
					}
				} else { // if variant is checked
					// add to the selections
					const selectedVariantIds = this.selectedReqHeaderId2ReqVariantIdsMap.get(parentReqHeader.Id);
					if (selectedVariantIds) {
						if (parentReqHeader.Children && (selectedVariantIds.length + 1 === parentReqHeader.Children.length)) {
							this.selectedReqHeaderId2ReqVariantIdsMap.delete(parentReqHeader.Id);
						} else {
							selectedVariantIds.push(-item.Id);
						}
					} else {
						this.selectedReqHeaderId2ReqVariantIdsMap.set(parentReqHeader.Id, [-item.Id]);
					}
				}
			}
		}
	}

	private getSelectedReqHeaderIdsCount() {
		return this.getSelectedReqHeaderIds().length;
	}

	public getSelectedReqTotal() {
		let total = 0;

		this.reqHeaders.forEach(reqHeader => {
			const children = _.filter(this.allReqHeaders, {ReqHeaderFk: reqHeader.Id});
			if (children && children.length > 0) {
				children.forEach(child => {
					if (child.Id > 0 && child.isChecked) {
						total += child.reqTotal ?? 0;
					}
				});
			}
			if (reqHeader.isChecked) {
				total += reqHeader.reqTotal ?? 0;
			}
		});

		return {
			total: total.toFixed(2),
			count: this.getSelectedReqHeaderIdsCount()
		};
	}

	public async load(quoteId: number, reqHeaderId?: number | null) {
		this.clearSelectedReqHeaderId2ReqVariantIdsMap();
		if (reqHeaderId) {
			this.isSingleReqHeader = true;
			this.selectedReqHeaderIds.push(reqHeaderId);
		}
		return this.onLoadSucceeded(await this.httpSvc.post<RT>(this.prepareDataUrl, {Id: quoteId}));
	}

	public async createContract(evaluatedItemHandleMode: EvaluatedItemHandleMode, createMode: CreateContractMode, showResultDialog: boolean = true) {
		const qtnHeaders = this.readData.Quote;
		const qtnHeaderId = qtnHeaders[0].Id;
		const qtnLength = qtnHeaders.length;
		const qtnHeaderIds = _.map(qtnHeaders, 'Id');
		const reqHeaderIds = this.getSelectedReqHeaderIds();
		const reqHeaderId2ReqVariantIdsMap = this.getSelectedReqHeaderId2ReqVariantIdsMap();

		const createEndpoint = createMode === CreateContractMode.Multiple ? 'createcontractsfromquote' : 'createmergecontractfromquote';

		if (qtnHeaderId > 0 && reqHeaderIds && reqHeaderIds.length > 0 && qtnLength === 1) {
			const contracts = await this.httpSvc.post<IConHeaderEntity[]>('procurement/contract/wizard/' + createEndpoint, {
				QtnHeaderId: qtnHeaderId,
				ReqHeaderIds: reqHeaderIds,
				Wizards: this.wizardName,
				IsFilterEvaluated: evaluatedItemHandleMode,
				AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
					ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
				} : null
			});
			if (showResultDialog) {
				await this.commonDlgSvc.showCreateContractResultDialog(contracts);
			}
			return contracts;
		} else if (reqHeaderIds && reqHeaderIds.length > 0 && qtnLength > 1) {
			const contract = await this.httpSvc.post<IConHeaderEntity>('procurement/contract/wizard/createmergecontractfromquotewithchangeorder', {
				QtnHeaderIds: qtnHeaderIds,
				HasChangeOrder: true,
				ReqHeaderIds: reqHeaderIds,
				Wizards: this.wizardName,
				AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
					ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
				} : null
			});
			if (showResultDialog) {
				await this.commonDlgSvc.showCreateContractResultDialog([contract]);
			}
			return [contract];
		} else {
			return Promise.resolve([]);
		}
	}

	public async showCreateContractWizardDialog(dialogOptions: ICreateContractDialogOptions) {
		return this.commonDlgSvc.showAsyncActionDialog<EvaluatedItemHandleMode, ProcurementPricecomparisonCreateContractWizardViewComponent>({
			headerText: 'procurement.pricecomparison.wizard.createContract',
			bodyComponent: ProcurementPricecomparisonCreateContractWizardViewComponent,
			defaultButton: {
				id: 'create',
				caption: {
					key: 'procurement.common.createBtn'
				},
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<EvaluatedItemHandleMode>, void>) => {
					await this.showOptionDialog(info.dialog.value as EvaluatedItemHandleMode);
				},
				isDisabled: (info: IDialogButtonEventInfo<IAsyncActionEditorDialog<EvaluatedItemHandleMode>, void>) => {
					return info.dialog.loading || this.getSelectedReqHeaderIds().length === 0;
				},
			},
			cancelButton: {
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<EvaluatedItemHandleMode>, void>) => {
					this.clearSelectedReqHeaderId2ReqVariantIdsMap();
				}
			},
			value: EvaluatedItemHandleMode.Takeover,
			provider: [{
				provide: CREATE_CONTRACT_WIZARD_VIEW_LOAD_OPTIONS_TOKEN,
				useValue: dialogOptions
			}]
		});
	}

	public async showOptionDialog(evaluatedItemHandleMode: EvaluatedItemHandleMode) {
		return this.commonDlgSvc.showOptionDialog(async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<CreateContractMode>, void>) => {
			info.dialog.loading = true;
			await this.createContract(evaluatedItemHandleMode, info.dialog.value as CreateContractMode);
			info.dialog.close(info.button.id);
		});
	}
}

@Injectable({
	providedIn: 'root'
})
/**
 * AngularJS -> procurementPriceComparisonOneQuoteContractMainService
 */
export class ProcurementPricecomparisonSingleQuoteContractWizardBoqService extends SingleQuoteContractWizardService<CompareColumnCompositeSingleQuoteBoqResponse> {
	protected constructor() {
		super('procurement/pricecomparison/comparecolumn/quotecontractboqs');
	}

	protected get wizardName(): string {
		return 'CreateContractFromBoq';
	}

	protected handleResponse(quoteBpId: number, normalReqHeaders: ReqHeaderComposite[]): void {
		const additionalList = this.readData.BoqRootItems2ReqHeader;
		this.handleAllReqHeaders(
			quoteBpId,
			normalReqHeaders,
			(id: number, item: ReqHeaderComposite) => id === item.Id,
			(variant: IReqVariantEntity, reqVariantInfo: ReqVariantInfo) => reqVariantInfo.ReqBoqVariants && reqVariantInfo.ReqBoqVariants.some(e => e.ReqVariantFk === variant.Id),
			(item: ReqHeaderComposite) => {
				let finalPrice = 0;
				if (additionalList.length === 0) {
					item.reqTotal = finalPrice;
					return;
				}

				const found = _.find(additionalList, {ReqHeaderId: item.Id});

				if (!found) {
					item.reqTotal = finalPrice;
					return;
				}

				_.forEach(found.BoqRootItems, (boq) => {
					finalPrice += boq.Finalprice;
				});

				item.reqTotal = finalPrice;
			}
		);
	}
}

@Injectable({
	providedIn: 'root'
})
/**
 * AngularJS -> procurementPriceComparisonOneQuoteContractMainService
 */
export class ProcurementPricecomparisonSingleQuoteContractWizardItemService extends SingleQuoteContractWizardService<CompareColumnCompositeSingleQuoteItemResponse> {
	protected constructor() {
		super('procurement/pricecomparison/comparecolumn/quotecontractitems');
	}

	protected get wizardName(): string {
		return 'CreateContractFromItem';
	}

	protected handleResponse(quoteBpId: number, normalReqHeaders: ReqHeaderComposite[]): void {
		this.handleAllReqHeaders(
			quoteBpId,
			normalReqHeaders,
			(id: number, item: ReqHeaderComposite) => id === item.Id || id === item.ReqHeaderFk,
			(variant: IReqVariantEntity, reqVariantInfo: ReqVariantInfo) => reqVariantInfo.ReqItemVariants && reqVariantInfo.ReqItemVariants.some(e => e.ReqVariantFk === variant.Id),
			(item: ReqHeaderComposite) => {
				let subtotal = 0;
				if (!item.PrcItems) {
					item.reqTotal = 0;
					return;
				}
				_.forEach(item.PrcItems, (prcItem) => {
					if (prcItem.ReplacementItems) {
						_.forEach(prcItem.ReplacementItems, (replaceItem) => {
							subtotal += replaceItem.Total;
						});
					} else {
						subtotal += prcItem.Total;
					}
				});
				item.reqTotal = subtotal;
			}
		);
	}
}