/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FieldType, getCustomDialogDataToken, IAdditionalSelectOptions, IControlContext, StandardDialogButtonId } from '@libs/ui/common';
import { DomainControlContext } from '../../../model/classes/domain-control-context.class';
import { CreateContractMode } from '../../../model/entities/wizard/custom-compare-column-composite.interface';
import { IAsyncActionEditorDialog } from '../../../model/entities/dialog/async-action-editor-dialog.interface';

@Component({
	selector: 'procurement-pricecomparison-create-contract-show-option-view',
	templateUrl: './create-contract-show-option-view.component.html',
	styleUrls: ['./create-contract-show-option-view.component.scss'],
})
export class ProcurementPricecomparisonCreateContractShowOptionViewComponent {
	public fieldType = FieldType;
	private readonly dlgWrapper = inject(getCustomDialogDataToken<CreateContractMode, ProcurementPricecomparisonCreateContractShowOptionViewComponent>());

	public loading:boolean = false;
	public createContext: IControlContext = ((owner: ProcurementPricecomparisonCreateContractShowOptionViewComponent) => {
		return new DomainControlContext('create_contract_show_option', false, {
			get value(): CreateContractMode {
				return owner.dlgWrapper.value as CreateContractMode;
			},
			set value(v: CreateContractMode) {
				owner.dlgWrapper.value = v;
			}
		});
	})(this);

	public createOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: CreateContractMode.Multiple,
				displayName: {key: 'procurement.quote.wizard.create.contract.createContracts'}
			}, {
				id: CreateContractMode.Single,
				displayName: {key: 'procurement.quote.wizard.create.contract.createOneContract'}
			}]
		}
	};
	public dialogInfo: IAsyncActionEditorDialog<CreateContractMode>;

	public constructor() {
		this.dialogInfo = ((owner: ProcurementPricecomparisonCreateContractShowOptionViewComponent): IAsyncActionEditorDialog<CreateContractMode> => {
			return {
				get value(): CreateContractMode {
					return owner.dlgWrapper.value as CreateContractMode;
				},
				set value(v: CreateContractMode) {
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
}
