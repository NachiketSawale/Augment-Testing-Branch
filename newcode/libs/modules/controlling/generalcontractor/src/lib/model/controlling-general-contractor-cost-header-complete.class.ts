import { CompleteIdentification } from '@libs/platform/common';
import { IGccCostControlDataEntity} from './entities/gcc-cost-control-data-entity.interface';

export class ControllingGeneralContractorCostHeaderComplete implements CompleteIdentification<IGccCostControlDataEntity>{

	public Id: number = 0;

	public Datas: IGccCostControlDataEntity[] | null = [];

	
}
