/*
 * Copyright(c) RIB Software GmbH
 */
export class AliasExpression {
	/**
	 * id
	 */
	public id: string;

	/**
	 * parentPath
	 */
	public parentPath: string;

	/**
	 * pathSegment
	 */
	public pathSegment?: string[];

	/**
	 * parameters
	 */
	public parameters?: unknown[];

	/**
	 * label
	 */
	public label: string = '';

	/**
	 * fullId
	 */
	public fullId?: string;

	/**
	 * Default constructor
	 * @param id
	 * @param parentPath
	 */
	public constructor(id: string, parentPath: string) {
		this.id = id;
		this.parentPath = parentPath;
	}
}