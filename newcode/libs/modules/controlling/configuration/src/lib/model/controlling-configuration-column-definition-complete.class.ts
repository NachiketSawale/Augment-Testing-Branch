import { CompleteIdentification } from '@libs/platform/common';
import { IMdcContrColumnPropDefEntity } from './entities/mdc-contr-column-prop-def-entity.interface';

export class ControllingConfigurationColumnDefinitionComplete implements CompleteIdentification<IMdcContrColumnPropDefEntity>{

	public Id: number = 0;

	public Datas: IMdcContrColumnPropDefEntity[] | null = [];


}
