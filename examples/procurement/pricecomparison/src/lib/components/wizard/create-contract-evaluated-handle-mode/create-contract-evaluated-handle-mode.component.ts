/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FieldType, IAdditionalSelectOptions, IControlContext } from '@libs/ui/common';
import { DomainControlContext } from '../../../model/classes/domain-control-context.class';
import { EvaluatedItemHandleMode } from '../../../model/entities/wizard/custom-compare-column-composite.interface';

@Component({
	selector: 'procurement-pricecomparison-create-contract-evaluated-handle-mode',
	templateUrl: './create-contract-evaluated-handle-mode.component.html',
	styleUrls: ['./create-contract-evaluated-handle-mode.component.scss'],
})
export class ProcurementPricecomparisonCreateContractEvaluatedHandleModeComponent {
	protected readonly fieldType = FieldType;
	protected readonly EvaluatedItemHandleMode = EvaluatedItemHandleMode;

	public evaluatedHandleModeCtx: IControlContext = ((owner: ProcurementPricecomparisonCreateContractEvaluatedHandleModeComponent) => {
		return new DomainControlContext('ctrl_' + Date.now().toString(), false, {
			get value(): EvaluatedItemHandleMode {
				return owner.evaluatedItemHandleMode as EvaluatedItemHandleMode;
			},
			set value(v: EvaluatedItemHandleMode) {
				owner.evaluatedItemHandleMode = v;
				owner.evaluatedItemHandleModeChange.next(v);
			}
		});
	})(this);

	public evaluatedHandleModeOptions: IAdditionalSelectOptions<string> = {
		itemsSource: {
			items: [{
				id: EvaluatedItemHandleMode.Bypass,
				displayName: {key: 'procurement.common.wizard.IsFilterEvaluated'}
			}, {
				id: EvaluatedItemHandleMode.Takeover,
				displayName: {key: 'procurement.common.wizard.isEvaluatedItems'}
			}, {
				id: EvaluatedItemHandleMode.TakeoverWithPrice,
				displayName: {key: 'procurement.common.wizard.isEvaluatedItemsPrice'}
			}]
		}
	};

	@Input()
	public evaluatedItemHandleMode?: EvaluatedItemHandleMode = EvaluatedItemHandleMode.Ignore;

	@Output()
	public evaluatedItemHandleModeChange: EventEmitter<EvaluatedItemHandleMode> = new EventEmitter<EvaluatedItemHandleMode>();
}
