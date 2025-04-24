import { IEstRoundingConfigDetailBaseEntity } from './est-rounding-config-detail-entity.base.interface';
import { IEstRoundingColumnConfig } from './est-rounding-column-config.interface';

export interface IEstRoundingConfigComplete {
	RoundingConfigDetails: IEstRoundingConfigDetailBaseEntity[] | null,
	EstRoundingColumnIds: IEstRoundingColumnConfig[] | null
}