/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { RightSelectionStatementComponent } from '../../components/selection-statement/right-selection-statement/right-selection-statement.component';
import { EstimateLineItemSelectionStatementDataService } from './estimate-line-item-selection-statement-data.service';
import { EstimateLineItemSelectionStatementBehavior } from './estimate-line-item-selection-statement-behavior.service';
import { EstimateLineItemSelectionStatementLayoutService } from './estimate-line-item-selection-statement-layout.service';
import { IEstLineItemSelStatementEntity } from '@libs/estimate/interfaces';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { SelectionStatementContainerComponent } from '../../components/selection-statement/selection-statement-container/selection-statement-container.component';
import { SelectionStatementContainerConfigToken } from './interfaces/selection-statement-container-config.interface';

/**
 * Estimate Line Item Selection Statement Entity Info
 */
export const ESTIMATE_LINEITEM_SELECTION_STATEMENT_ENTITY_INFO = EntityInfo.create<IEstLineItemSelStatementEntity>({
	grid: {
		title: { text: 'LineItem Selection Statement', key: 'estimate.main.lineItemSelStatement.containerTitle' },
		containerUuid: 'c90e5cf712f646a1b163d8ef308c1960',
		containerType: SelectionStatementContainerComponent,
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IEstLineItemSelStatementEntity) {
					const service = ctx.injector.get(EstimateLineItemSelectionStatementDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IEstLineItemSelStatementEntity) {
					const service = ctx.injector.get(EstimateLineItemSelectionStatementDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IEstLineItemSelStatementEntity>;
		},
		providers: (ctx) => [
			{
				provide: SelectionStatementContainerConfigToken,
				useValue: {
					rightContainerType: RightSelectionStatementComponent
					/*providers: [
						{
							provide: EstimateLineItemSelStatementFilterLookupService,
							useValue: ctx.injector.get(EstimateLineItemSelStatementFilterLookupService),
						},
					],*/
				},
			},
		],
	},
	dataService: (ctx) => ctx.injector.get(EstimateLineItemSelectionStatementDataService),
	dtoSchemeId: {
		typeName: 'EstLineItemSelStatementDto',
		moduleSubModule: 'Estimate.Main',
	},
	permissionUuid: '49e56a48a2b5481189f871774a0e641a',
	layoutConfiguration: (ctx) => ctx.injector.get(EstimateLineItemSelectionStatementLayoutService).generateLayout(),
	containerBehavior: (ctx) => ctx.injector.get(EstimateLineItemSelectionStatementBehavior)
});
