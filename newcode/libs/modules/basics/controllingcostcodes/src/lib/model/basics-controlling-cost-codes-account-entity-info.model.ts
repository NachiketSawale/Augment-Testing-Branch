/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsControllingCostCodesAccountDataService } from '../services/basics-controlling-cost-codes-account-data.service';
import { IAccount2MdcContrCostEntity } from './entities/account-2mdc-contr-cost-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const BASICS_CONTROLLING_COST_CODES_ACCOUNT_ENTITY_INFO: EntityInfo = EntityInfo.create<IAccount2MdcContrCostEntity>({
	grid: {
		title: {key: 'basics.controllingcostcodes.account'},
	},
	dataService: ctx => ctx.injector.get(BasicsControllingCostCodesAccountDataService),
	dtoSchemeId: {moduleSubModule: 'Basics.ControllingCostCodes', typeName: 'Account2MdcContrCostDto'},
	permissionUuid: '8a15f3b3c08248249a5b564bd9af9957',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['MdcContextFk', 'MdcLedgerContextFk', 'BasAccountFk', 'Factor', 'NominalDimension1', 'NominalDimension2', 'NominalDimension3']
			}
		],
		overloads: {
			// TODO: MdcContextFk
			// TODO: MdcLedgerContextFk:
		},
		labels: {
			...prefixAllTranslationKeys('basics.controllingcostcodes.', {
				MdcContextFk: {key: 'mdcContextFk'},
				MdcLedgerContextFk: {key: 'mdcLedgerContextFk'},
				BasAccountFk: {key: 'basAccountFk'},
				Factor: {key: 'factor'},
				NominalDimension1: {key: 'nominalDimension1'},
				NominalDimension2: {key: 'nominalDimension2'},
				NominalDimension3: {key: 'nominalDimension3'},
			})
		}
	}
});