/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity, IBoqItemSubPriceEntity, IBoqSplitQuantityEntity } from '@libs/boq/interfaces';
import { CompleteIdentification } from '@libs/platform/common';

// TODO-BOQ: Manipulated after code generation by the schematics tool.
export class BoqItemComplete implements CompleteIdentification<IBoqItemEntity> {
  // 'BoqItems' should be used instead of
  // public BoqItem?: IBoqItemEntity | null = {};

  // Should NOT be used (see implementation in c# class BoqItemCompleteDto)
  // public MainItemId: number | null = null;

 /*
  * BoqItems
  */
  public BoqItems?: IBoqItemEntity[] | null = []; // That was generated: public BoqItems?: IIIdentifyable[] | null = [];

 /*
  * BoqItemSubPriceToDelete
  */
  public BoqItemSubPriceToDelete?: IBoqItemSubPriceEntity[] | null = [];

 /*
  * BoqItemSubPriceToSave
  */
  public BoqItemSubPriceToSave?: IBoqItemSubPriceEntity[] | null = [];

	/*
	 * BoqSplitQuantityToDelete
	 */
	public BoqSplitQuantityToDelete?: IBoqSplitQuantityEntity[] | null = [];

	/*
	 * BoqSplitQuantityToSave
	 */
	public BoqSplitQuantityToSave?: IBoqSplitQuantityEntity[] | null = [];
}
