/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import {
    IDataServiceChildRoleOptions,
    IDataServiceEndPointOptions,
    DataServiceFlatLeaf
} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { BasicsBillingSchemaDataService } from './basics-billing-schema-data.service';
import { IBillingSchemaDetailEntity, IRubricCategoryTreeItemEntity, RubricCategoryTreeComplete } from '@libs/basics/interfaces';
import { BasicsBillingSchemaRubricCategoryDataService } from './basics-billing-schema-rubric-category-data.service';
import * as _ from 'lodash';

/**
 * Basics illing Schema Details DataService
 */
@Injectable({
    providedIn: 'root'
})

export class BasicsBillingSchemaDetailsDataService extends DataServiceFlatLeaf<IBillingSchemaDetailEntity, IRubricCategoryTreeItemEntity,RubricCategoryTreeComplete> {
    public constructor(
        private headerService: BasicsBillingSchemaDataService,
		private rubricCategoryService: BasicsBillingSchemaRubricCategoryDataService,
    ) {
        const options: IDataServiceOptions<IBillingSchemaDetailEntity> = {
            apiUrl: 'basics/billingschema/billingschemadetail',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'list',
                usePost: true,
            },
            roleInfo: <IDataServiceChildRoleOptions<IBillingSchemaDetailEntity,IRubricCategoryTreeItemEntity,RubricCategoryTreeComplete>>{
                role: ServiceRole.Leaf,
                itemName: 'BillingSchemaDetail',
                parent: rubricCategoryService
            }
        };

        super(options);
    }

    protected override provideLoadPayload(): object {
        const headerSelection = this.headerService.getSelection();
        const rubricCategoryServiceSelection = this.rubricCategoryService.getSelection();
        if (headerSelection.length > 0 && rubricCategoryServiceSelection.length > 0) {
            const headerEntity = headerSelection[0];
            const rubricCategoryEntity = rubricCategoryServiceSelection[0];
            return {MainItemId: headerEntity.Id, RubricCategoryId: rubricCategoryEntity.Id, RubricId: -1};
        } else {
            throw new Error('There should be a selected parent catalog to load the inter company data');
        }
    }

    protected override onLoadSucceeded(loaded: object): IBillingSchemaDetailEntity[] {
		if (loaded) {
			return _.get(loaded, 'Main', []);
		}
		return [];
	}
}
