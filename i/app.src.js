
function errorHandler(msg, url, line) {
	 // pro env
	if (location.hostname.indexOf('local') == -1) { return true }
	// dev env
	var txt ="Error: " + msg + "\n"
	txt +="URL: " + url + "\n"
	txt +="Line: " + line + "\n\n"
	txt +="Click OK to continue.\n\n"
	alert(txt)
	return false
}
onerror = errorHandler

// ��ֹ JS ���������������ʱҳ��������
if ($.browser.msie && document.charset.toUpperCase() == "UTF-8") { location.reload(false) }

// ��ʼ�� Google Analytics ��ʵ������������ֹ����ʱ����δ����ı���
function track(url) {  }
function trackOutLink(l) { track("\/out" + location.pathname + l.replace(/^https?:\/\//, '\/').replace('https:\/\/', '\/')) }
// 10������ڶ�������֮��� Cookie ��������
var $10y = new Date(); $10y.setFullYear($10y.getFullYear() + 10)

function trackSearch(wd, by) {
   $('#kwh').hide()
   track("\/search?by=" + by + "&at=" + location.pathname + "&wd=" + wd)
   track("\/search?by=" + by)
}
function fetchWeatherRPCDone() {
	if (arguments.length == 3) {
		jsid = arguments[0]
		city = arguments[1]
		info = arguments[2]
	} else {
		return
	}
	var str = city
	if (info[0].desc && info[0].desc != '����Ԥ��') {
		str +=  ': ' + info[0].desc + ' ' + info[0].temp[1] + '~' + info[0].temp[0]
	}
	$('#weather-info').text(str)
}

var $fs = $.cookie('B')
var $_i = -1
var $lk, $kw
var $ce = 'bd'
var $ck = $('#sb-' + $ce + '-kw')

function hint(keyword, evt) {
	if ($fs == '1') { return }
	if ($.browser.msie && document.readyState != "complete") { return }
	if (16 <= evt.keyCode && evt.keyCode <= 18) { return }
	var so = $('#kwh')
	if (!keyword.value || !keyword.value.length || evt.keyCode == 27) { // 27 is escape (evt.DOM_VK_ESCAPE)
		so.hide()
	}
	if (evt.keyCode == 38 || evt.keyCode == 40) { // up or down
		if (so.is(':hidden')) { return }
		var wy = $('#kwh-wy'); var yc = wy.children()
		var wz = $('#kwh-wz'); var zc = wz.children()
		var al = yc.length + zc.length
		yc.removeClass('c'); zc.removeClass('c')
		if (evt.keyCode == 38) { // up
			if ($_i < 0) { $_i = al - 1 }
			else { $_i-- }
		} else { // down
			if ($_i > al - 2) { $_i = -1 }
			else { $_i++ }
		}
		if (-1 < $_i && $_i < yc.length) { // ��ҳ
			yc.eq($_i).addClass('c')
			if (yc.eq($_i).children().length) {
				$kw = yc.eq($_i).children().eq(0).html()
				$kw = $kw.replace(/<span>/, '')
				$kw = $kw.replace(/<\/span>/, '')
				$lk = null
			}
		} else if ($_i == yc.length) { // ��ʾ
			if (evt.keyCode == 38) {
				yc.eq(--$_i).addClass('c')
				$kw = yc.eq($_i).children().eq(0).html()
				$kw = $kw.replace(/<span>/, '')
				$kw = $kw.replace(/<\/span>/, '')
				$lk = null
			} else {
				zc.eq(++$_i - yc.length).addClass('c')
				$lk = zc.eq($_i - yc.length).children().eq(1).html()
			}
		} else if (yc.length < $_i && $_i < al) { // ��ַ
			zc.eq($_i - yc.length).addClass('c')
			if (zc.eq($_i - yc.length).children().length) {
				$lk = zc.eq($_i - yc.length).children().eq(1).html()
			}
		}
	} else {
		if (!keyword.value || !keyword.value.length) { return }
		$_i = -1
		$kw = keyword.value
		gh($kw)
	}
}

function press(keyword, evt) {
	if ($fs == '1') { return }
	if (evt.keyCode != 13) { return	} // 13 is enter
	if ($lk != undefined && $lk) { // ��ַ���ٵ�������
		window.open($lk)
		$ck.val('')
		$('#kwh').hide()
		$kw = ''; $lk = ''; $_i = -1
		trackOutLink($lk)
		track('\/stat\/feellucky\/kb')
	} else { // �ؼ��� suggest ����
		if ($_i == -1) { return }
		$ck.val($kw)
		$('#form-' + $ce).submit()
		$ck.select()
		trackSearch($kw, $ce)
		track('\/stat\/suggest\/kb')
	}
	return false
}

function gh(key) {
	if ($fs == '1') { return }
	if ($.browser.msie && document.readyState != "complete") { return }
	$('#sg1').attr('src', 'http:\/\/www.google.cn\/complete\/search?hl=zh-CN&client=suggest&js=true&q=' + encodeURIComponent(key))
	$('#sg2').attr('src', 'http:\/\/daohang.google.cn\/suggest?num=60&partid=Moma&q=' + encodeURIComponent(key))
	
}
window.google = { ac: {} }
window.google.ac.Suggest_apply = function(a, b, c, d) {
	if ($.browser.msie && document.readyState != "complete") { return }
	if (!c || c.length < 3) { return }
	if (b != $ck.val()) { return }
	$('#kwh-wy').empty()
	for (var i = 1; i < c.length && i < 13; i += 2) {
		var kwd = c[i]; var num = c[i+1]
		$('#kwh-wy').append($('<li/>')
			.append($('<span/>').addClass('l').html(kwd))
			.append($('<span/>').addClass('r').html(num))
			.data('kwd', kwd)
			.addClass('wy')
			.mouseover(function(e) { $(this).addClass('c') })
			.mouseout(function(e) { $(this).removeClass('c') })
			.click(function(e) {
				$('#kwh').hide()
				$ck.val($(this).data('kwd'))
				$('#form-' + $ce).submit()
				$ck.select()
				track('\/stat\/suggest\/click')
			})
		)
	}
	$('#kwh').show()
}
function _handleAjaxMoma(res) {
	if ($fs == '1') { return }
	var row = res.split("|")
	if (row.length < 3) { return }
	$('#kwh-wz').empty()
	for (var i = 1; i < row.length && i < 13; i += 2) {
		if (i == 1) {
			$('#kwh-wz').append($('<li/>').addClass('t')
				.append($('<span/>').html('��ַ���ٵ���'))
			)
		}
		var url = row[i]; var tit = row[i+1]
		$('#kwh-wz').append($('<li/>')
			.append($('<span/>').addClass('l').html(tit))
			.append($('<span/>').addClass('r').html(url))
			.data('url', url)
			.addClass('wz')
			.mouseover(function(e) { $(this).addClass('c') })
			.mouseout(function(e) { $(this).removeClass('c') })
			.click(function(e) {
				$('#kwh').hide()
				window.open($(this).data('url'))
				trackOutLink($(this).data('url'))
				track('\/stat\/feellucky/click')
			})
		)
	}
	$('#kwh').show()
}

// �л�Ĭ����ҳ������ǩ
var toggleWYSE = function(en) {
	var eg = ['bd', 'gg']
	$ce = eg.toString().indexOf(en) == -1 ? eg[0] : en
	for (var i = 0; i < eg.length; i++) {
		_e = eg[i]
		if (_e == $ce) {
			continue
		}
		$('#sb-' + _e).hide()
		$('#tab-' + _e).removeClass('c')
	}
	$ck = $('#sb-' + $ce + '-kw')
	$('#sb-' + $ce).show()
	$('#tab-' + $ce).addClass('c')
	$.cookie('G', $ce, { expires: $10y, path: '/' })
	track('\/stat\/set\/sb-tab\/' + $ce)
}

function tblink(el) {
	if ($(el).is('a')) {
		if ($(el).attr('href').indexOf('allyes') != -1) {
			return true
		}
		r = Math.random()
		r = Math.floor(r * 10)
		if (r <= 0) {
			return true
		}
		$(el).attr('href', 'http:\/\/adtaobao.allyes.cn\/main\/adfclick?db=adtaobao&bid=1720,1677,333&cid=31811,469,1&sid=59310&ref=11575102&show=ignore&url=' + $(el).attr('href'))
	}
	return true
}


var $citySites = [{ 'link': 'http:\/\/www.chinaren.com\/', 'name': 'ChinaRen' }, { 'link': 'http:\/\/www.online.sh.cn\/', 'name': '�Ϻ�����' }, { 'link': 'http:\/\/sina.allyes.com\/main\/adfclick?db=sina&bid=131618,166554,171501&cid=0,0,0&sid=158775&advid=358&camid=22145&show=ignore&url=http:\/\/sports.sina.com.cn\/z\/paralympic2008\/', 'name': '�����а»�' }, { 'link': 'http:\/\/www.qihoo.com.cn\/', 'name': '�滢'}, {'link': 'http:\/\/www.vnet.cn\/', 'name': '�����ǿ�'}, {'link': 'http:\/\/www.pchome.net\/', 'name': '����֮��' }]
function citySiteRPCDone(name, pinyin, sites) {
	for (var i = 0; i < sites.length; i++) {
		$citySites[i] = sites[i]
	}
	$citySites[$citySites.length - 1] = { 'link': '\/difang\/' + pinyin + '\/', 'name': name + '����' }
}
var _e = $.cookie('E')
if (!_e) document.writeln('<scr' + 'ipt type="text\/javascript" src="\/api\/get\/area.php?mod=city"><\/scr' + 'ipt>')
else if (_e != 'unknow') document.writeln('<scr' + 'ipt type="text\/javascript" src="\/difang\/' + _e + '\/mingzhan.js"><\/scr' + 'ipt>')

$('#sb-container').ready(function(e) {
	// ������ onmouseover ʱ�۽�
	$('#sb-container input.kw').mouseover(function(e) { $(this).select() })
	// ������������ťЧ��
	$('#sb-container input.btn')
		.mouseover(function(e) { $(this).removeClass('btn-d').addClass('btn-o')    })
		.mouseup(  function(e) { $(this).removeClass('btn-d').removeClass('btn-o') })
		.mousedown(function(e) { $(this).removeClass('btn-o').addClass('btn-d')    })
		.mouseout( function(e) { $(this).removeClass('btn-o').removeClass('btn-d') })
	// �۽�������
	$('#sb-' + $ce + '-kw').focus()
})
$(document).ready(function(e) {
	$('*').click(function(e) {
		if ($.browser.msie && document.charset.toUpperCase() == "UTF-8") {
			// IE���������λ�ã�ʹҳ�����û� gb2312
			document.charset = 'gb2312'
		}
		$('#kwh').hide()
	})
	// ���ٱ�ҳ��ȫ�� <a> �ĵ��
	$('a').click(function(e) { trackOutLink($(this).attr('href')) })
	// ͳ��24Сʱ�ڵڶ��η��ʵļ����û�
	var _3m = new Date()
	var _ts = _3m.getTime()
	_3m.setTime(_ts + (1000 * 3600 * 24 * 90))
	var _lv = $.cookie('A')
	var _as = $.cookie('T')
	if (_lv && !_as && _ts - _lv < (1000 * 3600 * 24)) { // ����
		$('#ga-stat1').attr('src', 'http:\/\/www.googleadservices.com\/pagead\/conversion\/1039906861\/?label=aRZ8CIHxWxCt8O7vAw&script=0')
		track("\/stat\/conversion\/24h")
		$.cookie('T', '1', { expires: _3m, path: '/' })
	}
	$.cookie('A', _ts, { expires: $10y, path: '/' })
	// �������ڴ�С��δ���ȷ��
	if ($.browser.msie && (typeof screen.availWidth == "number")) {
		var _w = document.documentElement.clientWidth + 29
		var _h = document.documentElement.clientHeight
		if (_w < 1021 && screen.availWidth >= 1021) {
			var _tw = screen.availWidth < 1024 ? screen.availWidth : 1024
			var _th = Math.round(_tw * screen.availHeight / screen.availWidth)
			//moveTo(0, 0); resizeTo(_tw, _th) // δ���ȷ������ͳ������
			track('\/stat\/resize-window\/'
				+ screen.availWidth+ 'x' + screen.availHeight + '\/'
				+ _w + 'x' + _h + '\/' + _tw + 'x' + _th)
		} else if (_h < 500 && screen.availHeight > 500) {
			var _tw = _w
			var _th = Math.round(_tw * screen.availHeight / screen.availWidth)
			//moveTo(0, 0); resizeTo(_tw, _th)
			track('\/stat\/resize-window\/'
				+ screen.availWidth + 'x' + screen.availHeight + '\/'
				+ _w + 'x' + _h + '\/' + _tw + 'x' + _th)
		}
	}
	// ͳ����·
	var _fr = $.cookie('D')
	if (_fr) {
		track('/from/' + _fr)
		$.cookie('D', null, { path: '/' })
	}
})