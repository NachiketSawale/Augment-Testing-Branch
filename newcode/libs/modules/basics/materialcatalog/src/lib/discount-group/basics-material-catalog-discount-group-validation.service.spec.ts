/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CollectionHelper } from '@libs/platform/common';
import { ValidationInfo } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

import { BasicsMaterialCatalogDiscountGroupValidationService } from './basics-material-catalog-discount-group-validation.service';
import { BasicsMaterialCatalogDiscountGroupDataService } from './basics-material-catalog-discount-group-data.service';
import { IMaterialDiscountGroupEntity } from '../model/entities/material-discount-group-entity.interface';

describe('BasicsMaterialCatalogDiscountGroupValidationService', () => {
	let service: BasicsMaterialCatalogDiscountGroupValidationService;
	let dataService: jest.Mocked<BasicsMaterialCatalogDiscountGroupDataService>;

	const list: IMaterialDiscountGroupEntity[] = [
		{
			Id: 1,
			Code: 'Code_abc123',
			DescriptionInfo: {
				Description: 'Description_xyz456',
				DescriptionTr: 10,
				Translated: 'Translated_def789',
				DescriptionModified: true,
				Modified: false,
				VersionTr: 2,
				OtherLanguages: null,
			},
			Discount: 15.5,
			DiscountType: 1,
			HasChildren: true,
			MaterialCatalogFk: 456,
			MaterialDiscountGroupFk: 789,
			ChildItems: [
				{
					Id: 2,
					Code: 'Code_def456',
					DescriptionInfo: {
						Description: 'Description_ghi789',
						DescriptionTr: 20,
						Translated: 'Translated_jkl012',
						DescriptionModified: false,
						Modified: true,
						VersionTr: 3,
						OtherLanguages: null,
					},
					Discount: 10.0,
					DiscountType: 2,
					HasChildren: false,
					MaterialCatalogFk: 457,
					MaterialDiscountGroupFk: null,
					ChildItems: null,
				},
			],
		},
		{
			Id: 3,
			Code: 'Code_ghi789',
			DescriptionInfo: {
				Description: 'Description_mno123',
				DescriptionTr: 15,
				Translated: 'Translated_pqr456',
				DescriptionModified: true,
				Modified: true,
				VersionTr: 4,
				OtherLanguages: null,
			},
			Discount: 20.0,
			DiscountType: 3,
			HasChildren: false,
			MaterialCatalogFk: 458,
			MaterialDiscountGroupFk: 790,
			ChildItems: null,
		},
		{
			Id: 4,
			Code: 'Code_jkl012',
			DescriptionInfo: {
				Description: 'Description_stu789',
				DescriptionTr: 25,
				Translated: 'Translated_vwx123',
				DescriptionModified: false,
				Modified: false,
				VersionTr: 5,
				OtherLanguages: null,
			},
			Discount: 25.0,
			DiscountType: 4,
			HasChildren: true,
			MaterialCatalogFk: 459,
			MaterialDiscountGroupFk: 791,
			ChildItems: [
				{
					Id: 5,
					Code: 'Code_mno345',
					DescriptionInfo: {
						Description: 'Description_yza456',
						DescriptionTr: 30,
						Translated: 'Translated_bcd789',
						DescriptionModified: true,
						Modified: true,
						VersionTr: 6,
						OtherLanguages: null,
					},
					Discount: 30.0,
					DiscountType: 5,
					HasChildren: false,
					MaterialCatalogFk: 460,
					MaterialDiscountGroupFk: null,
					ChildItems: null,
				},
			],
		},
	];

	const selected = list[0];

	beforeEach(() => {
		const dataServiceMock = {
			getList: jest.fn(),
			setModified: jest.fn(),
			addInvalid: jest.fn(),
			removeInvalid: jest.fn(),
			flatList: jest.fn(),
		};

		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [BasicsMaterialCatalogDiscountGroupValidationService, BasicsSharedDataValidationService, { provide: BasicsMaterialCatalogDiscountGroupDataService, useValue: dataServiceMock }],
		});

		service = TestBed.inject(BasicsMaterialCatalogDiscountGroupValidationService);
		dataService = TestBed.inject(BasicsMaterialCatalogDiscountGroupDataService) as jest.Mocked<BasicsMaterialCatalogDiscountGroupDataService>;

		dataService.getList.mockReturnValue(list);
		dataService.flatList.mockReturnValue(CollectionHelper.Flatten(list, (e) => e.ChildItems ?? []));
	});

	it('Code is unique', () => {
		const info: ValidationInfo<IMaterialDiscountGroupEntity> = {
			entity: selected,
			field: 'Code',
			value: 'Code_abc123456',
		};

		const result = service['validateCode'](info);
		expect(result.valid).toBeTruthy();
	});

	it('Code is not unique', () => {
		const info: ValidationInfo<IMaterialDiscountGroupEntity> = {
			entity: selected,
			field: 'Code',
			value: 'Code_ghi789',
		};

		const result = service['validateCode'](info);
		expect(result.valid).toBeFalsy();
	});

	it('Code should not be empty', () => {
		const info: ValidationInfo<IMaterialDiscountGroupEntity> = {
			entity: selected,
			field: 'Code',
			value: '',
		};

		const result = service['validateCode'](info);
		expect(result.valid).toBeFalsy();
	});

	it('Code should not be null or undefined', () => {
		const info: ValidationInfo<IMaterialDiscountGroupEntity> = {
			entity: selected,
			field: 'Code',
			value: undefined,
		};

		const result = service['validateCode'](info);
		expect(result.valid).toBeFalsy();
	});
});
