import { CompleteIdentification } from '@libs/platform/common';
import { ICertificatedPlantEntity, ICertificateEntity } from '@libs/resource/interfaces';

export class ResourceCertificateComplete implements CompleteIdentification<ICertificateEntity>{

	public CertificateId: number = 0;

	public Certificates: ICertificateEntity [] | null = [];

	public CertificatedPlantsToSave : ICertificatedPlantEntity [] | null=[];

	public CertificatedPlantsToDelete : ICertificatedPlantEntity [] | null=[];


}
