/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { IClosingDialogButtonEventInfo, IDialogButtonEventInfo } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { PlatformDateService, PlatformHttpService } from '@libs/platform/common';
import { IQuoteRequisitionEntity } from '@libs/procurement/quote';
import { IRequisitionEntity } from '@libs/procurement/shared';
import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { ICustomCompareColumnEntity } from '../../model/entities/custom-compare-column-entity.interface';
import { CompareTypes } from '../../model/enums/compare.types.enum';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../rfq-header-data.service';
import { ProcurementPricecomparisonBidderIdentityService } from '../bidder-identity.service';
import { ProcurementPricecomparisonUtilService } from '../util.service';
import {
	CompareColumnCompositeResponse,
	CreateContractMode,
	CustomCompareColumnComposite,
	EvaluatedItemHandleMode, ICreateContractDialogOptions,
	ICreateContractShowContractsDialogContext,
	ReqHeaderComposite,
	ReqVariantInfo
} from '../../model/entities/wizard/custom-compare-column-composite.interface';
import { ProcurementPricecomparisonCompareCommonDialogService } from '../compare-common-dialog.service';
import { ProcurementPricecomparisonCreateContractWizardContractViewComponent } from '../../components/wizard/create-contract-wizard-contract-view/create-contract-wizard-contract-view.component';
import { IAsyncActionEditorDialog } from '../../model/entities/dialog/async-action-editor-dialog.interface';
import { CREATE_CONTRACT_WIZARD_VIEW_LOAD_OPTIONS_TOKEN, ProcurementPricecomparisonCreateContractWizardViewComponent } from '../../components/wizard/create-contract-wizard-view/create-contract-wizard-view.component';

@Injectable({
	providedIn: 'root'
})
/**
 * AngularJS -> procurementPriceComparisonCreateContractWizardGridService
 */
export class ProcurementPricecomparisonContractWizardService {
	private readonly httpSvc = inject(PlatformHttpService);
	private readonly dateSvc = inject(PlatformDateService);
	private readonly rfqSvc = inject(ProcurementPricecomparisonRfqHeaderDataService);
	private readonly bidderSvc = inject(ProcurementPricecomparisonBidderIdentityService);
	private readonly utilSvc = inject(ProcurementPricecomparisonUtilService);
	private readonly commonDlgSvc = inject(ProcurementPricecomparisonCompareCommonDialogService);

	private selectedQuote?: ICustomCompareColumnEntity;
	private allReqHeaders: Array<ReqHeaderComposite> = [];
	private allQuoteRequisition: IQuoteRequisitionEntity[] = [];
	private reqVariantInfo: ReqVariantInfo | null = null;
	private selectedReqHeaderIds: number[] = [];
	private selectedReqHeaderId2ReqVariantIdsMap: Map<number, number[]> = new Map();
	private items: CustomCompareColumnComposite[] = [];
	private selectedQuoteContracts: IConHeaderEntity[] = [];

	private provideLoadPayload(): object {
		return {
			rfqHeaderFk: this.rfqSvc.getSelectedRfqId(),
			compareType: CompareTypes.Both
		};
	}

	private handleAllReqHeaders(allReqHeaders: ReqHeaderComposite[]) {
		allReqHeaders.forEach((parent) => {
			let isChecked = false;
			let hasPartialReqAssigned = false;
			parent.Children = allReqHeaders.filter((item) => {
				if (item.ReqHeaderFk === parent.Id) {
					if (!item.isChecked && parent.isChecked && item.Id > 0) { // if parent is checked, then co reqHeader should be checked
						if (item.Id > 0) {
							item.isChecked = true;
							this.addSelectedReqHeader(item);
						}
					}

					if (item.isForPartialReqAssigned) {
						hasPartialReqAssigned = true;
					}
				}
				return item.ReqHeaderFk === parent.Id;
			});

			// if there are no variants which are assigned to rfq bidders, judge whether the parent need to check or not according to the co reqheader is checked or not.
			if (!hasPartialReqAssigned) {
				isChecked = parent.Children && parent.Children.length > 0 ?
					parent.Children.filter(e => e.Id > 0).some(e => e.isChecked) : false;
			}
			if (isChecked && !parent.isChecked) {
				parent.isChecked = isChecked;
				this.addSelectedReqHeader(parent);
			}
		});

		const result = allReqHeaders.filter((item) => {
			return !item.ReqHeaderFk;
		});

		result.forEach((base) => {
			base.Children?.forEach((child) => {
				if (base.isChecked && child.Id < 0) { // if the base is req header, the variant should be readonly
					// TODO-DRIZZLE: To be checked.
					// platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
				}
				if (child.isForPartialReqAssigned) { // if the child is variant which is assigned to rfq bidders, then it should be readonly
					// TODO-DRIZZLE: To be checked.
					// platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
				}
				if (child.Children && child.Children.length > 0) { // if the child is co req header
					_.forEach(child.Children, function (variant) {
						if (child.isChecked && variant.Id < 0) { // if the base is co (change order) req header, the variant should be readonly
							// TODO-DRIZZLE: To be checked.
							// platformRuntimeDataService.readonly(variant, [{field: 'isChecked', readonly: true}]);
						}
						if (variant.isForPartialReqAssigned) { // if the child is variant which is assigned to rfq bidders, then it should be readonly
							// TODO-DRIZZLE: To be checked.
							// platformRuntimeDataService.readonly(variant, [{field: 'isChecked', readonly: true}]);
						}
					});
				}
			});
		});

		return result;
	}

