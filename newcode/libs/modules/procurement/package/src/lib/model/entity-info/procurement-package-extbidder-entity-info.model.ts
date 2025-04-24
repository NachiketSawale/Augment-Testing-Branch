/*
 * Copyright(c) RIB Software GmbH
 */
import { ProcurementCommonExtBidderEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageExtBidderDataService } from '../../services/procurement-package-extbidder-data.service';

/**
 * Procurement Package Ext Bidder Entity Info
 */
export const PROCUREMENT_PACKAGE_EXT_BIDDER_ENTITY_INFO = ProcurementCommonExtBidderEntityInfo.create({
	permissionUuid:'de4193fe7caf4aa1bd69c0fcaac8041d',
	formUuid:'d3c764793b92489eabd741230a7c2741',
	dataServiceToken:ProcurementPackageExtBidderDataService,
});