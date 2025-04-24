
import { CompleteIdentification } from '@libs/platform/common';

import { IPpsParameterEntity, IPpsProductTemplateEntity } from '../models';
import { IEngDrawingComponentEntityGenerated, IPpsProductEntityGenerated, PpsProductCompleteEntity } from '@libs/productionplanning/shared';

// will be removed
export class PpsProductTemplateComplete_ implements CompleteIdentification<IPpsProductTemplateEntity>{

	public MainItemId: number = 0;
	public ProductDescriptions: IPpsProductTemplateEntity[] | null = [];

	public ProductToSave: PpsProductCompleteEntity[] | null = [];
	public ProductToDelete: IPpsProductEntityGenerated[] | null = [];

	public PpsParameterToDelete: IPpsParameterEntity[] | null = [];
	public PpsParameterToSave: IPpsParameterEntity[] | null = [];

	public DrawingComponentsToDelete: IEngDrawingComponentEntityGenerated[] | null = [];
	public DrawingComponentsToSave: IEngDrawingComponentEntityGenerated[] | null = [];

	//public PpsDocumentToDelete!: IIIdentifyable[] | null;
	//public PpsDocumentToSave!: IIIdentifyable[] | null;

	// public CopyFromMdcProductDescription!: boolean | null;
}
