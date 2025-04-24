/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {EntityInfo} from '@libs/ui/business-base';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {SalesSharedTransactionBehavior} from '../../behavior/sales-shared-transaction-behavior.service';
import { SalesSharedGeneralBehavior } from '../../behavior/sales-shared-general-behavior.service';
import { SalesSharedGeneralsLayoutService } from '../../services/sales-shared-generals-layout.service';

@Injectable({
    providedIn: 'root'
})
export class SalesSharedEntityInfo {

    public getTransactionEntityInfo(containerId: string,
                         permissionId: string,
                         dtoType: string,
                         moduleSubModule: string,
                         dataService: object): EntityInfo {
        return EntityInfo.create<object> ({
            grid: {
				  title: { key: 'procurement.common.transaction.title'},
                behavior: ctx => ctx.injector.get(SalesSharedTransactionBehavior),
            },
            form: {
					title: { key: 'procurement.common.transaction.detailTitle' },
                containerUuid: containerId
            },
            dataService: ctx => ctx.injector.get(dataService),
            dtoSchemeId: {moduleSubModule: moduleSubModule, typeName: dtoType},
            permissionUuid: permissionId,
            layoutConfiguration: {
                groups: [
                    { gid: 'Basic Data', attributes: ['TransactionId', 'CompanyFk', 'Isconsolidated', 'Ischange', 'Currency', 'Code',
                            'Description']
                    },
                ],
                overloads: {

                },
                labels: {
                    ...prefixAllTranslationKeys('sales.contract.', {

                    }),
                },
            }
        });
    }

	public getGeneralEntityInfo(containerId: string,
	                     permissionId: string,
	                     dtoType: string,
	                     moduleSubModule: string,
	                     dataService: object): EntityInfo {
		return EntityInfo.create<object> ({
			grid: {
				title: {text: 'Generals', key: 'sales.common.generals.titleList'},
				behavior: ctx => ctx.injector.get(SalesSharedGeneralBehavior)
			},
			form: {
				title: {text: 'General Detail', key: 'sales.common.generals.titleDetail'},
				containerUuid: containerId,
			},
			dataService: context => context.injector.get(dataService),
			dtoSchemeId: {moduleSubModule: moduleSubModule, typeName: dtoType},
			permissionUuid: permissionId,
			layoutConfiguration: context => {
				return context.injector.get(SalesSharedGeneralsLayoutService).generateLayout();
			}
		});
	}
}