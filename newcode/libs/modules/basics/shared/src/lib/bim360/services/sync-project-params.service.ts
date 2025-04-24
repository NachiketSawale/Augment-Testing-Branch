/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IBasicsBim360ParamSelectItem } from '../lookup/entities/basics-bim360-param-select-item.interface';
import { PlatformTranslateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedBim360SyncProjectParamsService {
	private readonly translate = inject(PlatformTranslateService);
	private requiredServiceTypes: IBasicsBim360ParamSelectItem[] = [];

	public constructor() {
		this.serviceTypes.forEach((serviceType) => {
			serviceType.translatedText = this.translate.instant(serviceType.displayName).text;
		});
	}

	/**
	 * Get project types.
	 */
	public getProjectTypes() {
		return this.projectTypes;
	}

	public getProjectTypeById(id: string) {
		return this.projectTypes.find((p) => p.id === id);
	}

	public getLanguages() {
		return this.languages;
	}

	public getLanguageById(id: string) {
		return this.languages.find((item) => item.id === id);
	}

	public getServiceTypes() {
		return this.serviceTypes;
	}

	public getServiceTypesByIds(ids: string[]) {
		return this.serviceTypes.filter((item) => ids.includes(item.id));
	}

	public getRequiredServiceTypes() {
		if (this.requiredServiceTypes.length === 0) {
			this.requiredServiceTypes = this.serviceTypes.filter((s) => s.required === true);
		}
		return this.requiredServiceTypes;
	}

	public getContractTypeByValue(value?: string | null) {
		if (value) {
			return this.contractTypes.find((item) => item.value === value);
		}
		return undefined;
	}

	private projectTypes: IBasicsBim360ParamSelectItem[] = [
		{
			id: 'Commercial',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.commercial',
			},
			Id: 1,
		},
		{
			id: 'Convention Center',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.conventionCenter',
			},
			Id: 2,
		},
		{
			id: 'Data Center',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.dataCenter',
			},
			Id: 3,
		},
		{
			id: 'Hotel / Motel',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.hotelMotel',
			},
			Id: 4,
		},
		{
			id: 'Office',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.office',
			},
			Id: 5,
		},
		{
			id: 'Parking Structure / Garage',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.parkingStructureGarage',
			},
			Id: 6,
		},
		{
			id: 'Performing Arts',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.performingArts',
			},
			Id: 7,
		},
		{
			id: 'Retail',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.retail',
			},
			Id: 8,
		},
		{
			id: 'Stadium/Arena',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.stadiumArena',
			},
			Id: 9,
		},
		{
			id: 'Theme Park',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.themePark',
			},
			Id: 10,
		},
		{
			id: 'Warehouse (non-manufacturing)',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.warehouse',
			},
			Id: 11,
		},
		{
			id: 'Healthcare',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.healthcare',
			},
			Id: 12,
		},
		{
			id: 'Assisted Living / Nursing Home',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.assistedLivingNursingHome',
			},
			Id: 13,
		},
		{
			id: 'Hospital',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.hospital',
			},
			Id: 14,
		},
		{
			id: 'Medical Laboratory',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.medicalLaboratory',
			},
			Id: 15,
		},
		{
			id: 'Medical Office',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.medicalOffice',
			},
			Id: 16,
		},
		{
			id: 'OutPatient Surgery Center',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.outPatientSurgeryCenter',
			},
			Id: 17,
		},
		{
			id: 'Institutional',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.institutional',
			},
			Id: 18,
		},
		{
			id: 'Court House',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.courtHouse',
			},
			Id: 19,
		},
		{
			id: 'Dormitory',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.dormitory',
			},
			Id: 20,
		},
		{
			id: 'Education Facility',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.educationFacility',
			},
			Id: 21,
		},
		{
			id: 'Government Building',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.governmentBuilding',
			},
			Id: 22,
		},
		{
			id: 'Library',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.library',
			},
			Id: 23,
		},
		{
			id: 'Military Facility',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.militaryFacility',
			},
			Id: 24,
		},
		{
			id: 'Museum',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.museum',
			},
			Id: 25,
		},
		{
			id: 'Prison / Correctional Facility',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.prisonCorrectionalFacility',
			},
			Id: 26,
		},
		{
			id: 'Recreation Building',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.recreationBuilding',
			},
			Id: 27,
		},
		{
			id: 'Religious Building',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.religiousBuilding',
			},
			Id: 28,
		},
		{
			id: 'Research Facility / Laboratory',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.researchFacilityLaboratory',
			},
			Id: 29,
		},
		{
			id: 'Residential',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.residential',
			},
			Id: 30,
		},
		{
			id: 'Multi-Family Housing',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.multiFamilyHousing',
			},
			Id: 31,
		},
		{
			id: 'Single-Family Housing',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.singleFamilyHousing',
			},
			Id: 32,
		},
		{
			id: 'Infrastructure',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.infrastructure',
			},
			Id: 33,
		},
		{
			id: 'Airport',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.airport',
			},
			Id: 34,
		},
		{
			id: 'Bridge',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.bridge',
			},
			Id: 35,
		},
		{
			id: 'Canal / Waterway',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.canalWaterway',
			},
			Id: 36,
		},
		{
			id: 'Dams / Flood Control / Reservoirs',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.damsFloodControlReservoirs',
			},
			Id: 37,
		},
		{
			id: 'Harbor / River Development',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.harborRiverDevelopment',
			},
			Id: 38,
		},
		{
			id: 'Rail',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.rail',
			},
			Id: 39,
		},
		{
			id: 'Seaport',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.seaport',
			},
			Id: 40,
		},
		{
			id: 'Streets / Roads / Highways',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.streetsRoadsHighways',
			},
			Id: 41,
		},
		{
			id: 'Transportation Building',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.transportationBuilding',
			},
			Id: 42,
		},
		{
			id: 'Tunnel',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.tunnel',
			},
			Id: 43,
		},
		{
			id: 'Waste Water / Sewers',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.wasteWaterSewers',
			},
			Id: 44,
		},
		{
			id: 'Water Supply',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.waterSupply',
			},
			Id: 45,
		},
		{
			id: 'Industrial & Energy',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.industrialEnergy',
			},
			Id: 46,
		},
		{
			id: 'Manufacturing / Factory',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.manufacturingFactory',
			},
			Id: 47,
		},
		{
			id: 'Oil & Gas',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.oilGas',
			},
			Id: 48,
		},
		{
			id: 'Plant',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.plant',
			},
			Id: 49,
		},
		{
			id: 'Power Plant',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.powerPlant',
			},
			Id: 50,
		},
		{
			id: 'Solar Far',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.solarFar',
			},
			Id: 51,
		},
		{
			id: 'Utilities',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.utilities',
			},
			Id: 52,
		},
		{
			id: 'Wind Farm',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.windFarm',
			},
			Id: 53,
		},
		{
			id: 'Sample Projects',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.sampleProjects',
			},
			Id: 54,
		},
		{
			id: 'Demonstration Project',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.demonstrationProject',
			},
			Id: 55,
		},
		{
			id: 'Template Project',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.templateProject',
			},
			Id: 56,
		},
		{
			id: 'Training Project',
			displayName: {
				key: 'cloud.desktop.bim360.projectType.trainingProject',
			},
			Id: 57,
		},
	];

	private languages: IBasicsBim360ParamSelectItem[] = [
		{
			id: 'en',
			displayName: { key: 'cloud.desktop.bim360.language.english' },
			Id: 1,
		},
		{
			id: 'de',
			displayName: { key: 'cloud.desktop.bim360.language.german' },
			Id: 2,
		},
	];

	private serviceTypes: IBasicsBim360ParamSelectItem[] = [
		{
			id: 'field',
			displayName: {
				key: 'cloud.desktop.bim360.serviceType.field',
			},
			Id: 1,
			required: true,
		},
		{
			id: 'glue',
			displayName: {
				key: 'cloud.desktop.bim360.serviceType.glue',
			},
			Id: 2,
		},
		{
			id: 'doc_manager',
			displayName: {
				key: 'cloud.desktop.bim360.serviceType.doc_manager',
			},
			Id: 3,
			required: true,
		},
		{
			id: 'collab',
			displayName: {
				key: 'cloud.desktop.bim360.serviceType.collab',
			},
			Id: 4,
		},
		{
			id: 'pm',
			displayName: {
				key: 'cloud.desktop.bim360.serviceType.pm',
			},
			Id: 5,
		},
		{
			id: 'fng',
			displayName: {
				key: 'cloud.desktop.bim360.serviceType.fng',
			},
			Id: 6,
			required: true,
		},
		{
			id: 'gng',
			displayName: {
				key: 'cloud.desktop.bim360.serviceType.gng',
			},
			Id: 7,
		},
	];

	private contractTypes = [
		{
			key: 'Construction Management (CM) at Risk',
			value: 'Construction contract is of type CM at Risk',
		},
		{ key: 'Design-Bid', value: 'Construction contract is design-build type' },
		{ key: 'Design-Bid-Build', value: 'Construction contract is design-bid-build type' },
		{ key: 'Design-Build-Operate', value: 'Construction contract is design-build-operate type' },
		{ key: 'IPD', value: 'Construction contract is integrated project delivery type' },
	];
}
