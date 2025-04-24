/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	IDataServiceOptions, IReadOnlyField,
	ServiceRole
} from '@libs/platform/data-access';
import { IQuoteHeaderEntity } from '../model/entities/quote-header-entity.interface';
import {
	IQuoteRequisitionEntity,
	IQuoteRequisitionListResponse
} from '../model/entities/quote-requisition-entity.interface';
import { QuoteRequisitionEntityComplete } from '../model/entities/quote-quisition-entity-complete.class';
import { ProcurementQuoteHeaderDataService } from './quote-header-data.service';
import { QuoteHeaderEntityComplete } from '../model/entities/quote-header-entity-complete.class';
import {
	IExchangeRateChangedEvent,
	IPaymentTermChangedEvent, IPrcHeaderContext,
	IPrcHeaderDataService,
	IPrcModuleValidatorService,
	ProcurementCommonCompanyContextService
} from '@libs/procurement/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { EntityProxy, ProcurementInternalModule } from '@libs/procurement/shared';
import { Subject } from 'rxjs';
/**
 * Represents the data service to handle quote requisition field.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementQuoteRequisitionDataService extends DataServiceFlatNode<IQuoteRequisitionEntity, QuoteRequisitionEntityComplete, IQuoteHeaderEntity, QuoteHeaderEntityComplete>
	implements IPrcHeaderDataService<IQuoteRequisitionEntity, QuoteRequisitionEntityComplete>, IPrcModuleValidatorService<IQuoteRequisitionEntity, QuoteRequisitionEntityComplete> {

	public readonly entityProxy = new EntityProxy(this, []);
	public readonly paymentTermChanged$ = new Subject<IPaymentTermChangedEvent>();
	public readonly exchangeRateChanged$ = new Subject<IExchangeRateChangedEvent>();
	public readonly readonlyChanged$ = new Subject<boolean>();
	protected readonly companyContext = inject(ProcurementCommonCompanyContextService);
	private _editorMode: boolean = false;

	public constructor(public readonly quoteDataService: ProcurementQuoteHeaderDataService) {
		const options: IDataServiceOptions<IQuoteRequisitionEntity> = {
			apiUrl: 'procurement/quote/requisition',
			readInfo: {
				endPoint: 'list',
				usePost: false
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IQuoteRequisitionEntity, IQuoteHeaderEntity, QuoteHeaderEntityComplete>>{
				role: ServiceRole.Node,
				itemName: 'QtnRequisition',
				parent: quoteDataService
			}
		};
		super(options);
	}

	protected override onLoadSucceeded(loaded: IQuoteRequisitionListResponse): IQuoteRequisitionEntity[] {
		return loaded.Main;
	}

	protected override provideLoadPayload(): object {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		return {
			mainItemId: -1
		};
	}

	public getHeaderContext(): IPrcHeaderContext {
		const quote = this.quoteDataService.getSelectedEntity()!;
		const quoteRequisition = this.getSelectedEntity();
		if (!quoteRequisition) {
			throw new Error('please selected record first');
		}

		return {
			prcHeaderFk: quoteRequisition.PrcHeaderFk!,
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

	public getHeaderEntity(): IPrcHeaderEntity {
		const quoteRequisition = this.getSelectedEntity()!;
		return quoteRequisition.PrcHeaderEntity!;
	}

	public updateTotalLeadTime(value: number) {
		//
	}

	public get editorMode() {
		return this._editorMode;
	}

	public set editorMode(value: boolean) {
		this._editorMode = value;
	}

	public importToAll(isEditor: boolean) {
		const entities = this.getList();
		this.editorMode = isEditor;
		entities.forEach(entity => {
			entity.IsSelected = isEditor;
			this.setReadOnlyForIsSelected(entity, isEditor);
		});
	}

	public setReadOnlyForIsSelected(entity: IQuoteRequisitionEntity, isReadOnly: boolean) {
		const readonlyFields: IReadOnlyField<IQuoteRequisitionEntity>[] = [
			{field: 'IsSelected', readOnly: isReadOnly}
		];
		this.setEntityReadOnlyFields(entity, readonlyFields);
	}

	public getInternalModuleName(): string {
		return ProcurementInternalModule.Quote;
	}
	public isValidForSubModule(): boolean {
		const quoteEntity = this.getSelectedEntity()!;
		return quoteEntity !== null && quoteEntity.Id !== undefined;
	}
}
