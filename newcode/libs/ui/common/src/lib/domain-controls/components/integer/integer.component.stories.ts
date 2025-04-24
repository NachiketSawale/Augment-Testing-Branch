/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IntegerComponent } from './integer.component';
import { DebounceChangeDirective } from '../../../directives/ng-model-debounce.directive';
import { INumericControlContext } from '../../model/numeric-control-context.interface';
import { ControlContextInjectionToken } from '../../model/control-context.interface';
import { UiNumericConverterService } from '../../services/numeric-converter.service';
import { MinimalEntityContext, IEntityContext } from '@libs/platform/common';

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
	title: 'IntegerComponent',
	component: IntegerComponent,
	decorators: [
		moduleMetadata({
			imports: [FormsModule, CommonModule],
			declarations: [DebounceChangeDirective],
			providers: [
				{ provide: ControlContextInjectionToken, useValue: ctlCtx },
				UiNumericConverterService
			],
		}),
	]
} as Meta<IntegerComponent>;

export const Primary = {
	render: (args: IntegerComponent) => ({
		props: args,
	}),
	args: {
		value: '0'
	},
};
