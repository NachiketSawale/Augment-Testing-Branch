/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-topic-one-overlay-demo',
	templateUrl: './overlay-demo.component.html',
	styleUrls: ['./overlay-demo.component.css'],
})
export class OverlayDemoComponent extends ContainerBaseComponent {
	/**
	 * Represent drag direction.
	 */
	public dragDir = 'topLeft';

	public constructor() {
		super();
	}
}

