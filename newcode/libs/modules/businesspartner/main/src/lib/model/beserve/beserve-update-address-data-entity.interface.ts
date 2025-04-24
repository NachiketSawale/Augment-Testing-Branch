/*
 * Copyright(c) RIB Software GmbH
 */

export interface IBeserveUpdateAddressDataEntity {
	bpid: number;
	beserveupdatestatus: number;
	newname?: string | null;
	newaddress?: string | null;
	newphone?: string | null;
	newfax?: string | null;
	updateinfo?: string | null;
}
