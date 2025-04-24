/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { BasicsConfigAuditContainerComplete } from '../model/basics-config-audit-container-complete.class';
import { IAudContainerEntity } from '../model/entities/aud-container-entity.interface';
import { IModuleEntity } from '../../modules/model/entities/module-entity.interface';
import { BasicsConfigComplete } from '../../modules/model/basics-config-complete.class';
import { BasicsConfigDataService } from '../../modules/services/basics-config-data.service';

@Injectable({
	providedIn: 'root'
})

export class BasicsConfigAuditContainerDataService extends DataServiceFlatNode<IAudContainerEntity, BasicsConfigAuditContainerComplete,IModuleEntity, BasicsConfigComplete >{

	public constructor( basicsConfigDataService:BasicsConfigDataService) {
		const options: IDataServiceOptions<IAudContainerEntity>  = {
			apiUrl: 'basics/config/audittrail',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint:'list4module',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IAudContainerEntity,IModuleEntity, BasicsConfigComplete>>{
				role: ServiceRole.Node,
				itemName: 'AudContainer',
				parent: basicsConfigDataService,
			},
		};

		super(options);
	}
	
	protected override provideLoadPayload(): object {
        return {
			//TODO: Get data from module-containers json file dynamically once
			//implemented in Dev-19077

            moduleName: 'basics.config',
            uuids:[
				'7001204d7fb04cf48d8771c8971cc1e5',
				'1918073bf2664785b1b9223c6e443d6d',
				'173343c2fdf04186b32bb4b9526aff4f',
				'6f184332b0b2496f8d6ab3201e8e1bde',
				'96ec1c43569a44c490010d4af9365715',
				'fdd90b3f00ce4390bcd4a798d0dbf847',
				'cff858f883ac47919f261c269eb84261',
				'314a70890a4e4cdc83c66906aabfed04',
				'd440373784664e58bbb3f57e66ef9566',
				'953385da027f45f786244d350d7124fd',
				'3de6ddaa808c45d39f71803909cbb06a',
				'c394fffc7b2b49c68a175614117084d0',
				'ce8cd4ae57f34df0b5e2ea3e60acb28e',
				'D33710E56CAB4D87A3DDEEB71A246A51',
				'dbd4af01c38d43dca8f80c7086a5691b',
				'661849b9e10d4de5882ad0db44289034',
				'7ace2ee99a5344e680b8924244fa6906',
				'ed6b6ff7037e4e709124e8ab50c9f494',
				'74e968c830314e0f83f247778aa527d9',
				'bbde9b1a6c8b43718215d2a0a40848f2',
				'c36c23d57c68458ab4460dc5e2d13b44',
				'b5481cf45753465ca032243fc9de3be3',
				'47c9f685816c4aeebc6c46896da7147f',
				'f0117bc77abd4af3ad9d0b62e4a5f4e8',
				'cfa2857c45f84a678dd4c81b92bea765',
				'0fa3894478344b379510b5fc4e784247',
				'144a5ed27742466eade625a6d570767f',
				'e5529f55f96e4eef869c01fb9a39a325',
				'c2480e233eb441a09e2e0904333ed185',
				'de2ecbe9450a401eb38d013a35c5bf3b',
				'b984bab23bfe42f991338ce28f6bf7c1',
				'deb38a79e18048f5b8a6f3f6b77e490f',
				'd66359e4102549f0a4a783d784a3c699',
				'80a9828f31e9450c8ef0eb8ba9fefe0a',
				'13599a7eabfa444aa9b34da16893dea4',
				'03deb09668e740c389bc3681210eaef1',
				'096bbc843bf142038615af92894512be',
				'2ce420a7aa8a4bd584cbaf35ccb45fd4',
				'3b5b0d89fb2744f6b3c97b3b2bcf817e',
				'2ae3555db27a40988a21c8e42336e42a',
				'ce1499b758bc45f8a61c4df00ade9e6e',
				'a8bd10d7081a45099bcd6a8bd56cdd79',
				'cddaf0f9b3fb4fb3800ea50c8c3afb77',
				'059b71ee2dd34f98821198c042407c94',
				'00867208667e47c797ec1ca8f8f74677',
				'd69a56cbdcb34621a3eea71cfb23a443',
				'af2323e0818c4f2dae3f4fc91a452959',
				'c797b75acac84db2866e4a6a0c891204',
				'0df97bf7a5284d8bbdce26bd8aea26a0',
				'cc4cbd5fbfe34bad9a3cebb51ffbff51',
				'4EAA47C530984B87853C6F2E4E4FC67E',
				'684F4CDC782B495E9E4BE8E4A303D693',
				'8BB802CB31B84625A8848D370142B95C',
				'D8BE3B30FED64AAB809B5DC7170E6219',
				null,
				'178b2b2002d24384a9802cfdb3973816'
			  ]
        };
    }
 
    protected override onLoadSucceeded(loaded: object): IAudContainerEntity[] {
        return loaded as IAudContainerEntity[];
	}
}





