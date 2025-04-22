/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { BasicsSharedConStatusLookupService, BasicsSharedTaxCodeLookupService, BasicsSharedVATGroupLookupService } from '@libs/basics/shared';
import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { ICreateContractShowContractsDialogContext } from '../../../model/entities/wizard/custom-compare-column-composite.interface';
import { createLookup, FieldType, getCustomDialogDataToken, IGridConfiguration, StandardDialogButtonId } from '@libs/ui/common';
import { IAsyncActionEditorDialog } from '../../../model/entities/dialog/async-action-editor-dialog.interface';

@Component({
	selector: 'procurement-pricecomparison-create-contract-wizard-contract-view',
	templateUrl: './create-contract-wizard-contract-view.component.html',
	styleUrls: ['./create-contract-wizard-contract-view.component.scss'],
})
export class ProcurementPricecomparisonCreateContractWizardContractViewComponent {
	private readonly dlgWrapper = inject(getCustomDialogDataToken<ICreateContractShowContractsDialogContext, ProcurementPricecomparisonCreateContractWizardContractViewComponent>());

	public loading: boolean = false;
	public dialogInfo: IAsyncActionEditorDialog<ICreateContractShowContractsDialogContext>;
	public config: IGridConfiguration<IConHeaderEntity> = {
		uuid: 'c9e0bbbfdeb943aa872d117e9b3a268e',
		skipPermissionCheck: true,
		entityRuntimeData: undefined, // TODO-DRIZZLE: To be checked.
		columns: [{
			id: 'contractId',
			model: 'Id',
			label: {
				text: 'Id',
				key: 'cloud.common.entityId'
			},
			type: FieldType.Integer,
			sortable: false,
			readonly: true
		}, {
			id: 'conStatusFk',
			model: 'ConStatusFk',
			label: {
				text: 'Status',
				key: 'cloud.common.entityState'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedConStatusLookupService,
			}),
			sortable: true,
			readonly: true
		}, {
			id: 'description',
			model: 'Description',
			label: {
				text: 'Description',
				key: 'cloud.common.entityDescription'
			},
			type: FieldType.Description,
			sortable: true,
			readonly: true
		}, {
			id: 'code',
			model: 'Code',
			label: {
				text: 'Code',
				key: 'cloud.common.entityReferenceCode'
			},
			type: FieldType.Code,
			sortable: true,
			readonly: true
		}, {
			id: 'taxCodeFk',
			model: 'TaxCodeFk',
			label: {
				text: 'Tax Code',
				key: 'cloud.common.entityTaxCode'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedTaxCodeLookupService,
			}),
			sortable: true,
			readonly: true
		}, {
			id: 'bpdVatGroupFk',
			model: 'BpdVatGroupFk',
			label: {
				text: 'Vat Group',
				key: 'procurement.common.entityVatGroup'
			},
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedVATGroupLookupService,
			}),
			sortable: true,
			readonly: true
		}],
		items: this.dlgWrapper.value?.contracts
	};

	public constructor() {
		this.dialogInfo = (function createDialogInfoFn(owner: ProcurementPricecomparisonCreateContractWizardContractViewComponent): IAsyncActionEditorDialog<ICreateContractShowContractsDialogContext> {
			return {
				get value(): ICreateContractShowContractsDialogContext {
					return owner.dlgWrapper.value as ICreateContractShowContractsDialogContext;
				},
				set value(v: ICreateContractShowContractsDialogContext) {
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
	}

	public get context(): ICreateContractShowContractsDialogContext {
		return this.dlgWrapper.value as ICreateContractShowContractsDialogContext;
	}
}
