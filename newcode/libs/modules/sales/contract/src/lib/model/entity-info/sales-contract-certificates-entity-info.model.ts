import { EntityInfo } from '@libs/ui/business-base';
import { SalesCommonCertificateLayoutService } from '@libs/sales/common';
import { SalesContractCertificateBehavior } from '../../behaviors/sales-contract-certificate-behavior.service';
import { SalesContractCertificatesDataService } from '../../services/sales-contract-certificate-data.service';
import { IOrdCertificateEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_CERTIFICATES_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrdCertificateEntity> ({
	grid: {
		title: {key: 'sales.common.certificateContainerListTitle'},
		behavior: ctx => ctx.injector.get(SalesContractCertificateBehavior),
	},
	form: {
		title: { key: 'sales.common.certificateContainerDetailTitle' },
		containerUuid: '80a057f19ea94187acdbbbdf17d124fb'
	},
	dataService: ctx => ctx.injector.get(SalesContractCertificatesDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdCertificateDto'},
	permissionUuid: '468925bdac6a4e47b6c6719a8686f95a',
	layoutConfiguration: context => {
        return context.injector.get(SalesCommonCertificateLayoutService).generateLayout();
    }
});