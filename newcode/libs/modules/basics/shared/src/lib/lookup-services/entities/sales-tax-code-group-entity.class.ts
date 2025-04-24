/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityBase, IDescriptionInfo } from '@libs/platform/common';

/**
 * basics Sales Tax Code Group entity
 */
export class SalesTaxCodeGroupEntity extends EntityBase {

	/**
	 * @param Id
	 */
	public constructor(public Id: number) {
		super();
	}

	/**
	 * LedgerContextFk
	 */
	public LedgerContextFk!: number;

	/**
	 * Code
	 */
	public Code?: string;

	/**
	 * Reference
	 */
	public Reference?: string;

	/**
	 * CommentText
	 */
	public CommentText?: string;

	/**
	 * UserDefined1
	 */
	public UserDefined1?: string;

	/**
	 * UserDefined2
	 */
	public UserDefined2?: string;

	/**
	 * UserDefined3
	 */
	public UserDefined3?: string;

	/**
	 * description info
	 */
	public DescriptionInfo!: IDescriptionInfo;

	/**
	 * IsLive
	 */
	public IsLive!: boolean;
}