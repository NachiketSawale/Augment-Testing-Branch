/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteMenuItem, IFormConfig } from '@libs/ui/common';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { WritableSignal } from '@angular/core';

/**
 * Defines the functions that are available for workflow custom action editors.
 */
export interface IWorkflowActionEditor {

	/**
	 * Signal for action from config.
	 */
	$config?: WritableSignal<IFormConfig<IWorkflowAction>>;

	/**
	 * Retrieves the form configuration for an action editor
	 */
	getFormConfig(): IFormConfig<IWorkflowAction>;

	/**
	 * Gets toolbar items for the component.
	 */
	getToolbarItems?: () => ConcreteMenuItem[];

	/**
	 * Sets default values
	 */
	setDefaultValues(): void;
}