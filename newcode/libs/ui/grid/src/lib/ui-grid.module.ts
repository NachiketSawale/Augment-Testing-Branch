/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridHostComponent } from './components/grid-host/grid-host.component';

@NgModule({
	imports: [CommonModule],
	declarations: [],
	exports: [],
})
export class UiGridModule {
	private injector = inject(Injector);

	public constructor() {
		GridHostComponent.createCustomElements(this.injector);
	}
}
