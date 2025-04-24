/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsShareBillingSchemaLookupService, IBillingSchemaEntity } from '@libs/basics/shared';
import { ProcurementRfqChangeBillingSchemaService } from '../../wizards';
import { Subject, takeUntil } from 'rxjs';

/**
 * Interface representing the data structure for change billing schema.
 */
export interface IData {
	BillingSchemaFk: number | null;
}

@Component({
	selector: 'procurement-rfq-change-billing-schema-wizard',
	standalone: true,
	imports: [FormsModule, UiCommonModule, PlatformCommonModule, CommonModule],
	templateUrl: './rfq-change-billing-schema-wizard.component.html',
	styleUrls: ['./rfq-change-billing-schema-wizard.component.css'],
})
export class RfqChangeBillingSchemaWizardComponent {
	/**
	 * Injects the ProcurementRfqChangeBillingSchemaService.
	 */
	private readonly dataService = inject(ProcurementRfqChangeBillingSchemaService);
	/**
	 * Injects the Lookup services.
	 */
	public readonly billingSchemaLookup = inject(BasicsShareBillingSchemaLookupService);

	/**
	 * Component data model.
	 */
	public data: IData = {
		BillingSchemaFk: this.dataService.mainItem?.BillingSchemaFk || null,
	};

	/**
	 * Lookup options for configuring UI components.
	 */
	public lookupOptions = {
		BillingSchemaFk: {
			showClearButton: true,
		},
	};

	/**
	 * Subject for managing component's lifecycle to unsubscribe from observables
	 */
	private readonly destroy$ = new Subject<void>();

	/**
	 * Handles changes to component data fields.
	 * Fetches lookup data and updates the corresponding service properties.
	 * @param value The new value for the field.
	 * @param field The field that changed.
	 */
	public valueChangeHandler<K extends keyof IData>(value: IData[K], field: K): void {
		this.data[field] = value;

		if (field === 'BillingSchemaFk' && this.data.BillingSchemaFk !== null) {
			this.billingSchemaLookup
				.getItemByKey({ id: this.data.BillingSchemaFk })
				.pipe(takeUntil(this.destroy$))
				.subscribe((res: IBillingSchemaEntity) => {
					if (this.dataService.mainItem) {
						this.dataService.mainItem.BillingSchemaFk = res.Id;
					}
				});
		}
	}
}
