/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';

@Component({
	standalone: true,
	imports: [UiCommonModule],
	template: '<ui-common-style-editor2></ui-common-style-editor2>',
})

/**
 * Basics Material Specification Component.
 */
export class BasicsMaterialSpecificationComponent<T extends object> extends EntityContainerBaseComponent<T> {
	public constructor() {
		super();
	}
}
