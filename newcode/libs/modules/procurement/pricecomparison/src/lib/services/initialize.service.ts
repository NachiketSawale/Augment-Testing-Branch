/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import * as _ from 'lodash';
import { ProcurementPricecomparisonConfigurationService } from './configuration.service';
import { ProcurementPricecomparisonUtilService } from './util.service';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedTaxCodeLookupService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonInitializeService {
	private readonly http = inject(PlatformHttpService);
	private readonly configService = inject(ProcurementPricecomparisonConfigurationService);
	private readonly utilService = inject(ProcurementPricecomparisonUtilService);
	private readonly mdcTaxCodeSvc = inject(BasicsSharedTaxCodeLookupService);

	/*public getBoqItemTypeCodes() {
		return this.__boqItemTypeCodes;
	}

	public setBoqItemTypeCodes() {
		if (!this.__boqItemTypeCodes) {
			this.__boqItemTypeCodes = [];
		}
		return simpleLookupService.getList({
			lookupModuleQualifier: 'basics.lookup.boqitemtypecode',
			displayMember: 'Code',
			valueMember: 'Id'
		}).then(function (result) {
			this.__boqItemTypeCodes = result;
		});
	}

	public getBoqItemType2Codes() {
		return public
		__boqItemType2Codes;
	}

	public setBoqItemType2Codes() {
		if (!this.__boqItemType2Codes) {
			this.__boqItemType2Codes = [];
		}
		return simpleLookupService.getList({
			lookupModuleQualifier: 'basics.lookup.boqitemtype2code',
			displayMember: 'Code',
			valueMember: 'Id'
		}).then(function (result) {
			this.__boqItemType2Codes = result;
		});
	}

	public getBoqLineTypes() {
		return this.__boqLineTypes;
	}

	public setBoqLineTypes() {
		if (!this.__boqLineTypes) {
			this.__boqLineTypes = [];
		}
		return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getboqlinetypes').then(function (response) {
			this.__boqLineTypes = _.filter(response.data.BoqLineType, function (item) {
				return (item.Id >= 1 && item.Id <= 9) || item.Id === 103;
			});
		});
	}

	public setProjectChangeStatus() {
		if (!this.__projectChangeStatus) {
			this.__projectChangeStatus = [];
		}
		return simpleLookupService.getList({
			lookupModuleQualifier: 'basics.customize.projectchangestatus',
			displayMember: 'Description',
			valueMember: 'Id',
			filter: {
				field: 'RubricCategoryFk',
				customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK'
			}
		}).then(function (result) {
			this.__projectChangeStatus = result;
		});
	}*/

	// TODO-DRIZZLE: To be checked.
	private getActiveView(): Promise<object> {
		const params = {
			moduleName: 'procurement.pricecomparison',
			formatVersion: 2
		};
		return this.http.get<object[]>('basics/layout/gettabs', {
			params: params
		}).then(tabs => {
			const activeTab = _.find(tabs, (tab) => {
				return _.get(tab, 'Id') as unknown as number === 924;
			}) as {
				Views: Array<{ ModuleTabViewConfigEntities: object[], Description: string | null }>
			};

			const activeView = activeTab.Views.find(v => v.Description === null);
			return activeView as object;
		});
	}

	public prepareData(): Promise<void> {
		return new Promise<void>((resolve) => {
			Promise.all([
				this.configService.load(),
				this.getActiveView(),
				this.mdcTaxCodeSvc.getList()
			]).then((results) => {
				this.utilService._currentActiveView = results[1] as object;
				resolve();
			});
		});
	}
}