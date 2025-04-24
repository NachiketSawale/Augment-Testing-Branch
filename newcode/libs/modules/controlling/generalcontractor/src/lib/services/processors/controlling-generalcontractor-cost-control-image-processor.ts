import {IEntityProcessor} from '@libs/platform/data-access';
import {IGccCostControlDataEntity} from '../../model/entities/gcc-cost-control-data-entity.interface';

import {
    ControllingGeneralContractorCostHeaderDataService
} from '../controlling-general-contractor-cost-header-data.service';

export class controllingGeneralContractorCostControlImageProcessor<T extends IGccCostControlDataEntity> implements IEntityProcessor<T> {
    public constructor(protected dataService: ControllingGeneralContractorCostHeaderDataService) {
    }

    public process(unit: T) {
        if (unit) {
            // root (empty)
            if (unit.MdcControllingUnitFk === null && !unit.CostControlVChildren) {
                unit.image = 'ico-folder-empty';
            }else if (unit.MdcControllingUnitFk === null && unit.CostControlVChildren?.length) { // root (with children)
                unit.image = 'ico-controlling-unit1';
            }else if (unit.MdcControllingUnitFk && unit.CostControlVChildren?.length) {// node
                unit.image = 'ico-controlling-unit1';
            }else if (unit.MdcControllingUnitFk && !unit.CostControlVChildren?.length) { // leaf
                unit.image = 'ico-controlling-unit2';
            }

            if(unit.ElementType === 2){
                unit.image = 'ico-boq-note';
            }

            if(unit.IsParent ===-1){
                unit.image = 'ico-boq-textelement';
            }
        }

    }

    public revertProcess(item: T): void {
    }
}