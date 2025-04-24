/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification } from '@libs/platform/common';
import { IModuleEntity } from './entities/module-entity.interface';

export class BasicsConfigComplete implements CompleteIdentification<IModuleEntity> {

    public Id: number = 0;

    public Datas: IModuleEntity[] | null = [];


}
