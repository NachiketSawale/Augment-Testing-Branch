/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityIdentification} from '@libs/platform/common';


export class PhaseRequirementTemplateEntity implements IEntityIdentification {
		public Id!: number;
		public PhaseTemplateFk!: number;
		public UpstreamGoodsTypeFk!: number;
		public MdcMaterialFk?: number;
		public PpsFormworkTypeFk!: number;
		public ProcessTemplateFk?: number;
		public Quantity!: number;
		public BasUomFk!: number;
		public CommentText?: string;
		public MdcCostCodeFk?: number;
		public MdcCostCodeTtFk?: number;
		public Userdefined1?: string;
		public Userdefined2?: string;
		public Userdefined3?: string;
		public Userdefined4?: string;
		public Userdefined5?: string;
		public InsertedAt!: Date;
		public InsertedBy!: number;
		public UpdatedAt?: Date;
		public UpdatedBy?: number;
		public Version!: number;

		public UpstreamGoods?: number;
}