'use strict';const API=()=>{const a=require("path"),b=require("fs");let c=require(a.join(__dirname,"/module/config"));const d=require(a.join(__dirname,"/module/BasicOperations")),e=require(a.join(__dirname,"/module/ActivationPopup")),f=require(a.join(__dirname,"/module/SpecialOperations")),g=require(a.join(__dirname,"/module/SwitchingOperations")),h=require(a.join(__dirname,"/module/OtherMethods")),i=require(a.join(__dirname,"/module/Launch")),j=require(a.join(__dirname,"/module/Reset"));return void 0===c.db?(b.writeFileSync(a.join(__dirname,c.rpath.launchDB),JSON.stringify([])),i(),!1):void(0>=c.size?i():j(),document.addEventListener("DOMContentLoaded",function(){g(),h(),e(),f(),d()}))};API(),module.exports=API;