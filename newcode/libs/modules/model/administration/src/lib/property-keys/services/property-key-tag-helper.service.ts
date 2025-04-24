/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import {
	FieldType,
	TypedConcreteFieldOverload
} from '@libs/ui/common';
import { IModelAdministrationPropertyKeyTagHelper, PROPERTY_KEY_TAG_HELPER_TOKEN } from '@libs/model/interfaces';
import { PropertyKeyTagSelectorComponent } from '../components/property-key-tag-selector/property-key-tag-selector.component';

/**
 * Provides reusable utilities for dealing with model property key tags.
 */
@LazyInjectable({
	token: PROPERTY_KEY_TAG_HELPER_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyTagHelperService implements IModelAdministrationPropertyKeyTagHelper {

	/**
	 * Generates a field overload to edit property key tags.
	 *
	 * @typeParam T The entity type.
	 */
	public generateTagsFieldOverload<T extends object>(): TypedConcreteFieldOverload<T> {
		return {
			type: FieldType.CustomComponent,
			componentType: PropertyKeyTagSelectorComponent
			// TODO: custom formatter function is not supported yet (DEV-15667)
		};
	}
}
