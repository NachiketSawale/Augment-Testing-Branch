/*
 * Copyright(c) RIB Software GmbH
 */
import { FormRow } from '@libs/ui/common';
import { Translatable } from '@libs/platform/common';
import { IBasicsSharedImportDataEntity } from '../basics-import-data-entity.interface';

/**
 * Interface for importing file dialog options.
 */
export interface IBasicsImportDialogOptions<TEntity extends IBasicsSharedImportDataEntity> {
	/**
	 * Dialog header.
	 */
	header: Translatable;
	/**
	 * File filter.
	 */
	fileFilter?: string;
	/**
	 * support multiselect or not.
	 */
	multiSelect?: boolean;
	/**
	 * additional form rows.
	 */
	additionalRows?: FormRow<TEntity>[];
}
