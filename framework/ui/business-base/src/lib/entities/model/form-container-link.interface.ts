/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityContainerLink } from './entity-container-link.model';
import { IFormConfig } from '@libs/ui/common';

/**
 * Provides references to the standard equipment inside a form container.
 */
export interface IFormContainerLink<T extends object> extends IEntityContainerLink<T> {

	/**
	 * A reference to the form config.
	 */
	readonly formConfig: IFormConfig<T>;

	/**
	 * Collapses all collapsible groups in the form.
	 */
	collapseAll(): void;

	/**
	 * Expands all collapsible groups in the form.
	 */
	expandAll(): void;
}