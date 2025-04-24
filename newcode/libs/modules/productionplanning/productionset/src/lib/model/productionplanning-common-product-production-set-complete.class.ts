import { CompleteIdentification } from '@libs/platform/common';
import { IPpsProductEntity } from '@libs/productionplanning/product';
import { IEngProdComponentEntity, IPpsProductToProdPlaceEntity, IPpsRackAssignEntity } from '@libs/productionplanning/product';

export class ProductionplanningCommonProductProductionSetComplete implements CompleteIdentification<IPpsProductEntity>{

	public Id: number = 0;

	public Datas: IPpsProductEntity[] | null = [];
	public RackAssignmentToSave: IPpsRackAssignEntity[] = [];
	public RackAssignmentToDelete: IPpsRackAssignEntity[] = [];

	public EngProdComponentToSave: IEngProdComponentEntity[] = [];
	public EngProdComponentToDelete: IEngProdComponentEntity[] = [];

	public ProductToProdPlaceToSave: IPpsProductToProdPlaceEntity[] = [];
	public ProductToProdPlaceToDelete: IPpsProductToProdPlaceEntity[] = [];

}
