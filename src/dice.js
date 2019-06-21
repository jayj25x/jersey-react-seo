import * as Utils from './util/utils';
import * as Configs from './config/configs';
import { Constants } from './constant/constants';

export default class Dice {
	model;
	
	constructor() {
		this.model = {};
	}
	
	/**
	 * Convert a Dice program into the cross platform ideal program model.
	 * 
	 * @param	pDiceProgram	A Dice event or vod.
	 */
	convertProgramToIdeal(pDiceProgram) {
		let program = {};
		program.propsMap = {};
		
		if (pDiceProgram.id) {
			program.id = pDiceProgram.id;
		}
		if (pDiceProgram.thumbnailUrl) {
			program.smallLandscapeImageUrl = pDiceProgram.thumbnailUrl	;
		}
		if (pDiceProgram.title) {
			program.name = pDiceProgram.title;
		}
		if (pDiceProgram.description) {
			program.description = pDiceProgram.description;
		}
		if (pDiceProgram.type) {
			program.programType = pDiceProgram.type;
		}
		if (pDiceProgram.sportId) {
			program.sportId = pDiceProgram.sportId;
		}
		if (pDiceProgram.startDate) {
			program.startDate = new Date(pDiceProgram.startDate).toISOString();
		}
		if (pDiceProgram.endDate) {
			program.endDate = new Date(pDiceProgram.endDate).toISOString();
		}
		if (typeof pDiceProgram.live !== 'undefined') {
			// TODO FIGURE OUT HOW TO MAP TO GAME STATE
		}
		if (pDiceProgram.duration) {
			program.runtime = pDiceProgram.duration;
		}
		if (pDiceProgram.tags) {
			program.tags = pDiceProgram.tags;
		}
		if (typeof pDiceProgram.favourite !== 'undefined') {
			program.favorite = pDiceProgram.favourite;
		}
		program.noAccess = (pDiceProgram.accessLevel !== Constants.GRANTED);
		if (pDiceProgram.watchProgress) {
			program.watchProgress = pDiceProgram.watchProgress;
		}
		if (pDiceProgram.watchedAt) {
			program.watchedAt = new Date(pDiceProgram.watchedAt).toISOString();
		}
		if (pDiceProgram.location) {
			program.venue = pDiceProgram.location;
		}
		if (pDiceProgram.posterUrl) {
			program.largePortraitImageUrl = pDiceProgram.posterUrl;
		}
		if (pDiceProgram.availablePurchases) {
			// TODO SOME WORK REQUIRED TO MAP THESE 2 PURCHASE OBJECTS
			program.bundlePurchases = pDiceProgram.availablePurchases;
		}
		if (pDiceProgram.subEvents) {
			program.related = [];
			
			for (let i=0; i<pDiceProgram.subEvents.length; i++) {
				program.related.push(this.convertProgramToIdeal(pDiceProgram.subEvents[i]));
			}
		}
		if (pDiceProgram.externalId) {
			program.propsMap.externalId = pDiceProgram.externalId;
		}
		if (pDiceProgram.propertyId) {
			// TODO FIGURE OUT WHAT DOES THIS MAP TO ON THE LION SIDE
			program.propsMap.propertyId = pDiceProgram.propertyId;
		}
		if (pDiceProgram.tournamentId) {
			// TODO FIGURE OUT WHAT DOES THIS MAP TO ON THE LION SIDE
			program.propsMap.tournamentId = pDiceProgram.tournamentId;
		}
		if (pDiceProgram.offlinePlaybackLanguages) {
			program.propsMap.offlinePlaybackLanguages = pDiceProgram.offlinePlaybackLanguages;
		}
		if (pDiceProgram.externalAssetId) {
			program.propsMap.externalAssetId = pDiceProgram.externalAssetId;
		}
		if (pDiceProgram.metaFields) {
			program.propsMap.metaFields = pDiceProgram.metaFields;
		}
		
		return program;
	}
	
