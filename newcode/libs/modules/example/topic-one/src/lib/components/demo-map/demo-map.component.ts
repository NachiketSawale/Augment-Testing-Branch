/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';

import { ContainerBaseComponent } from '@libs/ui/container-system';

import { IAddressEntity } from '@libs/ui/map';

import { AddressEntities, RouteEntity } from '../../model/constant/address-entities';

import { PlatformTranslateService } from '@libs/platform/common';

/**
 * This component is created for map demo purpose.
 */
@Component({
	selector: 'example-topic-one-demo-map',
	templateUrl: './demo-map.component.html',
	styleUrls: ['./demo-map.component.css'],
})
export class DemoMapComponent extends ContainerBaseComponent {

	public entity:IAddressEntity[] |IAddressEntity = AddressEntities;
	public showRoutes:boolean= false;
	public calculateDist:boolean= false;

	public editMap=false;
	public route=false;
	public calculateDistan=false;

public readonly translate = inject(PlatformTranslateService);
	public constructor(){
		super();
		this.translate.load(['transport']);
	}
	public selectEditMap(){
		this.showRoutes = false;
		this.editMap = true;
		this.entity= AddressEntities;
		this.route = false;
	}

	public showRoute(){
		this.route = true;
		this.entity = RouteEntity;
		this.showRoutes = true;
		this.editMap = false;
	}

	public calculateDistance(){
		this.calculateDistan = !this.calculateDistan;
		this.entity = RouteEntity;
		this.calculateDist = true;
	}

	public selectReadOnlyMap(){
		this.editMap = false;
		this.showRoutes = false;
		this.route = false;
		this.entity= AddressEntities;
	}
}

