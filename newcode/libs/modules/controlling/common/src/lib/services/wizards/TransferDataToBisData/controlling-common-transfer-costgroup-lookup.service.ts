/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IBasicsCostGroupCache } from '@libs/basics/shared';
import * as _ from 'lodash';
import { IBasicsSharedCostGroupCatalogConfigDataService, ICostGroupCatEntity } from '@libs/basics/shared';
import { ICostGroupCatalog } from './controlling-common-transfer-data-wizard-options';

@Injectable({
	providedIn: 'root',
})
export class ControllingCommonTransferCostgroupLookupService {
	private costGroupCatalogList: ICostGroupCatalog[] = [];
	private readonly costGroupCatalogConfigDataService = inject(IBasicsSharedCostGroupCatalogConfigDataService);

	public constructor() {}

	public async getCostGroupCatalogList(projectId: number) {
		const configModuleName = 'Estimate';
		const costGroupCatalogConfigService = this.costGroupCatalogConfigDataService.getProjectCostGroupCatalogService(projectId);

		const result = await costGroupCatalogConfigService.loadConfig(configModuleName);

		this.setControllingCostGroupCatalogs(result);

		return this.costGroupCatalogList;
	}

	private setControllingCostGroupCatalogs(data: IBasicsCostGroupCache) {
		if (!data) {
			return;
		}

		const configurationAssign = data.configurationAssign ? data.configurationAssign : [];
		const enterpriseCostGroupCatalogList: ICostGroupCatalog[] = [];
		const isControllingCatalog = (costGroupCatalog: ICostGroupCatEntity, isProject: boolean) => {
			const config = _.find(configurationAssign, function (item) {
				return isProject ? item.Code === costGroupCatalog.Code : item.CostGroupCatalogFk === costGroupCatalog.Id;
			});

			return config && config.IsControlling;
		};

		if (data.licCostGroupCats) {
			_.forEach(data.licCostGroupCats, function (c) {
				if (isControllingCatalog(c, false)) {
					enterpriseCostGroupCatalogList.push({
						Id: c.Id,
						Classification: c.Code,
						Code: c.Code,
						DescriptionInfo: c.DescriptionInfo,
						IsProjectCatalog: false,
					});
				}
			});
		}
		if (data.prjCostGroupCats) {
			_.forEach(data.prjCostGroupCats, function (d) {
				if (isControllingCatalog(d, true)) {
					enterpriseCostGroupCatalogList.push({
						Id: d.Id,
						Classification: d.Code,
						Code: d.Code,
						DescriptionInfo: d.DescriptionInfo,
						IsProjectCatalog: true,
					});
				}
			});
		}

		this.costGroupCatalogList = enterpriseCostGroupCatalogList;
	}
}
