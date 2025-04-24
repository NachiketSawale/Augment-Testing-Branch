import { CompleteIdentification } from '@libs/platform/common';
import {ICompanyCostHeaderEntity} from './entities/company-cost-header-entity.interface';
import {ICompanyCostDataEntity} from './entities/company-cost-data-entity.interface';


export class ControllingActualsCostHeaderComplete implements CompleteIdentification<ICompanyCostHeaderEntity>{


	public controllingActualsCostHeader: ICompanyCostHeaderEntity | null = null;
	public EntitiesCoun :number | 0 =0;
	/*
     * MainItemId
     */
	public MainItemId? : number | null=null;
	/*
     * controllingActualsCostDataToSave
     */
	public controllingActualsCostDataToSave :ICompanyCostDataEntity[] | [] = [];
	/*
     * controllingActualsCostDataToDelete
     */
	public controllingActualsCostDataToDelete :ICompanyCostDataEntity[] | [] = [];
}
