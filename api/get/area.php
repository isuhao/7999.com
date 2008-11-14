<?php

include_once '../functions.inc.php';
include_once './IPLocation.inc.php';

exportTimeout(0);

$rip = array_key_exists('ip', $_GET) ? $_GET['ip'] : getClientRealIP();
$ipl = IPLocation::getInstance('./chunzhen.dat');
$loc = $ipl->getLocation($rip);
$loc = $loc['country'];

// ̽�ⷵ�ظ�ʽ
$fmt = "xml";
if (preg_match("/\.([^\.]+)$/", $_SERVER['SCRIPT_NAME'], $matches)) {
	switch ($matches[1]) {
		case 'js';
			$fmt = 'js';
			break;
		case 'yml';
		case 'yaml';
			$fmt = 'yml';
			break;
		case 'red';
		case 'php';
			$fmt = 'red';
			break;
	}
}
switch ($fmt) {
	case 'js':
		header('Content-type: application/x-javascript; charset=gb2312');
	case 'yml':
		header('Content-type: text/plain; charset=utf-8');
	case 'xml':
		header('Content-type: text/xml; charset=utf-8');
}

include_once '../weather/area-code.inc.php';
$area = $city = null;
$areas = array_keys($CC);
for ($i = 0; $i < count($areas); $i++) {
	$area = $areas[$i];
	if (strpos($loc, $area) === 0) { // ����
		if (is_array($CC[$area])) { // ������
			$cities = array_keys($CC[$area]);
			for ($j = 0; $j < count($cities); $j++) {
				$city = $cities[$j];
				if (strpos($loc, $city) !== false) { // ����
					break;
				}
				$city = null; // ����
			}
		}
		break;
	}
	$area = null; // ����
}
if ($area == null && ($rip == '127.0.0.1' || strpos($rip, '192.168.1.') === 0)) {
	$area = '�Ϻ�';
}
if ($area == null) {
	setcookie('L', 'unknow', time() + (3600 * 6), '/');
}

if ($area != null) {
	if ($city == null) $location = "$area";
	else $location = "$area/$city";
	$encoded = crc32($location);
	echo $encoded;
} else {
	$location = null;
	$encoded = 0;
}

$mod = array_key_exists('mod', $_GET) ? $_GET['mod'] : '';
if ($mod == 'weather') {
	switch ($fmt) {
		case 'red':
			if ($encoded) {
				setcookie('L', $encoded, time() + (3600 * 24), '/');
				header("Location: /api/weather/details/$encoded.js");
			}
		default:
	}
} elseif ($mod == 'city') {
	$city = $city ? $city : $area;
	$known_cities = array(
		'�Ϻ�' => 'shanghai',
		'����' => 'beijing',
		'����' => 'shenzhen',
		'����' => 'hangzhou',
        '���' => 'tianjin',
        '����' => 'guangzhou',
		'�ɶ�' => 'chengdu',
		'�人' => 'wuhan',
		'�Ͼ�' => 'nanjing',
		'֣��' => 'zhengzhou',
		'����' => 'chongqing',
		'������' => 'haerbin'
	);
	$pinyin = 'unkown';
	if (array_key_exists($city, $known_cities)) {
		$pinyin = $known_cities[$city];
	}
	switch ($fmt) {
		case 'red':
			setcookie('E', $pinyin, time() + (3600 * 24), '/');
			if ($pinyin != 'unkown') {
				header("Location: /difang/$pinyin/mingzhan.js");
			}
		default:
	}
}

