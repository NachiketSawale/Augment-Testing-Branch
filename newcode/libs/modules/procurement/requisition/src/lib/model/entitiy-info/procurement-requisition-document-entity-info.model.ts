/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcDocumentEntity, ProcurementCommonDocumentEntityInfo } from '@libs/procurement/common';

import { IReqHeaderEntity } from '../entities/reqheader-entity.interface';
import { ReqHeaderCompleteEntity } from '../entities/requisition-complete-entity.class';
import { ProcurementRequisitionDocumentDataService } from '../../services/requisition-document-data.service';

/**
 * Procurement Requisition Document Entity Info
 */

export const PROCUREMENT_REQUISITION_DOCUMENT_ENTITY_INFO = ProcurementCommonDocumentEntityInfo.create<IPrcDocumentEntity, IReqHeaderEntity, ReqHeaderCompleteEntity>({
	permissionUuid: '4006012996104D98A9A6BC11D4B0BEA4',
	formUuid: '34188fb16cb44bb5a0c47302426c3925',
	dataServiceToken: ProcurementRequisitionDocumentDataService,
});
