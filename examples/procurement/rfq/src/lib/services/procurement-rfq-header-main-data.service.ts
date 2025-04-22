/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IRfqHeaderEntity, IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { RfqHeaderEntityComplete } from '../model/entities/rfq-header-entity-complete.class';
import { BasicsSharedTreeDataHelperService } from '@libs/basics/shared';
import { EntityProxy, PrcRfqStatusLookupService } from '@libs/procurement/shared';
import {
	IExchangeRateChangedEvent,
	IPaymentTermChangedEvent, IPrcCommonReadonlyService, IPrcHeaderContext,
	IPrcHeaderDataService
} from '@libs/procurement/common';
import { ReplaySubject, Subject } from 'rxjs';
import { ProcurementRfqHeaderDataBaseService } from './base/rfq-header-data-base.service';

/**
 * Represents the data service to handle rfq.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementRfqHeaderMainDataService extends ProcurementRfqHeaderDataBaseService implements IPrcHeaderDataService<IRfqHeaderEntity, RfqHeaderEntityComplete>, IPrcCommonReadonlyService<IRfqHeaderEntity> {

	private readonly configService;
	private readonly treeHelper;
	private readonly rfqStatusLookupService;
	protected rootDataCreated$ = new ReplaySubject<RfqHeaderEntityComplete>(1);

	public constructor(injector?: Injector) {
		super();
		if (injector) {
			this.configService = injector.get(PlatformConfigurationService);
			this.treeHelper = injector.get(BasicsSharedTreeDataHelperService);
			this.rfqStatusLookupService = injector.get(PrcRfqStatusLookupService);
		} else {
			this.configService = inject(PlatformConfigurationService);
			this.treeHelper = inject(BasicsSharedTreeDataHelperService);
			this.rfqStatusLookupService = inject(PrcRfqStatusLookupService<IRfqHeaderEntity>);
		}
	}

	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly readonlyChanged$ = new Subject<boolean>();
	public readonly entityProxy = new EntityProxy(this, []);

	public isEntityReadonly(entity?: IRfqHeaderEntity): boolean {
		const selected = entity ?? this.getSelectedEntity();
		if (selected) {
			const status = this.rfqStatusLookupService.syncService?.getListSync().find(e => e.Id === selected.RfqStatusFk);
			if (status) {
				return status.IsReadonly;
			}
		}
		return true;
	}

	public get RootDataCreated$() {
		return this.rootDataCreated$;
	}

	public updateTotalLeadTime(value: number) {
		const entity = this.getSelectedEntity()!;
		entity.TotalLeadTime = value;
	}

	public getHeaderEntity(): IPrcHeaderEntity {
		//TODO: right now rfq header do not get the prc header
		/*const rfq = this.getSelectedEntity()!;
		return rfq.PrcHeaderInstance!;*/
		return {
			Id: 1,
			BpdEvaluationFk: 1,
			ConfigurationFk: 1,
			StrategyFk: 1,
			StructureFk: 1,
			TaxCodeFk: 1
		};
	}

	public getHeaderContext(): IPrcHeaderContext {
		//TODO: right now rfq header do not get the prc header
		const rfq = this.getSelectedEntity()!;
		return {
			prcHeaderFk: rfq.PrcHeaderFk,
			projectFk: rfq.ProjectFk!,
			controllingUnitFk: 1,
			currencyFk: rfq.CurrencyFk,
			exchangeRate: 1,
			taxCodeFk: undefined,
			prcConfigFk: rfq.PrcHeaderInstance?.ConfigurationFk,
			structureFk: rfq.PrcHeaderInstance?.StructureFk,
			businessPartnerFk: 1,
			dateOrdered: rfq.DateQuoteDeadline as unknown as Date,
			readonly: true
		};
	}
}
