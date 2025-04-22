/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { ICustomPrcItem } from './custom-prc-item.interface';
import { ICustomReplacementItem } from './custom-replacement-item.interface';

export interface ICompositeItemEntity extends ICompositeBaseEntity<ICompositeItemEntity, ICustomPrcItem> {
	/**
	 * AddressFk
	 */
	AddressFk?: number | null;

	/**
	 * BasItemType85Fk
	 */
	BasItemType85Fk?: number | null;

	/**
	 * BudgetFixedTotal
	 */
	BudgetFixedTotal: boolean;

	/**
	 * BudgetFixedUnit
	 */
	BudgetFixedUnit: boolean;

	/**
	 * BusinessPartnerId
	 */
	BusinessPartnerId: number;

	/**
	 * CommentClient
	 */
	CommentClient?: string | null;

	/**
	 * CommentContractor
	 */
	CommentContractor?: string | null;

	/**
	 * ConfigurationId
	 */
	ConfigurationId: number;

	/**
	 * ControllingUnitFk
	 */
	ControllingUnitFk?: number | null;

	/**
	 * DateQuoted
	 */
	DateQuoted: string;

	/**
	 * DateRequired
	 */
	DateRequired?: string | null;

	/**
	 * Description1
	 */
	Description1?: string | null;

	/**
	 * Description2
	 */
	Description2?: string | null;

	/**
	 * FactorPriceUnit
	 */
	FactorPriceUnit: number;

	/**
	 * FactoredTotalPrice
	 */
	FactoredTotalPrice: number;

	/**
	 * HasReplacementItem4QuoteNewItem
	 */
	HasReplacementItem4QuoteNewItem: boolean;

	/**
	 * InstanceId
	 */
	InstanceId: number;

	/**
	 * ItemAlt
	 */
	ItemAlt?: string | null;

	/**
	 * ItemAltFk
	 */
	ItemAltFk?: number | null;

	/**
	 * ItemNo
	 */
	ItemNo?: string | null;

	/**
	 * ItemType2Fk
	 */
	ItemType2Fk?: number | null;

	/**
	 * ItemTypeFk
	 */
	ItemTypeFk?: number | null;

	/**
	 * LeadTime
	 */
	LeadTime: number;

	/**
	 * LeadTimeExtra
	 */
	LeadTimeExtra: number;

	/**
	 * MaterialFk
	 */
	MaterialFk?: number | null;

	/**
	 * OffHire
	 */
	OffHire?: string | null;

	/**
	 * OnHire
	 */
	OnHire?: string | null;

	/**
	 * PackageFk
	 */
	PackageFk?: number | null;

	/**
	 * PaymentTermFiFk
	 */
	PaymentTermFiFk?: number | null;

	/**
	 * PaymentTermPaFk
	 */
	PaymentTermPaFk?: number | null;

	/**
	 * PrcIncotermFk
	 */
	PrcIncotermFk?: number | null;

	/**
	 * PrcItemId
	 */
	PrcItemId: number;

	/**
	 * PrcItemParentId
	 */
	PrcItemParentId?: number | null;

	/**
	 * Price
	 */
	Price: number;

	/**
	 * PriceExtra
	 */
	PriceExtra: number;

	/**
	 * PriceExtraOc
	 */
	PriceExtraOc: number;

	/**
	 * PriceGross
	 */
	PriceGross: number;

	/**
	 * PriceOcGross
	 */
	PriceOcGross: number;

	/**
	 * PriceUnit
	 */
	PriceUnit: number;

	/**
	 * QuoteNewItems
	 */
	QuoteNewItems?: ICompositeItemEntity[] | null;

	/**
	 * ReplacementItems4QuoteNewItem
	 */
	ReplacementItems4QuoteNewItem?: ICustomReplacementItem[] | null;

	/**
	 * Specification
	 */
	Specification?: string | null;

	/**
	 * StatusFk
	 */
	StatusFk: number;

	/**
	 * StructureFk
	 */
	StructureFk?: number | null;

	/**
	 * TaxCodeFk
	 */
	TaxCodeFk?: number | null;

	/**
	 * Total
	 */
	Total: number;

	/**
	 * TotalGross
	 */
	TotalGross: number;

	/**
	 * TotalOcGross
	 */
	TotalOcGross: number;

	/**
	 * TotalPrice
	 */
	TotalPrice: number;

	/**
	 * TotalPriceGross
	 */
	TotalPriceGross: number;

	/**
	 * TotalPriceOcGross
	 */
	TotalPriceOcGross: number;

	/**
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/**
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/**
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/**
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/**
	 * UserDefined5
	 */
	UserDefined5?: string | null;
}
