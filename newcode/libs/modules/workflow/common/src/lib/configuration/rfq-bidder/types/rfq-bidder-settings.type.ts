/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the type used in RFQ bidder settings container.
 */
export type RfqBidderSettings = {
	[key: string]: boolean | string;
	ClerkEmailBcc: boolean;
	SendWithOwnMailAddress: boolean;
	GenerateSafeLink: boolean;
	DisableDataFormatExport: boolean;
	ReplyToClerk: boolean;
	DisableZipping: boolean;
	LinkAndAttachment: boolean;
	FileNameFromDescription: boolean;
	AdditionalEmailForBCC: string;
}