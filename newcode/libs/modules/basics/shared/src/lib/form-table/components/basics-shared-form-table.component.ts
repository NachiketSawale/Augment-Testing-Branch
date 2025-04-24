import { Component, inject, InjectionToken, StaticProvider } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyType } from '@libs/platform/common';
import { ControlContextInjectionToken, FieldType, ICompositeField, IControlContext, IFormConfig, UiCommonModule } from '@libs/ui/common';
import { IFormTableOptions } from '../models/interfaces/form-table-options.interface';

const FORM_TABLE_OPTIONS_TOKEN = new InjectionToken('form_table_options');

export function getFormTableOptionToken<T extends object>(): InjectionToken<IFormTableOptions<T>> {
	return FORM_TABLE_OPTIONS_TOKEN;
}

export function createFormTableOptionProvider<T extends object>(options: IFormTableOptions<T>): StaticProvider[] {
	return [
		{
			provide: getFormTableOptionToken<T>(),
			useValue: options,
		},
	];
}

/*
 * A component for showing the form table header.
 * Actually the header is shown in the label. This component is make the field empty.
 */
@Component({
	selector: 'basics-shared-form-table-header',
	template: '',
	standalone: true,
	styles: [],
})
export class BasicsSharedFormTableHeaderComponent {}

/*
 * A component for showing a form like a simple table.
 * With table header and label for each row. It utilizes the form component with composite field.
 */
@Component({
	selector: 'basics-shared-form-table',
	standalone: true,
	imports: [CommonModule, UiCommonModule],
	templateUrl: './basics-shared-form-table.component.html',
	styleUrl: './basics-shared-form-table.component.scss',
})
export class BasicsSharedFormTableComponent<T extends object> {
	private options = inject(getFormTableOptionToken<T>());
	private controlContext = inject(ControlContextInjectionToken) as IControlContext<PropertyType, T>;
	public formConfig: IFormConfig<T>;

	public constructor() {
		this.formConfig = this.getFormConfig();
	}

	public get entity(): T | undefined {
		return this.controlContext.entityContext.entity;
	}

	private getFormConfig(): IFormConfig<T> {
		const headerRow: ICompositeField<T> = {
			id: 'header',
			type: FieldType.Composite,
			label: ' ', //Dummy label to show the header row correctly
			composite: this.options.tableHeaders.map((header) => ({
				id: header.key!,
				type: FieldType.CustomComponent,
				label: header,
				model: '',
				readonly: true,
				componentType: BasicsSharedFormTableHeaderComponent,
			})),
		};

		const rows: ICompositeField<T>[] = this.options.rows.map((row) => ({
			id: row.rowId,
			label: row.rowLabel,
			type: FieldType.Composite,
			composite: row.rowFields,
		}));

		return {
			formId: 'formTable',
			showGrouping: false,
			groups: [],
			rows: [headerRow, ...rows],
		};
	}
}