	/**
	 * Converts Dice bucket or playlist data into the cross platform ideal content model.
	 * 
	 * @param pDiceContent	A Dice bucket or playlist.
	 * @param	pPageName			A Dice section name. Required for bucket.
	 */
	convertContentToIdeal(pDiceContent, pPageName) {
		let content = {};
		let isBucket = pDiceContent.buckets ? true : false;
		
		content.propsMap = {};
		
		// Bucket attributes
		if (pDiceContent.bucketId) {
			content.id = pDiceContent.bucketId;
			
			if (pDiceContent.type) {
				content.type = pDiceContent.type;
			}
			if (pDiceContent.contentList) {
				if (pDiceContent.type === Constants.VOD_PLAYLIST) {
					content.subContent = [];
					
					for (let i=0; i<pDiceContent.contentList.length; i++) {
						content.subContent.push(this.convertContentToIdeal(pDiceContent.contentList[i], pPageName));
					}
				} else {
					content.programs = [];
					for (let i=0; i<pDiceContent.contentList.length; i++) {
						content.programs.push(this.convertProgramToIdeal(pDiceContent.contentList[i]));
					}
				}
			}
		}
		if (pDiceContent.rowTypeData) {
			content.propsMap.rowTypeData = pDiceContent.rowTypeData;
			
			if (pDiceContent.rowTypeData.background.imageUrl) {
				content.largeImageUrl = pDiceContent.rowTypeData.background.imageUrl;
			}
		}
		if (pDiceContent.name) {
			content.name = pDiceContent.name;
			content.apiUrl = Configs.BASE_URL + pPageName + '/' + pDiceContent.name;
			content.linkUrl = '/' + Configs.REALM + '/' + pPageName + '/' + pDiceContent.name;
		}
		if (pDiceContent.exid) {
			content.extid = pDiceContent.exid;
		}
		if (pDiceContent.page) {
			content.pageNumber = pDiceContent.page;
		}
		if (pDiceContent.totalPages) {
			content.totalPages = pDiceContent.totalPages;
		}
		if (pDiceContent.totalResults) {
			content.count = pDiceContent.totalResults;
		}
		if (pDiceContent.placeholderData) {
			content.propsMap.placeholderData = pDiceContent.placeholderData;
		}
		// Playlist attributes
		if (pDiceContent.title) {
			content.name = pDiceContent.title;
		}
		if (pDiceContent.id) {
			content.apiUrl = Configs.PLAYLIST_BASE_URL + pDiceContent.id
			if (pPageName) {
				content.linkUrl = '/' + Configs.REALM + '/' + pPageName + '/' + pDiceContent.id;
			} else {
				content.linkUrl = '/' + Configs.REALM + '/' + pDiceContent.id;
			}
		}
		if (pDiceContent.coverUrl) {
			content.largeImageUrl = pDiceContent.coverUrl;
		}
		if (pDiceContent.smallCoverUrl) {
			content.smallImageUrl = pDiceContent.smallCoverUrl;
		}
		if (pDiceContent.vodCount) {
			content.propsMap.vodCount = pDiceContent.vodCount;
		}
		if (pDiceContent.accessLevel) {
			content.propsMap.accessLevel = pDiceContent.accessLevel;
		}
		if (pDiceContent.availablePurchases) {
			content.propsMap.availablePurchases = pDiceContent.availablePurchases;
		}
		if (pDiceContent.description) {
			content.description = pDiceContent.description;
		}
		if (pDiceContent.videos) {
			if (pDiceContent.videos.totalResults) {
				content.count = pDiceContent.videos.totalResults;
			}
			if (pDiceContent.videos.totalPages) {
				content.totalPages = pDiceContent.videos.totalPages;
			}
			if (pDiceContent.videos.page) {
				content.pageNumber = pDiceContent.videos.page;
			}
			if (pDiceContent.videos.vods) {
				content.programs = [];
				for (let i=0; i<pDiceContent.videos.vods.length; i++) {
					content.programs.push(this.convertProgramToIdeal(pDiceContent.videos.vods[i]));
				}
			}
		}
		
		return content;
	}
	
