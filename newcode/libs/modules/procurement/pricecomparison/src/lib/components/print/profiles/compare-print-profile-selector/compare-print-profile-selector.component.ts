/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { FieldType, getCustomDialogDataToken, IAdditionalSelectOptions, IControlContext, IEditorDialog, StandardDialogButtonId } from '@libs/ui/common';
import { CompareProfileSaveTypes } from '../../../../model/enums/compare-profile-save-types.enum';
import { DomainControlContext } from '../../../../model/classes/domain-control-context.class';

@Component({
	selector: 'procurement-pricecomparison-compare-print-profile-selector',
	templateUrl: './compare-print-profile-selector.component.html',
	styleUrls: ['./compare-print-profile-selector.component.scss'],
})
export class ProcurementPricecomparisonComparePrintProfileSelectorComponent {
	protected readonly fieldType = FieldType;
	public dialogInfo: IEditorDialog<CompareProfileSaveTypes>;
	public readonly dlgWrapper = inject(getCustomDialogDataToken<CompareProfileSaveTypes, ProcurementPricecomparisonComparePrintProfileSelectorComponent>());
	public profileContext: IControlContext = ((owner: ProcurementPricecomparisonComparePrintProfileSelectorComponent) => {
		return new DomainControlContext('print_profile_selector', false, {
			get value(): CompareProfileSaveTypes | undefined {
				return owner.dlgWrapper.value;
			},
			set value(v: CompareProfileSaveTypes) {
				owner.dlgWrapper.value = v;
			}
		});
	})(this);
	public profileOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: CompareProfileSaveTypes.generic,
				displayName: {key: 'procurement.pricecomparison.printing.generalProfile'}
			}, {
				id: CompareProfileSaveTypes.rfq,
				displayName: {key: 'procurement.pricecomparison.printing.rfqProfile'}
			}]
		}
	};

	public constructor() {
		this.dialogInfo = (function createDialogInfoFn(owner: ProcurementPricecomparisonComparePrintProfileSelectorComponent): IEditorDialog<CompareProfileSaveTypes> {
			return {
				get value(): CompareProfileSaveTypes {
					return owner.dlgWrapper.value as CompareProfileSaveTypes;
				},
				set value(v: CompareProfileSaveTypes) {
					owner.dlgWrapper.value = v;
				},
				close(closingButtonId?: StandardDialogButtonId | string) {
					owner.dlgWrapper.close(closingButtonId);
				}
			};
		})(this);
	}
}
