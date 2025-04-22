/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProcurementPurchaseOrderType } from '../model/enums';
import { IConPurchaseOrderEntity } from '@libs/procurement/interfaces';

/**
 * Service of determining the type of contract purchase order
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementContractPurchaseOrderTypeService {

	/**
	 * check the contract whether is change order
	 * @param contractEntity
	 */
	public static isChangeOrder(contractEntity: IConPurchaseOrderEntity): boolean {
		return contractEntity.PurchaseOrders === ProcurementPurchaseOrderType.ChangeOrder;
	}

	/**
	 * check the contract whether is call off
	 * @param contractEntity
	 */
	public static isCallOff(contractEntity: IConPurchaseOrderEntity): boolean {
		return contractEntity.PurchaseOrders === ProcurementPurchaseOrderType.CallOff;
	}

	/**
	 * check the contract whether is framework
	 * @param entity
	 */
	public static isFramework(entity: IConPurchaseOrderEntity): boolean {
		return entity.PurchaseOrders === ProcurementPurchaseOrderType.FrameworkContract || entity.IsFramework;
	}

	/**
	 * check the contract whether is framework by setting material catalog or boqWicCatFk
	 * @param entity
	 */
	public static isFrameworkByWicNMdcCatalog(entity: IConPurchaseOrderEntity): boolean {
		return (!entity.ConHeaderFk && !!(entity.BoqWicCatFk || entity.MaterialCatalogFk));
	}

	/**
	 * check the contract whether is framework by setting boqWicCatFk
	 * @param entity
	 */
	public static isFrameworkContractCallOffByWic(entity: IConPurchaseOrderEntity): boolean {
		return (!entity.ConHeaderFk && !!(entity.BoqWicCatFk));
	}

	/**
	 * check the contract whether is framework by setting material catalog
	 * @param entity
	 */
	public static isFrameworkContractCallOffByMdc(entity: IConPurchaseOrderEntity): boolean {
		return (!entity.ConHeaderFk && !!(entity.MaterialCatalogFk));
	}
}