import { IBackwarkFromEntity } from './est-main-backward-calculation-form-entity.interface';

export interface IBackwarkCalculationConfiguration {
	SelLineItemScope: IBackwarkFromEntity;
	ActStandardAllowanceFk: number | null;
	KeepFixedPrice: boolean;
	ActStandardAllowance?: object | null;
}
