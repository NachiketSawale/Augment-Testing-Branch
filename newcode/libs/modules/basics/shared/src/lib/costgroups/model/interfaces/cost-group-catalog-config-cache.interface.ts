/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCostGroupCatalogConfigService } from '../../services/basics-shared-cost-group-catalog-config.service';

export interface ICostGroupCatalogConfigCache {
	key: string;
	service: BasicsSharedCostGroupCatalogConfigService;
}
