import { CompleteIdentification } from '@libs/platform/common';
import { IAccount2MdcContrCostEntity } from './entities/account-2mdc-contr-cost-entity.interface';

export class BasicsControllingCostCodesAccountComplete implements CompleteIdentification<IAccount2MdcContrCostEntity>{

	public Id: number = 0;

	public Datas: IAccount2MdcContrCostEntity[] | null = [];


}
