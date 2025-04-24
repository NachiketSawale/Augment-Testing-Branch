import { CompleteIdentification } from '@libs/platform/common';
import { IOrdCertificateEntity } from '@libs/sales/interfaces';

export class SalesContractCertificatesComplete implements CompleteIdentification<IOrdCertificateEntity>{

	public Id: number = 0;
	public CertificateEntityToSave: IOrdCertificateEntity[] | null = [];
}