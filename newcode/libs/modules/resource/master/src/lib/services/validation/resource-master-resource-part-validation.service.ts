/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMasterResourcePartValidationGeneratedService } from './generated/resource-master-resource-part-validation-generated.service';
import { inject, Injectable } from '@angular/core';
import { IRevalidationFunctions, RevalidationInfo, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IResourceEquipmentPlantEntity, IResourceMasterResourcePartEntity } from '@libs/resource/interfaces';
import { PlatformConfigurationService, PlatformHttpService } from '@libs/platform/common';
import { IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { ResourceMasterResourcePartDataService } from '../data/resource-master-resource-part-data.service';
import { ResourceMasterResourceDataService } from '../data/resource-master-resource-data.service';
import { isUndefined } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ResourceMasterResourcePartValidationService extends ResourceMasterResourcePartValidationGeneratedService {
	private readonly resourceMasterResourcePartDataService = inject(ResourceMasterResourcePartDataService);
	private readonly resourceMasterResourceDataService = inject(ResourceMasterResourceDataService);
	protected readonly http = inject(PlatformHttpService);
	private readonly configService = inject(PlatformConfigurationService);
	protected override handwrittenValidators = {
		PartFk: [this.validatePartFk],
		Price: [this.validatePrice],
	};
	protected override handwrittenRevalidators : IRevalidationFunctions<IResourceMasterResourcePartEntity> = {
		IsMainPart: [
				{
					dependsOn: ['IsMainPart'],
					validator: this.validateIsMainPart,
				}
			]
	};
	private validatePrice(info : ValidationInfo<IResourceMasterResourcePartEntity>) {
		const entities = this.resourceMasterResourcePartDataService.getList();
		const destinationDataService = this.resourceMasterResourceDataService;
		const sumUp = (total: number,item: IResourceMasterResourcePartEntity) => total + item.Price;
		const sum = entities.reduce(sumUp,0);
		const destinationEntity = destinationDataService.getList().find((item) => info.entity.ResourceFk === item.Id);
		if(!isUndefined(destinationEntity)){
			destinationEntity.Rate = sum;
			destinationDataService.setModified(destinationEntity);
		}

		return new ValidationResult();
	}
	private async validatePartFk(info: ValidationInfo<IResourceMasterResourcePartEntity>) {
		const plant = 1;
		const employee = 2;
		const containerSpec = {Id: info.value};

		if(info.entity.ResourcePartTypeFk === plant){
			return this.http.post<IResourceEquipmentPlantEntity[]>(this.configService.webApiBaseUrl + 'resource/equipment/plant/list', containerSpec).
			then(result => {
				if (result.some(p => true)) {
					info.entity.DescriptionInfo = result[0].DescriptionInfo;
				}
				return new ValidationResult();
			});
		}

		if(info.entity.ResourcePartTypeFk === employee){
			return this.http.post<IEmployeeEntity[]>(this.configService.webApiBaseUrl + 'timekeeping/employee/list', containerSpec).then(function (result) {
				if (result.some(p => true)) {
					info.entity.DescriptionInfo = result[0].DescriptionInfo;
				}
				return new ValidationResult();
			});
		}
		return new ValidationResult();
	}
	private selectedItem : IResourceMasterResourcePartEntity|null = null;
	private changedIsMainPartValue: boolean = false;
	private validateIsMainPart(info: RevalidationInfo<IResourceMasterResourcePartEntity>) {
		let res = new ValidationResult('...');

		if (info.entity.IsMainPart !== info.value) {
			this.changedIsMainPartValue = info.value as boolean;
			this.selectedItem = info.entity;

			// TODO from old client probably not actual:
			//old code comment: For some reason the grid is updated with the old data if gridRefresh is called in the same thread...
			//old code:
			//setTimeout(function () {
			// 					resourceMasterResourcePartDataService.gridRefresh();
			// 				}, 1);
			//probably new code, probably provide by framework gridRefresh: setTimeout(() => this.resourceMasterResourcePartDataService.gridRefresh(), 1);
		}

		const selectedMainParts = info.entities.filter(
			(item : IResourceMasterResourcePartEntity) => item.Id === this.selectedItem?.Id ? this.changedIsMainPartValue : item.IsMainPart
		);

		if (selectedMainParts.length > 1 && (info.entity.Id === this.selectedItem?.Id ? this.changedIsMainPartValue : info.entity.IsMainPart)) {
			res = new ValidationResult('resource.master.errorOnlyOneMainPart');
		} else if (selectedMainParts.length < 1 && (info.entity.Id === this.selectedItem?.Id ? !this.changedIsMainPartValue : !info.entity.IsMainPart)) {
			res = new ValidationResult('resource.master.errorNeedsOneMainPart');
		} else {
			res = new ValidationResult();
		}
		//TODO: Probably not needed with revalidation
		//Old Client Code return platformDataValidationService.finishValidation(res, entity, value, model, self, resourceMasterResourcePartDataService);
		return res;
	}
}