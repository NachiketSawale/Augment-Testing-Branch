/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {map} from 'rxjs';
import {ProcurementTicketSystemCartItemResponse,ProcurementTicketSystemCartItemHttpResponse} from '../model/cart-item-reponse';
import {ISubmitEntity} from '../model/interfaces/submit-entity.interface';

/**
 * cart item service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementTicketSystemCartItemService {
    protected http = inject(HttpClient);
    protected configurationService = inject(PlatformConfigurationService);
    protected webApiBaseUrl = this.configurationService.webApiBaseUrl;
    protected queryPath = this.configurationService.webApiBaseUrl + 'procurement/ticketsystem/cartitem/';
    protected defaultConfigurationUrl = this.configurationService.webApiBaseUrl + 'basics/procurementconfiguration/configuration/defaultbyrubric';
    protected submitPath = this.configurationService.webApiBaseUrl + 'procurement/ticketsystem/submitcart/';

    /**
     * Initialize load
     */
    public loadCartItem() {
        return this.http.get(this.queryPath + 'list').pipe(map((res) => {
            const response = res as ProcurementTicketSystemCartItemHttpResponse;
            return this.createResponse(response);
        }));
    }

    public createResponse(httpResponse: ProcurementTicketSystemCartItemHttpResponse) {
        const response = new ProcurementTicketSystemCartItemResponse();
        response.cartList = httpResponse.Items;
        response.homeCurrency = httpResponse.HomeCurrency;
        response.cartTotal = 0;
        return response;
    }

    /**
     * load default Configuration
     */
    public getDefaultConfiguration(rubricFk: number) {
        return this.http.get(this.defaultConfigurationUrl + '?rubric=' + rubricFk);
    }

    /**
     * add cart item
     */
    public add() {
        return this.http.post(this.queryPath + 'add', []);
    }

    /**
     * clear cart item
     */
    public clear() {
        return this.http.post(this.queryPath + 'clear', []);
    }

    /**
     * delete cart item
     */
    public delete(id: number) {
        return this.http.get(this.queryPath + 'delete?materialId=' + id);
    }

    /**
     * load cart item
     */
    public loadSubmitCart(projectId: number, structureId: number) {
        return this.http.get(this.submitPath + 'list?projectFK=' + projectId + '&structureId=' + structureId);
    }

    /**
     * place Order
     */
    public placeOrder(submitCartEntity: ISubmitEntity) {
        return this.http.post(this.submitPath + 'place', submitCartEntity);
    }

    /**
     * get Address By ProjectId
     */
    public getAddressByProject(projectId: number) {
        return this.http.get(this.webApiBaseUrl + 'project/main/byid?id=' + projectId);
    }
}