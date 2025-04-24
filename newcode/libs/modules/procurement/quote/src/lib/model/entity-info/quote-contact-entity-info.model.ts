/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonContactEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteContactDataService } from '../../services/quote-contact-data.service';

export const PROCUREMENT_QUOTE_CONTACT_ENTITY_INFO = ProcurementCommonContactEntityInfo.create({
	permissionUuid: '13E7F8A9CE0444489ED1FA96CB43C79D',
	formUuid: 'AD21F3560B124B12A7764B0A761340C2',
	dataServiceToken: ProcurementQuoteContactDataService
});