/*
 * Copyright(c) RIB Software GmbH
 */
import * as _ from 'lodash';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';
import {IMaterialSearchEntity} from '../model/interfaces/material-search-entity.interface';
import {IMaterialBlobEntity} from '../model/interfaces/material-blob-entity.interface';
import { firstValueFrom } from 'rxjs';

/**
 * Service to handle material blob/image
 */
@Injectable({
  providedIn: 'root'
})
export class BasicsSharedMaterialBlobService {
  private http = inject(HttpClient);
  private configurationService = inject(PlatformConfigurationService);

  private blobCache = new Map<string, IMaterialBlobEntity>();

  /**
   * Provide base64 format image string
   * @param dataItems
   * @param hasPlaceHolder
   */
  public async provideImage(dataItems: IMaterialSearchEntity[], hasPlaceHolder: boolean = true) {
	  await Promise.all(dataItems.map(async (dataItem) => {
		  if (_.isNil(dataItem.BasBlobsFk)) {
			  return;
		  }

		  const key = this.generateCacheKey(dataItem);

		  if (hasPlaceHolder) {
			  const placeholderImg = dataItem.InternetCatalogFk ? 'ico-mat-placeholder' : 'ico-pic-placeholder';
			  dataItem.Image = 'cloud.style/content/images/control-icons.svg#' + placeholderImg;
		  }

		  if (this.blobCache.has(key)) {
			  this.setImage(dataItem, this.blobCache.get(key)!);
		  } else {
			  const blob = await this.getImage(dataItem) as IMaterialBlobEntity;
			  if (blob) {
				  this.blobCache.set(key, blob);
				  this.setImage(dataItem, blob);
			  }
		  }
	  }));
  }

  private setImage(dataItem: IMaterialSearchEntity, blob: IMaterialBlobEntity) {
    dataItem.Image = 'data:image/png;base64,' + blob.Content;
  }

  private async getImage(dataItem: IMaterialSearchEntity) {
    const request = _.isNil(dataItem.InternetCatalogFk) ?
		 this.http.get(this.configurationService.webApiBaseUrl + 'cloud/common/blob/getblobbyid?id=' + dataItem.BasBlobsFk) :
		 this.http.get(this.configurationService.webApiBaseUrl + 'basics/material/commoditysearch/1.0/internetBlob?blobId=' + dataItem.BasBlobsFk + '&catalogId=' + dataItem.InternetCatalogFk);

	 return await firstValueFrom(request);
  }

  private generateCacheKey(dataItem: IMaterialSearchEntity) {
    if (_.isNil(dataItem.InternetCatalogFk)) {
      return dataItem.BasBlobsFk!.toString();
    }
    return dataItem.BasBlobsFk + '&' + dataItem.InternetCatalogFk;
  }

}