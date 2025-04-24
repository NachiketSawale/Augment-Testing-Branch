/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutGroup } from './layout-group.interface';
import { AllKeys, Translatable } from '@libs/platform/common';
import { FieldOverloadSpec } from './field-overload-spec.type';
import { TransientFieldSpec } from './transient-field-spec.type';

/**
 * Represents a layout configuration for a given entity type.
 *
 * A layout configuration object defines which fields of a given entity type are displayed in the UI.
 * It can group the fields, and specify a custom appearance that deviates from the default editor for the domain type.
 *
 * ## Role in the UI Generation Process
 *
 * Information on an entity type is retrieved from the server and goes through the following stages until it culminates in a form or a grid being displayed on screen:
 *
 * 1. The schema information is received from the server.
 * 2. Based on the TypeScript DTO type, a layout configuration object specifies how grid columns or form fields should be structured.
 * 3. The schema information and the layout configuration object are transformed into grid columns or a form configuration object.
 *
 * @typeParam T The entity type.
 *
 * @group Layout Configuration
 */
export interface ILayoutConfiguration<T extends object> {

	/**
	 * Optionally, the ID for form configuration object based on the layout.
	 */
	fid?: string;

	/**
	 * Define the groups the layout configuration is split into.
	 * If this is not specified, all attributes declared in the schema will be added to one default group.
	 */
	groups?: ILayoutGroup<T>[];

	/**
	 * An optional array of excluded attribute names.
	 * Any attribute listed in this array will not show up in the entity grid/form.
	 */
	excludedAttributes?: (keyof T)[];

	/**
	 * Defines custom UI representations of individual fields in the entity type.
	 */
	overloads?: {

		/**
		 * A description object for a custom UI representation of a given field.
		 */
		[key in keyof Partial<T>]: FieldOverloadSpec<T>;
	};

	/**
	 * Custom Ui represntation for nested attributes.
	 */
	additionalOverloads? : {
		/**
		 * A description object for a custom UI representation of a given field.
		 */
		[key in AllKeys<T>]?: FieldOverloadSpec<T>;
	}

	/**
	 * By default, and if supported by the entity object, a group with history fields will be added.
	 * This option can be used to suppress automated creation of the history group.
	 */
	suppressHistoryGroup?: boolean;

	/**
	 * An optional array of additional, transient fields to show for the entity.
	 *
	 * Transient fields are defined only in the entity info.
	 * They have no counterpart in the schema data on the entity.
	 *
	 * If a transient field uses the same ID as a field from the schema, the transient field is prioritized.
	 * In this case, the field from the schema will be shadowed and not displayed.
	 */
	transientFields?: TransientFieldSpec<T>[];

	/**
	 * A collection of labels that will be used as a fallback if no label is specified for a given
	 * field or group (as a title, in the latter case).
	 */
	labels?: {
		[key: string]: Translatable;
	}
}
