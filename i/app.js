function errorHandler(E,D,B){if(location.hostname.indexOf("local")==-1){return true}var A="Error: "+E+"\n";A+="URL: "+D+"\n";A+="Line: "+B+"\n\n";A+="Click OK to continue.\n\n";alert(A);return false}onerror=errorHandler;var $id=function(D){if(D&&(D.nodeType||D.item)){return D}if(typeof D==="string"||!D){return document.getElementById(D)}if(D.length!==undefined){var E=[];for(var B=0,A=D.length;B<A;++B){E[E.length]=$id(D[B])}return E}return D};var C={reClassName:{},property:{}};var getClassRegEx=function(B){var A=C.reClassName[B];if(!A){A=new RegExp("(?:^|\\s+)"+B+"(?:\\s+|$)");C.reClassName[B]=A}return A};var getElementsByClassName=function(H,B,D){B=B||"*";D=(D)?$id(D):null||document;if(!D){return[]}var E=[],I=D.getElementsByTagName(B),G=getClassRegEx(H);for(var F=0,A=I.length;F<A;++F){if(G.test(I[F].className)){E[E.length]=I[F]}}return E};var trim=function(A){try{return A.replace(/^\s+|\s+$/g,"")}catch(B){return A}};var batch=function(E,G){E=(E&&(E.tagName||E.item))?E:$id(E);if(!E||!G){return false}var D=window;if(E.tagName||E.length===undefined){return G.call(D,E)}var F=[];for(var B=0,A=E.length;B<A;++B){F[F.length]=G.call(D,E[B])}return F};var hasClass=function(D,B){var A=getClassRegEx(B);var E=function(F){return A.test(F.className)};return batch(D,E)};var addClass=function(B,A){var D=function(E){if(hasClass(E,A)){return false}E.className=trim([E.className,A].join(" "));return true};return batch(B,D)};var removeClass=function(D,B){var A=getClassRegEx(B);var E=function(F){if(!B||!hasClass(F,B)){return false}var G=F.className;F.className=G.replace(A," ");if(hasClass(F,B)){removeClass(F,B)}F.className=trim(F.className);return true};return batch(D,E)};var replaceClass=function(E,B,A){if(!A||B===A){return false}var D=getClassRegEx(B);var F=function(G){if(!hasClass(G,B)){addClass(G,A);return true}G.className=G.className.replace(D," "+A+" ");if(hasClass(G,B)){replaceClass(G,B,A)}G.className=trim(G.className);return true};return batch(E,F)};jQuery.cookie=function(B,J,M){if(typeof J!="undefined"){M=M||{};if(J===null){J="";M.expires=-1}var F="";if(M.expires&&(typeof M.expires=="number"||M.expires.toUTCString)){var G;if(typeof M.expires=="number"){G=new Date();G.setTime(G.getTime()+(M.expires*24*60*60*1000))}else{G=M.expires}F="; expires="+G.toUTCString()}var L=M.path?"; path="+(M.path):"";var H=M.domain?"; domain="+(M.domain):"";var A=M.secure?"; secure":"";document.cookie=[B,"=",encodeURIComponent(J),F,L,H,A].join("")}else{var E=null;if(document.cookie&&document.cookie!=""){var K=document.cookie.split(";");for(var I=0;I<K.length;I++){var D=jQuery.trim(K[I]);if(D.substring(0,B.length+1)==(B+"=")){E=decodeURIComponent(D.substring(B.length+1));break}}}return E}};var track=function(A){};if($.browser.msie&&document.charset.toUpperCase()=="UTF-8"){location.reload(false)}function trackOutLink(A){_l="/out"+location.pathname+A.replace(/^https?:\/\//,"/").replace("https://","/");track(_l)}var $10y=new Date();$10y.setFullYear($10y.getFullYear()+10);$clicked=false;function signinMail(A){var D=A.__dd;var E=A.__uu;var B=A.__pp;if(E.value==""){alert("请输入用户名！");E.focus();return false}if(D.value==""){alert("请选择邮箱！");D.focus();return false}if(B.value==""){alert("请输入密码！");B.focus();return false}switch(D.value){case"163":A.action="http://reg.163.com/CheckUser.jsp";A.url.value="http://fm163.163.com/coremail/fcg/ntesdoor2?lightweight=1&verifycookie=1&language=-1&style=15";A.username.value=E.value;A.password.value=B.value;A.enterVip.value="";break;case"126":A.action="http://entry.126.com/cgi/login";A.domain.value="126.com";A.user.value=E.value;A.pass.value=B.value;break;case"yeah":A.action="http://entry.yeah.net/cgi/login";A.domain.value="yeah.net";A.user.value=E.value;A.pass.value=B.value;break;case"188":A.action="http://reg.mail.188.com/servlet/coremail/login?language=0&style=1";A.user.value=E.value;A.pass.value=B.value;break;case"sohu":A.action="http://passport.sohu.com/login.jsp";A.url.value="";A.UserName.value=E.value;A.Password.value=B.value;A.id.value=E.value;A.username.value=E.value;A.password.value=B.value;A.m.value=E.value;A.passwd.value=B.value;A.mpass.value=B.value;A.loginid.value=E.value+"@sohu.com";A.fl.value="1";A.vr.value="1|1";A.appid.value="1000";A.ru.value="http://login.mail.sohu.com/servlet/LoginServlet";A.eru.value="http://login.mail.sohu.com/login.jsp";A.ct.value="1173080990";A.sg.value="5082635c77272088ae7241ccdf7cf062";break;case"yahoo":A.action="http://edit.bjs.yahoo.com/config/login";A.login.value=E.value;A.passwd.value=B.value;break;case"yahoocn":A.action="http://edit.bjs.yahoo.com/config/login";A.login.value=E.value+"@yahoo.cn";A.passwd.value=B.value;break;case"tom":A.action="http://bjweb.163.net/cgi/163/login_pro.cgi";A.user.value=E.value;A.pass.value=B.value;break;case"21cn":A.action="http://passport.21cn.com/maillogin.jsp";A.LoginName.value=E.value;A.passwd.value=B.value;A.domainname.value="21cn.com";A.UserName.value=E.value+"@21cn.com";break;case"sina":A.action="http://mail.sina.com.cn/cgi-bin/login.cgi";A.u.value=E.value;A.psw.value=B.value;break;case"gmail":A.action="https://www.google.com/accounts/ServiceLoginAuth";A.Email.value=E.value;A.Passwd.value=B.value;break;case"chinaren":A.action="http://passport.sohu.com/login.jsp";A.loginid.value=E.value+"@chinaren.com";A.passwd.value=B.value;A.fl.value="1";A.vr.value="1|1";A.appid.value="1005";A.ru.value="http://profile.chinaren.com/urs/setcookie.jsp?burl=http://alumni.chinaren.com/";A.ct.value="1174378209";A.sg.value="84ff7b2e1d8f3dc46c6d17bb83fe72bd";break;case"tianya":A.action="http://www.tianya.cn/user/loginsubmit.asp";A.vwriter.value=E.value;A.vpassword.value=B.value;break;case"baidu":A.action="http://passport.baidu.com/?login";A.username.value=E.value;A.password.value=B.value;break}B.value="";track("/out/checkmail/"+D.value);return true}function checkSearchTab(F){var D=["gg","bd","yy","tp","sp","xz","gw","dt"];for(var B=0;B<D.length;B++){var A="tab-"+D[B];var E="sb-"+D[B];if(F.id==A){if(D[B]=="gg"||D[B]=="bd"){toggleWYSE(D[B])}$id(A).className="c";$id(E).style.display="";$id("sb-"+D[B]+"-kw").focus()}else{$id(A).className="";$id(E).style.display="none"}}return false}function getBit(A,B){return(A>>B)&1}function lunar(K){var N="一二三四五六七八九十";var I="正二三四五六七八九十冬腊";var B=[268949,3402,3493,133973,1386,464219,605,2349,334123,2709,2890,267946,2773,592565,1210,2651,395863,1323,2707,265877];var J=[0,31,59,90,120,151,181,212,243,273,304,334];var L,F,D,G;var E=false;var P=K.getYear();if(P<1900){P+=1900}L=(P-2001)*365+Math.floor((P-2001)/4)+J[K.getMonth()]+K.getDate()-23;if(K.getYear()%4==0&&K.getMonth()>1){L++}for(F=0;;F++){G=(B[F]<4095)?11:12;for(D=G;D>=0;D--){if(L<=29+getBit(B[F],D)){E=true;break}L=L-29-getBit(B[F],D)}if(E){break}}var H=2001+F;var M=G-D+1;var O=L;if(G==12){if(M==Math.floor(B[F]/65536)+1){M=1-M}if(M>Math.floor(B[F]/65536)+1){M--}}var A=Math.floor((K.getHours()+3)/2);var P="";if(M<1){P+="闰";P+=I.charAt(-M-1)}else{P+=I.charAt(M-1)}P+="月";P+=(O<11)?"初":((O<20)?"十":((O<30)?"廿":"卅"));if(O%10!=0||O==10){P+=N.charAt((O-1)%10)}return P}function getFullDate(){var D=new Date();var E=D.getFullYear()+"年"+(D.getMonth()+1)+"月"+D.getDate()+"日";var B=["日","一","二","三","四","五","六"];var B="星期"+B[D.getDay()];var A="农历"+lunar(D);return{date:E,week:B,cd:A}}function trackSearch(A,B){$id("kwh").style.display="none";track("/search?by="+B+"&at="+location.pathname+"&wd="+A)}function fetchWeatherRPCDone(){if(arguments.length==3){jsid=arguments[0];city=arguments[1];info=arguments[2]}else{if(arguments.length==2){city=arguments[0];info=arguments[1]}else{return }}var A=city;if(info[0].desc&&info[0].desc!="暂无预报"){A+=": "+info[0].desc+" "+info[0].temp[1]+"~"+info[0].temp[0]}$id("weather-info").innerHTML=A}var $fs=$.cookie("B");var $_i=-1;var $lk,$kw;var $ce="bd";var $ck=$id("sb-"+$ce+"-kw");function hint(H,J){if($fs=="1"){return }if($.browser.msie&&document.readyState!="complete"){return }if(16<=J.keyCode&&J.keyCode<=18){return }var F=$id("kwh");if(!H.value||!H.value.length||J.keyCode==27){F.style.display="none"}if(J.keyCode==38||J.keyCode==40){if(F.style.display=="none"){return }var D=$id("kwh-wy");var B=$id("kwh-wz");var A=0;var I=0;if(D){A=D.childNodes.length}if(B){I=B.childNodes.length}var G=A+I;for(var E=0;E<G;E++){if(E<A){removeClass(D.childNodes[E],"c")}else{removeClass(B.childNodes[E-A],"c")}}if(J.keyCode==38){if($_i<0){$_i=G-1}else{$_i--}}else{if($_i>G-2){$_i=-1}else{$_i++}}if(-1<$_i&&$_i<A){addClass(D.childNodes[$_i],"c");if(D.childNodes[$_i].childNodes[0]){$kw=D.childNodes[$_i].childNodes[0].innerHTML;$kw=$kw.replace(/<span>/,"");$kw=$kw.replace(/<\/span>/,"");$lk=null}}else{if($_i==A){if(J.keyCode==38){addClass(D.childNodes[--$_i],"c")}else{addClass(B.childNodes[++$_i-A],"c")}$kw=null;$lk=null}else{if(A<$_i&&$_i<G){addClass(B.childNodes[$_i-A],"c");$lk=B.childNodes[$_i-A].childNodes[1].innerHTML;$kw=null}}}}else{if(!H.value||!H.value.length){return }$_i=-1;$kw=H.value;gh($kw)}}function press(B,A){if($fs=="1"){return }if(A.keyCode!=13){return }if($lk!=null&&$lk!=undefined){window.open($lk);$ck.value="";$id("kwh").style.display="none";$kw="";$lk="";$_i=-1;trackOutLink($lk);track("/stat/feellucky/kb")}else{if($_i==-1){return }$ck.value=$kw;$id("form-"+$ce).submit();$ck.select();trackSearch($kw,$ce);track("/stat/suggest/kb")}return false}function gh(E){if($fs=="1"){return }if($.browser.msie&&document.readyState!="complete"){return }if($id("sg1")){var D=$id("sg1").parentNode;D.removeChild($id("sg1"))}if($id("sg2")){var D=$id("sg2").parentNode;D.removeChild($id("sg2"))}var B=document.body.appendChild(document.createElement("script"));B.id="sg1";B.charset="utf-8";B.src="http://www.google.cn/complete/search?hl=zh-CN&client=suggest&js=true&q="+encodeURIComponent(E);var A=document.body.appendChild(document.createElement("script"));A.id="sg2";A.charset="utf-8";A.src="http://daohang.google.cn/suggest?num=60&partid=Moma&q="+encodeURIComponent(E)}window.google={ac:{}};window.google.ac.Suggest_apply=function(B,A,I,H){if($.browser.msie&&document.readyState!="complete"){return }if(!I||I.length<3){return }if(A!=$ck.value){return }old_wy_trs=getElementsByClassName("wy","ul","kwh");for(var E=0;E<old_wy_trs.length;E++){e=old_wy_trs[E];e.parentNode.removeChild(e)}var F="";for(var D=1;D<I.length&&D<13;D+=2){F+="<li class=\"wy\" onmouseover=\"addClass(this, 'c')\" onmouseout=\"removeClass(this, 'c');\" onclick=\"$id('kwh').style.display = 'none'; $ck.value = '"+I[D]+"'; $id('form-' + $ce).submit(); $ck.select(); track('/stat/suggest/click')\"><span class=\"l\">"+I[D]+'</span><span class="r">'+I[D+1]+"</span></li>"}if($id("kwh-wy")){$id("kwh-wy").parentNode.removeChild($id("kwh-wy"))}if($id("kwh-wz")){var G=document.createElement("ul");G.id="kwh-wy";$id("kwh").insertBefore(G,$id("kwh-wz"));G.innerHTML=F}else{var G=document.createElement("ul");G.id="kwh-wy";$id("kwh").appendChild(G);G.innerHTML=F}$id("kwh").style.display="block"};var _handleAjaxMoma=function(B){if($fs=="1"){return }var F=B.split("|");if(F.length<3){return }old_wz_trs=getElementsByClassName("wz","tr","kwh");if($id("kwh-wy-th")!==null){$id("kwh-wy-th").parentNode.removeChild($id("kwh-wy-th"))}for(var A=0;A<old_wz_trs.length;A++){e=old_wz_trs[A];e.parentNode.removeChild(e)}var D;for(var A=1;A<F.length&&A<13;A+=2){if(A==1){D='<li id="tip"><span>网址快速导航</span></li>'}url=F[A];tit=F[A+1];D+="<li class=\"wz\" onmouseover=\"addClass(this, 'c');\" onmouseout=\"removeClass(this, 'c');\" onclick=\"$id('kwh').style.display = 'none'; window.open('"+url+"'); trackOutLink('"+url+"'); track('/stat/feellucky/click')\"><span class=\"l\">"+tit+'</span><span class="r">'+url+"</span></li>"}if($id("kwh-wz")){$id("kwh-wz").parentNode.removeChild($id("kwh-wz"))}var E=document.createElement("ul");E.id="kwh-wz";$id("kwh").appendChild(E);E.innerHTML=D;$id("kwh").style.display="block"};var _cl=$.cookie("C");var _sz=$.cookie("S");var _css="";if(!_cl||_cl=="0"){_css+="#layout-alpha a:visited, #layout-beta a:visited, #layout-gamma a:visited, #layout-delta a:visited { color: #752481; }\n"}if(_sz=="1"){_css+="#layout-beta .section table td, #layout-gamma .section td { font-size: 12px; }\n";_css+="#layout-gamma .section td.cm { font-size: 12px; }"}document.write('<style type="text/css">\n'+_css+"</style>");var toggleWYSE=function(A){var D=["bd","gg"];$ce=D.toString().indexOf(A)==-1?D[0]:A;for(var B=0;B<D.length;B++){_e=D[B];if(_e==$ce){continue}$id("sb-"+_e).style.display="none";$id("tab-"+_e).className=""}$ck=$id("sb-"+$ce+"-kw");$id("sb-"+$ce).style.display="block";$id("tab-"+$ce).className="c";$.cookie("G",$ce,{expires:$10y,path:"/"});track("/stat/set/sb-tab/"+$ce)};if(/Windows/.test(navigator.userAgent)){var _css='<style type="text/css" media="all">\n#layout-alpha .section th { font: bold 14px "宋体"; }\n#layout-alpha .section tfoot td { padding: 6px 0px 9px; }\n</style>';document.write(_css)}var $citySites=[{link:"http://www.chinaren.com/",name:"ChinaRen"},{link:"http://www.online.sh.cn/",name:"上海热线"},{link:"http://sina.allyes.com/main/adfclick?db=sina&bid=131618,166554,171501&cid=0,0,0&sid=158775&advid=358&camid=22145&show=ignore&url=http://sports.sina.com.cn/z/paralympic2008/",name:"北京残奥会"},{link:"http://www.qihoo.com.cn/",name:"奇虎"},{link:"http://www.vnet.cn/",name:"互联星空"},{link:"http://www.pchome.net/",name:"电脑之家"}];var citySiteRPCDone=function(B,A,E){for(var D=0;D<E.length;D++){$citySites[D]=E[D]}$citySites[$citySites.length-1]={link:"/difang/"+A+"/",name:B+"导航"}};var _e=$.cookie("E");if(!_e){document.writeln('<script type="text/javascript" src="/api/get/area.php?mod=city"><\/script>')}else{if(_e!="unknow"){document.writeln('<script type="text/javascript" src="/difang/'+_e+'/mingzhan.js"><\/script>')}};