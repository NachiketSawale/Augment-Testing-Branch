/*
 * Copyright(c) RIB Software GmbH
 */

import {ProcurementCommonItemReadonlyProcessor} from '@libs/procurement/common';
import {IConHeaderEntity, IConItemEntity} from '../../model/entities';
import {ConItemComplete} from '../../model/con-item-complete.class';
import {ContractComplete} from '../../model/contract-complete.class';
import {ProcurementContractItemDataService} from '../procurement-contract-item-data.service';
import {ReadonlyFunctions} from '@libs/basics/shared';

export class ProcurementContractItemReadonlyProcessor extends ProcurementCommonItemReadonlyProcessor<IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {

    public constructor(protected conItemDataService: ProcurementContractItemDataService) {
        super(conItemDataService);
    }

    public override generateReadonlyFunctions(): ReadonlyFunctions<IConItemEntity> {
	    return {
		    ...super.generateReadonlyFunctions(),
		    MdcTaxCodeFk: this.readonlyByMaterial,
		    SafetyLeadTime: () => true,
		    BufferLeadTime: () => true,
		    hasPreviousParent: {
			    shared: ['Price', 'PriceOc', 'PriceGross', 'PriceGrossOc', 'PriceUnit', 'BasUomPriceUnitFk', 'PrcPriceConditionFk', 'MdcTaxCodeFk', 'MdcMaterialFk', 'PrcStructureFk', 'BasUomFk', 'AlternativeUomFk', 'Description1', 'Description2'],
			    readonly: info => {
				    return info.item.hasPreviousParent;
			    }
		    },
		    TargetPrice: {
			    shared: ['TargetTotal'],
			    readonly: () => true
		    },
	    };
    }
}