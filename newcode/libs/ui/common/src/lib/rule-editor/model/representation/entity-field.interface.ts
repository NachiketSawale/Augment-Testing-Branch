/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents a field in the entity in the hierarchical structure.
 * Structure of Fields array item in IEntityFieldsInfo
 */
export interface IEntityField {
	/**
	 * DdPath
	 */
	DdPath: string;

	/**
	 * IsFilterAttribute
	 */
	IsFilterAttribute?: boolean;

	/**
	 * IsForeignKey
	 */
	IsForeignKey?: boolean;

	/**
	 * IsNullable
	 */
	IsNullable?: boolean;

	/**
	 * Name
	 */
	Name: string;

	/**
	 * UiTypeId
	 */
	UiTypeId: string;

	/**
	 * TargetId
	 */
	TargetId: number | null;

	/**
	 * TargetKind
	 */
	TargetKind?: string; // todo

	/**
	 * CategoryId
	 */
	CategoryId?: string[];

	/**
	 * TableNameDb
	 */
	TableNameDb?: string; // todo

	/**
	 * TableIdDb
	 */
	TableIdDb?: number;

	/**
	 * Parameters
	 */
	Parameters?: string[]
}