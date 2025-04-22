/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';
import { PackageRemarkName } from '../enums/package-remark-name.enum';

export const PACKAGE_REMARK_ACCESSOR = new InjectionToken<IPackageRemarkAccessor<unknown>>('PACKAGE_REMARK_ACCESSOR');

/**
 * package remark accessor interface.
 */
export interface IPackageRemarkAccessor<T> {
	/**
	 * Getter
	 * @param remarkName
	 * @param entity
	 */
	getText(remarkName: PackageRemarkName, entity: T): string | undefined;

	/**
	 * Setter
	 * @param remarkName
	 * @param entity
	 * @param value
	 */
	setText(remarkName: PackageRemarkName, entity: T, value?: string): void;
}
