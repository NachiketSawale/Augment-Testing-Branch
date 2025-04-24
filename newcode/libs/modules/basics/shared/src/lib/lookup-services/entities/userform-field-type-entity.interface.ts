/*
 * Copyright(c) RIB Software GmbH
 */

export class IBasicUserFormFieldTypeEntity {
	public constructor(public Id: number) {

	}

	/**
	 * description
	 */
	public Description?: string;
	public SortIndx?: number;
	public Value?: number;
}
