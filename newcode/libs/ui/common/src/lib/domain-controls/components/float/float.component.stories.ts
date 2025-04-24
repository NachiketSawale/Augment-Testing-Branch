/*
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FloatComponent } from './float.component';
import { ControlContextInjectionToken } from '../..//model/control-context.interface';
import { FloatConfigInjectionToken, IFloatConfig } from '../../model/float-config.interface';
import { INumericControlContext } from '../..//model/numeric-control-context.interface';
import { UiNumericConverterService } from '../../services/numeric-converter.service';
import { DebounceChangeDirective } from '../../../directives/ng-model-debounce.directive';
import { MinimalEntityContext, IEntityContext } from '@libs/platform/common';

const config: IFloatConfig = {
	decimalPlaces: 2
};
let lastAssignedValue: number | undefined = 42;
const ctlCtx: INumericControlContext = {
	fieldId: 'Value',
	readonly: false,
	validationResults: [],
	get value(): number {
		return 42;
	},
	set value(assignedValue: number | undefined) {
		lastAssignedValue = assignedValue;
	},
	get entityContext(): IEntityContext<object> {
		return new MinimalEntityContext<object>();
	}
};

export default {
	title: 'FloatComponent',
	component: FloatComponent,
	decorators: [
		moduleMetadata({
			imports: [FormsModule, CommonModule],
			declarations: [DebounceChangeDirective],
			providers: [
				{ provide: ControlContextInjectionToken, useValue: ctlCtx },
				{ provide: FloatConfigInjectionToken, useValue: config },
				UiNumericConverterService
			],
		}),
	]
} as Meta<FloatComponent>;

export const Primary = {
	render: (args: FloatComponent) => ({
		props: args,
	}),
	args: {
		value: '0.00'
	},
};