	public onLoadSucceeded(loaded: CompareColumnCompositeResponse): CustomCompareColumnComposite[] {
		const reqCounts = loaded.QtnReqCount;
		const totals = loaded.Totals;
		const baseQuotes: CustomCompareColumnComposite[] = [];
		const changeQuotes: CustomCompareColumnComposite[] = [];

		// add an formatted date in lookup data
		loaded.Quote = loaded.Quote.map((item) => {
			item.DateQuotedFormatted = item.DateQuoted ? this.dateSvc.formatLocal(item.DateQuoted) : '';
			return item;
		});

		// distinct by 'QuoteHeaderId' and remove base and target quote
		loaded.Main = _.uniqBy(loaded.Main, e => e.QuoteHeaderId).filter((item) => {
			return this.bidderSvc.isNotReference(item.QuoteHeaderId);
		}).map((item) => {
			// add a checkbox, req-count, grand-total column to the data
			item.IsChecked = false;
			item.ReqCount = this.utilSvc.getReqCount(reqCounts, item.QuoteHeaderId);
			item.subTotal = this.utilSvc.getSubTotal(totals, item.QuoteHeaderId);
			item.grandTotal = this.utilSvc.getGrandTotal(loaded.Quote, totals, item.BusinessPartnerId, item.QuoteVersion);
			item.Children = []; // is hierarchy now (Base quote has change quotes now)

			return item;
		});

		// rebuild tree
		_.forEach(loaded.Main, function (item) {
			if (!item.CompareColumnFk) {
				baseQuotes.push(item);
			} else {
				changeQuotes.push(item);
			}
		});

		_.forEach(baseQuotes, (base) => {
			base.Children = [];
			_.forEach(changeQuotes, (child) => {
				child.Children = [];
				if (child.CompareColumnFk === base.Id && base.Children) {
					child.ReqCount = this.utilSvc.getReqCount(reqCounts, child.QuoteHeaderId);
					child.subTotal = this.utilSvc.getSubTotal(totals, child.QuoteHeaderId);
					child.grandTotal = this.utilSvc.getGrandTotal(loaded.Quote, totals, child.BusinessPartnerId, child.QuoteVersion);
					base.Children.push(child);
				}
			});
		});

		// set child field 'IsCheck' readonly
		_.forEach(baseQuotes, (base) => {
			_.forEach(base.Children, (child) => {
				// TODO-DRIZZLE: To be checked.
				// platformRuntimeDataService.readonly(child, [{field: 'IsChecked', readonly: true}]);
			});
		});

		// allQuoteRequisition
		this.allQuoteRequisition = loaded.QuoteRequisition;

		// allReqHeaders
		this.allReqHeaders = loaded.Requisition;

		this.reqVariantInfo = loaded.RequisitionVariantInfo && loaded.RequisitionVariantInfo.length > 0 ? loaded.RequisitionVariantInfo[0] : null;

		loaded.RequisitionVariantInfo = [];

		// TODO-DRIZZLE: To be checked.
		// lookup data
		// basicsLookupdataLookupDescriptorService.attachData(loaded || {});

		return this.items = loaded.Main;
	}

