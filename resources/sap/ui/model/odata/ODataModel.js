/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.ui.model.odata.ODataModel");jQuery.sap.require("sap.ui.thirdparty.datajs");jQuery.sap.require("sap.ui.model.Model");jQuery.sap.require("sap.ui.model.odata.ODataPropertyBinding");jQuery.sap.require("sap.ui.model.odata.ODataListBinding");
sap.ui.model.odata.ODataModel=function(s,j,u,p){sap.ui.model.Model.apply(this,arguments);this.sDefaultBindingMode=sap.ui.model.BindingMode.OneWay;this.mSupportedBindingModes={"OneWay":true,"OneTime":true,"TwoWay":true};this.bCountSupported=true;this.bJSON=j;this.bCache=true;this.oRequestQueue=[];this.aBatchOperations=[];this.oHandler;this.oHeaders={};this.oData={};this.oMetadata={};if(s.indexOf("?")==-1){this.sServiceUrl=s}else{var U=s.split("?");this.sServiceUrl=U[0];this.sUrlParams=U[1]}this.sServiceUrl=this.sServiceUrl.replace(/\/$/,"");this.sUser=u;this.sPassword=p;this.oHeaders["x-csrf-token"]="Fetch";this._loadMetadata();if(this.bJSON){this.oHeaders["Accept"]="application/json";this.oHandler=OData.jsonHandler}else{this.oHeaders["Accept"]="application/atom+xml,application/atomsvc+xml,application/xml";this.oHandler=OData.atomHandler}this.oHeaders["Accept-Language"]=sap.ui.getCore().getConfiguration().getLanguage();this.oHeaders["MaxDataServiceVersion"]="2.0";this.oHeaders["DataServiceVersion"]="2.0"};
sap.ui.model.odata.ODataModel.prototype=jQuery.sap.newObject(sap.ui.model.Model.prototype);sap.ui.base.Object.defineClass("sap.ui.model.odata.ODataModel",{baseType:"sap.ui.model.Model",publicMethods:["create","remove","update","submitChanges","getServiceMetadata","read","hasPendingChanges","refresh","resetChanges","isCountSupported","setCountSupported","forceNoCache","setProperty","refreshSecurityToken"]});sap.ui.model.odata.ODataModel.M_EVENTS={RejectChange:"rejectChange"};
sap.ui.model.odata.ODataModel.prototype.fireRejectChange=function(a){this.fireEvent("rejectChange",a);return this};
sap.ui.model.odata.ODataModel.prototype.attachRejectChange=function(d,f,l){this.attachEvent("rejectChange",d,f,l);return this};
sap.ui.model.odata.ODataModel.prototype.detachRejectChange=function(f,l){this.detachEvent("rejectChange",f,l);return this};
sap.ui.model.odata.ODataModel.prototype._createRequest=function(p,u,a,c){var U=this.sServiceUrl;if(p){if(!jQuery.sap.startsWith(p,"/")){U+="/"}U+=p}if(!u){u=[]}if(this.sUrlParams){u.push(this.sUrlParams)}if(u.length>0){U+="?"+u.join("&")}if(c===undefined){c=true}if(c===false){var t=jQuery.now();var r=U.replace(/([?&])_=[^&]*/,"$1_="+t);U=r+((r===U)?(/\?/.test(U)?"&":"?")+"_="+t:"")}var C={};jQuery.extend(C,this.oHeaders);return{requestUri:U,headers:C,async:a,user:this.sUser,password:this.sPassword}};
sap.ui.model.odata.ODataModel.prototype._loadMetadata=function(){var r=this._createRequest("$metadata",null,false);var t=this;function _(m,R){if(R){t.oHeaders["x-csrf-token"]=R.headers["x-csrf-token"]}t.oMetadata=m}function a(e){t._handleError(e)}OData.read(r,_,a,OData.metadataHandler)};
sap.ui.model.odata.ODataModel.prototype._loadData=function(p,P,s,e,c,C){var r=this._createRequest(p,P,true,C||this.bCache);var t=this;function _(d,o){if(!d){jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by service: "+o.requestUri)}R=R.concat(d.results);if(d.__next){r.requestUri=d.__next;b(r)}else{jQuery.extend(d.results,R);if(d.results&&!jQuery.isArray(d.results)){d=d.results}t._importData(d);if(s){s(d)}t.sChangeKey=null;t.checkUpdate(c);t.fireRequestCompleted({url:r.requestUri,type:"GET",async:r.async,info:"Accept headers:"+t.oHeaders["Accept"]})}}function a(E){if(e){e()}var m=t._handleError(E);t.sChangeKey=null;t.checkUpdate(c);t.fireRequestCompleted({url:r.requestUri,type:"GET",async:r.async,info:"Accept headers:"+t.oHeaders["Accept"]});t.fireRequestFailed(m)}function b(d){OData.read(r,_,a,this.oHandler,undefined,t.oMetadata)}var R=[];this.fireRequestSent({url:r.requestUri,type:"GET",async:r.async,info:"Accept headers:"+this.oHeaders["Accept"]});b(r)};
sap.ui.model.odata.ODataModel.prototype._importData=function(d){var t=this,l,k,r;if(d.results){l=[];jQuery.each(d.results,function(i,e){l.push(t._importData(e))});return l}else{k=this._getKey(d);this.oData[k]=d;jQuery.each(d,function(i,e){if(e&&(e.__metadata&&e.__metadata.uri||e.results)&&!e.__deferred){r=t._importData(e);if(jQuery.isArray(r)){d[i]={__list:r}}else{d[i]={__ref:r}}}});return k}};
sap.ui.model.odata.ODataModel.prototype._removeReferences=function(d){var t=this,l;if(d.results){l=[];jQuery.each(d.results,function(i,e){l.push(t._removeReferences(e))});return l}else{jQuery.each(d,function(p,c){if(c){if(c["__ref"]||c["__list"]){delete d[p]}}});return d}};
sap.ui.model.odata.ODataModel.prototype._restoreReferences=function(d){var t=this,c,l,r=[];if(d.results){l=[];jQuery.each(d.results,function(i,e){l.push(t._restoreReferences(e))});return l}else{jQuery.each(d,function(p,c){if(c&&c["__ref"]){var C=t._getObject("/"+c["__ref"]);if(C){delete c["__ref"];d[p]=C;t._restoreReferences(C)}}else if(c&&c["__list"]){jQuery.each(c["__list"],function(j,e){var C=t._getObject("/"+c["__list"][j]);if(C){r.push(C);t._restoreReferences(C)}});delete c["__list"];c.results=r;r=[]}});return d}};
sap.ui.model.odata.ODataModel.prototype.removeData=function(){this.oData={};this.aBindings=[]};
sap.ui.model.odata.ODataModel.prototype.checkUpdate=function(c,f){var b=this.aBindings.slice(0);jQuery.each(b,function(i,B){if((!c||B.getContext()==c)||f){B.checkUpdate(f)}})};
sap.ui.model.odata.ODataModel.prototype.bindProperty=function(p,c,P){var b=new sap.ui.model.odata.ODataPropertyBinding(this,p,c,P);return b};
sap.ui.model.odata.ODataModel.prototype.bindList=function(p,c,s,f,P){var b=new sap.ui.model.odata.ODataListBinding(this,p,c,s,f,P);return b};
sap.ui.model.odata.ODataModel.prototype.createBindingContext=function(p,c,P,C){if(typeof c=="function"){C=c;c=null}if(typeof P=="function"){C=P;P=null}var d=this._getObject(p,c),k,n,t=this;if(d){k=this._getKey(d);n=this.getContext(k);C(n)}else{var i=!jQuery.sap.startsWith(p,"/"),f=this.resolve(p,c);if(f){var a=[],s=this.createCustomParams(P);if(s){a.push(s)}this._loadData(f,a,function(d){k=d?t._getKey(d):undefined;if(k&&c&&i){var b=c.getPath();b=b.substr(1);t.oData[b][p]={__ref:k}}n=t.getContext(k);C(n)},function(){C()})}else{C()}}};
sap.ui.model.odata.ODataModel.prototype.destroyBindingContext=function(c){};
sap.ui.model.odata.ODataModel.prototype.createCustomParams=function(p){var c=[],s={expand:true,select:true};for(var n in p){if(n in s){c.push("$"+n+"="+jQuery.sap.encodeURL(p[n]))}}return c.join("&")};
sap.ui.model.odata.ODataModel.prototype.setCountSupported=function(c){this.bCountSupported=c};
sap.ui.model.odata.ODataModel.prototype.isCountSupported=function(){return this.bCountSupported};
sap.ui.model.odata.ODataModel.prototype._getKey=function(e){var u=e.__metadata.uri;return u.substr(u.lastIndexOf("/")+1)};
sap.ui.model.odata.ODataModel.prototype.getProperty=function(p,c,i){var v=this._getObject(p,c);if(i==null||i==undefined){return v}if(!jQuery.isPlainObject(v)){return v}v=jQuery.extend(true,{},v);if(i==true){return this._restoreReferences(v)}else{return this._removeReferences(v)}};
sap.ui.model.odata.ODataModel.prototype._getObject=function(p,c){var n=this.isLegacySyntax()?this.oData:null,k,i=p&&jQuery.sap.startsWith(p,"/")?false:true;if(c&&i){k=c.getPath();k=k.substr(1);n=this.oData[k]}if(!p){return n}var P=p.split("/"),I=0;if(!P[0]){n=this.oData;I++}while(n&&P[I]){n=n[P[I]];if(n){if(n.__ref){n=this.oData[n.__ref]}else if(n.__list){n=n.__list}else if(n.__deferred){n=null}}I++}return n};
sap.ui.model.odata.ODataModel.prototype.refreshSecurityToken=function(s,e,a){var t=this;this.oHeaders["x-csrf-token"]="Fetch";if(a==undefined){a=false}var r=this._createRequest("/",null,a);OData.read(r,_,b,this.oHandler,null,this.oMetadata);function _(d,R){if(R){t.oHeaders["x-csrf-token"]=R.headers["x-csrf-token"]}if(s){s(d,R)}}function b(E){t._handleError(E);if(e){e(E)}}};
sap.ui.model.odata.ODataModel.prototype.refresh=function(){var b=this.aBindings.slice(0);jQuery.each(b,function(i,B){B._refresh()})};
sap.ui.model.odata.ODataModel.prototype._submitChange=function(r,s,e){var t=this;function _(d,R){if(s){s(d,R)}if(t._isDataStored(t.oRequestQueue[0])||t.oRequestQueue[0].method=="POST"){t.sChangeKey=null;t.refresh()}t.oRequestQueue=[]}function a(E){t._handleError(E);if(t._isDataStored(t.oRequestQueue[0])){t.sChangeKey=null;t.refresh()}t.oRequestQueue=[];if(e){e(E)}}OData.request(r,_,a,this.oHandler,undefined,this.oMetadata)};
sap.ui.model.odata.ODataModel.prototype._submitBatch=function(r,s,e){var t=this,E,a=[];function _(d,R){t.aBatchOperations=[];jQuery.each(d.__batchResponses,function(i,o){if(o.message){E="The following problem occurred: "+o.message;if(o.response){E+=o.response.statusCode+","+o.response.statusText+","+o.response.body}a.push(o);jQuery.sap.log.fatal(E)}if(o.__changeResponses){jQuery.each(o.__changeResponses,function(i,c){if(c.message){E="The following problem occurred: "+c.message;if(c.response){E+=c.response.statusCode+","+c.response.statusText+","+c.response.body}a.push(c);jQuery.sap.log.fatal(E)}})}});if(s){s(d,R,a)}}function b(o){t._handleError(o);t.aBatchOperations=[];if(e){e(o)}}OData.request(r,_,b,OData.batchHandler,undefined,this.oMetadata)};
sap.ui.model.odata.ODataModel.prototype._handleError=function(e){var p={};var E="The following problem occurred: "+e.message;p.message=e.message;if(e.response){if(e.response.statusCode=='403'&&e.response.headers["x-csrf-token"]){this.oHeaders["x-csrf-token"]=e.response.headers["x-csrf-token"];this.refreshSecurityToken()}E+=e.response.statusCode+","+e.response.statusText+","+e.response.body;p.statusCode=e.response.statusCode;p.statusText=e.response.statusText;p.responseText=e.response.body}jQuery.sap.log.fatal(E);return p};
sap.ui.model.odata.ODataModel.prototype.getData=function(p,c,i){return this.getProperty(p,c,i)};
sap.ui.model.odata.ODataModel.prototype._getChangeUrl=function(p,c){var u,k;if(c){k=c.getPath();k=k.substr(1)}p=p.replace(/^\/|\/$/g,"");if(c&&p){u=this.sServiceUrl+'/'+k+'/'+p}else if(!c&&p){u=this.sServiceUrl+'/'+p}else{u=this.sServiceUrl+'/'+k}return u};
sap.ui.model.odata.ODataModel.prototype._createChangeRequest=function(u,p,m,a){var c={};jQuery.extend(c,this.oHeaders);if(this.bJSON&&m!="DELETE"){c["Content-Type"]="application/json"}if(m=="MERGE"){c["x-http-method"]="MERGE";m="POST"}return{headers:c,requestUri:u,method:m,data:p,user:this.sUser,password:this.sPassword,async:a}};
sap.ui.model.odata.ODataModel.prototype._isDataStored=function(r){var p,d;p=r.requestUri.replace(this.sServiceUrl,'');d=this._getObject(p);if(d){return true}return false};
sap.ui.model.odata.ODataModel.prototype.update=function(p,d,c,s,e,m){var r,u;u=this._getChangeUrl(p,c);if(m){r=this._createChangeRequest(u,d,"MERGE",false)}else{r=this._createChangeRequest(u,d,"PUT",false)}this.oRequestQueue.push(r);this._submitChange(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.create=function(p,d,c,s,e){var r,u;u=this._getChangeUrl(p,c);r=this._createChangeRequest(u,d,"POST",false);this.oRequestQueue.push(r);this._submitChange(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.remove=function(p,c,s,e){var r,u;u=this._getChangeUrl(p,c);r=this._createChangeRequest(u,null,"DELETE",false);this.oRequestQueue.push(r);this._submitChange(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.read=function(p,c,P,a,s,e){var r,u;u=this._getChangeUrl(p,c);r=this._createRequest(u.replace(this.sServiceUrl,''),P,a);OData.read(r,s,e,this.oHandler,null,this.oMetadata)};
sap.ui.model.odata.ODataModel.prototype.createBatchOperation=function(p,m,d){var c={};jQuery.extend(c,this.oHeaders);if(jQuery.sap.startsWith(p,"/")){p=p.substr(1)}if(this.bJSON&&m!="DELETE"&&m!="GET"){c["Content-Type"]="application/json"}else{c["Content-Type"]="application/atom+xml"}var r={requestUri:p,method:m.toUpperCase(),headers:c};if(d){r.data=d}return r};
sap.ui.model.odata.ODataModel.prototype.addBatchReadOperations=function(r){if(!jQuery.isArray(r)||r.length<=0){jQuery.sap.log.warning("No array with batch operations provided!");return false}var t=this;jQuery.each(r,function(i,R){if(R.method!="GET"){jQuery.sap.log.warning("Batch operation should be a GET operation!");return false}t.aBatchOperations.push(R)})};
sap.ui.model.odata.ODataModel.prototype.addBatchChangeOperations=function(c){if(!jQuery.isArray(c)||c.length<=0){return false}jQuery.each(c,function(i,C){if(C.method!="POST"&&C.method!="PUT"&&C.method!="MERGE"&&C.method!="DELETE"){jQuery.sap.log.warning("Batch operation should be a POST/PUT/MERGE/DELETE operation!");return false}});this.aBatchOperations.push({__changeRequests:c})};
sap.ui.model.odata.ODataModel.prototype.clearBatch=function(){this.aBatchOperations=[]};
sap.ui.model.odata.ODataModel.prototype.submitBatch=function(s,e,a){var r,u;if(!(typeof(s)=="function")){var o=a;var O=e;a=s;s=O;e=o}if(this.aBatchOperations.length<=0){jQuery.sap.log.warning("No batch operations in batch. No request will be triggered!");return false}u=this.sServiceUrl+"/$batch";var c={};jQuery.extend(c,this.oHeaders);delete c["Content-Type"];var p={};p.__batchRequests=this.aBatchOperations;var r={headers:c,requestUri:u,method:"POST",data:p,user:this.sUser,password:this.sPassword,async:a};this._submitBatch(r,s,e)};
sap.ui.model.odata.ODataModel.prototype.getServiceMetadata=function(){return this.oMetadata};
sap.ui.model.odata.ODataModel.prototype.submitChanges=function(s,e){var r,p,t=this,P;if(this.sChangeKey){P=this.sChangeKey.replace(this.sServiceUrl,'');p=this._getObject(P);if(jQuery.isPlainObject(p)){p=jQuery.extend(true,{},p);delete p.__metadata;jQuery.each(p,function(b,o){if(o&&o.__deferred){delete p[b]}});p=this._removeReferences(p)}r=this._createChangeRequest(this.sChangeKey,p,"MERGE",true);this.oRequestQueue.push(r);function _(d,R){if(s){s(d,R)}t.sChangeKey=null};function a(E){if(e){e(E)}t.sChangeKey=null};this._submitChange(r,_,a)}};
sap.ui.model.odata.ODataModel.prototype.resetChanges=function(s,e){var p;if(this.sChangeKey){p=this.sChangeKey.replace(this.sServiceUrl,'');this._loadData(p,null,s,e)}};
sap.ui.model.odata.ODataModel.prototype.setProperty=function(p,v,c){var P,e={},C=this._getChangeUrl(p,c),o=p.substring(0,p.lastIndexOf("/")),s=false;C=C.replace(this.sServiceUrl+'/','');C=C.substring(0,C.indexOf("/")),C=this.sServiceUrl+'/'+C,P=p.substr(p.lastIndexOf("/")+1);e=this._getObject(o,c);if(!this.sChangeKey){this.sChangeKey=C}if(this.sChangeKey==C){e[P]=v;s=true;this.checkUpdate()}else{this.fireRejectChange({rejectedValue:v,oldValue:e[P]})}return s};
sap.ui.model.odata.ODataModel.prototype.hasPendingChanges=function(){return this.sChangeKey!=null};
sap.ui.model.odata.ODataModel.prototype.updateBindings=function(f){this.checkUpdate(null,f)};
sap.ui.model.odata.ODataModel.prototype.forceNoCache=function(f){this.bCache=!f};
sap.ui.model.odata.ODataModel.prototype._getEntityType=function(c){var e,E,o;if(!this.oMetadata||jQuery.isEmptyObject(this.oMetadata)){return null}jQuery.each(this.oMetadata.dataServices.schema,function(i,s){if(s.entityContainer){jQuery.each(s.entityContainer,function(k,a){jQuery.each(a.entitySet,function(j,b){if(b.name===c){var S=b.entityType.lastIndexOf(".");e=b.entityType.substr(0,S);E=b.entityType.substr(S+1);return false}})})}});if(!E||!e){return null}jQuery.each(this.oMetadata.dataServices.schema,function(i,s){if(s.entityType&&s.namespace===e){jQuery.each(s.entityType,function(j,C){if(C.name===E){o=C;return false}});return!o}});return o};
sap.ui.model.odata.ODataModel.prototype._getPropertyMetadata=function(e,p){var P;jQuery.each(e.property,function(k,o){if(o.name===p){P=o;return false}});return P};