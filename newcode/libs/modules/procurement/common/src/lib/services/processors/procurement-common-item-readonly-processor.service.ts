/*
 * Copyright(c) RIB Software GmbH
 */

import {CompleteIdentification, IEntityIdentification} from '@libs/platform/common';
import {IPrcItemEntity} from '../../model/entities';
import {ProcurementCommonItemDataService} from '../procurement-common-item-data.service';
import {PrcCommonItemComplete} from '../../model/procurement-common-item-complete.class';
import {
	BasItemType,
	EntityReadonlyProcessorBase,
	ReadonlyFunctions,
	ReadonlyInfo
} from '@libs/basics/shared';

/**
 * Procurement item entity readonly processor
 */
export class ProcurementCommonItemReadonlyProcessor<T extends IPrcItemEntity, U extends PrcCommonItemComplete,
	PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {

	protected get prcHeaderContext() {
		return this.dataService.parentService.getHeaderContext();
	}

	/**
	 *The constructor
	 */
	public constructor(protected dataService: ProcurementCommonItemDataService<T, U, PT, PU>) {
		super(dataService);
	}

	public generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			DiscountAbsolute: {
				shared: ['DiscountAbsoluteOc', 'DiscountAbsoluteGross', 'DiscountAbsoluteGrossOc'],
				readonly: this.readonlyDiscountAbsolute
			},
			DateRequired: e => e.item.Hasdeliveryschedule,
			PrcStructureFk: {
				shared: ['SellUnit', 'LeadTime', 'MinQuantity', 'BasUomFk'],
				readonly: this.readonlyByMaterial
			},
			Price: {
				shared: ['PriceOc'],
				readonly: this.readonlyByHasScope
			},
			LeadTimeExtra: e => e.item.HasLeadTimeFormula,
			BudgetPerUnit: e => !e.item.BudgetFixedUnit,
			BudgetTotal: e => !e.item.BudgetFixedTotal,
			TotalGross: {
				shared: ['TotalGrossOc'],
				readonly: this.readonlyTotalGross
			},
			Description1: {
				shared: [
					'Description2',
					'Specification',
					'BasUomFk',
					'AlternativeUomFk',
					'Price',
					'PriceOc',
					'PrcPriceConditionFk',
					'PriceUnit',
					'BasUomPriceUnitFk',
					'FactorPriceUnit',
					'BasPaymentTermFiFk',
					'BasPaymentTermPaFk',
					'PrcIncotermFk',
					'BpdAgreementFk',
					'PriceGross',
					'PriceGrossOc'
				],
				readonly: this.readonlyByMaterialCatalogNMaterial
			},
			Itemno: {
				shared: [
					'Description1',
					'Description2',
					'Specification',
					'Userdefined1',
					'Userdefined2',
					'Userdefined3',
					'Userdefined4',
					'Userdefined5'
				],
				readonly: this.readonlyByItemType,
				makeOthersOpposite: true
			},
			PrjStockFk: {
				shared: ['PrjStockLocationFk'],
				readonly: this.readonlyPrjStock
			},
			AlternativeUomFk: e => {
				return !!e.item.MdcMaterialFk && !e.item.Material2Uoms;
			},
		};
	}

	protected override readonlyEntity(item: T): boolean {
		return this.prcHeaderContext.readonly;
	}

	protected readonlyDiscountAbsolute(info: ReadonlyInfo<T>) {
		const item = info.item;
		return (item.Price + item.PriceExtra) === 0;
	}

	protected readonlyByMaterial(info: ReadonlyInfo<T>) {
		return !!info.item.MdcMaterialFk;
	}

	protected readonlyByMaterialCatalogNMaterial(info: ReadonlyInfo<T>) {
		return !!this.prcHeaderContext.materialCatalogFk && !!info.item.MdcMaterialFk;
	}

	protected readonlyByHasScope(info: ReadonlyInfo<T>) {
		return this.readonlyByMaterial(info) || info.item.HasScope;
	}

	protected readonlyTotalGross(info: ReadonlyInfo<T>) {
		return !this.dataService.isCalculateOverGross;
	}

	protected readonlyByItemType(info: ReadonlyInfo<T>) {
		if (info.item.BasItemTypeFk === BasItemType.TextElement) {
			return false;
		}
		return;
	}

	protected readonlyPrjStock(info: ReadonlyInfo<T>) {
		if (info.item.PrjStockFk) {
			return false;
		}

		const result = this.dataService.getPrjStockFk(info.item);
		return result.PrjStockFk === undefined;
	}
}