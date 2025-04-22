/*
 * Copyright(c) RIB Software GmbH
 */

import { StandardViewFieldType } from '../../enum/action-editors/standard-view-field-type.enum';
import { IFormConfig } from '@libs/ui/common';

/**
 * Default options available in view configuration.
 */
export interface IBaseViewProperties<Entity extends object, ParentEntity extends object = object> {
	/**
	 * The entity/object that will be set to the standard view control.
	 */
	entity: Entity | ParentEntity;

	/**
	 * The type of standard view to be rendered.
	 */
	standardViewFieldType: StandardViewFieldType;

	/**
	 * Form configuration for expert view. Script field will be shown by default.
	 */
	expertViewFormConfig: IFormConfig<ParentEntity>
}