/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken, ViewEncapsulation, SecurityContext } from '@angular/core';
import { CellChangeEvent, FieldType, getCustomDialogDataToken, GridApiService, IAccordionItem, IGridConfiguration, StandardDialogButtonId } from '@libs/ui/common';
import {
	CREATE_CONTRACT_WIZARD_GRID_CONFIG_TOKEN,
	CREATE_CONTRACT_WIZARD_GRID_MENU_TOKEN,
	CREATE_CONTRACT_WIZARD_GRID_OPTIONS_TOKEN,
	ProcurementPricecomparisonCreateContractWizardViewGridComponent,
	WizardViewGridOptions
} from '../create-contract-wizard-view-grid/create-contract-wizard-view-grid.component';
import { CustomCompareColumnComposite, EvaluatedItemHandleMode, ICreateContractDialogOptions, ICreateContractOptions, ReqHeaderComposite } from '../../../model/entities/wizard/custom-compare-column-composite.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { IAsyncActionEditorDialog } from '../../../model/entities/dialog/async-action-editor-dialog.interface';

export const CREATE_CONTRACT_WIZARD_VIEW_LOAD_OPTIONS_TOKEN = new InjectionToken('create_contract_wizard_view_load_options');

@Component({
	selector: 'procurement-pricecomparison-create-contract-wizard-view',
	templateUrl: './create-contract-wizard-view.component.html',
	styleUrls: ['./create-contract-wizard-view.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProcurementPricecomparisonCreateContractWizardViewComponent {
	private readonly gridApiSvc = inject(GridApiService);
	private readonly sanitizer = inject(DomSanitizer);
	public loading: boolean = false;
	public accordionItems: IAccordionItem[] = [];
	public dialogOptions = inject<ICreateContractDialogOptions>(CREATE_CONTRACT_WIZARD_VIEW_LOAD_OPTIONS_TOKEN);
	public customNote: string = '';
	public error?: string;
	public hasChangeOrder: boolean = false;
	public showContractNote: boolean = false;
	public quoteConfig: IGridConfiguration<CustomCompareColumnComposite> = {
		uuid: '87db302347e948f28b0bdb42b002c7c5',
		skipPermissionCheck: true,
		treeConfiguration: {
			parent: entity => {
				return null;
			},
			children: entity => {
				return entity.Children as CustomCompareColumnComposite[] ?? [];
			}
		},
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: [{
			id: 'IsChecked',
			model: 'IsChecked',
			label: {
				text: 'Is Checked'
			},
			type: FieldType.Boolean,
			sortable: false,
		}, {
			id: 'statusFk',
			model: 'QuoteHeaderId', // TODO-DRIZZLE: To be checked.
			label: {
				text: 'Status',
				key: 'cloud.common.entityState'
			},
			type: FieldType.Description,
			sortable: true,
			readonly: true
		}, {
			id: 'qtnCode',
			model: 'QuoteHeaderId', // TODO-DRIZZLE: To be checked.
			label: {
				text: 'Reference Code',
				key: 'cloud.common.entityReferenceCode'
			},
			type: FieldType.Code,
			sortable: true,
			readonly: true
		}, {
			id: 'qtnDescription',
			model: 'QuoteHeaderId', // TODO-DRIZZLE: To be checked.
			label: {
				text: 'Description',
				key: 'cloud.common.entityDescription'
			},
			type: FieldType.Description,
			sortable: true,
			readonly: true
		}, {
			id: 'businessPartnerFk',
			model: 'QuoteHeaderId', // TODO-DRIZZLE: To be checked.
			label: {
				text: 'Business Partner',
				key: 'cloud.common.entityBusinessPartner'
			},
			type: FieldType.Description,
			sortable: true,
			readonly: true
		}, {
			id: 'subTotal',
			model: 'subTotal',
			label: {
				text: 'Subtotal',
				key: 'procurement.pricecomparison.compareSubtotal'
			},
			type: FieldType.Money,
			sortable: true,
			readonly: true
		}, {
			id: 'grandTotal',
			model: 'grandTotal',
			label: {
				text: 'Grand Total',
				key: 'procurement.pricecomparison.compareGrandTotal'
			},
			type: FieldType.Money,
			sortable: true,
			readonly: true
		}, {
			id: 'DateQuoted',
			model: 'QuoteHeaderId', // TODO-DRIZZLE: To be checked.
			label: {
				text: 'Date Submit',
				key: 'procurement.pricecomparison.compareSubmitDate'
			},
			type: FieldType.DateUtc,
			sortable: true,
			readonly: true
		}, {
			id: 'qtnVersion',
			model: 'QuoteHeaderId', // TODO-DRIZZLE: To be checked.
			label: {
				text: 'Version',
				key: 'cloud.common.entityVersion'
			},
			type: FieldType.Description,
			sortable: true,
			readonly: true
		}]
	};
	public requisitionConfig: IGridConfiguration<ReqHeaderComposite> = {
		uuid: '7af726cca0ec49fab7a7fa4dd5bd5811',
		skipPermissionCheck: true,
		treeConfiguration: {
			parent: entity => {
				return null;
			},
			children: entity => {
				return entity.Children ?? [];
			}
		},
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: [{
			id: 'isChecked',
			model: 'isChecked',
			label: {
				text: 'Select All'
			},
			type: FieldType.Boolean,
			sortable: false
		}, {
			id: 'code',
			model: 'Code',
			label: {
				text: 'Code',
				key: 'cloud.common.entityCode'
			},
			type: FieldType.Code,
			sortable: true,
			readonly: true
		}, {
			id: 'reqTotal',
			model: 'reqTotal',
			label: {
				text: 'Quote Subtotal',
				key: 'procurement.pricecomparison.compareQuoteSubtotal'
			},
			type: FieldType.Money,
			sortable: true,
			readonly: true
		}]
	};

	public readonly dlgWrapper = inject(getCustomDialogDataToken<EvaluatedItemHandleMode, ProcurementPricecomparisonCreateContractWizardViewComponent>());
	public dialogInfo: IAsyncActionEditorDialog<EvaluatedItemHandleMode>;

	public constructor() {
		this.dialogInfo = (function createDialogInfoFn(owner: ProcurementPricecomparisonCreateContractWizardViewComponent): IAsyncActionEditorDialog<EvaluatedItemHandleMode> {
			return {
				get value(): EvaluatedItemHandleMode {
					return owner.dlgWrapper.value as EvaluatedItemHandleMode;
				},
				set value(v: EvaluatedItemHandleMode) {
					owner.dlgWrapper.value = v;
				},
				get loading(): boolean {
					return owner.loading;
				},
				set loading(v: boolean) {
					owner.loading = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);

		this.startLoadOptions().then();
	}

	private async startLoadOptions() {
		this.loading = true;
		const r = await (this.dialogOptions.verify ? this.dialogOptions.verify() : Promise.resolve(true));
		if (r) {
			this.dialogOptions.loadOptions().then(options => {
				this.showContractNote = options.showContractNote;
				this.hasChangeOrder = options.hasChangeOrder;
				this.dlgWrapper.value = options.evaluatedItemHandleMode;
				this.quoteConfig.items = options.items;
				this.updateCustomNote(options);
				this.accordionItems = [{
					id: 'quote',
					title: 'procurement.pricecomparison.wizard.quoteGrid.choose.quote',
					expanded: true,
					children: [{
						id: '0',
						component: ProcurementPricecomparisonCreateContractWizardViewGridComponent,
						providers: [{
							provide: CREATE_CONTRACT_WIZARD_GRID_MENU_TOKEN,
							useValue: undefined
						}, {
							provide: CREATE_CONTRACT_WIZARD_GRID_CONFIG_TOKEN,
							useValue: this.quoteConfig
						}, {
							provide: CREATE_CONTRACT_WIZARD_GRID_OPTIONS_TOKEN,
							useValue: {
								onCellChanged: (evt_3: CellChangeEvent<CustomCompareColumnComposite>) => {
									this.updateCheckedStatus(evt_3.item, options.items);
									this.updateCustomNote(options);
								},
								onSelectChanged: async (items_1: CustomCompareColumnComposite[]) => {
									this.updateCheckedStatus(items_1[0], options.items);
									await options.onSelectChanged(items_1[0]);
									options.getAllReqHeaders(items_1[0], options.items).then(result_2 => {
										const grid = this.gridApiSvc.get<ReqHeaderComposite>(this.requisitionConfig.uuid as string);
										if (grid) {
											grid.items = [...result_2];
										}
									});
								}
							} as WizardViewGridOptions<CustomCompareColumnComposite>
						}]
					}]
				}, {
					id: 'requisition',
					title: 'procurement.pricecomparison.wizard.reqInQuotation',
					expanded: true,
					children: [{
						id: '0',
						component: ProcurementPricecomparisonCreateContractWizardViewGridComponent,
						providers: [{
							provide: CREATE_CONTRACT_WIZARD_GRID_MENU_TOKEN,
							useValue: undefined
						}, {
							provide: CREATE_CONTRACT_WIZARD_GRID_CONFIG_TOKEN,
							useValue: this.requisitionConfig
						}, {
							provide: CREATE_CONTRACT_WIZARD_GRID_OPTIONS_TOKEN,
							useValue: {
								onCellChanged: async (evt_5: CellChangeEvent<ReqHeaderComposite>) => {
									if (!evt_5.column) {
										const grid_1 = this.gridApiSvc.get<ReqHeaderComposite>(this.requisitionConfig.uuid as string);
										if (grid_1) {
											// TODO-DRIZZLE: To be check, use framework APIs.
											evt_5.column = grid_1.visibleColumns[evt_5.cell - 2];
										}
									}

									if (options.onRequisitionCellChanged) {
										const result_3 = await options.onRequisitionCellChanged(evt_5);
										this.error = result_3.status ? '' : result_3.error;
									}

									this.updateCustomNote(options);
								}
							} as WizardViewGridOptions<ReqHeaderComposite>
						}]
					}]
				}];
				this.loading = false;
			});
		} else {
			this.dlgWrapper.close();
			this.loading = false;
		}
	}

	private updateCustomNote(options: ICreateContractOptions) {
		this.customNote = options.customNote ? this.sanitizer.sanitize(SecurityContext.HTML, options.customNote()) as string : this.customNote;
	}

	private updateCheckedStatus(baseItem: CustomCompareColumnComposite, items: CustomCompareColumnComposite[]) {
		if (baseItem.CompareColumnFk) {
			return; // do nothing if child selected
		}

		items.forEach((base) => {
			base.IsChecked = false;
			if (!base.Children) {
				return;
			}
			const children = base.Children as CustomCompareColumnComposite[];
			children.forEach((child) => {
				child.IsChecked = false;
			});
		});
		baseItem.IsChecked = true;

		if (!baseItem.Children) {
			return;
		}

		const baseChildren = baseItem.Children as CustomCompareColumnComposite[];
		baseChildren.forEach((child) => {
			child.IsChecked = true;
		});

		const grid = this.gridApiSvc.get<CustomCompareColumnComposite>(this.quoteConfig.uuid as string);
		if (grid) {
			grid.items = [...items];
		}
	}
}
