import { ICostCodesRefrenceEntity } from '@libs/basics/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

export class BasicsCostCodesReferencesComplete implements CompleteIdentification<ICostCodesRefrenceEntity>{

	public Id: number = 0;

	public Refrences: ICostCodesRefrenceEntity [] | null = [];
}
