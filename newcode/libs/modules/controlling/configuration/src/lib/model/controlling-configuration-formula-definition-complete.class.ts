import { CompleteIdentification } from '@libs/platform/common';
import { IMdcContrFormulaPropDefEntity } from './entities/mdc-contr-formula-prop-def-entity.interface';

export class ControllingConfigurationFormulaDefinitionComplete implements CompleteIdentification<IMdcContrFormulaPropDefEntity>{

    public Id: number = 0;

    public ContrFormulaPropDefToSave: IMdcContrFormulaPropDefEntity[] | null = [];


}