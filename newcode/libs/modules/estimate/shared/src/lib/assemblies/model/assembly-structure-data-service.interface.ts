import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';

export interface IAssemblyStructureDataService{
	getList():IEstAssemblyCatEntity[];
}