/*
 * Copyright(c) RIB Software GmbH
 */

export interface IModuleEntityGenerated {
	/**
	 * Id
	 */
	Id: number;

	/**
	 * InternalName
	 */
	InternalName: string | null;

	/**
	 * SortOrderPath
	 */
	Sortorderpath?: string | null;

	/**
	 * MaxPageSize
	 */
	MaxPageSize: number | null;
}