	/**
	 * Converts Dice hero data into the cross platform ideal dynamic lead model.
	 * 
	 * @param pDiceHero		A Dice hero.
	 */
	convertHeroToIdeal(pDiceHero) {
		let dynamicLead = {};
		dynamicLead.propsMap = {};
		
		if (pDiceHero.heroId) {
			dynamicLead.id = pDiceHero.heroId;
		}
		if (pDiceHero.imageUrl) {
			dynamicLead.imageUrl = pDiceHero.imageUrl;
		}
		if (pDiceHero.title) {
			dynamicLead.title = pDiceHero.title;
		}
		if (pDiceHero.description) {
			dynamicLead.description = pDiceHero.description;
		}
		if (pDiceHero.ctaText) {
			dynamicLead.ctaText = pDiceHero.ctaText;
		}
		if (pDiceHero.link) {
			if (pDiceHero.link.type === Constants.CONTENT_LINK) {
				dynamicLead.program = this.convertProgramToIdeal(pDiceHero.link.event);
			}
		}
		if (pDiceHero.alignmentHorizontal) {
			dynamicLead.propsMap.alignmentHorizontal = pDiceHero.alignmentHorizontal;
		}
		if (pDiceHero.alignmentVertical) {
			dynamicLead.propsMap.alignmentVertical = pDiceHero.alignmentVertical;
		}
		if (typeof pDiceHero.enabled !== 'undefined') {
			dynamicLead.propsMap.endabled = pDiceHero.enabled;
		}
		if (pDiceHero.primaryButton) {
			dynamicLead.propsMap.primaryButton = pDiceHero.primaryButton;
		}
		if (pDiceHero.secondaryButton) {
			dynamicLead.propsMap.secondaryButton = pDiceHero.secondaryButton;
		}
		if (pDiceHero.textAlignment) {
			dynamicLead.propsMap.textAlignment = pDiceHero.textAlignment;
		}
		if (pDiceHero.background) {
			dynamicLead.propsMap.background = pDiceHero.background;
		}
		
		return dynamicLead;
	}
	
