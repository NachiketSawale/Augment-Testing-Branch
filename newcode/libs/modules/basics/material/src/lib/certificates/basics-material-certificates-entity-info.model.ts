/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialCertificatesDataService } from './basics-material-certificates-data.service';
import { BasicsMaterialCertificatesLayoutService } from './basics-material-certificates-layout.service';
import { IMaterial2CertificateEntity } from '../model/entities/material-2-certificate-entity.interface';
import { BasicsMaterialCertificatesValidationService } from './basics-material-certificates-validation.service';

/**
 * Basics Material Certificates Module Info
 */
export const BASICS_MATERIAL_CERTIFICATES_ENTITY_INFO = EntityInfo.create<IMaterial2CertificateEntity>({
	grid: {
		title: { text: 'Material Certificates', key: 'basics.material.certificate.listTitle' }
	},
	form: {
		containerUuid: '42b48e9002794059b5e773f65adb5f0c',
		title: { text: 'Material Certificates Detail', key: 'basics.material.certificate.formTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsMaterialCertificatesDataService),
	validationService: (ctx) => ctx.injector.get(BasicsMaterialCertificatesValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'Material2CertificateDto' },
	permissionUuid: '327797c391a948d4bffb252099bdc6a3',
	layoutConfiguration: context => {
		return context.injector.get(BasicsMaterialCertificatesLayoutService).generateLayout();
	}
});