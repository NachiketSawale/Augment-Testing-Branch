/*
 * Copyright(c) RIB Software GmbH
 */
 /*

 //TODO: The container should be migrated into the new client, which belongs to the resource area and is not available yet.
import { EntityInfo } from '@libs/ui/business-base';
import { LogisticCardPlantCompatibleMaterialDataService } from '../services/logistic-card-plant-compatible-material-data.service';
import { LogisticCardPlantCompatibleMaterialBehavior } from '../behaviors/logistic-card-plant-compatible-material-behavior.service';


 export const LOGISTIC_CARD_PLANT_COMPATIBLE_MATERIAL_ENTITY_INFO: EntityInfo = EntityInfo.create<'//TODO:T extends EntityInfo Interface'> ({
                grid: {
                    title: {key: 'cardPlantCompatibleMaterialListTitle'},
						  behavior: ctx => ctx.injector.get(LogisticCardPlantCompatibleMaterialBehavior),
                },
                form: {
			    title: { key: 'logistic.card' + '.cardPlantCompatibleMaterialDetailTitle' },
			    containerUuid: '517e4033147a40bd8e2975297c9443e0',
		        },
                dataServiceToken: ctx => ctx.injector.get(LogisticCardPlantCompatibleMaterialDataService),
                dtoSchemeId: {moduleSubModule: '//TODO:Add Module.Submodulename here', typeName: '//TODO:Add DTO name Here'},
                permissionUuid: '47693dc497464c16ba9df74576724959',

            });
 */