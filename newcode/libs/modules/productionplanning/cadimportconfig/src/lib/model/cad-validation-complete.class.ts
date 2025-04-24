import { CompleteIdentification } from '@libs/platform/common';
import { IEngCadValidationEntity } from './entities/cad-validation-entity.interface';

export class PpsEngineeringCadValidationComplete implements CompleteIdentification<IEngCadValidationEntity>{

	public Id: number = 0;

	public Datas: IEngCadValidationEntity[] | null = [];

	
}
