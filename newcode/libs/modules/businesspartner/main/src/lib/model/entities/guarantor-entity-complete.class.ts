import { IGuarantorEntity } from '@libs/businesspartner/interfaces';
import { CompleteIdentification } from '@libs/platform/common';


export class GuarantorEntityComplete implements CompleteIdentification<IGuarantorEntity>{
	public MainItemId: number = 0;
	public Guarantor: IGuarantorEntity | null = null;
	public Guarantors: IGuarantorEntity[] | null = [];
}