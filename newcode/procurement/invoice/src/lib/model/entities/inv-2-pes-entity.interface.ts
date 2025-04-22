/*
 * Copyright(c) RIB Software GmbH
 */

import { IInv2PESEntityGenerated } from './inv-2-pes-entity-generated.interface';

export interface IInv2PESEntity extends IInv2PESEntityGenerated {

	/*
	 * ValueGross
	 */
	ValueGross?: number;

	/*
	 * ValueOcGross
	 */
	ValueOcGross?: number;
}
