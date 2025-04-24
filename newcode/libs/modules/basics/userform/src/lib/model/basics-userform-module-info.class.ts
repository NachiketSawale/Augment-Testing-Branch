/*
 * Copyright(c) RIB Software GmbH
 */

import { BusinessModuleInfoBase, EntityInfo } from '@libs/ui/business-base';
import { USER_FROM_ENTITY_INFO } from './entity-info/userform-entity-info.model';
import { USER_FROM_FIELD_ENTITY_INFO } from './entity-info/userform-field-entity-info.model';
import { USER_FROM_DATA_ENTITY_INFO } from './entity-info/userform-data-entity-info.model';

/**
 * Represents the user form module contains all the module information.
 */
export class BasicsUserformModuleInfo extends BusinessModuleInfoBase {

	public static readonly instance = new BasicsUserformModuleInfo();

	private constructor() {
		super();
	}

	/**
	 * An identifier that identifies the module.
	 */
	public override get internalModuleName(): string {
		return 'basics.userform';
	}

	/**
	 * Returns the module identifier in PascalCase.
	 */
	public override get internalPascalCasedModuleName(): string {
		return 'Basics.UserForm';
	}

	/**
	 * The entity set related to containers.
	 */
	public override get entities(): EntityInfo[] {
		return [USER_FROM_ENTITY_INFO, USER_FROM_FIELD_ENTITY_INFO, USER_FROM_DATA_ENTITY_INFO];
	}

	/**
	 * Loads the translation file before enter the module.
	 */
	public override get preloadedTranslations(): string[] {
		return super.preloadedTranslations.concat(['cloud.common', this.internalModuleName,]);
	}

	/**
	 * Override this to auto-generate a translation container with the specified UUID.
	 * The default implementation returns `undefined`, in which no translation container
	 * will be automatically added to the module.
	 */
	protected override get translationContainer(): string | undefined {
		return '56339a49d96c4a018201d058a44762ac';
	}

}
