/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormConfig } from '@libs/ui/common';
import { IBaseViewProperties } from './base-view-properties.interface';
import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';

export interface IDomainControlProperties<ParentEntity extends object> {

	/**
	 * View field type is always from `DomainControl` enum to infer the required domain control options.
	 */
	standardViewFieldType: StandardViewFieldType.DomainControl;

	/**
	 * The formrow associated with selected field type. These properties will be passed to the standard view form control to render the required form field.
	 */
	formConfig: IFormConfig<ParentEntity>;

	/**
	 * The entity/object that will be set to the standard view control.
	 */
	entity: ParentEntity;
}

/**
 * Properties required to render a domain control in standard view.
 */
export type IDomainControlView<Entity extends object, ParentEntity extends object> = IBaseViewProperties<Entity, ParentEntity> & IDomainControlProperties<ParentEntity>;