/*
 * Copyright(c) RIB Software GmbH
 */
import {Component, Input} from '@angular/core';
import {ProcurementTicketSystemOrderRequestScope} from '../../model/order-request-scope';
import {IReqStatusEntity} from '../../model/interfaces/req-status-entity.interface';
import {formatNumber} from 'accounting';
import { IPrcOrderQueryItemEntity } from '../../model/interfaces/prc-order-query-item-entity.interface';

/**
 * order request card
 */
@Component({
    selector: 'procurement-ticket-system-order-card',
    templateUrl: './order-card.component.html',
    styleUrls: ['./order-card.component.scss']
})
export class ProcurementTicketSystemOrderCardComponent {
    /**
     * Order Request scope
     */
    @Input()
    public scope!: ProcurementTicketSystemOrderRequestScope;

    /**
     * Order Request entity
     */
    @Input()
    public dataItem!: IPrcOrderQueryItemEntity;
    /**
     * Show Details
     */
    public IsShowDetails: boolean = false;
    /**
     * Show Delete Button
     */
    public showDeleteBtn: boolean = true;

    /**
     * initialization
     */
    public ngOnInit() {
	    this.showDeleteBtn = (this.dataItem?.ReqStatus && (!this.dataItem.ReqStatus.Iscanceled && !this.dataItem.ReqStatus.Isordered))
		    ?? (this.dataItem?.ConStatus && (!this.dataItem.ConStatus.Iscanceled && !this.dataItem.ConStatus.Isordered))
		    ?? false;
    }

    /**
     * format total
     */
    public get totalInfo() {
        const total = this.dataItem.Total;
        return formatNumber(total, 2, ',', '.');
    }

    /**
     * order Delete
     */
    public orderDelete(entity: IPrcOrderQueryItemEntity) {
        this.scope.orderRequestService.DeleteItem$(entity).then((res) => {
            if (res) {
                const response = res as IReqStatusEntity;
                this.showDeleteBtn = false;
                entity.ReqStatus = response;
                entity.ReqStatusFk = response.Id;
            }
        });
    }

    /**
     * show or hide Details
     */
    public showDetails() {
        this.IsShowDetails = !this.IsShowDetails;
    }
}
