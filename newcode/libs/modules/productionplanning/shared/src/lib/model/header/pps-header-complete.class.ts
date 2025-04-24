import { CompleteIdentification } from '@libs/platform/common';
import { IPpsHeaderEntity } from './pps-header-entity.interface';
// import { IPpsHeader2ClerkEntity } from './pps-header2clerk-entity.interface'; // todo/refactor in the future


export class PpsHeaderComplete implements CompleteIdentification<IPpsHeaderEntity> {

	public MainItemId: number = 0;
	public PPSHeader?: IPpsHeaderEntity;
	public PPSHeaders: IPpsHeaderEntity[] | null = [];
	// public Header2ClerkToSave: IPpsHeader2ClerkEntity[] | null = [];
	// public Header2ClerkToDelete: IPpsHeader2ClerkEntity[] | null = [];
}
