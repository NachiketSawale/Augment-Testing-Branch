/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole } from '@libs/platform/data-access';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import {
	IExchangeRateChangedEvent,
	IPaymentTermChangedEvent,
	IPrcCommonReadonlyService, IPrcHeaderContext,
	IPrcHeaderDataService,
	IPrcModuleValidatorService,
	ProcurementCommonCompanyContextService
} from '@libs/procurement/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { EntityProxy, ProcurementInternalModule } from '@libs/procurement/shared';
import { ReplaySubject, Subject } from 'rxjs';
import { RfqHeaderEntityComplete } from '@libs/procurement/rfq';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { IQuoteRequisitionListResponse } from '../model/entities/quote-requisition-entity.interface';
import { BasicsSharedQuotationStatusLookupService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteHeaderDataService extends DataServiceFlatRoot<IQuoteHeaderEntity, QuoteHeaderEntityComplete>
	implements IPrcHeaderDataService<IQuoteHeaderEntity, QuoteHeaderEntityComplete>, IPrcModuleValidatorService<IQuoteHeaderEntity, QuoteHeaderEntityComplete>, IPrcCommonReadonlyService<IQuoteHeaderEntity> {

	public readonly entityProxy = new EntityProxy(this, []);
	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly readonlyChanged$ = new Subject<boolean>();
	protected readonly companyContext = inject(ProcurementCommonCompanyContextService);
	protected rootDataCreated$ = new ReplaySubject<RfqHeaderEntityComplete>(1);
	private readonly http = inject(HttpClient);
	private readonly statusService = inject(BasicsSharedQuotationStatusLookupService);
	private readonly configService = inject(PlatformConfigurationService);
	public constructor() {
		super({
			apiUrl: 'procurement/quote/header',
			readInfo: {
				endPoint: 'listqtn',
				usePost: true
			},
			createInfo: {
				endPoint: 'createqtn'
			},
			updateInfo: {
				endPoint: 'updateqtn',
				/*preparePopupDialogData:() => {
					return this.createDialogService.openCreateDialogForm();
				}*/
				// TODO-DRIZZLE: The custom create dialog to be migrated.
			},
			deleteInfo: {
				endPoint: 'deleteqtn'
			},
			roleInfo: {
				role: ServiceRole.Root,
				itemName: 'QuoteHeader'
			}
		});

		this.selectionChanged$.subscribe((e) => {
			this.onSelectionChanged();
		});
	}

	public override createUpdateEntity(modified: IQuoteHeaderEntity | null): QuoteHeaderEntityComplete {
		const complete = new QuoteHeaderEntityComplete(modified ? modified.Id : -1, 1);
		if (modified) {
			complete.QuoteHeader = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: QuoteHeaderEntityComplete): IQuoteHeaderEntity[] {
		return complete.QuoteHeader ? [complete.QuoteHeader] : [];
	}

	public isValidForSubModule(): boolean {
		const entity = this.getSelectedEntity()!;
		return entity !== null && entity.Id !== undefined;
	}

	public getInternalModuleName(): string {
		return ProcurementInternalModule.Quote;
	}

	public getHeaderContext(): IPrcHeaderContext {
		const quote = this.getSelectedEntity();
		if (!quote) {
			throw new Error('please selected record first');
		}

		return {
			prcHeaderFk: quote.PrcHeaderFk!,
			projectFk: quote.ProjectFk!,
			controllingUnitFk: 0,
			currencyFk: quote.CurrencyFk,
			exchangeRate: quote.ExchangeRate,
			prcConfigFk: quote.PrcHeaderEntity?.ConfigurationFk,
			structureFk: quote.PrcHeaderEntity?.StructureFk,
			businessPartnerFk: quote.BusinessPartnerFk,
			dateOrdered: new Date(),
			readonly: false,
		};

	}

	public get loginCompanyEntity() {
		return this.companyContext.loginCompanyEntity;
	}

	public getHeaderEntity(): IPrcHeaderEntity {
		const quote = this.getSelectedEntity()!;
		return quote.PrcHeaderEntity!;
	}

	public updateTotalLeadTime(value: number) {
		const entity = this.getSelectedEntity()!;
		entity.TotalLeadTime = value;
	}

	public getStatus(entity?: IQuoteHeaderEntity)  {
		const selectedEntity = entity ?? this.getSelectedEntity();
		if (!selectedEntity) {
			return undefined;
		}

		const status = this.statusService.cache.getItem({ id: selectedEntity.StatusFk });
		return status || undefined;
	}

	public isEntityReadonly(entity?: IQuoteHeaderEntity): boolean {
		const status = this.getStatus(entity);
		if (status) {
			return status.IsReadOnly;
		}
		return true;
	}

	public get RootDataCreated$() {
		return this.rootDataCreated$;
	}

	private onSelectionChanged() {
		const quote = this.getSelectedEntity()!;
		if (!quote.PrcHeaderEntity) {
			this.http.get(this.configService.webApiBaseUrl + 'procurement/quote/requisition/list', {
				params: {
					mainItemId: quote.Id
				}
			}).subscribe(e => {
				const respone = e as IQuoteRequisitionListResponse;
				if (respone && respone.Main && respone.Main.length > 0) {
				const prcHeader = respone.Main[0].PrcHeaderEntity;
				if (prcHeader) {
					quote.PrcHeaderEntity = prcHeader;
					quote.PrcHeaderFk = prcHeader.Id;
				}
			}
			});
		}
	}
}

