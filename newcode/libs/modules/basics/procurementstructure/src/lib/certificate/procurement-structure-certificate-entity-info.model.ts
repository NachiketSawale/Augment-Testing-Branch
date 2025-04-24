/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import {BasicsProcurementStructureCertificateLayoutService} from './basics-procurement-structure-certificate-layout.service';
import {BasicsProcurementStructureCertificateDataService} from './basics-procurement-structure-certificate-data.service';
import { IPrcConfiguration2CertEntity } from '../model/entities/prc-configuration-2-cert-entity.interface';

export const PROCUREMENT_STRUCTURE_CERTIFICATE_ENTITY_INFO = EntityInfo.create<IPrcConfiguration2CertEntity>({
	dtoSchemeId: { moduleSubModule: 'Basics.ProcurementStructure', typeName: 'PrcConfiguration2CertDto' },
	permissionUuid: '14a291fd061c4261a4f9d984638903d8',
	grid: {
		title: { text: 'Certificate', key: 'basics.procurementstructure.certificatesContainerTitle' },
	},
	form: {
		containerUuid: '923226d28f17486b96f446cdce269d90',
		title: { text: 'Certificate Detail', key: 'basics.procurementstructure.certificatesDetailContainerTitle' },
	},
	dataService: ctx => ctx.injector.get(BasicsProcurementStructureCertificateDataService),
	layoutConfiguration: context => {
		return context.injector.get(BasicsProcurementStructureCertificateLayoutService).generateLayout();
	}
});
