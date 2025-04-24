import { CompleteIdentification } from '@libs/platform/common';
import { ICertificateDocumentEntity } from '@libs/resource/interfaces';

export class ResourceCertificateDocumentComplete implements CompleteIdentification<ICertificateDocumentEntity>{

	public Id: number = 0;

	public Datas: ICertificateDocumentEntity[] | null = [];


}