	/**
	 * Returns the menu, dynamic leads and page contents for a given page.
	 * 
	 * @param	pPageName		Name of the page (a.k.a. section).
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchPage(pPageName, pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		let url = Configs.CONTENT_BASE_URL + pPageName;
		
		return Promise.all([
				this.fetchMenu(pAuthToken), 
				Utils.handleFetch(url, attributes).then(response => {
					if (response.code === Constants.NOT_FOUND) {
						return {message: response.messages[0]}
					}
					
					let pageContents = [];
					let dynamicLeads = [];
					
					for (let i=0; i<response.buckets.length; i++) {
						pageContents.push(this.convertContentToIdeal(response.buckets[i], pPageName));
					}
					for (let i=0; i<response.heroes.length; i++) {
						dynamicLeads.push(this.convertHeroToIdeal(response.heroes[i]));
					}
					
					return {
						pageContents,
						dynamicLeads
					};
				}).catch(error => {
					return {
						error
					}
				})
		]).then(response => {
			if (response.error) {
				return response.error;
			}
			return {
				navigationItems: response[0],
				pageContents: response[1].pageContents,
				dynamicLeads: response[1].dynamicLeads,
				propsMap: {}
			}
		});
	}
	
	/**
	 * Obtain the navigation menu for the application.
	 * 
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchMenu(pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		
		return Utils.handleFetch(Configs.MENU_URL, attributes).then(response => {
			let navigationItems = [];
			let linkUrl;
			let title;
			let type;
			let id;
			let apiUrl = null;
			let content;
			let propsMap = {};
			let diceMenuItem;
			
			for (let i=0; i<response.length; i++) {
				diceMenuItem = response[i];
				id = diceMenuItem.id
				title = diceMenuItem.title;
				type = diceMenuItem.externalDataTable.type;
				propsMap.enabled = diceMenuItem.enabled;
				propsMap.order = diceMenuItem.order;
				propsMap.featured = diceMenuItem.featured;
				propsMap.externalDataTable = {};
				propsMap.externalDataTable.deviceRestriction = diceMenuItem.externalDataTable.deviceRestriction;
				
				if (diceMenuItem.externalDataTable.type === Constants.OUTBOUND_LINK) {
					linkUrl = diceMenuItem.externalDataTable.outboundLink;
				} else if (diceMenuItem.externalDataTable.type === Constants.VIEW) {
					switch (diceMenuItem.externalDataTable.view) {
						case Constants.HISTORY:
							linkUrl = '/' + Configs.REALM + '/' + title;
							apiUrl = Configs.WATCHED_URL;
							break;
						case Constants.FAVOURITES:
							linkUrl = '/' + Configs.REALM + '/' + title;
							apiUrl = Configs.FAVORITES_URL;
							break;
						case Constants.PREFERENCES:
							linkUrl = '/' + Configs.REALM + '/' + title;
							apiUrl = Configs.PREFERENCES_URL;
							break;
						case Constants.ACCOUNT:
							linkUrl = '/' + Configs.REALM + '/' + title;
							apiUrl = null;
							// TODO FIGURE OUT HOW TO HANDLE. DEDICATED ACCOUNT PAGE REQUIRED.
							break;
						default:
							// Every else is unknown and not handled.
							linkUrl = null;
							apiUrl = null;
					}
				} else if (diceMenuItem.externalDataTable.type === Constants.SECTION) {
					linkUrl = '/' + Configs.REALM + '/' + title;
					apiUrl = Configs.CONTENT_BASE_URL + title;
				}
			
				navigationItems.push({id, linkUrl, title, type, apiUrl, propsMap});
			}
			
			return navigationItems;
		}).catch(error => {
			return {
				error
			}
		});
	}
	
	/**
	 * Returns a list of items for a given category.
	 * 
	 * @param	pPageName			Name of the page (a.k.a. section).
	 * @param	pContentName	Name of the content (a.k.a bucket or playlist).
	 * @param pAuthToken		The Bearer token required to invoke the web service.
	 */
	fetchContent(pPageName, pContentName, pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		let url = Configs.CONTENT_BASE_URL + pPageName + '/' + pContentName;
		
		return Utils.handleFetch(url, attributes).then(response => {
			if (response.buckets && response.buckets.length) {
				return this.convertContentToIdeal(response.buckets[0], pPageName);
			}
			return {};
		}).catch(error => {
			return {
				error
			};
		});
	}
	
