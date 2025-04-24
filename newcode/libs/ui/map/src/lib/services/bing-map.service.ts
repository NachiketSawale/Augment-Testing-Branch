/*
 * Copyright(c) RIB Software GmbH
 */
//TODO any, will be removed in future.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Microsoft:any;

import { Injectable, inject } from '@angular/core';

import * as _ from 'lodash';

import { PlatformDateService } from '@libs/platform/common';
import { MapUtilityService } from './map-utility.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { MapBaseService } from './map-base.service';
import { BaiduMapService } from './baidu-map.service';
import { GoogleMapService } from './google-map.service';
import { OpenstreetMapService } from './openstreet-map.service';

import { IMapOptions } from '../model/interfaces/map-options-info.interface';
import { IAddressEntity } from '../model/interfaces/address-entity.interface';
import { IMarkOptions } from '../model/interfaces/mark-options.interface';
import { ILocation } from '../model/interfaces/location.interface';
import { ISearchOptions } from '../model/interfaces/search-options.interface';
import { IBingGeocodeInfo } from '../model/interfaces/bing-geocode-info.interface';
import { IBingGeocode } from '../model/interfaces/bing-geocode.interface';
import { IBingGeocodeAddress } from '../model/interfaces/bing-geocode-address.interface';
import { IBingEvent } from '../model/interfaces/bing-event.interface';
import { IShowRouteDistance } from '../model/interfaces/bing-map/showroute-distance.interface';
import { IMapContainerDimensions } from '../model/interfaces/google-map/map-container-dimension.interface';
import { IWaypoint } from '../model/interfaces/bing-map/waypoint.interface';
import { IShowPinWaypointData } from '../model/interfaces/show-pin-waypoint-data.interface';
import { IEventHandler } from '../model/interfaces/bing-map/event-handler.interface';
import { IEventTarget } from '../model/interfaces/bing-map/event-target.interface';
import { IEventAddon } from '../model/interfaces/bing-map/event-addon.interface';

/**
 * Handle bing map functionality
 */
@Injectable({
  providedIn: 'root'
})

export class BingMapService extends MapBaseService{

  /**
   * Map instance.
   */
  public map:typeof Microsoft | null = null;

  /**
   * RouteInfoBox.
   */
  public routeInfoBox:typeof Microsoft | null = null;

  /**
   * DirectionManager.
   */
  public directionManager:typeof Microsoft | null = null;

  /**
   * wayPoints Address.
   */
  public wayPointsAdrs!:IAddressEntity[];

  /**
   * directionWaypointLayer.
   */
  public directionWaypointLayer:typeof Microsoft.Maps | null = null;

  /**
   * waypointDragging.
   */
  public waypointDragging=false;

  /**
   * Map pin.
   */
  public pin:typeof Microsoft.Maps | null = null;

  /**
   * Map pinInfo.
   */
	public pinInfo:typeof Microsoft.Maps | null = null;

  /**
   * ShowInfoBoxId event.
   */
  public showInfoBoxId:typeof Microsoft.Maps.Events;

  /**
   * HideInfoBoxId event.
   */
  public hideInfoBoxId:typeof Microsoft.Maps.Events;

  /**
   * UpdateInfoBoxPosition event.
   */
  public updateInfoBoxPosition:typeof Microsoft.Maps.Events;

  /**
   * Event instance.
   */
  public clickMapId: typeof Microsoft.Maps.Events | null = null;

  /**
   * marker list.
   */
  public markerList:typeof Microsoft.Maps.Infobox[] = [];

  /**
   * selectedPin.
   */
  public selectedPin: typeof Microsoft.Maps;

  /**
   * Bing API Url.
   */
  public apiUrl = 'https://www.bing.com/api/maps/mapcontrol';

  /**
   * Snapshot path.
   */
  private snapshotUrl = 'https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/';

  /**
   * Map key service.
   */
  private mapKeyService = inject(MapUtilityService);

