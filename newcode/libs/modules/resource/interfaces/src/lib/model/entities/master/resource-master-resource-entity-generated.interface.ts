/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IResourceMasterResourceEntityGenerated extends IEntityIdentification, IEntityBase {
	 SiteFk: number;
	 ResourceContextFk?: number | null;
	 TypeFk: number;
	 KindFk: number;
	 GroupFk: number;
	 DispatcherGroupFk?: number | null;
	 CompanyFk?: number | null;
	 CalendarFk?: number | null;
	 UomBasisFk: number;
	 UomTimeFk?: number | null;
	 Code: string | null;
	 DescriptionInfo?: IDescriptionInfo | null;
	 ExternalCode?: string | null;
	 Capacity: number;
	 Validfrom?: Date | null;
	 Validto?: Date | null;
	 Remark?: string | null;
	 Userdefined1?: string | null;
	 Userdefined2?: string | null;
	 Userdefined3?: string | null;
	 Userdefined4?: string | null;
	 Userdefined5?: string | null;
	 IsLive: boolean;
	 SearchPattern?: string | null;
	 SortCode?: string | null;
	 ItemFk?: number | null;
	 BusinessPartnerFk?: number | null;
	 ClerkFk?: number | null;
}