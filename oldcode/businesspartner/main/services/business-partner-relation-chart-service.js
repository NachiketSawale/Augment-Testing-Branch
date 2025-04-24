(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	let moduleName = 'businesspartner.main';
	// let module = angular.module('businesspartner.main');
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('businessPartnerRelationChartService',
		['_', '$q', '$http', '$injector', 'platformObjectHelper', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService', 'genericWizardService', '$translate',
			'basicsLookupdataLookupFilterService','$rootScope',
			function (_, $q, $http, $injector, platformObjectHelper, lookupDescriptorService, parentService, genericWizardService, $translate,
				basicsLookupdataLookupFilterService,$rootScope) {

				// properties
				let cacheData = {};
				let showBranchDimension = false;
				let subIdPrefix = 'sub_';
				let service = {};
				let subsidiary2BpRelationType = null;
				let defaultSubsidiary2BpRelationType = {
					Id: 1000,
					DescriptionInfo: {
						Translated: $translate.instant(moduleName + '.sub2BpRelationTypeDesc')
					},
					OppositeDescriptionInfo: {
						Translated: $translate.instant(moduleName + '.sub2BpRelationTypeOppositeDesc')
					},
					Sorting: 1000,
					IsDefault: false,
					IsLive: true,
					RelationColor: 1279156,
					OppositeRelationColor: 8198001
				};

				angular.extend(service, {
					load: loadData,
					relationArrows: relationArrows
				});

				Object.defineProperties(service, {
					'showBranchDimension': {
						get: function () {
							return showBranchDimension;
						},
						set: function (value) {
							showBranchDimension = value;
						}, enumerable: true
					}
				});

				let addressLabel = $translate.instant(moduleName + '.relationInfoAddressLabel');
				let telephoneLabel = $translate.instant(moduleName + '.relationInfoTelephoneLabel');

				let filters = [
					{
						key: 'businesspartner-main-relation-subsidiary2-filter',
						serverSide: true,
						serverKey: 'businesspartner-main-relation-subsidiary2-filter',
						fn: function (entity) {
							return {
								BusinessPartnerFk: entity.BusinessPartner2Fk
							};
						}
					}
				];
				_.each(filters,function (filter) {
					if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.registerFilter(filter);
					}
				});
				return service;

				function setColor(relationTypeList) {
					_.forEach(relationTypeList, function (list) {
						let numStr = '000000';
						if (list.Id >= 0) {
							numStr = list.RelationColor.toString(16);
						} else {
							numStr = list.OppositeRelationColor.toString(16);
						}
						let count = 6 - numStr.length;
						for (let i = 0; i < count; i++) {
							numStr = '0' + numStr;
						}
						list.Color = {'background-color': '#' + numStr};
					});
				}

				function loadData(depth, noUseCache) {
					let defer = $q.defer(), oldData = [];
					let businessPartner = parentService.getSelected() || genericWizardService.getDataServiceByName('businesspartnerMainHeaderDataService', {}).getSelected();

					if (!businessPartner || !angular.isNumber(businessPartner.Id)) {
						return defer.promise;
					}

					if (noUseCache || !cacheData[businessPartner.Id]) {
						oldData = cacheData[businessPartner.Id] || {};
						cacheData[businessPartner.Id] = {
							nodes: [],
							links: [],
							relationTypes: [],
							showInfo: false
						};
						$rootScope.$broadcast('asyncInProgress', true);
						$http({
							method: 'get',
							url: globals.webApiBaseUrl + 'businesspartner/main/relation/list',
							params: {
								MainItemId: businessPartner.Id,
								Level: depth || 5
							}
						}
						).then(function (response) {
							$rootScope.$broadcast('asyncInProgress', false);
							if (response.data.Main.length) {
								if (showBranchDimension) {
									response.data.AllBusinessPartnerRelationType = response.data.AllBusinessPartnerRelationType || [];
									subsidiary2BpRelationType = _.find(response.data.AllBusinessPartnerRelationType, {Id: 1}) || defaultSubsidiary2BpRelationType;
								}
								lookupDescriptorService.attachData(response.data);
								let relationTypes = _.uniqBy(response.data.AllBusinessPartnerRelationType, 'Id');
								relationTypes = _.orderBy(relationTypes, 'Sorting');
								setColor(relationTypes);
								cacheData[businessPartner.Id].relationTypes = relationTypes;
								let tempRelationIdIndex = 1;
								_.forEach(response.data.Main, function (relation) {
									/** @namespace response.data.BusinessPartnerInfo */
									let bpNode = null;
									let bp2Node = null;
									let subNode = null;
									let sub2Node = null;
									if (showBranchDimension) {
										bpNode = initDataNode(oldData.nodes, relation.BusinessPartnerFk, response.data.BusinessPartnerInfo || []);
										bp2Node = initDataNode(oldData.nodes, relation.BusinessPartner2Fk, response.data.BusinessPartnerInfo || []);
										subNode = initSubDataNode(oldData.nodes, relation.BpSubsidiaryFk);
										sub2Node = initSubDataNode(oldData.nodes, relation.BpSubsidiary2Fk);

										if (subNode) {
											let bp2SubRelation = buildRelation(tempRelationIdIndex++, relation.BusinessPartnerFk, subIdPrefix + relation.BpSubsidiaryFk, subsidiary2BpRelationType.Id);
											initDataLink(cacheData[businessPartner.Id], bp2SubRelation, bpNode, subNode);
										}

										if (sub2Node) {
											let bp2ToSub2Relation = buildRelation(tempRelationIdIndex++, relation.BusinessPartner2Fk, subIdPrefix + relation.BpSubsidiary2Fk, subsidiary2BpRelationType.Id);
											initDataLink(cacheData[businessPartner.Id], bp2ToSub2Relation, bp2Node, sub2Node);
										}

										if (!subNode && !sub2Node) {
											let bpToBp2Relation = buildRelation(tempRelationIdIndex++, relation.BusinessPartnerFk, relation.BusinessPartner2Fk, relation.RelationTypeFk);
											initDataLink(cacheData[businessPartner.Id], bpToBp2Relation, bpNode, bp2Node);
										} else if (subNode && !sub2Node) {
											let subToBp2Relation = buildRelation(tempRelationIdIndex++, subIdPrefix + relation.BpSubsidiaryFk, relation.BusinessPartner2Fk, relation.RelationTypeFk);
											initDataLink(cacheData[businessPartner.Id], subToBp2Relation, subNode, bp2Node);
										} else if (!subNode && sub2Node) {
											let bpToSub2Relation = buildRelation(tempRelationIdIndex++, relation.BusinessPartnerFk, subIdPrefix + relation.BpSubsidiary2Fk, relation.RelationTypeFk);
											initDataLink(cacheData[businessPartner.Id], bpToSub2Relation, bpNode, sub2Node);
										} else {
											let subToSub2Relation = buildRelation(tempRelationIdIndex++, subIdPrefix + relation.BpSubsidiaryFk, subIdPrefix + relation.BpSubsidiary2Fk, relation.RelationTypeFk);
											initDataLink(cacheData[businessPartner.Id], subToSub2Relation, subNode, sub2Node);
										}
									} else {
										bpNode = initDataNode(oldData.nodes, relation.BusinessPartnerFk, response.data.BusinessPartnerInfo || []);
										bp2Node = initDataNode(oldData.nodes, relation.BusinessPartner2Fk, response.data.BusinessPartnerInfo || []);
										initDataLink(cacheData[businessPartner.Id], relation, bpNode, bp2Node);
									}
								});
								_.find(cacheData[businessPartner.Id].nodes, {Id: businessPartner.Id}).isMain = true;
							}

							defer.resolve(cacheData[businessPartner.Id]);
						});
					} else {
						defer.resolve(cacheData[businessPartner.Id]);
					}
					return defer.promise;
				}

				function initDataNode(oldNodes, businessPartnerFk, businessPartnerInfo) {
					let bp = _.find(lookupDescriptorService.getData('BusinessPartner'), {Id: businessPartnerFk});
					let backNode = _.find(oldNodes, {Id: businessPartnerFk}) || {};
					let info = _.find(businessPartnerInfo, {BusinessPartnerFk: businessPartnerFk}) || {};

					/** @namespace info.Subsidiary */
					let result = angular.extend(backNode, {
						Id: bp.Id,
						name: bp.BusinessPartnerName1,
						data: bp,
						image: info.Blob && ('data:image/jpg;base64,' + info.Blob),
						info: {},
						dataType: 'businessPartner'
					});

					result.info[addressLabel] = info.Subsidiary ? platformObjectHelper.getValue(info.Subsidiary, 'AddressItem.AddressLine') : null;
					result.info[telephoneLabel] = info.Subsidiary ? platformObjectHelper.getValue(info.Subsidiary, 'TelephoneNumberItem.Telephone') : null;
					return result;
				}

				function initSubDataNode(oldNodes, subsidiaryId) {
					if (!subsidiaryId) {
						return null;
					}
					let subsidiary = _.find(lookupDescriptorService.getData('RelationSubsidiary'), {Id: subsidiaryId});
					if (!subsidiary) {
						return null;
					}
					let backNode = _.find(oldNodes, {Id: subIdPrefix + subsidiaryId}) || {};
					let result = angular.extend(backNode, {
						Id: subIdPrefix + subsidiaryId,
						name: subsidiary.Description,
						data: subsidiary,
						image: null,
						info: {},
						dataType: 'subsidiary'
					});

					result.info[addressLabel] = platformObjectHelper.getValue(subsidiary, 'AddressItem.AddressLine');
					result.info[telephoneLabel] = platformObjectHelper.getValue(subsidiary, 'TelephoneNumberItem.Telephone');
					return result;
				}

				function initDataLink(cache, relation, node1, node2) {
					let relationType = _.find(lookupDescriptorService.getData('AllBusinessPartnerRelationType'), {Id: relation.RelationTypeFk}) || {};
					let relationTypeName = platformObjectHelper.getValue(relationType, 'DescriptionInfo.Translated') + ' -  ' + platformObjectHelper.getValue(relationType, 'OppositeDescriptionInfo.Translated');
					let colorType = platformObjectHelper.getValue(relationType, 'Color');
					let _node1 = _.find(cache.nodes, {Id: node1.Id});
					let _node2 = _.find(cache.nodes, {Id: node2.Id});
					if (!_node1) {
						_node1 = node1;
						cache.nodes.push(_node1);
					}
					if (!_node2) {
						_node2 = node2;
						cache.nodes.push(_node2);
					}

					angular.forEach([node1, node2], function (node) {
						if (!_.some(cache.nodes, function (i) {
							return i.Id === node.Id;
						})) {
							cache.nodes.push(node);
						}
					});

					cache.links.push({
						Id: relation.Id,
						source: _node1,
						target: _node2,
						relation: relation,
						relationType: {
							id: relationType.Id,
							name: relationTypeName,
							color: '#' + new Date(0).setYear(relationType.Id).toString(16).slice(-8, -2)
						},
						color: colorType,
						info: relationTypeName
					});
				}

				function relationArrows(relation, source, target) {
					let lineLength = {x: 15, y: 5};
					let direction = relation.SourceId === target.Id ? 1 : -1;
					let center = {x: ((source.x || 0) + (target.x || 0)) / 2, y: ((source.y || 0) + (target.y || 0)) / 2};
					let vector = {ax: (source.x || 0) - (target.x || 0), ay: (source.y || 0) - (target.y || 0)};
					let vectorLength = Math.sqrt(vector.ax * vector.ax + vector.ay * vector.ay);
					vector = {ax: vector.ax / vectorLength * direction, ay: vector.ay / vectorLength * direction};

					let x1 = center.x + lineLength.x * vector.ax + lineLength.y * vector.ay;
					let y1 = center.y + lineLength.x * vector.ay - lineLength.y * vector.ax;
					let x2 = center.x;
					let y2 = center.y;
					let x3 = center.x + lineLength.x * vector.ax - lineLength.y * vector.ay;
					let y3 = center.y + lineLength.x * vector.ay + lineLength.y * vector.ax;

					return 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2 + ' L' + x3 + ',' + y3;
				}

				function buildRelation(id, sourceId, targetId, relationTypeId) {
					return {
						Id: id,
						SourceId: sourceId,
						TargetId: targetId,
						RelationTypeFk: relationTypeId
					};
				}
			}]);
})(angular);