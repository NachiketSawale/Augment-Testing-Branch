import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { CertificateHelperService } from './certificate-helper-service.class';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';

export class CertificateEntityInfo {
	/**
	 * Creates a new instance of type {@link EntityInfo} based on a typed configuration object.
	 * @param config The configuration object.
	 */
	public static create(config: { [key in keyof IEntityInfo<ICertificateEntity>]: IEntityInfo<ICertificateEntity>[key] }) {

		const options = {
			grid: {
				title: {
					text: 'Actual Certificates',
					key: 'businesspartner.certificate' + '.actualCertificateListContainerTitle'
				},
				containerUuid: '9299c9b28b41432dac41fee1d53eb868',
			},
			form: {
				title: {
					text: 'Actual Certificate Detail',
					key: 'businesspartner.certificate' + '.actualCertificateDetailContainerTitle'
				},
				containerUuid: 'eb367ee13d5844d8b9092fefc65e3b17',
			},
			permissionUuid: '2c39331cf48c4016af9d17a573388100',
			dataService: config.dataService,
			dtoSchemeId: {
				moduleSubModule: 'BusinessPartner.Certificate',
				typeName: 'CertificateDto'
			},
		};

		CertificateHelperService.extendOptions(options, config);

		return EntityInfo.create<ICertificateEntity>(options);
	}
}