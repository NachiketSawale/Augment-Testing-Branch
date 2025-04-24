/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IControltemplateEntity } from './controltemplate-entity.interface';
import { IControltemplateGroupEntity } from './controltemplate-group-entity.interface';
import { IControltemplateUnitEntity } from './controltemplate-unit-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IControltemplateUnitEntityGenerated extends IEntityBase {

	/*
	 * Assignment01
	 */
	Assignment01?: string | null;

	/*
	 * Assignment02
	 */
	Assignment02?: string | null;

	/*
	 * Assignment03
	 */
	Assignment03?: string | null;

	/*
	 * Assignment04
	 */
	Assignment04?: string | null;

	/*
	 * Assignment05
	 */
	Assignment05?: string | null;

	/*
	 * Assignment06
	 */
	Assignment06?: string | null;

	/*
	 * Assignment07
	 */
	Assignment07?: string | null;

	/*
	 * Assignment08
	 */
	Assignment08?: string | null;

	/*
	 * Assignment09
	 */
	Assignment09?: string | null;

	/*
	 * Assignment10
	 */
	Assignment10?: string | null;

	/*
	 * Code
	 */
	Code?: string | null;

	/*
	 * CommentText
	 */
	CommentText?: string | null;

	/*
	 * CompanyFk
	 */
	CompanyFk?: number | null;

	/*
	 * ControllingCatFk
	 */
	ControllingCatFk?: number | null;

	/*
	 * ControllingGrpDetail01Fk
	 */
	ControllingGrpDetail01Fk?: number | null;

	/*
	 * ControllingGrpDetail02Fk
	 */
	ControllingGrpDetail02Fk?: number | null;

	/*
	 * ControllingGrpDetail03Fk
	 */
	ControllingGrpDetail03Fk?: number | null;

	/*
	 * ControllingGrpDetail04Fk
	 */
	ControllingGrpDetail04Fk?: number | null;

	/*
	 * ControllingGrpDetail05Fk
	 */
	ControllingGrpDetail05Fk?: number | null;

	/*
	 * ControllingGrpDetail06Fk
	 */
	ControllingGrpDetail06Fk?: number | null;

	/*
	 * ControllingGrpDetail07Fk
	 */
	ControllingGrpDetail07Fk?: number | null;

	/*
	 * ControllingGrpDetail08Fk
	 */
	ControllingGrpDetail08Fk?: number | null;

	/*
	 * ControllingGrpDetail09Fk
	 */
	ControllingGrpDetail09Fk?: number | null;

	/*
	 * ControllingGrpDetail10Fk
	 */
	ControllingGrpDetail10Fk?: number | null;

	/*
	 * ControltemplateEntity
	 */
	ControltemplateEntity?: IControltemplateEntity | null;

	/*
	 * ControltemplateFk
	 */
	ControltemplateFk?: number | null;

	/*
	 * ControltemplateGroupEntities
	 */
	ControltemplateGroupEntities?: IControltemplateGroupEntity[] | null;

	/*
	 * ControltemplateUnitChildren
	 */
	ControltemplateUnitChildren?: IControltemplateUnitEntity[] | null;

	/*
	 * ControltemplateUnitFk
	 */
	ControltemplateUnitFk?: number | null;

	/*
	 * ControltemplateUnitParent
	 */
	ControltemplateUnitParent?: IControltemplateUnitEntity | null;

	/*
	 * DescriptionInfo
	 */
	DescriptionInfo?: IDescriptionInfo | null;

	/*
	 * HasChildren
	 */
	HasChildren?: boolean | null;

	/*
	 * Id
	 */
	Id: number;

	/*
	 * IsAccountingElement
	 */
	IsAccountingElement?: boolean | null;

	/*
	 * IsAssetmanagement
	 */
	IsAssetmanagement?: boolean | null;

	/*
	 * IsBillingElement
	 */
	IsBillingElement?: boolean | null;

	/*
	 * IsDefault
	 */
	IsDefault?: boolean | null;

	/*
	 * IsFixedBudget
	 */
	IsFixedBudget?: boolean | null;

	/*
	 * IsIntercompany
	 */
	IsIntercompany?: boolean | null;

	/*
	 * IsLive
	 */
	IsLive?: boolean | null;

	/*
	 * IsPlanningElement
	 */
	IsPlanningElement?: boolean | null;

	/*
	 * IsPlantmanagement
	 */
	IsPlantmanagement?: boolean | null;

	/*
	 * IsStockmanagement
	 */
	IsStockmanagement?: boolean | null;

	/*
	 * IsTimekeepingElement
	 */
	IsTimekeepingElement?: boolean | null;

	/*
	 * MdcContextFk
	 */
	MdcContextFk?: number | null;

	/*
	 * UomFk
	 */
	UomFk?: number | null;

	/*
	 * UserDefined1
	 */
	UserDefined1?: string | null;

	/*
	 * UserDefined2
	 */
	UserDefined2?: string | null;

	/*
	 * UserDefined3
	 */
	UserDefined3?: string | null;

	/*
	 * UserDefined4
	 */
	UserDefined4?: string | null;

	/*
	 * UserDefined5
	 */
	UserDefined5?: string | null;
}