	public getList() {
		return this.items;
	}

	public async load() {
		const r = await this.httpSvc.post<CompareColumnCompositeResponse>('procurement/pricecomparison/comparecolumn/quotes4wizardcreatecontract', this.provideLoadPayload());
		return this.onLoadSucceeded(r);
	}

	// return bool, check if the current quote's requisition count greater than 1
	public getQuoteRequisitionCount() {
		return false;
		// if the quote has many requisitions and user want to create a contract for each quote requisition.
		// the code below will be used to show the options.
		// return this.hasSelection() && this.getSelected().ReqCount > 1;
	}

	public getAllReqHeaders() {
		const selectedQuote = this.selectedQuote;
		if (!selectedQuote) {
			return [];
		} else {
			let requisitions: ReqHeaderComposite[] = [];
			const quoteBpId = selectedQuote.BusinessPartnerId;
			if (selectedQuote.QuoteHeaderId) {
				const quoteChildren = selectedQuote.Children;
				let quoteRequisitions = selectedQuote ? this.allQuoteRequisition.filter((item) => {
					return item.QtnHeaderFk === selectedQuote.QuoteHeaderId;
				}) : [];

				if (quoteChildren && quoteChildren.length > 0) {
					const children = selectedQuote ? this.allQuoteRequisition.filter((item) => {
						return quoteChildren.some(e => item.QtnHeaderFk === e.QuoteHeaderId);
					}) : [];
					quoteRequisitions = quoteRequisitions.concat(children);
				}

				quoteRequisitions.forEach((quoteReq) => {
					this.allReqHeaders.forEach((item) => {
						if (item.Id === quoteReq.ReqHeaderFk) {
							const req = _.cloneDeep(item);
							const variantInfo = this.reqVariantInfo;
							req.PrcItems = item.PrcItems && item.PrcItems.length ? item.PrcItems.filter((prcItem) => {
								return prcItem.PrcHeaderFk === quoteReq.PrcHeaderFk;
							}) : [];
							requisitions.push(req);

							if (selectedQuote && !selectedQuote.IsIdealBidder && variantInfo && variantInfo.ReqVariants && variantInfo.ReqVariants.length > 0) {
								const variants = variantInfo.ReqVariants.filter((variant) => {
									if (variant.ReqHeaderFk !== item.Id) {
										return false;
									}
									// the requisition defines variants and no partial requisition assigned is defined, show variants in the UI.
									if (!variantInfo.RfqParialReqAssigneds || variantInfo.RfqParialReqAssigneds.length === 0 || !variantInfo.RfqParialReqAssigneds.some(e =>
										e.ReqHeaderFk === item.Id &&
										e.BpdBusinessPartnerFk === quoteBpId)) {
										return true;
									}

									// if there are no boq items or prc items assigned to the variant, don't show it in UI.
									if ((!variantInfo.ReqBoqVariants || variantInfo.ReqBoqVariants.length === 0) && (!variantInfo.ReqItemVariants || variantInfo.ReqItemVariants.length === 0)) {
										return false;
									}

									// get variants assigned to rfq bidders
									const partials = variantInfo.RfqParialReqAssigneds.filter(e => e.ReqHeaderFk === item.Id && e.BpdBusinessPartnerFk === quoteBpId && e.ReqVariantFk === variant.Id);
									variant.isForPartialReqAssigned = partials.length > 0; // mark the variant is assigned to rfq bidder
									variant.isChecked = variant.isForPartialReqAssigned; // if variant is assigned to rfq bidder, it is always checked.

									// if there are boq items or prc items assigned to the variant, show it in UI.
									return variant.isForPartialReqAssigned && variantInfo && (variantInfo.ReqBoqVariants.some(e => e.ReqVariantFk === variant.Id) || variantInfo.ReqItemVariants.some(e => e.ReqVariantFk === variant.Id));
								});

								// initialize variants
								variants.forEach((variant) => {
									const variantReq = _.cloneDeep(item);
									variantReq.Id = -variant.Id;
									variantReq.Code = variant.Code ?? '';
									variantReq.Description = variant.Description ?? '';
									variantReq.ReqHeaderFk = item.Id;
									variantReq.reqHeader = req;
									variantReq.isChecked = !!variant.isChecked;
									variantReq.isForPartialReqAssigned = variant.isForPartialReqAssigned;
									variantReq.PrcItems = undefined;

									requisitions.push(variantReq);
								});
							}
						}
					});
				});
			}

			requisitions = requisitions.map((item) => {
				let subtotal = 0;
				if (!item.PrcItems) {
					item.reqTotal = 0;
					return item;
				}
				item.PrcItems.forEach((prcItem) => {
					if (prcItem.ReplacementItems) {
						prcItem.ReplacementItems.forEach((replaceItem) => {
							subtotal += replaceItem.Total;
						});
					} else {
						subtotal += prcItem.Total;
					}
				});

				item.reqTotal = subtotal;
				return item;
			});
			return this.handleAllReqHeaders(requisitions);
		}
	}

