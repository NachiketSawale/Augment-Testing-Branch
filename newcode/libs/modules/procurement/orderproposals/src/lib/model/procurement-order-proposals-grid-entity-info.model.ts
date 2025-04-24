/*
 * Copyright(c) RIB Software GmbH
 */
 
import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementOrderProposalsGridDataService } from '../services/procurement-order-proposals-grid-data.service';
import { ProcurementOrderProposalsGridLayoutService } from '../services/procurement-order-proposals-grid-layout.service';
import { IOrderProposalEntity } from './entities/order-proposal-entity.interface';

 export const PROCUREMENT_ORDER_PROPOSALS_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrderProposalEntity> ({
                grid: {
                    title: {key: 'procurement.orderproposals' + '.title.header'},
                },
                form: {
			    title: { key: 'procurement.orderproposals' + '.title.headerDetail' },
			    containerUuid: 'b2f6d32032a04c75b3a13dac2a439769',
		        },
                dataService: ctx => ctx.injector.get(ProcurementOrderProposalsGridDataService),
                dtoSchemeId: {moduleSubModule: 'Procurement.OrderProposals', typeName: 'OrderProposalDto'},
                permissionUuid: 'f381ad3099f34acabc936ae4d95f728d',
                layoutConfiguration: context => {
                    return context.injector.get(ProcurementOrderProposalsGridLayoutService).generateLayout();
                }                    
            });