	/**
	 * Returns program details by program id.
	 * 
	 * @param	pProgramId	The id of the program.
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchProgram(pProgramId, pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		let url = Configs.VOD_BASE_URL + pProgramId;
		
		return Utils.handleFetch(url, attributes).then(response => {			
			return this.convertProgramToIdeal(response);
		}).catch(error => {
			return {
				error
			};
		});
	}
	
	/**
	 * Returns event details by event id.
	 * 
	 * @param	pEventId	The id of the event.
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchLiveEvent(pEventId, pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		let url = Configs.EVENT_BASE_URL + pEventId;
		
		return Utils.handleFetch(url, attributes).then(response => {			
			return this.convertProgramToIdeal(response);;
		}).catch(error => {
			return {
				error
			};
		});
	}
	
	/**
	 * Returns all current live events.
	 * 
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchAllLiveEvents(pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		
		return Utils.handleFetch(Configs.LIVE_EVENTS_URL, attributes).then(response => {			
			let programs = [];
			
			if (response.events) {
				for (let i=0; i<response.events.length; i++) {
					programs.push(this.convertProgramToIdeal(response.events[i]));
				}
			}
			
			return programs;
		}).catch(error => {
			return {
				error
			};
		});
	}
	
	/**
	 * Returns all favorite programs.
	 * 
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchFavorites(pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		
		return Utils.handleFetch(Configs.FAVORITES_URL, attributes).then(response => {			
			let programs = [];
			
			if (response.events) {
				for (let i=0; i<response.events.length; i++) {
					programs.push(this.convertProgramToIdeal(response.events[i]));
				}
			}
			
			return programs;
		}).catch(error => {
			return {
				error
			}
		});
	}
	
	/**
	 * Returns all watched programs.
	 * 
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchWatchHistory(pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		
		return Utils.handleFetch(Configs.WATCHED_URL, attributes).then(response => {
			let programs = [];
			
			if (response.vods) {
				for (let i=0; i<response.vods.length; i++) {
					programs.push(this.convertProgramToIdeal(response.vods[i]));
				}
			}
			
			return programs;
		}).catch(error => {
			return {
				error
			}
		});
	}
	
	/**
	 * Returns list of programs by playlist id.
	 * 
	 * @param	pPlaylistId		The id of the playlist.
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	fetchPlaylist(pPlaylistId, pAuthToken) {
		let attributes = Utils.getGetAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		let url = Configs.PLAYLIST_BASE_URL + pPlaylistId;
		
		return Utils.handleFetch(url, attributes).then(response => {	
			if (response.code === Constants.NOT_FOUND) {
				return {message: response.messages[0]}
			}
			return this.convertContentToIdeal(response);
		}).catch(error => {
			return {
				error
			};
		});
	}
	
	/**
	 * Add a program as a favorite.
	 * 
	 * @param	pProgramId	The id of the program.
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	addFavorite(pProgramId, pAuthToken) {
		let attributes = Utils.getPutAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		let url = Configs.FAVORITES_URL + '/' + pProgramId;
		
		return Utils.handleFetch(url, attributes).then(response => {			
			return {
				message: Constants.SUCCESS_MSG
			};
		}).catch(error => {
			return {
				message: Constants.FAILURE_MSG
			};
		});
	}
	
	/**
	 * Remove a program as a favorite.
	 * 
	 * @param	pProgramId	The id of the program.
	 * @param pAuthToken	The Bearer token required to invoke the web service.
	 */
	removeFavorite(pProgramId, pAuthToken) {
		let attributes = Utils.getDeleteAttributes(Configs.API_KEY, Configs.REALM, pAuthToken);
		let url = Configs.FAVORITES_URL + '/' + pProgramId;
		
		return Utils.handleFetch(url, attributes).then(response => {			
			return {
				message: Constants.SUCCESS_MSG
			};
		}).catch(error => {
			return {
				message: Constants.FAILURE_MSG
			};
		});
	}
	
	/**
	 * Obtain a Bearer token for subsequent API calls.
	 * 
	 * @param	id			The email address of the user.
	 * @param secret	The password.
	 */
	handleLogin(pUsername, pPassword) {
		let attributes = Utils.getPostLoginAttributes(Configs.API_KEY, Configs.REALM, pUsername, pPassword);
		
		// Login
		if (pUsername && pPassword) {
			return Utils.handleFetch(Configs.LOGIN_URL, attributes).then(response => {
				let login;
					
				if (response.code === Constants.NOT_FOUND) {
					login = {
					  login: {
					  	loggedIn: false,
					  	message: response.messages[0]
					  }
					}
				} else {
					login = {
						login: {
	            loggedIn: true,
	            message: Constants.SUCCESSFUL_LOGIN_MSG,
	            authToken: response.authorisationToken,
	            refreshToken: response.refreshToken,
	            propsMap: {cognitoAuth: response.cognitoAuth}
	          }
					}
				}
				
				return login;
			}).catch(error => {
				return ({
					login: {
						loggedIn: false,
						message: error.message
					}
				});
			});
		// Checkin
		} else {
			return Utils.handleFetch(Configs.GUEST_LOGIN_URL, attributes).then(response => {
				let login;
					
				if (response.code === Constants.GUESTS_NOT_ALLOWED) {
					login = {
					  login: {
					  	loggedIn: false,
					  	message: response.messages[0]
					  }
					}
				} else {
					login = {
						login: {
	            loggedIn: false,
	            message: Constants.SUCCESSFUL_CHECKIN_MSG,
	            authToken: response.authorisationToken,
	            refreshToken: response.refreshToken
	          }
					}
				}
				return login;
			}).catch(error => {				
				return ({
					login: {
						loggedIn: false,
						message: error.message
					}
				});
			});
		}
	}
}
