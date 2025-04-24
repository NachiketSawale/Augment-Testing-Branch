

import { CompleteIdentification } from '@libs/platform/common';
import { IPpsProductTemplateEntityGenerated } from './pps-product-template-entity-generated.interface';
import { PpsProductCompleteEntity } from '../product/product-complete-entity';
import { IPpsParameterEntityGenerated } from '../formula-configuration/pps-parameter-entity-generated.interface';
import { IEngDrawingComponentEntityGenerated } from '../drawing/eng-drawing-component-entity-generated.interface';
import { IPpsProductEntityGenerated } from '../product/product-entity-generated.interface';


export class PpsProductTemplateComplete extends CompleteIdentification<IPpsProductTemplateEntityGenerated>{

	public MainItemId: number = 0;
	public ProductDescriptions: IPpsProductTemplateEntityGenerated[] | null = [];

	public ProductToSave: PpsProductCompleteEntity[] | null = [];
	public ProductToDelete: IPpsProductEntityGenerated[] | null = [];

	public PpsParameterToDelete: IPpsParameterEntityGenerated[] | null = [];
	public PpsParameterToSave: IPpsParameterEntityGenerated[] | null = [];

	public DrawingComponentsToDelete: IEngDrawingComponentEntityGenerated[] | null = [];
	public DrawingComponentsToSave: IEngDrawingComponentEntityGenerated[] | null = [];
}