  /**
   * inject the PlatformTranslateService
   */
  public readonly translate = inject(PlatformTranslateService);

  /**
   * PlatformDateService instance.
   */
  private dateService = inject(PlatformDateService);

  /**
   * ShowInfoBox event callback.
   */
  public showInfoBox = ()=>{
    this.pinInfo.setOptions({visible: true});
    this.pinInfo.setMap(this.map);
  };

  /**
   * HideInfoBox event callback.
   */
  public hideInfoBox = ()=>{
    this.pinInfo.setOptions({visible: false});
    this.pinInfo.setMap(null);
  };

  /**
   * Find address by lat-lon.
   * @param lat number.
   * @param lon number.
   */
  public geoLocation2address(lat:number, lon:number) {
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', ()=> {
      const searchManager = new Microsoft.Maps.Search.SearchManager(this.map);
      const reverseGeocodeRequestOptions = {
        location: new Microsoft.Maps.Location(lat, lon),
        callback: (response:IBingGeocode)=> {
          let newAddress = null;
          try {
            newAddress = this.extractAddress(response, true);
          } catch (e) {
            throw new Error('Bing Map geo error: No address found');
          }

          this.dataOnMapClick$.next({
            latitude: lat,
            longitude: lon,
            addressEntity: newAddress
          });
        }
      };
      searchManager.reverseGeocode(reverseGeocodeRequestOptions);
    });
  }

  /**
   * Initialize bing map.
   */
  public override init() {
    const defaults = {
      credentials: 'AjtUzWJBHlI3Ma_Ke6Qv2fGRXEs0ua5hUQi54ECwfXTiWsitll4AkETZDihjcfeI',
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      zoom: 16,
      showMapTypeSelector: false,
    }, mapSettings = Object.assign({}, defaults, (this.options as IMapOptions).mapOptions);

    // create map
    this.map = new Microsoft.Maps.Map(this.element, mapSettings);


    this.routeInfoBox = new Microsoft.Maps.Infobox(this.map.getCenter(), {
      showCloseButton: true,
      visible: false
    });
    this.routeInfoBox.setMap(this.map);

    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', ()=> {
      this.directionManager = new Microsoft.Maps.Directions.DirectionsManager(this.map);
    });
  }

  /**
   * listen click event of map.
   */
  public mapClickEvent(){
    // listen click event of map
    this.clickMapId = Microsoft.Maps.Events.addHandler(this.map, 'click',(e:IBingEvent)=> {

      if (e && e.targetType === 'map') {
        const location = e.location;
        this.geoLocation2address(location.latitude, location.longitude);
      }
    });
  }

  /**
   * Remove click event.
   */
  public override destroy(){
    Microsoft.Maps.Events.removeHandler(this.clickMapId);
  }

  /**
   * Add mark on the map.
   * @param markOptions location info.
   * @returns null
   */
  public mark(markOptions:IMarkOptions | null) {


    // judge latitude and longitude value are valid or not.
    const validLoacation: boolean = this.mapKeyService.isLatLongValid(markOptions as IMarkOptions);
    this.pin = null;
    if (!markOptions || !validLoacation) { // clear mark.
      if (this.pin) {
        Microsoft.Maps.Events.removeHandler(this.showInfoBoxId);
        this.pin = null;
      }
      if (this.map) {
        Microsoft.Maps.Events.removeHandler(this.hideInfoBoxId);
        this.map.entities.clear();
        this.map.setView({center: new Microsoft.Maps.Location(0, 0)});
      }
      this.pinInfo = null;
      return;
    }

    const center = new Microsoft.Maps.Location(markOptions.latitude, markOptions.longitude);
    const address = markOptions.address || 'you are here';


    if (!this.pin || !this.pinInfo) {
      this.pin = new Microsoft.Maps.Pushpin(center, {
        // text: '1',
        icon: 'https://www.bingmapsportal.com/content/images/poi_custom.png'
      });

      this.pinInfo = new Microsoft.Maps.Infobox(center, {
        width: 180,
        height: 60,
        visible: true,
        offset: new Microsoft.Maps.Point(0, 39)
      });

      this.showInfoBoxId = Microsoft.Maps.Events.addHandler(this.pin, 'click', this.showInfoBox);

      this.hideInfoBoxId = Microsoft.Maps.Events.addHandler(this.map, 'viewchange', this.hideInfoBox);

      this.map.entities.clear();
      this.map.entities.push(this.pin);
    } else {
      this.pin.setLocation(center);
      this.pinInfo.setLocation(center);

    }

    // when pickup location on map, don't show this info box, to avoid the close button fire event on map again pb
    let isInfoVisible = (this.options as IMapOptions).showInfoBox; // default

    // when pick up location on map...
    if (markOptions.disableSetCenter) {
      // disable show the info box when mark address on map
      isInfoVisible = false;
    } else {
      this.map.setView({center: center});
    }

    this.pinInfo.setOptions({
      visible: isInfoVisible,
      description: address
    });

  }


  /**
   * Clear mark.
   */
  public clearMarker() {
    if (this.map.entities) {
      this.map.entities.clear();
    }
    this.markerList.forEach((markItem)=>{
      markItem.setMap(null);
    });
    this.markerList = [];
  }

  /**
   * Marks multiple locations.
   * @param markItemList locations info.
   */
  public markMultiple(markItemList:IAddressEntity[]) {

    const pinDefaultImage = 'https://www.bingmapsportal.com/content/images/poi_custom.png';
    const pinSelectedImage = 'cloud.style/content/images/control-icons.svg#ico-pushpin-bing';
    this.clearMarker();
    let selectedPinInfo: typeof Microsoft.Maps = null;

    markItemList.forEach((markItem:IAddressEntity,i:number)=>{
      const markdata:IMarkOptions={
        latitude:markItem.Latitude,
        longitude:markItem.Longitude,
        address:markItem.Address

      };
      if (!this.mapKeyService.isLatLongValid(markdata)) {
        return;
      }
      const center = new Microsoft.Maps.Location(markItem.Latitude, markItem.Longitude);
      const address = markItem.Address;
      const title = markItem.CountryDescription;

      const pin = new Microsoft.Maps.Pushpin(center, {
        text: (i + 1).toString(), icon: pinDefaultImage, width: '25px', height: '39px'
      });

      const pinInfo = new Microsoft.Maps.Infobox(center, {
        width: 180,
        height: 60,
        visible: false,
        offset: new Microsoft.Maps.Point(0, 39),
        title: title,
        description: address
      });

      if (markItem.isSelected) {
        pin.setOptions({icon: pinSelectedImage, iconSize: {height: 40, width: 40}, draggable: true});
        this.selectedPin = pin;
        selectedPinInfo = pinInfo;
      }

      pinInfo.setMap(this.map);

      this.showInfoBoxId = Microsoft.Maps.Events.addHandler(pin, 'click', ()=>{
        pinInfo.setOptions({visible: true});
        pinInfo.setMap(this.map);
      });
      this.hideInfoBoxId = Microsoft.Maps.Events.addHandler(this.map, 'viewchange', ()=>{
        pinInfo.setOptions({visible: false});
        pinInfo.setMap(null);
      });
      this.updateInfoBoxPosition = Microsoft.Maps.Events.addHandler(pin, 'drag', (event:IBingEvent)=>{
        pinInfo.setOptions({location: event.location});
      });

      this.map.entities.push(pin);
      this.markerList.push(pinInfo);
    });


    if (this.selectedPin && selectedPinInfo) {
      setTimeout(()=> {
        if (selectedPinInfo) {
          selectedPinInfo.setOptions({visible: true});
          selectedPinInfo.setMap(this.map);
        }
      }, 1000);
    }
    this.map.setView({bounds: this.createBound(markItemList)});
    this.map.setView({zoom: 3});
    this.waypointDragging = false;
  }

  /**
   * Creates bound for mark.
   * @param markItemList locations info.
   * @returns fromEdges.
   */
  public createBound(markItemList:IAddressEntity[]) {

    const extremeValues = this.mapKeyService.getExtremes(markItemList);
    return new Microsoft.Maps.LocationRect.fromEdges(extremeValues.maxLat, extremeValues.minLong, extremeValues.minLat, extremeValues.maxLong);
  }

  /**
   * search LatLng using location address.
   * @param searchOptions searchOptions.
   */
  public search(searchOptions:ISearchOptions) {

    const hasSuccessCallback = typeof searchOptions.success === 'function',
      successCallback = (location:ILocation | null)=> {
        if (hasSuccessCallback && location) {
          searchOptions.success(location);
        }
      },
      errorCallback = ()=> {
        if (typeof searchOptions.error === 'function') {
          searchOptions.error();
        }
      };

    Microsoft.Maps.loadModule('Microsoft.Maps.Search', ()=> {
      const searchManager = new Microsoft.Maps.Search.SearchManager(this.map);
      // encode string and replace all line breaks with simple spaces
      // if line breaks included bing responds with wrong result
      searchOptions.address = decodeURI(encodeURI(searchOptions.address).replace(/%0D/g, '%20'));

      const requestOptions = {
        where: searchOptions.address,
        bounds: Microsoft.Maps.LocationRect.fromEdges(85.5, -180, -85.5, 180),
        count: 1,
        callback: (response:IBingGeocodeInfo)=> {
          if (response && response.results && response.results.length > 0 || this.isResponseResultValid(response.results[0], searchOptions)) {

            const location = {
              latitude: response.results[0].location.latitude,
              longitude: response.results[0].location.longitude,
              addressEntity: this.extractAddress(response.results[0], false)
            };
            if (!searchOptions.searchOnly) {

              const markOptions = Object.assign({},location, {
                address: response.results[0].address.formattedAddress
              });

              this.mark(markOptions as IMarkOptions);
            }

            successCallback(location);

          } else {
            if (!searchOptions.searchOnly) {
              this.mark(null); // clear old mark.
            }
            successCallback(null); // clear old latitude and longitude.
          }
        },
        errorCallback: ()=> {
          errorCallback();
        }
      };

      try {
        searchManager.geocode(requestOptions);
      } catch (e) {
        errorCallback();
      }

    });
  }

  /**
   * Checks response result is valid or not.
   * @param result Geocoder result.
   * @param searchOptions options.
   * @returns valid result flag.
   */
  public isResponseResultValid(result:IBingGeocode, searchOptions:ISearchOptions) {

    const zipCodeValidOrEmpty = (String(searchOptions.entity.ZipCode).length === 0) || (String(result.address.postalCode) === String(searchOptions.entity.ZipCode));

    return searchOptions.entity.AddressModified || zipCodeValidOrEmpty; // check if zip codes are equal, if the result location in the right city
  }

  /**
   * Extract address from geocoder response.
   * @param result map geocoder response.
   * @param addressModified boolean
   * @returns new address.
   */
  public extractAddress(result:IBingGeocode, addressModified:boolean) {
    const addressComponents:IBingGeocodeAddress = result.address;
    const newAddressEntity = {
            AddressModified: addressModified,
            Address: addressComponents.formattedAddress
        };

    const info = {
      Street: ['addressLine'],
      City: ['locality'],
      County: ['adminDistrict2', 'adminDistrict'],
      // state: ['locality'],
      ZipCode: ['postalCode'],
      CountryCodeISO2: ['countryRegionIso2']
    };

    _.map(info, (val, key)=> {
      const addrInfo:string[] = [];
      _.map(val, (property)=> {
        //TODO any, will be removed in future.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addrInfo.push((addressComponents as any)[property]);
      });
      //TODO any, will be removed in future.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newAddressEntity as any)[key] = _.uniq(addrInfo).join(' ');
    });

    return newAddressEntity;
  }

  /**
   * Show route between two locations.
   * @param wayPoints locations information.
   * @returns promise.
   */
  public showRoutes$(wayPoints:IAddressEntity[]){
    const distance = new Promise((resolve)=>{
      const data:IShowRouteDistance = {unitInfo: 'km', distances: []};
      this.wayPointsAdrs = wayPoints;
      // reset route
      this.clearMarker();
      this.routeInfoBox.setOptions({
        visible: false
      });
      this.directionManager.clearAll();

      this.directionManager.setRequestOptions({
        routeMode: Microsoft.Maps.Directions.RouteMode.driving,
        distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
        routeDraggable: false
      });



      // only create new layer if it's not yet initialised
      if (!this.directionWaypointLayer) {
        // Create a layer for managing custom waypoints.
        this.directionWaypointLayer = new Microsoft.Maps.Layer();

        Microsoft.Maps.Events.addHandler(this.directionWaypointLayer, 'click', (e:IEventHandler)=>{
          this.onWaypointClicked(e);
        }
        );
        this.map.layers.insert(this.directionWaypointLayer);
      }

      // always clear layer
      this.directionWaypointLayer.clear();

      wayPoints.forEach((wayPoint)=> {
        let wayPnt;
        const checkWayPoint:IMarkOptions={
          latitude:wayPoint.Latitude,
          longitude:wayPoint.Longitude,
          address:wayPoint.Address

        };
        if (wayPoint.Latitude && wayPoint.Longitude && this.mapKeyService.isLatLongValid(checkWayPoint)) {
          wayPnt = new Microsoft.Maps.Directions.Waypoint({location: new Microsoft.Maps.Location(wayPoint.Latitude, wayPoint.Longitude)});
        } else if (wayPoint.AddressLine) {
          wayPnt = new Microsoft.Maps.Directions.Waypoint({address: wayPoint.AddressLine});
        } else {
          wayPnt = new Microsoft.Maps.Directions.Waypoint({address: wayPoint.Address});
        }
        this.directionManager.addWaypoint(wayPnt);
      });

      Microsoft.Maps.Events.addOne(this.directionManager, 'directionsUpdated', (e:IEventAddon)=>{

        data.distances.push(this.directionsUpdated(e,wayPoints) as number);
      });

      Microsoft.Maps.Events.addHandler(this.directionManager, 'directionsError', (directionsErrorEventArgs:IEventHandler)=> {
        this.routeInfoBox.setOptions({
          location: this.map.getCenter(),
          title: 'Route Error',
          description: directionsErrorEventArgs.message,
          showPointer: false,
          visible: true
        });

        if (this.wayPointsAdrs.length >= 1) {
          this.markMultiple(this.wayPointsAdrs);
        }
      });

      this.directionManager.setRenderOptions({
        firstWaypointPushpinOptions: {visible: false},
        lastWaypointPushpinOptions: {visible: false},
        waypointPushpinOptions: {visible: false}
      });
      this.directionManager.calculateDirections();

      resolve(data);
    });

    return distance;
  }

  /**
   * Show info box for selected pin
   * @param pin Event target info.
   * @param waypoint Way point.
   */
  public showPinInfoBox(pin:IEventTarget, waypoint:IShowPinWaypointData) {

    const waypointStr = this.translate.instant('ui.map.entityWaypoint').text;
    const plannedTime = this.translate.instant('ui.map.entityPlannedTime').text;
    const address = this.translate.instant('ui.map.entityAddress').text;
    const comments = this.translate.instant('ui.map.entityCommentText').text;

    const planTimeStr = '<b>' + plannedTime + '</b>: ' +
      this.dateService.formatLocal(waypoint.PlannedTime);
    const addressStr = '<br><b>' + address + '</b>: ' +
      waypoint.Address.Address || '';
    const commentStr = '<br><b>' + comments + '</b>: ' +
      waypoint.CommentText || '';

    this.routeInfoBox.setOptions({
      location: pin.getLocation(),
      title: '<' + waypoint.Code + '> ' + waypointStr,
      description: planTimeStr + addressStr + commentStr,
      offset: pin.metadata.infoboxOffset,
      showPointer: true,
      visible: true,
      maxHeight: 160
    });
  }

  /**
   * Updates directions.
   * @param e Event.
   * @param wayPoints Way point.
   * @returns number.
   */
  public directionsUpdated(e:IEventAddon,wayPoints:IAddressEntity[] ): number | undefined{
    this.directionWaypointLayer.clear();
    if (e.route && e.route.length > 0) {
      const route = e.route[0];
      let waypointCnt = 0;
      const waypointLabel = 'ABCDEFGHIJKLMNOPQRSTYVWXYZ';
      let pin = null;
      const wp: typeof Microsoft.Maps[] = [];
      let step;
      let isWaypoint;
      let waypointColor;
      const SVG = '<circle cx=\'27\' cy=\'25\' r=\'3\' style=\'stroke-width:2;stroke:#ffffff;fill:#000000;\'/>' +
        '<polygon style=\'fill:rgba(0,0,0,0.5)\' points=\'21,1 27,25 21,18 21,1\'/>' +
        '<rect x=\'5\' y=\'2\' width=\'15\' height=\'15\' style=\'stroke-width:2;stroke:#000000;fill:{color}\'/>' +
        '<text x=\'12\' y=\'13\' style=\'font-size:10px;font-family:arial;fill:#ffffff;\' text-anchor=\'middle\'>{text}</text>';
      const ICON = '<svg xmlns=\'http://www.w3.org/2000/svg\' xmlns:xlink=\'http://www.w3.org/1999/xlink\' width=\'50\' height=\'50\' viewBox=\'0 0 35 35\' xml:space=\'preserve\'>' +
        SVG + '</svg>';
      let distanceInfo = 0;
      for (let i = 0; i < route.routeLegs.length; i++) {
        for (let j = 0; j < route.routeLegs[i].itineraryItems.length; j++) {
          isWaypoint = true;
          step = route.routeLegs[i].itineraryItems[j];
          if (j === 0) {
            if (i === 0) {
              // Start Endpoint, make it green.
              waypointColor = '#008f09';
            } else {
              // Midpoint Waypoint, make it gray,
              waypointColor = '#737373';
            }
          } else if (i === route.routeLegs.length - 1 && j === route.routeLegs[i].itineraryItems.length - 1) {
            // End waypoint, make it red.
            waypointColor = '#d60000';

          } else {
            // Instruction step
            isWaypoint = false;
          }
          if (isWaypoint) {
            pin = new Microsoft.Maps.Pushpin(step.coordinate, {
              icon: ICON,
              anchor: new Microsoft.Maps.Point(42, 39),
              color: waypointColor,
              text: waypointLabel[waypointCnt],   // Give waypoints a letter as a label.
              draggable: true
            });
            // Store the waypoint/step information in the metadata.
            pin.metadata = {
              entity: wayPoints[waypointCnt],
              index: waypointCnt,
              infoboxOffset: new Microsoft.Maps.Point(-25, 35)
            };
            Microsoft.Maps.Events.addHandler(
              pin,
              'dragend',
              (args:IEventHandler)=> {
                const draggedWaypoint = args.target.metadata.entity;
                draggedWaypoint.Latitude = args.location.latitude;
                draggedWaypoint.Longitude = args.location.longitude;
                this.waypointDragging = true;
                const center = this.map.getCenter();
                const zoom = this.map.getZoom();
                this.showRoutes$(wayPoints).then(result => {
                  this.map.setView({center: center, zoom: zoom});
                });
              }
            );
            waypointCnt++;
            wp.push(pin);
          }
        }
        //data.distances.push(route.routeLegs[i].summary.distance);
        distanceInfo = route.routeLegs[i].summary.distance;
      }
      //defer.resolve(data);
      // Add the pins to the map.
      this.directionWaypointLayer.add(wp);
      return distanceInfo;
    }else{
      return;
    }
  }

  /**
   * Shows info box.
   * @param e Event.
   */
  public onWaypointClicked(e:IEventHandler) {

    this.mapKeyService.waypointClicked(e.target.metadata).then((waypoint:IShowPinWaypointData)=> {
      this.showPinInfoBox(e.target, waypoint);
    });
  }

  /**
   * Creates snapshot url.
   * @param map Map instance.
   * @param mapDimensions Container dimensions.
   * @returns Snap shot url.
   */
  public getMapSnapshotURL(map:GoogleMapService | BaiduMapService | BingMapService | OpenstreetMapService, mapDimensions:IMapContainerDimensions){
    if ((map as BingMapService).directionManager.getAllWaypoints().length > 1) {
      return this.getMapSnapshotURLForRoute(map as BingMapService, mapDimensions);
    } else {
      return this.getMapSnapshotURLForPinpoint(map as BingMapService, mapDimensions);
    }
  }

  /**
   * Creates snap shot url for route.
   * @param map Map instance.
   * @param mapDimensions Container dimensions.
   * @returns Snap shot url.
   */
  public getMapSnapshotURLForRoute(map:BingMapService, mapDimensions:IMapContainerDimensions) {
    let httpString = this.snapshotUrl + map.map.getCenter().latitude + ',' + map.map.getCenter().longitude
      + '/' + map.map.getZoom() + '/Routes?driving?ur=at&c=en-GB';
    httpString += '&mapSize=' + mapDimensions.width + ',' + mapDimensions.height;
    let i = 0;
    if (map.directionManager.getAllWaypoints().length > 0) {

      const waypoints = map.directionManager.getAllWaypoints();
      let waypointString = '';

      waypoints.forEach((waypoint:IWaypoint) => {
        waypointString = waypoint._waypointOptions.location ? waypoint._waypointOptions.location.latitude + ',' + waypoint._waypointOptions.location.longitude : encodeURI(waypoint._waypointOptions.address).replace(/%0D/g, '%20');
        httpString += '&wp.' + i++ + '=' + waypointString;
      });

      httpString += '&ra=routepath,routepathannotations,routeproperties,routeInfoCard,TransitFrequency&optmz=time&du=km&tt=departure&maxSolns=3&rpo=Points&jsonp=JSON_CALLBACK&key=' + this.key;
    }
    return httpString;
  }

  /**
   * Creates snapshot url for pinpoint.
   * @param map Map instance.
   * @param mapDimensions Container dimensions.
   * @returns Snap shot url.
   */
  public getMapSnapshotURLForPinpoint(map:BingMapService, mapDimensions:IMapContainerDimensions) {
    let httpString = this.snapshotUrl + map.map.getCenter().latitude + ',' + map.map.getCenter().longitude
      + '/' + map.map.getZoom();
    httpString += '?mapSize=' + mapDimensions.width + ',' + mapDimensions.height;
    httpString += '&pp=' + map.selectedPin.geometry.y + ',' + map.selectedPin.geometry.x + ';54';
    httpString += '&mapLayer=Basemap,Buildings&key=' + this.key;
    return httpString;
  }

  /**
   * Opens map into new tab.
   * @param entityData location information.
   */
  public showMapToNewTab(entityData:IAddressEntity) {
    const url = '//www.bing.com/maps' + '/?q=' + entityData.Latitude + ',' + entityData.Longitude;

    window.open(url, '_blank');
  }

}
