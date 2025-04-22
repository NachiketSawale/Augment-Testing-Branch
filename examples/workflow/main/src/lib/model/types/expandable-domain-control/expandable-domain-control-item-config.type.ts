/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, IAdditionalCustomComponentOptions, IAdditionalFileSelectOptions, IAdditionalNumericOptions, IAdditionalScriptOptions, IAdditionalSelectOptions, IAdditionalStringOptions } from '@libs/ui/common';
import { DomainControlContext } from '../../classes/expandable-domain-control/domain-control-context.class';
import { InjectionToken } from '@angular/core';

/**
 * Configuration required to create a domain control.
 */
export type BaseDomainControlItemConfig<Entity extends object> = {
	fieldType: FieldType;
	controlContext: DomainControlContext<Entity>
};

/**
 * Discriminated union to load required additional options for required field type.
 */
export type ExpandableDomainControlItemConfig<Entity extends object> = BaseDomainControlItemConfig<Entity> & (
	{ fieldType: FieldType.Description, additionalOptions: IAdditionalStringOptions } |
	{ fieldType: FieldType.Integer, additionalOptions: IAdditionalNumericOptions } |
	{ fieldType: FieldType.CustomComponent, additionalOptions: IAdditionalCustomComponentOptions } |
	{ fieldType: FieldType.Radio, additionalOptions: IAdditionalSelectOptions } |
	{ fieldType: FieldType.FileSelect, additionalOptions: IAdditionalFileSelectOptions } |
	{ fieldType: FieldType.Script, additionalOptions: IAdditionalScriptOptions });

/**
 * Injection token used to provide domain controls to the accordion component.
 */
export const EXPANDABLE_DOMAIN_CONTROL_ITEM_TOKEN = new InjectionToken<ExpandableDomainControlItemConfig<object>>('expandable-domain-control-item');