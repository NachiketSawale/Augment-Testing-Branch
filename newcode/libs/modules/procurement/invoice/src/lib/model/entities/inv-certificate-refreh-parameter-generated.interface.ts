/*
 * Copyright(c) RIB Software GmbH
 */

import { IInvCertificateEntity } from './inv-certificate-entity.interface';
import { IInvHeaderEntity } from './inv-header-entity.interface';

export interface IInvCertificateRefrehParameterGenerated {
	/*
	 * conHeaderFromItems
	 */
	conHeaderFromItems?: number[] | null;

	/*
	 * conHeaderFromPes
	 */
	conHeaderFromPes?: number[] | null;

	/*
	 * invCertificates
	 */
	invCertificates?: IInvCertificateEntity[] | null;

	/*
	 * invHeader
	 */
	invHeader?: IInvHeaderEntity | null;
}
