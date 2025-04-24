/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { IAssemblyReferencesEntity } from '../../model/entities/assembly-references-entity.interface';
import { EstimateAssembliesReferencesDataService } from './estimate-assemblies-references-data.service';
import { EstimateAssembliesReferencesLayoutService } from './estimate-assemblies-references-layout.service';
import { EstimateAssembliesReferencesBehavior } from './estimate-assemblies-references-behavior.service';


/**
 * Basics Assemblies Resource Entity Info
 */
export const ESTIMATE_ASSEMBLIES_REFERENCES_ENTITY_INFO = EntityInfo.create<IAssemblyReferencesEntity>({
	grid: {
		containerUuid:'d0cd8c0b6d68486d9e8a137f2fb33687',
		behavior:ctx => ctx.injector.get(EstimateAssembliesReferencesBehavior),
		title: { text: 'Assembly References', key: 'estimate.assemblies.reference' }
	},
	dataService: ctx => ctx.injector.get(EstimateAssembliesReferencesDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Assemblies', typeName: 'AssemblyReferencesDto' },
	permissionUuid: 'd0cd8c0b6d68486d9e8a137f2fb33687',
	layoutConfiguration: context => {
		return context.injector.get(EstimateAssembliesReferencesLayoutService).generateLayout();
	},
	
});