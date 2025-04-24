/*
 * Copyright(c) RIB Software GmbH
 */

import { RfqBidderWizardContainers } from '../enum/rfq-bidder-containers.enum';
import { IGenericWizardReportEntity } from './generic-wizard-report-entity.interface';
import { RfqBidderBoq } from './rfq-bidder-boq.type';
import { RfqBidderDataFormat } from './rfq-bidder-data-format.type';
import { RfqBidderProjectDocument } from './rfq-bidder-project-document.type';
import { RfqBidderSender } from './rfq-bidder-sender.type';
import { RfqBidderSettings } from './rfq-bidder-settings.type';
import { RfqBidders } from './rfq-bidders.type';

/**
 * A map of generic wizard container uuid to the entity used in the container.
 * This is used to strongly type the items that will be retrieved by the service in the container.
 */
export type RfqBidderWizardUuidTypeMap = {
	[RfqBidderWizardContainers.RFQ_BIDDER]: RfqBidders;
	[RfqBidderWizardContainers.RFQ_BIDDER_SETTINGS]: RfqBidderSettings;
	[RfqBidderWizardContainers.RFQ_DATA_FORMAT]: RfqBidderDataFormat;
	[RfqBidderWizardContainers.RFQ_SENDER]: RfqBidderSender;
	[RfqBidderWizardContainers.RFQ_BIDDER_DOCUMENTS_PROJECT]: RfqBidderProjectDocument;
	[RfqBidderWizardContainers.RFQ_BIDDER_DOCUMENTS]: RfqBidderProjectDocument;
	[RfqBidderWizardContainers.RFQ_BIDDER_Report]: IGenericWizardReportEntity;
	[RfqBidderWizardContainers.RFQ_BIDDER_COVER_LETTER]: IGenericWizardReportEntity;
	[RfqBidderWizardContainers.RFQ_PROCUREMENT_STRUCTURE_DOCUMENTS]: RfqBidderProjectDocument;
	[RfqBidderWizardContainers.RFQ_CLERKDOCUMENTS]: RfqBidderProjectDocument;
	[RfqBidderWizardContainers.RFQ_BIDDER_BOQ_SELECT]: RfqBidderBoq;
	[RfqBidderWizardContainers.TRANSMISSION]: RfqBidders;
}