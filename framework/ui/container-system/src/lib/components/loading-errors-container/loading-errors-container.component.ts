/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Component,
	inject,
	InjectionToken
} from '@angular/core';

import { ContainerBaseComponent } from '../container-base/container-base.component';

export const LOADING_ERRORS_TOKEN = new InjectionToken<string[]>('container-loading-errors');

/**
 * A container that is displayed instead of another container if the other container cannot be loaded due to exceptions.
 */
@Component({
	selector: 'ui-container-system-loading-errors-container',
	templateUrl: './loading-errors-container.component.html',
	styleUrls: ['./loading-errors-container.component.scss']
})
export class LoadingErrorsContainerComponent extends ContainerBaseComponent {

	/**
	 * The error messages collected while loading the failing container.
	 */
	public readonly errors: string[] = inject(LOADING_ERRORS_TOKEN);
}
