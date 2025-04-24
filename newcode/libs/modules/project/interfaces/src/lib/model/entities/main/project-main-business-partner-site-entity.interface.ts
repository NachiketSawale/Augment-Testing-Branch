/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectMainBusinessPartnerSiteEntityGenerated } from './project-main-business-partner-site-entity-generated.interface';

export interface IProjectMainBusinessPartnerSiteEntity extends IProjectMainBusinessPartnerSiteEntityGenerated {

	TelephoneNumberFk: number | null;
	Email: string;
}