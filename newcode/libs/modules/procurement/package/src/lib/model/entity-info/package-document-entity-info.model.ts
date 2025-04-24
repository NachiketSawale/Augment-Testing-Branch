/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcDocumentEntity, ProcurementCommonDocumentEntityInfo } from '@libs/procurement/common';

import { ProcurementPackageDocumentDataService } from '../../services/procurement-package-document-data.service';

import { IPrcPackageEntity } from '@libs/procurement/interfaces';
import { PrcPackageCompleteEntity } from '../entities/package-complete-entity.class';

/**
 * Procurement Package Document Entity Info
 */
export const PROCUREMENT_PACKAGE_DOCUMENT_ENTITY_INFO = ProcurementCommonDocumentEntityInfo.create<IPrcDocumentEntity, IPrcPackageEntity, PrcPackageCompleteEntity>({
	permissionUuid: '3899AD6A9FCE4B75981A350D4F5C1F6B',
	formUuid: '8BB802CB31B84625A8848D370142B95C',
	dataServiceToken: ProcurementPackageDocumentDataService,
});
