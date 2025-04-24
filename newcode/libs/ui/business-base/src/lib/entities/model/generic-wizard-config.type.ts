/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceBase, IRootRole } from '@libs/platform/data-access';
import { IEntityInfo } from '..';
import { Type } from '@angular/core';

/**
 * Represents the generic wizard root entity configuration.
 */
export type GenericWizardRootEntityConfig<T extends object, U extends object = never> = GenericWizardConfigBase<T> & {

	/**
	 * Represents the data service type.
	 */
	rootDataServiceType: Type<IRootRole<T, U>>;
}

/**
 * Represents the generic wizard entity configuration.
 */
export type GenericWizardEntityConfig<T extends object> = GenericWizardConfigBase<T> & {
	/**
	 * Represents the data service type.
	 */
	dataServiceType: Type<DataServiceBase<T>>;
}

/**
 * Represents the generic wizard configuration base.
 */
type GenericWizardConfigBase<T extends object> = {
	/**
	 * Represents the entity configuration.
	 */
	entityConfig: Partial<IEntityInfo<T>>;
}