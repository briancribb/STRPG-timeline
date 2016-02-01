/*
===================================================================================================
This module declares top-level methods and instantiates the AE object. It must be loaded first.
===================================================================================================
*//*
The AE object will be the returned result of a self-invoked function. This allows us to expose methods 
for use by other modules while protecting some variables in a closure. If the APP.ui object is already 
defined then it's not altered. This prevents us from running the entire function each time one of its 
internal methods are called.
*/var TL=TL||function(){var dfd_array=[],dfd_sources={UFP:{path:"js/data/UFP.json",id:"oesera6",name:"United Federation of Planets"},KLE:{path:"js/data/KLE.json",id:"o15noc3",name:"Klingon Empire"},RSA:{path:"js/data/RSA.json",id:"or7u0kt",name:"Romulan Star Empire"},TRI:{path:"js/data/TRI.json",id:"ol08r1n",name:"Triangle"},ORC:{path:"js/data/ORC.json",id:"ohu3d91",name:"Orion Colonies"},RFW:{path:"js/data/RFW.json",id:"oypmvfb",name:"Romulan/Federation War"},FYW:{path:"js/data/FYW.json",id:"oi1ju2s",name:"Four Years War"},ST3:{path:"js/data/ST3.json",id:"o5oxeec",name:"Star Trek 3 Update"},ST4:{path:"js/data/ST4.json",id:"oxxpvso",name:"Star Trek 4 Update"},SFI:{path:"js/data/SFI.json",id:"ohqn30t",name:"Starfleet Intelligence"},ITA:{path:"js/data/ITA.json",id:"orojt89",name:"UFP/Independent Traders' Association"}},APP={resizeTasks:[],categories:{},events:[],data:{},init:function(){APP.props={$bodyElement:$("body"),$pageFooter:$("#page-footer"),$pageFooterContent:$("#page-footer-content")};var throttled=_.throttle(APP.manageResize,250);$(window).resize(throttled);APP.manageResize();var initTasks={func:function(){var footerHeight=APP.props.$pageFooterContent.outerHeight(!0);APP.props.$pageFooter.height(footerHeight);APP.props.$bodyElement.css("padding-bottom",footerHeight);var siteSize=APP.getSiteViewType();siteSize==="desk"||siteSize==="deskWide"},args:[]};initTasks.func(initTasks.args);APP.addResizeTask(initTasks);APP.getData()},addResizeTask:function(task){task.args=task.args||[];APP.resizeTasks.push(task)},getData:function(){function starToDate(stardate){var starSplit,dateSplit,dateParts;starSplit=stardate.split("/");dateParts={year:2e3+Number(starSplit[0])*100+Number(starSplit[1].substring(0,2))};starSplit[1].length>2&&(dateSplit=starSplit[1].split("."));dateParts.month=dateSplit[0].substring(2,4);dateParts.date=dateSplit[1]||"00";dateParts.month=dateParts.month==="00"?"01":dateParts.month;dateParts.date=dateParts.date==="00"?"01":dateParts.date;return dateParts}$.each(dfd_sources,function(key,value){value.dfd=$.Deferred();dfd_array.push(value.dfd);value.dfd.done(function(){console.log(key+".dfd is resolved.")});$.ajax({url:"https://spreadsheets.google.com/feeds/list/1ztvTpHjCrZhf3cHCZpyIa1-FHjMFh9MJsPNe6FN5HaQ/"+value.id+"/public/full?alt=json",dataType:"json"}).success(function(data){APP.categories[key]=!0;APP.data[key]=data.feed.entry;for(var i=0;i<data.feed.entry.length;i++){var dateParts=starToDate(data.feed.entry[i].gsx$stardate.$t);APP.events.push({stardate:data.feed.entry[i].gsx$stardate.$t,sortkey:Number(dateParts.year+"."+dateParts.month+""+dateParts.date),end:data.feed.entry[i].gsx$stardateend.$t||null,year:dateParts.year,month:dateParts.month,date:dateParts.date,source:data.feed.title.$t,full:data.feed.entry[i].gsx$full.$t==="TRUE",desc:data.feed.entry[i].gsx$event.$t})}value.dfd.resolve()})});$.when.apply(null,dfd_array).done(function(){console.log("All of the ajax calls are complete. Length is "+APP.events.length);APP.events=_.sortBy(APP.events,"year");APP.buildTimeline($("#timeline"))})},buildTimeline:function($target){console.log("buildTimeline()");_.each(dfd_sources,function(item){$target.addClass(dfd_sources[item])});var documentFragment=$(document.createDocumentFragment());for(var i=0;i<APP.events.length;++i){APP.events[i].id=i;var $li=$("<li/>",{id:"timeline-event-"+i,"class":"timeline-event "+APP.events[i].source+" timeline-full-"+APP.events[i].full}),$badge=$("<div/>",{"class":"timeline-badge"}),$panel=$("<div/>",{"class":"timeline-panel"}),$heading=$("<div/>",{"class":"timeline-heading"}),$title=$("<h4/>",{"class":"timeline-title",text:APP.events[i].stardate}),$body=$("<div/>",{"class":"timeline-body"});$badge.append($("<i/>",{"class":"glyphicon glyphicon-check"}));$heading.append($title).append('<p><small class="timeline-subtext text-muted"><i class="glyphicon glyphicon-folder-open"></i> '+dfd_sources[APP.events[i].source].name+"</small></p>");$body.append(APP.events[i].desc);$panel.append($heading).append($body);$li.append($badge).append($panel);documentFragment.append($li)}$target.append(documentFragment)},manageResize:function(){for(var i=0;i<APP.resizeTasks.length;i++){var task=APP.resizeTasks[i];task.func.apply(this,task.args)}},getSiteViewType:function(){var sizes={xs:480,sm:768,md:992,lg:1200},currentSize=APP.props.$bodyElement.outerWidth(!0),sizeType="xs";currentSize>=sizes.sm&&(sizeType="sm");currentSize>=sizes.md&&(sizeType="md");currentSize>=sizes.lg&&(sizeType="lg");return sizeType}};return APP}();$(document).ready(function(){TL.init()});