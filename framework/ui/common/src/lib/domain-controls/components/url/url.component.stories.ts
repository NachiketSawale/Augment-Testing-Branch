/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';

import { IEntityContext, MinimalEntityContext, PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { UrlComponent } from './url.component';
const ctlCtx: IControlContext = {
	fieldId: 'SingleLineText',
	readonly: false,
	validationResults: [],
	get entityContext(): IEntityContext<object> {
		return new MinimalEntityContext();
	},
};

export default {
	title: 'UrlComponent',
	component: UrlComponent,
	decorators: [
		moduleMetadata({
			imports: [ReactiveFormsModule, HttpClientModule],
			declarations: [],
			providers: [TranslatePipe, PlatformTranslateService, { provide: ControlContextInjectionToken, useValue: ctlCtx }],
		}),
	],
} as Meta<UrlComponent>;

export const primary = {
	render: (args: UrlComponent) => ({
		props: args,
	}),

	args: {},
};

export const url = {
	render: (args: UrlComponent) => ({
		props: args,
	}),
	args: {
		controlContext: {
			value: '',
		},
		urlString: new FormControl('', [Validators.required]),
	},
};

