/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { IGridTreeConfiguration } from '@libs/ui/common';
import { IConHeaderEntity } from '../entities';
import { PROCUREMENT_CONTRACT_HEADER_BEHAVIOR_TOKEN } from '../../behaviors/procurement-contract-header-behavior.service';
import { ProcurementContractHeaderDataService } from '../../services/procurement-contract-header-data.service';
import { ProcurementContractHeaderLayoutService } from '../../services/procurement-contract-header-layout.service';
import { PROCUREMENT_CONTRACT_STRUCTURE_BEHAVIOR_TOKEN } from '../../behaviors/procurement-contract-structure-behavior.service';
import { ProcurementModule } from '@libs/procurement/shared';
import { BasicsSharedConStatusLookupService, BasicsSharedNumberGenerationService } from '@libs/basics/shared';
import { ProcurementContractHeaderValidationService } from '../../services/procurement-contract-header-validation.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const CON_HEADER_ENTITY_CONFIG: IEntityInfo<IConHeaderEntity> = {
	grid: {
		title: { text: 'Contracts', key: 'procurement.contract.contractGridTitle' },
		behavior: PROCUREMENT_CONTRACT_HEADER_BEHAVIOR_TOKEN,
	},
	form: {
		containerUuid: 'b3b0fdf482ae4973a4b6bbea754876c3',
		title: { text: 'Contract Detail', key: 'procurement.contract.contractFormTitle' },
	},
	permissionUuid: 'e5b91a61dbdd4276b3d92ddc84470162',
	dataService: (ctx) => ctx.injector.get(ProcurementContractHeaderDataService),
	validationService: (ctx) => ctx.injector.get(ProcurementContractHeaderValidationService),
	dtoSchemeId: { moduleSubModule: ProcurementModule.Contract, typeName: 'ConHeaderDto' },
	entitySchema: {
		schema: 'IConHeaderEntity',
		properties: {
			Id: { domain: EntityDomainType.Integer, mandatory: true },
			PurchaseOrders: { domain: EntityDomainType.Integer, mandatory: false },
			Code: { domain: EntityDomainType.Code, mandatory: true },
			Description: { domain: EntityDomainType.Description, mandatory: false },
			ConStatusFk: { domain: EntityDomainType.Integer, mandatory: true },
			ProjectFk: { domain: EntityDomainType.Integer, mandatory: false },
			ProjectStatusFk: { domain: EntityDomainType.Integer, mandatory: false },
			PackageFk: { domain: EntityDomainType.Integer, mandatory: false },
			ReqHeaderFk: { domain: EntityDomainType.Integer, mandatory: false },
			TaxCodeFk: { domain: EntityDomainType.Integer, mandatory: true },
			BpdVatGroupFk: { domain: EntityDomainType.Integer, mandatory: false },
			ClerkPrcFk: { domain: EntityDomainType.Integer, mandatory: false },
			ClerkReqFk: { domain: EntityDomainType.Integer, mandatory: false },
			BasCurrencyFk: { domain: EntityDomainType.Description, mandatory: true },
			ExchangeRate: { domain: EntityDomainType.ExchangeRate, mandatory: false },
			ProjectChangeFk: { domain: EntityDomainType.Integer, mandatory: false },
			ContractHeaderFk: { domain: EntityDomainType.Integer, mandatory: false },
			MaterialCatalogFk: { domain: EntityDomainType.Integer, mandatory: false },
			PaymentTermFiFk: { domain: EntityDomainType.Integer, mandatory: false },
			PaymentTermPaFk: { domain: EntityDomainType.Integer, mandatory: false },
			PaymentTermAdFk: { domain: EntityDomainType.Integer, mandatory: false },
			DateOrdered: { domain: EntityDomainType.Date, mandatory: true },
			DateReported: { domain: EntityDomainType.Date, mandatory: false },
			DateCanceled: { domain: EntityDomainType.Date, mandatory: false },
			DateDelivery: { domain: EntityDomainType.Date, mandatory: false },
			DateCallofffrom: { domain: EntityDomainType.Date, mandatory: false },
			DateCalloffto: { domain: EntityDomainType.Date, mandatory: false },
			ConTypeFk: { domain: EntityDomainType.Integer, mandatory: true },
			AwardmethodFk: { domain: EntityDomainType.Integer, mandatory: true },
			ContracttypeFk: { domain: EntityDomainType.Integer, mandatory: true },
			ControllingUnitFk: { domain: EntityDomainType.Integer, mandatory: false },
			BillingSchemaFk: { domain: EntityDomainType.Integer, mandatory: true },
			BillingSchemaFinal: { domain: EntityDomainType.Money, mandatory: false },
			BillingSchemaFinalOC: { domain: EntityDomainType.Money, mandatory: false },
			ConfirmationCode: { domain: EntityDomainType.Description, mandatory: false },
			ConfirmationDate: { domain: EntityDomainType.Date, mandatory: false },
			ExternalCode: { domain: EntityDomainType.Description, mandatory: false },
			TotalLeadTime: { domain: EntityDomainType.Quantity, mandatory: false },
			PrcCopyModeFk: { domain: EntityDomainType.Integer, mandatory: true },
			DateEffective: { domain: EntityDomainType.Date, mandatory: true },
			ProvingPeriod: { domain: EntityDomainType.Integer, mandatory: false },
			ProvingDealdline: { domain: EntityDomainType.Integer, mandatory: false },
			ApprovalPeriod: { domain: EntityDomainType.Integer, mandatory: false },
			ApprovalDealdline: { domain: EntityDomainType.Integer, mandatory: false },
			IsFreeItemsAllowed: { domain: EntityDomainType.Boolean, mandatory: true },
			MdcPriceListFk: { domain: EntityDomainType.Integer, mandatory: false },
			BankFk: { domain: EntityDomainType.Integer, mandatory: false },
			ExecutionStart: { domain: EntityDomainType.Date, mandatory: false },
			ExecutionEnd: { domain: EntityDomainType.Date, mandatory: false },
			OrdHeaderFk: { domain: EntityDomainType.Integer, mandatory: false },
			OverallDiscount: { domain: EntityDomainType.Decimal, mandatory: true },
			OverallDiscountOc: { domain: EntityDomainType.Decimal, mandatory: true },
			OverallDiscountPercent: { domain: EntityDomainType.Decimal, mandatory: true },
			SalesTaxMethodFk: { domain: EntityDomainType.Integer, mandatory: true },
			ValidFrom: { domain: EntityDomainType.Date, mandatory: false },
			ValidTo: { domain: EntityDomainType.Date, mandatory: false },
			BoqWicCatFk: { domain: EntityDomainType.Integer, mandatory: false },
			BoqWicCatBoqFk: { domain: EntityDomainType.Integer, mandatory: false },
			IsFramework: { domain: EntityDomainType.Boolean, mandatory: true },
			IsNotAccrualPrr: { domain: EntityDomainType.Boolean, mandatory: true },
			BaselinePath: { domain: EntityDomainType.Remark, mandatory: false },
			FrameworkConHeaderFk: { domain: EntityDomainType.Integer, mandatory: false },
			BusinessPartnerFk: { domain: EntityDomainType.Integer, mandatory: true },
			SubsidiaryFk: { domain: EntityDomainType.Integer, mandatory: false },
			SupplierFk: { domain: EntityDomainType.Integer, mandatory: false },
			ContactFk: { domain: EntityDomainType.Integer, mandatory: false },
			BusinessPartner2Fk: { domain: EntityDomainType.Integer, mandatory: false },
			Subsidiary2Fk: { domain: EntityDomainType.Integer, mandatory: false },
			Supplier2Fk: { domain: EntityDomainType.Integer, mandatory: false },
			Contact2Fk: { domain: EntityDomainType.Integer, mandatory: false },
			BusinessPartnerAgentFk: { domain: EntityDomainType.Integer, mandatory: false },
			AddressEntity: { domain: EntityDomainType.Integer, mandatory: false },
			IncotermFk: { domain: EntityDomainType.Integer, mandatory: false },
			CompanyInvoiceFk: { domain: EntityDomainType.Integer, mandatory: false },
			CodeQuotation: { domain: EntityDomainType.Description, mandatory: false },
			Remark: { domain: EntityDomainType.Remark, mandatory: false },
			Userdefined1: { domain: EntityDomainType.Description, mandatory: false },
			Userdefined2: { domain: EntityDomainType.Description, mandatory: false },
			Userdefined3: { domain: EntityDomainType.Description, mandatory: false },
			Userdefined4: { domain: EntityDomainType.Description, mandatory: false },
			Userdefined5: { domain: EntityDomainType.Description, mandatory: false },
			DatePenalty: { domain: EntityDomainType.Date, mandatory: false },
			PenaltyPercentPerDay: { domain: EntityDomainType.Money, mandatory: true },
			PenaltyPercentMax: { domain: EntityDomainType.Money, mandatory: true },
			PenaltyComment: { domain: EntityDomainType.Description, mandatory: true },
			BasAccassignBusinessFk: { domain: EntityDomainType.Integer, mandatory: false },
			BasAccassignControlFk: { domain: EntityDomainType.Integer, mandatory: false },
			BasAccassignAccountFk: { domain: EntityDomainType.Integer, mandatory: false },
			BasAccassignConTypeFk: { domain: EntityDomainType.Integer, mandatory: false },
			Net: { domain: EntityDomainType.Integer, mandatory: false },
			Vat: { domain: EntityDomainType.Integer, mandatory: false },
			Gross: { domain: EntityDomainType.Integer, mandatory: false },
			NetOc: { domain: EntityDomainType.Integer, mandatory: false },
			VatOc: { domain: EntityDomainType.Integer, mandatory: false },
			GrossOc: { domain: EntityDomainType.Integer, mandatory: false },
			ChangeOrderNet: { domain: EntityDomainType.Integer, mandatory: false },
			ChangeOrderVat: { domain: EntityDomainType.Integer, mandatory: false },
			ChangeOrderGross: { domain: EntityDomainType.Integer, mandatory: false },
			ChangeOrderNetOc: { domain: EntityDomainType.Integer, mandatory: false },
			ChangeOrderVatOc: { domain: EntityDomainType.Integer, mandatory: false },
			ChangeOrderGrossOc: { domain: EntityDomainType.Integer, mandatory: false },
			CallOffNet: { domain: EntityDomainType.Integer, mandatory: false },
			CallOffVat: { domain: EntityDomainType.Integer, mandatory: false },
			CallOffGross: { domain: EntityDomainType.Integer, mandatory: false },
			CallOffNetOc: { domain: EntityDomainType.Integer, mandatory: false },
			CallOffVatOc: { domain: EntityDomainType.Integer, mandatory: false },
			CallOffGrossOc: { domain: EntityDomainType.Integer, mandatory: false },
			GrandNet: { domain: EntityDomainType.Integer, mandatory: false },
			GrandVat: { domain: EntityDomainType.Integer, mandatory: false },
			GrandGross: { domain: EntityDomainType.Integer, mandatory: false },
			GrandNetOc: { domain: EntityDomainType.Integer, mandatory: false },
			GrandVatOc: { domain: EntityDomainType.Integer, mandatory: false },
			GrandGrossOc: { domain: EntityDomainType.Integer, mandatory: false },
		},
		additionalProperties: {
			'PrcHeaderEntity.ConfigurationFk': { domain: EntityDomainType.Integer, mandatory: false },
			'PrcHeaderEntity.StructureFk': { domain: EntityDomainType.Integer, mandatory: false },
			'PrcHeaderEntity.StrategyFk': { domain: EntityDomainType.Integer, mandatory: false },
		},
	},
	layoutConfiguration: (context) => {
		return context.injector.get(ProcurementContractHeaderLayoutService).generateLayout(context);
	},
	prepareEntityContainer: async (ctx) => {
		const prcNumGenSrv = ctx.injector.get(BasicsSharedNumberGenerationService);
		const statusLookupService = inject(BasicsSharedConStatusLookupService);
		await Promise.all([prcNumGenSrv.getNumberGenerateConfig('procurement/contract/numbergeneration/list'), firstValueFrom(statusLookupService.getList())]);
	},
	tree: {
		containerUuid: 'd3c6691f0af64490b9f4dc6ecc481992',
		title: { text: 'Contract Structure(Main/Sub)', key: 'procurement.contract.mainContractStructure' },
		behavior: PROCUREMENT_CONTRACT_STRUCTURE_BEHAVIOR_TOKEN,
		treeConfiguration: (ctx) => {
			return {
				parent: function (entity: IConHeaderEntity) {
					const service = ctx.injector.get(ProcurementContractHeaderDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IConHeaderEntity) {
					const service = ctx.injector.get(ProcurementContractHeaderDataService);
					return service.childrenOf(entity);
				},
			} as IGridTreeConfiguration<IConHeaderEntity>;
		},
	},
};

export const PROCUREMENT_CONTRACT_ENTITY_INFO = EntityInfo.create<IConHeaderEntity>(CON_HEADER_ENTITY_CONFIG);