	public async setSelectedQuote(selectedItem: ICustomCompareColumnEntity) {
		this.selectedQuote = selectedItem;
		const response = await this.httpSvc.post<{
			canCreate: boolean;
			contracts: IConHeaderEntity[];
		}>('procurement/quote/header/cancreatecontract', {Value: selectedItem.QuoteHeaderId});
		this.selectedQuoteContracts = response.contracts ?? [];
	}

	public getSelectedReqHeaderIds(value?: number[]) {
		if (value) {
			this.selectedReqHeaderIds = value;
		}

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
		} else if (value.Id < 0 && value.ReqHeaderFk !== undefined && value.ReqHeaderFk > 0) { // value is reqVariant
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

	public getSelectedReqHeaderId2ReqVariantIdsMap() {
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
			if (!_.isUndefined(found) && found !== null && !item.isChecked && item.Id > 0) {
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
						// TODO-DRIZZLE: To be checked
						// set it to editable
						//platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: false}]);
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
						// set it to readonly
						// platformRuntimeDataService.readonly(child, [{field: 'isChecked', readonly: true}]);
					}
				});
				// if req header or co req header is checked, remove the variants from the selections
				this.selectedReqHeaderId2ReqVariantIdsMap.delete(item.Id);
			}
			// note: if the item is a variant which is assigned to rfq bidder, don't put it to selectedReqHeaderId2ReqVariantIdsMap.
			if (item.Id < 0 && !item.isForPartialReqAssigned && item.reqHeader) { // if item is a variant which is not assigned to a rfq bidder
				const parentReqHeader = item.reqHeader;
				if (!item.isChecked) {  // if the variant is not checked
					// collect the selected variants
					const childrenSelected = item.reqHeader && item.reqHeader.Children ? item.reqHeader.Children.filter(e => {
						return e.isChecked;
					}) : [];
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

	public getSelectedReqHeaderIdsCount() {
		return this.getSelectedReqHeaderIds().length;
	}

	public resetRequisitionGrid() {
		this.selectedQuote = undefined;
		this.allReqHeaders = [];
		this.allQuoteRequisition = [];
	}

	public getSelectedQuoteContracts() {
		return this.selectedQuoteContracts;
	}

	public async createContract(evaluatedItemHandleMode: EvaluatedItemHandleMode, createMode: CreateContractMode, showResultDialog: boolean = true) {
		const selectedItems = this.items.filter(e => e.IsChecked);
		// it's a tree, but we can get all flatted items using 'getList()'
		const qtnHeaderIds = selectedItems.map(e => e.QuoteHeaderId);

		const reqHeaderIds = this.getSelectedReqHeaderIds();
		const reqHeaderId2ReqVariantIdsMap = this.getSelectedReqHeaderId2ReqVariantIdsMap();

		// (1) Only create contract for the quote.
		if (qtnHeaderIds.length === 1) {
			// (1.1) create a contract for each quote's requisitions.
			// (1.2) create one contract (merge many quote requisitions to one contract)
			const createEndpoint = createMode === CreateContractMode.Single ? 'createmergecontractfromquote' : 'createcontractsfromquote';

			return this.httpSvc.post<IConHeaderEntity[]>('procurement/contract/wizard/' + createEndpoint, {
				QtnHeaderId: qtnHeaderIds[0],
				ReqHeaderIds: reqHeaderIds,
				Wizards: 23,
				IsFilterEvaluated: evaluatedItemHandleMode,
				AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
					ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
				} : null
			}).then(contracts => {
				if (showResultDialog) {
					this.commonDlgSvc.showCreateContractResultDialog(contracts);
				}
				return contracts;
			});
		} else {
			// (2) Create a contract for Base quote, and it's change order quotes. Need to compare and merge the same PrcItems or BoqItems.
			return this.httpSvc.post<IConHeaderEntity>('procurement/contract/wizard/createmergecontractfromquotewithchangeorder', {
				QtnHeaderIds: qtnHeaderIds,
				HasChangeOrder: true,
				ReqHeaderIds: reqHeaderIds,
				AdditionalInfo: reqHeaderId2ReqVariantIdsMap ? {
					ReqHeaderId2ReqVariantIdsMap: reqHeaderId2ReqVariantIdsMap
				} : null
			}).then(contract => {
				if (showResultDialog) {
					this.commonDlgSvc.showCreateContractResultDialog([contract]);
				}
				return [contract];
			});
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
					if (this.getSelectedQuoteContracts().length > 0) {
						await this.showContractsDialog();
					} else {
						if (this.getSelectedReqHeaderIds().length > 1) {
							await this.showOptionDialog(info.dialog.value as EvaluatedItemHandleMode);
							info.dialog.close(info.button.id);
						} else {
							info.dialog.loading = true;
							await this.createContract(info.dialog.value as EvaluatedItemHandleMode, CreateContractMode.Multiple);
							info.dialog.loading = false;
							info.dialog.close(info.button.id);
						}
					}
				},
				isDisabled: (info: IDialogButtonEventInfo<IAsyncActionEditorDialog<EvaluatedItemHandleMode>, void>) => {
					return info.dialog.loading || this.getSelectedReqHeaderIds().length === 0;
				},
			},
			cancelButton: {
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<EvaluatedItemHandleMode>, void>) => {
					this.resetRequisitionGrid();
				}
			},
			value: EvaluatedItemHandleMode.Takeover,
			provider: [{
				provide: CREATE_CONTRACT_WIZARD_VIEW_LOAD_OPTIONS_TOKEN,
				useValue: dialogOptions
			}]
		});
	}

	public async showContractsDialog() {
		const selectedItems = _.filter(this.items, {IsChecked: true});
		const isIdealBidder = selectedItems[0].IsIdealBidder;
		const qtnHeaderIds = _.map(selectedItems, 'QuoteHeaderId') || [];

		const hasContractItem = await this.httpSvc.post<boolean>('procurement/common/wizard/hascontracteddata', {
			MainItemIds: qtnHeaderIds,
			ModuleName: 'procurement.quote'
		});

		return this.commonDlgSvc.showAsyncActionDialog<ICreateContractShowContractsDialogContext, ProcurementPricecomparisonCreateContractWizardContractViewComponent>({
			headerText: 'procurement.pricecomparison.wizard.createContract',
			bodyComponent: ProcurementPricecomparisonCreateContractWizardContractViewComponent,
			defaultButton: {
				id: 'create',
				caption: {
					key: 'procurement.common.createBtn'
				},
				fn: async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<ICreateContractShowContractsDialogContext>, void>) => {
					if (this.getSelectedReqHeaderIds().length > 1) {
						info.dialog.close(info.button.id);
						await this.showOptionDialog(info.dialog.value?.evaluatedItemHandleMode as EvaluatedItemHandleMode);
					} else {
						info.dialog.loading = true;
						await this.createContract(info.dialog.value?.evaluatedItemHandleMode as EvaluatedItemHandleMode, CreateContractMode.Multiple);
						info.dialog.loading = false;
						info.dialog.close(info.button.id);
					}
				}
			},
			value: {
				contracts: this.selectedQuoteContracts,
				hintInfo: isIdealBidder ? 'procurement.common.createdContracts4IdealQtn' : 'procurement.common.hasContractWhetherStillCreate',
				hasContractItem: hasContractItem,
				evaluatedItemHandleMode: EvaluatedItemHandleMode.Takeover
			}
		});
	}

	public async showOptionDialog(evaluatedItemHandleMode: EvaluatedItemHandleMode) {
		return this.commonDlgSvc.showOptionDialog(async (event: MouseEvent, info: IClosingDialogButtonEventInfo<IAsyncActionEditorDialog<CreateContractMode>, void>) => {
				info.dialog.loading = true;
				await this.createContract(evaluatedItemHandleMode, info.dialog.value as CreateContractMode);
				info.dialog.close(info.button.id);
			}
		);
	}
}