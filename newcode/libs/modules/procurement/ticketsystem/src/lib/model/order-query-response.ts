/*
 * Copyright(c) RIB Software GmbH
 */
import { IPrcOrderQueryItemEntity } from './interfaces/prc-order-query-item-entity.interface';

/**
 * Order query response model
 */
export class ProcurementTicketSystemOrderQueryResponse {
    /**
     * Max count of Order Request
     */
    public TotalItems = 0;

    /**
     * Order Request entities
     */
    public Result: IPrcOrderQueryItemEntity[] = [];
}
