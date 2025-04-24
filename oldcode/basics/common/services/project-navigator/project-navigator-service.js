/**
 * Created by chlai on 11.10.2024.
 */

(function (angular) {
	'use strict';

	/**
	 *
	 */
	angular.module('basics.common').factory('basicsCommonProjectNavigatorService', basicsCommonProjectNavigatorService);

	basicsCommonProjectNavigatorService.$inject = ['_', 'moment', '$q', '$http', '$translate', 'platformStringUtilsService'];

	function basicsCommonProjectNavigatorService(_, moment, $q, $http, $translate, stringUtils) { // jshint ignore:line
		let prjNaviBaseUrl = globals.webApiBaseUrl + 'basics/common/projectnavigator/';

		let prjList = [];
		let prjNaviUserSettings = null;
		let prjNaviTreeMap = null;

		function getNaviTree(projectId, naviConfig){

			const prjNaviData = prjList.find(s => s.ProjectFk === projectId);
			if(prjNaviData){
				let naviTreeMap = {};
				prjNaviUserSettings = prjNaviData.UserSettings ?? { moduleUserSettings: [] };

				//default sort by navi module config
				let modules = prjNaviData.CacheData.modules ?? [];
				const moduleInfoByName = {};
				naviConfig.forEach((moduleInfo, index) => {
					moduleInfoByName[moduleInfo.moduleName] = { ...moduleInfo, sort: index };
				});

				for (let module of modules){

					const moduleInfo = moduleInfoByName[module.moduleName];
					if(moduleInfo.isActive === false){
						continue;
					}
					const moduleUS = initializeModuleUserSettings(prjNaviUserSettings, module);

					for (let dataItem of module.moduleData){
						const dynamicPaths = [];
						let currentModuleUS = moduleUS;

						for (let i = 0; i < dataItem.parentModules.length; i++) {
							const parentModuleName = dataItem.parentModules[i];
							const parentFk = dataItem.parentFks[i];

							const parentModule = _.find(modules, { moduleName: parentModuleName });
							const isParentExist = parentModule ? _.some(parentModule.moduleData, { id: parentFk }) : false;

							if (isParentExist) {
								const dynamicPath = [parentModuleName, 'moduleData', `_${parentFk}`, 'submoduleInfos', module.moduleName];
								dynamicPaths.push(dynamicPath);
							}
						}

						if (dynamicPaths.length === 0) {
							const dynamicPath = [module.moduleName];
							dynamicPaths.push(dynamicPath);
						}

						for (const dynamicPath of dynamicPaths) {

							// Get Submodule user setting
							if(dynamicPath.includes('submoduleInfos') && dynamicPath.length > 3){
								const parentId = parseInt(dynamicPath[2].replace('_', ''));
								currentModuleUS = initializeSubmoduleUserSettings(prjNaviUserSettings, dynamicPath[0], parentId, module);
							}

							const existingModule = _.get(naviTreeMap, dynamicPath, {});
							const moduleSetting = createUserSettingProxy(currentModuleUS);
							_.set(naviTreeMap, dynamicPath, {
								...existingModule,
								moduleInfo: moduleInfo,
								moduleSetting: moduleSetting
							});

							const existingItems = _.get(naviTreeMap, [...dynamicPath, 'moduleData', `_${dataItem.id}`], {});

							// Get data user setting
							const dataUS = initializeDataUserSettings(currentModuleUS, dataItem);
							if(moduleInfo.hideData){
								dataUS.isVisible = false;
							}
							dataItem.dataUserSetting = createUserSettingProxy(dataUS);

							_.set(naviTreeMap, [...dynamicPath, 'moduleData', `_${dataItem.id}`], { ...existingItems, dataItem });
						}
					}
				}

				naviTreeMap = collapseMap(naviTreeMap);
				prjNaviData.UserSettings = prjNaviUserSettings;

				function collapseMap(treeNode, level = 0) {
					return Object.values(treeNode).map(m => {
						m.level = level;
						if (typeof m.moduleData !== 'undefined') {
							//m.moduleData = collapseMap(m.moduleData, level + 1).sort((a, b) => _.get(a, 'dataItem.dataSetting.sort', 0) - _.get(b, 'dataItem.dataSetting.sort', 0));
							m.moduleData = collapseMap(m.moduleData, level + 1).sort((a, b) => _.get(a, 'dataItem.sort', 0) - _.get(b, 'dataItem.sort', 0));
						}
						if (typeof m.submoduleInfos !== 'undefined') {
							m.submoduleInfos = collapseMap(m.submoduleInfos, level + 1).sort((a, b) => _.get(a, 'moduleInfo.sort', 0) - _.get(b, 'moduleInfo.sort', 0));
						}
						return m;
					}).sort((a, b) => _.get(a, 'moduleInfo.sort', 0) - _.get(b, 'moduleInfo.sort', 0));
				}

				prjNaviTreeMap = {
					project: {
						id: projectId,
						title: stringUtils.replaceSpecialChars(prjNaviData.FormattedDescription),
						isFavourite: prjNaviData.IsFavourite
					},
					modules: naviTreeMap
				};

				return prjNaviTreeMap;
			}
			return null;

		}

		function createUserSettingProxy(refData){
			return new Proxy(
				{
					expanded: refData.expanded ?? false,
					isVisible: refData.isVisible ?? true,
					sort: refData.sort ?? 0,
					filterOptions: refData.filterOptions ?? {}},
				{
					set(target, prop, value) {
						refData[prop] = value; // Update module when moduleSetting is updated
						target[prop] = value; // Update moduleSetting
						return true;
					},
				}
			)
		}

		function initializeModuleUserSettings(prjNaviUserSettings, module) {
			let moduleUS = prjNaviUserSettings.moduleUserSettings.find(s => s.name === module.moduleName);
			if (!moduleUS) {
				moduleUS = {
					name: module.moduleName,
					expanded: false,
					filterOptions: {},
					isVisible: true,
					sort: 0,
					dataUserSettings: [],
				};
				prjNaviUserSettings.moduleUserSettings.push(moduleUS);
			}
			return moduleUS;
		}

		function initializeDataUserSettings(moduleUS, dataItem) {
			let dataUS = moduleUS.dataUserSettings.find(dUS => dUS.id === dataItem.id);
			if (!dataUS) {
				dataUS = {
					id: dataItem.id,
					expanded: false,
					isVisible: true,
					sort: 0,
				};
				moduleUS.dataUserSettings.push(dataUS);
			}
			return dataUS;
		}

		function initializeSubmoduleUserSettings(prjNaviUserSettings, parentModuleName, parentId, module) {
			let currentModuleUS = {
				name: module.moduleName,
				expanded: false,
				filterOptions: {},
				isVisible: true,
				sort: 0,
				dataUserSettings: [],
			};

			let parentModuleUS = prjNaviUserSettings.moduleUserSettings.find(s => s.name === parentModuleName);

			if (parentModuleUS?.dataUserSettings) {
				const parentDataUS = parentModuleUS.dataUserSettings.find(ds => ds.id === parentId);

				if (parentDataUS) {
					const submoduleUS = parentDataUS.submoduleUserSettings?.find(subms => subms.name === module.moduleName);
					if (submoduleUS) {
						currentModuleUS = submoduleUS;
					} else {
						(parentDataUS.submoduleUserSettings ??= []).push(currentModuleUS);
					}
				}
			}

			return currentModuleUS;
		}

		function toggleProjectFromFavourite(projectId) {
			const index = prjList.findIndex(s=> s.ProjectFk === projectId);
			if(index !== -1){
				prjList[index].IsFavourite = !prjList[index].IsFavourite;
			}
			return prjList;
		}

		async function addProjectToNavigator(projectId){
			let prjIdx = prjList.findIndex(c => c.ProjectFk === projectId);
			if(prjIdx === -1){
				await $http.post(prjNaviBaseUrl + 'usersetting/getbyprjid?projectId=' + projectId).then(function (response) {
					if(response.data){
						const newPrj = {
							...response.data,
							UserSettings: JSON.parse(response.data.Value)
						}
						prjList.unshift(newPrj);
						prjIdx = 0;
					}
				});
				// await getProjectNavigatorSettingById(projectId);
				// setting.IsFavourite = false;
				// prjList.unshift(setting);
			}
			return prjList[prjIdx];
		}

		async function addProjectsToNavigator(projectIds){
			await Promise.all(projectIds.map(id => addProjectToNavigator(id)));
			return prjList;
		}

		function getProjectNavigatorSettingById(projectId){
			if(projectId){

				let prjIdx = prjList.findIndex(s => s.ProjectFk === projectId);

				let cacheDataPromise = $http.post(prjNaviBaseUrl + 'getprjdatabyid?projectId=' + projectId);

				//TODO
				let userSettingPromise = $http.post(prjNaviBaseUrl + 'usersetting/getbyprjid?projectId=' + projectId);

				return $q.all([cacheDataPromise, userSettingPromise]).then(function (responses) {
					if(prjIdx !== -1){
						prjList[prjIdx].CacheData = responses[0].data;
						prjList[prjIdx].UserSettings = JSON.parse(responses[1].data.Value);
					} else {
						prjIdx = prjList.length;
						const newPrj = {
							...responses[1].data,
							CacheData: responses[0].data,
							UserSettings: JSON.parse(responses[1].data.Value)
						}
						prjList.push(newPrj);
					}
					return prjList[prjIdx];
				});
			}
		}

		function getProjectList(){
			return $http.get(prjNaviBaseUrl + 'usersetting/getprojectlist').then(
				function (response){
					if(response.data){
						prjList = response.data;
					}
					return prjList;
				});
		}

		function saveProjectNavigatorSetting() {
			if(prjNaviTreeMap !== null) {
				const prjId = prjNaviTreeMap.project.id;
				const prjNaviData = prjList.find(s => s.ProjectFk === prjId);
				prjNaviData.Value = JSON.stringify(prjNaviData.UserSettings);
			}

			_.forEach(prjList, (item, index) => {
				item.Sort = index;
			});

			return $http.post(prjNaviBaseUrl + 'usersetting/savesettings', prjList).then(
				function (response){
					if(response.data){
						prjList = response.data;
					}
					return prjList;
				}
			);
		}

		function deleteProjectNavigatorSetting(settingIds) {
			prjList = _.filter(prjList, prjSettings => !settingIds.includes(prjSettings.Id));
		}

		function setDefaultProject(projectId) {
			const prjIdx = prjList.findIndex(s => s.ProjectFk === projectId);
			const defaultPrjIdx = prjList.findIndex(s => s.IsDefault);

			prjList[prjIdx].IsDefault = true;
			if(defaultPrjIdx !== -1 && defaultPrjIdx !== prjIdx){
				prjList[defaultPrjIdx].IsDefault = false;
			}

			return prjList;
		}

		function getDefaultProject() {
			if (_.isArray(prjList) && prjList.length > 0){
				let defaultPrjIdx = prjList.findIndex(prj => prj.IsDefault);
				if(defaultPrjIdx === -1){
					defaultPrjIdx = 0;
					setDefaultProject(prjList[defaultPrjIdx].ProjectFk)
				}
				return prjList[defaultPrjIdx];
			}
		}

		function getProjectFavoriteCount(){
			return $http.get(prjNaviBaseUrl + 'getprjfavcount'
			).then(
				function (response){
					return response.data;
				}
			);
		}

		function getFilteredData(moduleItem){

			let filteredIds = [];

			if (_.some(_.values(moduleItem.moduleSetting.filterOptions))) {
				if (moduleItem.moduleSetting.filterOptions["isActive"]) {
					filteredIds.push(...moduleItem.moduleData
						.filter(md => md.dataItem.isActive)
						.map(md => md.dataItem.id));
				}

				if (moduleItem.moduleSetting.filterOptions["status"]) {
					const filteredStatus = moduleItem.moduleSetting.filterOptions["status"].map(s => s.id);
					filteredIds.push(...moduleItem.moduleData
						.filter(md => _.includes(filteredStatus, md.dataItem.statusFk))
						.map(md => md.dataItem.id));
				}

				filteredIds = _.uniq(filteredIds);
			} else {
				filteredIds = moduleItem.moduleData.map(md => md.dataItem.id);
			}

			moduleItem.moduleData.forEach(md => {
				md.dataItem.dataUserSetting.isVisible = filteredIds.includes(md.dataItem.id);
			});
		}

		function removeFilterOption(moduleItem, filterKey, filterValue){
			const index = moduleItem.moduleSetting.filterOptions[filterKey].indexOf(filterValue);
			if (index > -1) {
				moduleItem.moduleSetting.filterOptions[filterKey].splice(index, 1);

				// If the array is empty after removal, delete the key
				if (moduleItem.moduleSetting.filterOptions[filterKey].length === 0) {
					delete moduleItem.moduleSetting.filterOptions[filterKey];
				}
			}

			return moduleItem;
		}

		function getFilterOptions(moduleItem){
			const filterInfo = moduleItem.moduleInfo.filterInfo;
			let filterOptions = {};
			let getStatusPromise = $q.when(true);
			const activeFilterOpts = moduleItem.moduleSetting.filterOptions;

			if(filterInfo.isActive.enabled){
				filterOptions.isActiveInfo = {
					id: 1,
					title: $translate.instant('cloud.common.entityIsActive'),
					isActive: !!activeFilterOpts["isActive"]
				};
			}

			if(filterInfo.status.enabled){
				const activeStatusId = activeFilterOpts["status"]?.map(s => s.id);
				getStatusPromise = $http.post(globals.webApiBaseUrl + filterInfo.status.httpRead + '/list').then(
					function(response){
						if(response.data){
							const status = response.data.filter(s => s.IsLive);
							if(filterInfo.status.hasRubricCategory){
								let rubricCategoryFks = status.map(s => s.RubricCategoryFk);
								rubricCategoryFks = _.uniq(rubricCategoryFks);

								const rubricCategoryPromise = $http.post(globals.webApiBaseUrl + 'basics/customize/rubriccategory/list').then(
									function (response){
										if(response.data){
											let rubricCatList = response.data;
											return rubricCatList.filter(rc => rubricCategoryFks.includes(rc.Id));
										} else {
											return [];
										}
									}
								);

								return $q.all([rubricCategoryPromise]).then(function(results) {
									const rubricCatList = results[0]; // Get the rubric category list from the results
									const rubCatInfo = rubricCatList.map(rc => ({
										id: rc.Id,
										title: rc.DescriptionInfo.Translated
									}));
									const options = status.map(s => ({
										id: s.Id,
										title: s.DescriptionInfo.Translated,
										rubCatFk: s.RubricCategoryFk,
										isActive: !!activeStatusId?.includes(s.Id)
									}));

									return {
										statusInfo: {
											hasRubricCategory: true,
											options: options.reduce((grouped, item) => {
												const key = rubCatInfo.find(rubCat => rubCat.id === item.rubCatFk).title;
												if (!grouped[key]) {
													grouped[key] = [];
												}
												grouped[key].push(item);
												return grouped;
											}, {})
										}
									};
								});
							} else {
								return {
									statusInfo: {
										hasRubricCategory: false,
										options: status.map(s => ({
											id: s.Id,
											title: s.DescriptionInfo.Translated,
											isActive: !!activeStatusId?.includes(s.Id)
										}))
									}
								};
							}
						}

						return null;
					}
				)
			}

			return $q.all([getStatusPromise]).then(function (results) {
				if(results && results.length > 0){
					filterOptions = {
						...filterOptions,
						statusInfo: results[0].statusInfo
					};
				}
				return filterOptions;
			});

		}

		// all method support by this service listed here
		return {
			getNaviTree: getNaviTree,
			addProjectToNavigator: addProjectToNavigator,
			addProjectsToNavigator: addProjectsToNavigator,
			getProjectNavigatorSettingById: getProjectNavigatorSettingById,
			getProjectList: getProjectList,
			saveProjectNavigatorSetting: saveProjectNavigatorSetting,
			deleteProjectNavigatorSetting: deleteProjectNavigatorSetting,
			toggleProjectFromFavourite: toggleProjectFromFavourite,
			setDefaultProject: setDefaultProject,
			getDefaultProject: getDefaultProject,
			getProjectFavoriteCount: getProjectFavoriteCount,
			getFilteredData: getFilteredData,
			removeFilterOption: removeFilterOption,
			getFilterOptions: getFilterOptions
		};
	}

})(angular);
