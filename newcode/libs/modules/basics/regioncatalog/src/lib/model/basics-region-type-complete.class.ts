import { BasicsRegionTypeEntity } from './basics-region-type-entity.class';
import { CompleteIdentification } from '@libs/platform/common';
import { BasicsRegionCatalogEntity } from "./basics-region-catalog-entity.class";

export class BasicsRegionTypeComplete implements CompleteIdentification<BasicsRegionTypeEntity> {
	public MainItemId: number = 0;

	public Datas: BasicsRegionTypeEntity[] | null = [];

	public RegionCatalogToSave: BasicsRegionCatalogEntity[] | null = [];
	public RegionCatalogToDelete: BasicsRegionCatalogEntity[] | null = [];
}
