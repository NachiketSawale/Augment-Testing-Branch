/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Component
} from '@angular/core';

import { ContainerBaseComponent } from '../container-base/container-base.component';

/**
 * A container that is displayed instead of another container if the container UUID is unknown.
 */
@Component({
	selector: 'ui-container-system-placeholder-container',
	templateUrl: './placeholder-container.component.html',
	styleUrls: ['./placeholder-container.component.scss']
})
export class PlaceholderContainerComponent extends ContainerBaseComponent {

	/**
	 * Returns the UUID of the missing container.
	 */
	public get containerUuid(): string {
		return this.containerDefinition.uuid;
	}
}
