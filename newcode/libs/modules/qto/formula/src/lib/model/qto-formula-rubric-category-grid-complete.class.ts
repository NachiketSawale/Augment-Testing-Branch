import { CompleteIdentification } from '@libs/platform/common';
import { IQtoFormulaHeaderCompleteEntity } from './entities/qto-formula-header-complete-entity.interface';
import { QtoFormulaItemComplete } from './qto-formula-item-complete.class';
import { IQtoFormulaEntity } from './entities/qto-formula-entity.interface';

export class QtoFormulaRubricCategoryGridComplete implements CompleteIdentification<IQtoFormulaHeaderCompleteEntity>{

    /*
   * QtoFormulaToSave
   */
    public QtoFormulaToSave?: QtoFormulaItemComplete[] | null;

    /*
  * QtoFormulaToDelete
  */
    public QtoFormulaToDelete?: IQtoFormulaEntity[] | null;
}
