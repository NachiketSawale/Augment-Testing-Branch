import { ICharacteristicEntity } from '@libs/basics/interfaces';


export interface ICharacteristicDataService {
	getUnfilteredList?: ()=>[];

	getList:()=>ICharacteristicEntity[]; ///todo this should by <IEntity>[]
}