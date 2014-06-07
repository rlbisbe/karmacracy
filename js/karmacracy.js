﻿function Karmacracy(appkey, lang){
	var _appkey = appkey;
	var _baseUrl = 'http://karmacracy.com/api/v1/';
	var _langs = ['en', 'es'];
	
	/*
 	 * Serialize an object to param string for URLs
 	 */
	var _serializeObject = function(object) {
		var pairs = [];
		for (var prop in object) {
			if (!object.hasOwnProperty(prop)) {
				continue;
			}
			if (Object.prototype.toString.call(object[prop]) == '[object Object]') {
				pairs.push(object[prop].serialize());
				continue;
			}
			if( object[prop] ){
				pairs.push(prop + '=' + object[prop]);
			}
		}
		return pairs.join('&');
	};

	var _doRequest = function(method, params, error, success) {
		if( typeof params == 'function')
		{
			success = error || null;
			error = params;
			params = {};
		}

		var xhr = XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");

		var requestType = _getRequestType.call(this, method);
		var url = _getUrl.call(this, method, params);

		xhr.open(requestType, url, true);
		xhr.onreadystatechange = function(){

			if ( xhr.readyState == 4 ) {
				if ( xhr.status == 200 ) {
					var response = _parseResponse(method, xhr);
					if( response && typeof success === 'function')
						success(response);
				}
			}
		};
		xhr.onerror = error;

		xhr.send();
	};
	var _getRequestType = function(method){
		return 'GET';
	};
	var _parseResponse = function(method, xhr){
		var data = JSON.parse(xhr.responseText);
		if( data.error )
			return xhr.onerror(data);

		if( data.data ) data = data.data;

		switch(method){
			case 'user':
				data = data.user[0];
				break;
			case 'awards': case 'awards:nut':
				data = data.nut;
				break;
			case 'networks':
				data = data.network;
				break;
			case 'domains':
				data = data.domain;
				break;
			case 'kcy': case 'world':
				data = data.kcy;
				break;
			case 'rank':
				data = data.user;
				break;
			case 'stats:evolution':
				data = data.stats;
				data.links_evolution = JSON.parse(data.links_evolution);
				data.koi_evolution = JSON.parse(data.koi_evolution);
				data.clicks_evolution = JSON.parse(data.clicks_evolution);
				data.rank_evolution = JSON.parse(data.rank_evolution);
				break;
			case 'stats:relevance':
				data = data.stats;
				break;
		    case 'firewords':
		        data = data.word;
		        break;
		}
		return data;
	};
	var _getUrl = function(method, params){
		var url = _baseUrl;
		params = params || {};
		params.u = params.u || this.userName;
		params.k = params.k || this.userKey;
		params.appkey = _appkey;

		switch(method){
			case 'key':
				url += method + "/";
				delete(params.k);
				params.p = encodeURIComponent(params.p);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'key:check':
				method = method.replace(':', '/');
				url += method + "/";
				params.key = params.k;
				delete(params.k);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'user': case 'awards':
				url += [method, params.u].join('/');
				delete(params.u);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'awards:nut':
				if( !params.n ) return false;
				method = method.split(':');
				url += [method[0], params.u, method[1], params.n].join('/');
				params.lang = this.lang;
				delete(params.u);
				delete(params.n);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'networks:fbpages':
				method = method.replace(':', '/');
				url += method + "/";
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'stats:evolution': case 'stats:relevance':
				method = method.replace(':', '/');
				url += method + "/";
				delete(params.k);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'kcy': case 'world':
				url += [method, params.kcy].join('/');
				delete(params.kcy);
				delete(params.u);
				delete(params.k);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'networks': case 'domains': case 'rank':
				url += method + "/";
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'share':
				url += method + "/";
				params.txt = encodeURIComponent(params.txt);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
			case 'shortLink':
				url = 'http://kcy.me/api/';
				params.format = 'json';
				params.key = params.k;
				params.url = encodeURIComponent(params.url);
				delete(params.k);
				params = _serializeObject(params);
				if( params !== '' ) url += '?' + params;
				break;
		    case 'firewords':
		        url += method + "/";
		        params.format = 'json';
		        params = _serializeObject(params);
		        if (params !== '') url += '?' + params;
		        break;
		}
		return url;
	};

	this.setLang = function(lang){
		this.lang = lang || (typeof navigaror !== 'undefined' ? (navigator.language || navigator.userLanguage) : null );
		if( ! (this.lang in _langs) )
			this.lang = _langs[0];
		return this.lang;
	};
	this.setUserKey = function(userKey){
		this.userKey = userKey;
		return this.userKey;
	};
	this.setUserName = function(userName){
		this.userName = userName;
		return this.userName;
	};
	this.setUser = function(userName, userKey){
		this.setUserName(userName);
		this.setUserKey(userKey);
	};

	this.getKey = function(params, error, success) {
		var method = 'key';
		params.regenerate = 0;
		_doRequest.call(this, method, params, error, success);
	};
	this.getNewKey = function(params, error, success) {
		var method = 'key';
		params.regenerate = 1;
		_doRequest.call(this, method, params, error, success);
	};
	this.checkKey = function(params, error, success) {
		var method = 'key:check';
		_doRequest.call(this, method, params, error, success);
	};
	this.getUserInfo = function(params, error, success) {
		var method = 'user';
		_doRequest.call(this, method, params, error, success);
	};
	this.getNuts = function(params, error, success) {
		var method = 'awards';
		_doRequest.call(this, method, params, error, success);
	};
	this.getNut = function(params, error, success) {
		var method = 'awards:nut';
		_doRequest.call(this, method, params, error, success);
	};
	this.getNetworks = function(error, success) {
		var method = 'networks';
		_doRequest.call(this, method, error, success);
	};
	this.getFacebookPages = function(params, error, success) {
		var method = 'networks:fbpages';
		_doRequest.call(this, method, params, error, success);
	};
	this.getDomains = function(params, error, success) {
		var method = 'domains';
		_doRequest.call(this, method, params, error, success);
	};
	this.getKcy = function(params, error, success) {
		var method = 'kcy';
		_doRequest.call(this, method, params, error, success);
	};
	this.getKcys = function(params, error, success) {
		var method = 'world';
		_doRequest.call(this, method, params, error, success);
	};
	this.getRank = function(params, error, success) {
		var method = 'rank';
		_doRequest.call(this, method, params, error, success);
	};
	this.getStatsEvolution = function(params, error, success) {
		var method = 'stats:evolution';
		_doRequest.call(this, method, params, error, success);
	};
	this.getStatsRelevance = function(params, error, success) {
		var method = 'stats:relevance';
		_doRequest.call(this, method, params, error, success);
	};
	this.shortLink = function(params, error, success){
		var method = 'shortLink';
		_doRequest.call(this, method, params, error, success);
	};
	this.shareKcy = function(params, error, success){
		var method = 'share';
		_doRequest.call(this, method, params, error, success);
	};
	this.getFirewords = function (params, error, success) {
	    var method = 'firewords';
	    _doRequest.call(this, method, params, error, success);
	};

	this.setLang(lang);
}

if( typeof module !== "undefined" && module.exports )
{
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	module.exports = Karmacracy;
}
