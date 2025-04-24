/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslatable, PropertyType } from '@libs/platform/common';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { IFormConfig } from '../../../form/model/form-config.interface';

export const DefaultLookupDialogSearchForm = {
	title: {
		key: 'cloud.common.advancedCriteria',
		text: 'Advanced Criteria'
	},
	form: {
		config: {
			addValidationAutomatically: false,
			formId: undefined,
			showGrouping: false,
			groups: [],
			rows: []
		}
	}
};

/**
 * Represents the form entity property value type.
 */
export type LookupDialogSearchFormEntityValue = PropertyType | null | undefined;

/**
 * The search form entity interface to binds with search form.
 */
export interface ILookupDialogSearchFormEntity<TValue = LookupDialogSearchFormEntityValue> {
	[key: string]: TValue;
}

/**
 * Represents the change information of current search entity.
 */
export interface ILookupDialogSearchFormEntityChangeContext<TEntity extends object, TValue> {
	/**
	 * Represents current row's field name.
	 */
	model: string;

	/**
	 * Represents current new value.
	 */
	value: TValue;

	/**
	 * The current search form entity.
	 */
	entity: TEntity;

	/**
	 * The search form entity runtime data.
	 */
	runtimeData: EntityRuntimeData<TEntity>;

	/**
	 * The search form configuration.
	 */
	config: IFormConfig<TEntity>;
}

/**
 * Represents the context to initialize the form entity.
 */
export interface ILookupDialogSearchFormEntityInitContext<TEntity extends object> {
	/**
	 * The context entity.
	 */
	entity?: TEntity;
}

/**
 * Represents the form options to display/handle form related info.
 */
export interface ILookupDialogSearchFormOptions<TEntity extends object> {
	/**
	 * The form configuration display in search area.
	 */
	config?: IFormConfig<ILookupDialogSearchFormEntity>;

	/**
	 * A custom process function to add/remove/modify the form config.
	 * @param config The form config in current context.
	 */
	process?: (config: IFormConfig<ILookupDialogSearchFormEntity>) => void;

	/**
	 * Excluded specified rows.
	 */
	excludedRows?: string[];

	/**
	 * A custom function to handle changed event.
	 * @param context The change context.
	 */
	rowChanged?: (context: ILookupDialogSearchFormEntityChangeContext<ILookupDialogSearchFormEntity, LookupDialogSearchFormEntityValue>) => void;

	/**
	 * The entity runtime data that holds the entity state.
	 */
	entityRuntimeData?: EntityRuntimeData<ILookupDialogSearchFormEntity>;

	/**
	 * An entity provider to provide the initial search entity.
	 * @param context
	 */
	entity?(context: ILookupDialogSearchFormEntityInitContext<TEntity>): ILookupDialogSearchFormEntity;
}

/**
 * The search form configuration to display/handle dialog-based lookup search form area.
 */
export interface ILookupDialogSearchForm<TEntity extends object> {
	/**
	 * Show or hide de search form area.
	 */
	visible?: boolean;

	/**
	 * Represents the translation info of search area title.
	 */
	title?: ITranslatable;

	/**
	 * Represents the form options to display/handle form related info.
	 */
	form?: ILookupDialogSearchFormOptions<TEntity>;
}