/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PaymentTermDataService } from '../services/basics-payment-main.service';
import { IPaymentTermEntity } from '../model/entities/payment-term-entity.interface';

// export const BASICS_TAX_CODE_BEHAVIOR_TOKEN = new InjectionToken<BasicsTaxCodeBehavior>('basicsTaxCodeBehavior');
@Injectable({
	providedIn: 'root',
})
export class BasicsPaymentTermBehavior implements IEntityContainerBehavior<IGridContainerLink<IPaymentTermEntity>, IPaymentTermEntity> {
	private dataService: PaymentTermDataService;

	public constructor() {
		this.dataService = inject(PaymentTermDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IPaymentTermEntity>): void {
	}

}