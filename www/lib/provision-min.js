/*
###################################################################################
##     Cloud File Browser                                                        ##
###################################################################################

Copyright 2012-2014 Cloud Elements <http://www.cloud-elements.com>          

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.

*/
var CloudElements=function(){var e=null,t=null,n=null,r=null,i=null,s=null,o=null,u=null,a={box:"Box",dropbox:"Dropbox",googledrive:"Google Drive",onedrive:"OneDrive",sharepoint:"SharePoint"};return{getConfig:function(){return e},getOTkn:function(){return t},getUTkn:function(){return n},getAkey:function(){return n},getEnvUrl:function(){return i},setNotification:function(e,t,n){if(u!=null||u!=undefined){u(n,{element:t})}if(o==null||o==undefined){o=new Object}if(o.action==null||o.action==undefined){o[n]=new Object}o[n][e]=t},getNotification:function(){return o},init:function(o){e=o.documents;t=o.oSec;n=o.uSec;r=o.aKey;u=o.callback;s=o;if(o.env==null||o.env==undefined){i="https://console.cloud-elements.com/elements/"}else{i=o.env}var f=[],l=[];for(var c in e){f.push(c);l.push(a[c])}cloudFileBrowser.init(f,l)},updateCallback:function(e){provision.processNextOnCallback(e)}}}();var provision=function(){var e=null;_provision={getTokenForElement:function(e){var t=CloudElements.getConfig()[e];return t["elementToken"]},getParentTokenForElement:function(e){var t=CloudElements.getConfig()[e];return t["elementTemplate"]},getElementDetails:function(e){var t=CloudElements.getConfig()[e];return t},setTokenToElement:function(e,t){var n=CloudElements.getConfig()[e];n["elementToken"]=t;CloudElements.setNotification(e,t,"create")},getParamsFromURI:function(e){var t=decodeURI(e);var n=t.split("&");var r=Object();for(var i=0;i<n.length;i++){var s=n[i].split("=");if(s[0].search("\\[\\]")!==-1){if(typeof r[s[0]]==="undefined"){r[s[0]]=[s[1]]}else{r[s[0]].push(s[1])}}else{r[s[0]]=s[1]}}return r}};return{getDocuments:function(e,t,n,r){server.list(_provision.getTokenForElement(e),t,n,r)},createInstance:function(e,t,n){var r=_provision.getTokenForElement(e);if(r!=null){t(r,n);return}var i=_provision.getParentTokenForElement(e);if(i!=null&&i!=undefined){var s=window.open("","_target");var o={cbFun:t,cbArgs:n,element:e,win:s};server.getOAuthUrlOnTemplate(e,i,provision.handleOnGetOAuthUrl,o);return}var u=_provision.getElementDetails(e);if(u!=null&&u!=undefined){var s=window.open("","_target");var o={cbFun:t,cbArgs:n,element:e,win:s,elementDetails:u};server.getOAuthUrlOnAPIKey(e,u.apiKey,u.apiSecret,u.callbackUrl,provision.handleOnGetOAuthUrl,o);return}},handleOnGetOAuthUrl:function(t,n){e=n;n.win.location.href=t.value},processNextOnCallback:function(t){var n=_provision.getParamsFromURI(t);var r=n.not_approved;if(r){return}var i=e.element;var s={element:i,cbFun:e.cbFun,cbArgs:e.cbArgs};var o=e.elementDetails;if(o!=null&&o!=undefined){server.createInstance(i,n.code,o.apiKey,o.apiSecret,o.callbackUrl,provision.handleOnCreateInstanceCall,s)}else{server.createInstanceOnParent(i,n.code,_provision.getParentTokenForElement(i),provision.handleOnCreateInstanceCall,s)}},handleOnCreateInstanceCall:function(e,t){_provision.setTokenToElement(t.element,e.token);t.cbFun(e.token,t.cbArgs)},fileSelected:function(e,t){CloudElements.setNotification(e,t,"select")},getFile:function(e,t,n,r){server.getFile(_provision.getTokenForElement(element),filepath,n,r)},downloadFile:function(e,t){server.downloadFile(_provision.getTokenForElement(e),t)},displayFile:function(e,t,n,r){server.displayThumbnail(_provision.getTokenForElement(e),t,n,r)},testThumbnail:function(e,t){server.testThumbnail(e,t)},uploadFile:function(e,t,n,r,i){server.uploadFile(_provision.getTokenForElement(e),t,n,r,i)}}}();var server=function(){_server={call:function(e,t,n,r,i,s){if(server.isNullAndUndef(t))t="Get";var o=$.ajax({url:server.getUrl(e),type:t,headers:n,data:r,cache:false,contentType:"application/json"}).done(function(e){console.log(e);if(server.isNullAndUndef(e.results))i(e,s);else i(e.results,s)}).error(function(t){console.log(t.status+" error on "+e);_server.handleFailure(t,i,s)})},callUpload:function(e,t,n,r,i,s){var o=$.ajax({url:server.getUrl(e),type:t,headers:n,data:r,cache:false,processData:false,contentType:false}).done(function(e){console.log(e);if(server.isNullAndUndef(e.results))i(e,s);else i(e.results,s)}).error(function(t){console.log(t.status+" error on "+e);_server.handleFailure(t,i,s)})},callThumbnail:function(e,t){var n=$.ajax({url:e,type:"Get",cache:false}).done(function(e){console.log(e);t("true")}).error(function(e){if(e.status===0){t("true")}else{t("false");cloudFileBrowser.displayError("Error loading thumbnail!")}})},handleFailure:function(e,t,n){if(e.status==-1){console.error("The server has not responded and "+"your request has timed out."+" Please use your browser's refresh "+"button to try again. ("+e.statusText+")");cloudFileBrowser.displayError(e.statusText)}else if(e.status==0){console.error("A communication error has occurred and "+"your request cannot be processed."+" Please use your browser's refresh button "+"to try again. ("+e.statusText+")");cloudFileBrowser.displayError(e.statusText)}else{if(server.isNullAndUndef(e.responseText)){t(e,n);cloudFileBrowser.displayError(e.statusText)}else{console.error("The server was unable to process this request. "+"Please contact your representative. ("+e.status+"/"+e.statusText+")");cloudFileBrowser.displayError(e.statusText)}}}};return{getUrl:function(e){return CloudElements.getEnvUrl()+e},isNullAndUndef:function(e){return e==null||e==undefined},authHeader:function(e,t,n,r){var i="";if(!this.isNullAndUndef(e)){i+="User "+e}if(!this.isNullAndUndef(t)){i+=", Organization "+t}if(!this.isNullAndUndef(n)){i+=", ParentElement "+n}if(!this.isNullAndUndef(r)){if(i.length>0){i+=", Element "+r}else{i+="Element "+r}}return{Authorization:i}},list:function(e,t,n,r){var i={path:t};_server.call("api-v1/document/list","Get",this.authHeader(null,null,null,e),i,n,r)},_downloadCallback:function(e){var t="hiddenDownloader",n=document.getElementById(t);if(n===null){n=document.createElement("iframe");n.id=t;n.style.display="none";document.body.appendChild(n)}n.src=e.value},getFile:function(e,t,n,r){var i={path:t};_server.call("api-v1/document/get","Get",this.authHeader(null,null,null,e),i,n,r)},downloadFile:function(e,t,n,r){var i={path:t};_server.call("api-v1/document/getDownloadLink","Get",this.authHeader(null,null,null,e),i,this._downloadCallback,r)},displayThumbnail:function(e,t,n,r){var i={path:t};_server.call("api-v1/document/getDownloadLink","Get",this.authHeader(null,null,null,e),i,n,r)},testThumbnail:function(e,t){_server.callThumbnail(e,t)},uploadFile:function(e,t,n,r,i){var s=new FormData;s.append("file",n);var o={cb:r,cbArgs:i};_server.callUpload("api-v1/document/uploadFile?path="+t,"POST",this.authHeader(null,null,null,e),s,this._uploadCallback,o)},_uploadCallback:function(e,t){console.log(e);t.cbArgs.data=e;t.cb(t.cbArgs)},getOAuthUrlOnTemplate:function(e,t,n,r){_server.call("api-v1/provisioning/1/getOAuthUrl","Get",this.authHeader(CloudElements.getUTkn(),CloudElements.getOTkn(),t,null),null,n,r)},getOAuthUrlOnAPIKey:function(e,t,n,r,i,s){var o={elementKey:e,apiKey:t,apiSecret:n,callbackUrl:r};_server.call("api-v1/provisioning/1/getOAuthUrl","Get",this.authHeader(CloudElements.getUTkn(),CloudElements.getOTkn(),null,null),o,i,s)},createInstanceOnParent:function(e,t,n,r,i){var s={element:{key:e},name:e};var o={instance:s,resellerConfig:true,code:t,account:{key:CloudElements.getAkey()}};_server.call("api-v1/provisioning/1/createAccountWithInstance","POST",this.authHeader(CloudElements.getUTkn(),CloudElements.getOTkn(),n,null),JSON.stringify(o),r,i)},createInstance:function(e,t,n,r,i,s,o){var u={provisionConfigs:[{key:"oauth.api.key",propertyValue:n},{key:"oauth.api.secret",propertyValue:r},{key:"oauth.callback.url",propertyValue:i}],element:{key:e},name:e};var a={instance:u,resellerConfig:true,code:t,account:{key:CloudElements.getAkey()}};_server.call("api-v1/provisioning/1/createAccountWithInstance","POST",this.authHeader(CloudElements.getUTkn(),CloudElements.getOTkn(),null,null),JSON.stringify(a),s,o)}}}()