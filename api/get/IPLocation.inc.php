<?php
if( !function_exists('ftok') )
{
    function ftok($filename = "", $proj = "")
    {
        if( empty($filename) || !file_exists($filename) )
        {
            return -1;
        }
        else
        {
            $filename = $filename . (string) $proj;
            for($key = array(); sizeof($key) < strlen($filename); $key[] = ord(substr($filename, sizeof($key), 1)));
            return array_sum($key);
        }
    }
}

/**
* IP ����λ�ò�ѯ��
*
* @author ���Ң
* @version 2.5
* @copyright 2005 CoolCode.CN
*/
if (function_exists('shmop_open')) {
    class IPLocation {
        /**
         * �����ڴ���
         *
         * @var int
         */
        var $shm_id;
        /**
         * ��һ��IP��¼��ƫ�Ƶ�ַ
         *
         * @var int
         */
        var $firstip;

        /**
         * ���һ��IP��¼��ƫ�Ƶ�ַ
         *
         * @var int
         */
        var $lastip;

        /**
         * IP��¼�����������������汾��Ϣ��¼��
         *
         * @var int
         */
        var $totalip;

        /**
         * ��ǰ�����ڴ�λ��ָ��
         *
         * @var int
         */
        var $pos;

        /**
         * ���ض�ȡ�ĳ�������
         *
         * @access private
         * @return int
         */
        function getLong() {
            //����ȡ��little-endian�����4���ֽ�ת��Ϊ��������
            $result = unpack('Vlong', shmop_read($this->shm_id, $this->pos, 4));
            $this->pos += 4;
            return $result['long'];
        }

        /**
         * ���ض�ȡ��3���ֽڵĳ�������
         *
         * @access private
         * @return int
         */
        function getLong3() {
            //����ȡ��little-endian�����3���ֽ�ת��Ϊ��������
            $result = unpack('Vlong', shmop_read($this->shm_id, $this->pos, 3).chr(0));
            $this->pos += 3;
            return $result['long'];
        }

        /**
         * ����ѹ����ɽ��бȽϵ�IP��ַ
         *
         * @access private
         * @param string $ip
         * @return string
         */
        function packIp($ip) {
            // ��IP��ַת��Ϊ���������������PHP5�У�IP��ַ�����򷵻�False��

            // ��ʱintval��Flaseת��Ϊ����-1��֮��ѹ����big-endian������ַ���

            return pack('N', intval(ip2long($ip)));
        }

        /**
         * ���ض�ȡ���ַ���
         *
         * @access private
         * @param string $data
         * @return string
         */
        function getString($data = "") {
            $char = shmop_read($this->shm_id, $this->pos++, 1);
            while (ord($char) > 0) {        // �ַ�������C��ʽ���棬��\0����
                $data .= $char;             // ����ȡ���ַ����ӵ������ַ���֮��
                $char = shmop_read($this->shm_id, $this->pos++, 1);
            }
            return $data;
        }

        /**
         * ���ص�����Ϣ
         *
         * @access private
         * @return string
         */
        function getArea() {
            $byte = shmop_read($this->shm_id, $this->pos++, 1); // ��־�ֽ�
            switch (ord($byte)) {
                case 0:                     // û��������Ϣ
                $area = "";
                break;
                case 1:
                case 2:                     // ��־�ֽ�Ϊ1��2����ʾ������Ϣ���ض���
                $this->pos = $this->getLong3($this->pos);
                $area = $this->getString();
                break;
                default:                    // ���򣬱�ʾ������Ϣû�б��ض���

                $area = $this->getString($byte);
                break;
            }
            return $area;
        }

        /**
         * �������� IP ��ַ�������������ڵ�����Ϣ
         *
         * @access public
         * @param string $ip
         * @return array
         */
        function getLocation($ip) {
            if (!$this->shm_id) return null;    // ��������ڴ�û�б���ȷ�򿪣���ֱ�ӷ��ؿ�
            $location['ip'] = gethostbyname($ip);   // �����������ת��ΪIP��ַ
            $ip = $this->packIp($location['ip']);   // �������IP��ַת��Ϊ�ɱȽϵ�IP��ַ
            // ���Ϸ���IP��ַ�ᱻת��Ϊ255.255.255.255
            // �Է�����
            $l = 0;                             // �������±߽�
            $u = $this->totalip;                // �������ϱ߽�
            $findip = $this->lastip;            // ���û���ҵ��ͷ������һ��IP��¼��QQWry.Dat�İ汾��Ϣ��
            while ($l <= $u) {                  // ���ϱ߽�С���±߽�ʱ������ʧ��
                $i = floor(($l + $u) / 2);      // ��������м��¼
                $this->pos = $this->firstip + $i * 7;
                $beginip = strrev(shmop_read($this->shm_id, $this->pos, 4));
                // ��ȡ�м��¼�Ŀ�ʼIP��ַ
                // strrev����������������ǽ�little-endian��ѹ��IP��ַת��Ϊbig-endian�ĸ�ʽ
                // �Ա����ڱȽϣ�������ͬ��
                if ($ip < $beginip) {       // �û���IPС���м��¼�Ŀ�ʼIP��ַʱ
                    $u = $i - 1;            // ���������ϱ߽��޸�Ϊ�м��¼��һ
                }
                else {
                    $this->pos += 4;
                    $this->pos = $this->getLong3();
                    $endip = strrev(shmop_read($this->shm_id, $this->pos, 4));  // ��ȡ�м��¼�Ľ���IP��ַ
                    if ($ip > $endip) {     // �û���IP�����м��¼�Ľ���IP��ַʱ
                        $l = $i + 1;        // ���������±߽��޸�Ϊ�м��¼��һ
                    }
                    else {                  // �û���IP���м��¼��IP��Χ��ʱ

                        $findip = $this->firstip + $i * 7;

                        break;              // ���ʾ�ҵ�������˳�ѭ��
                    }
                }
            }

            //��ȡ���ҵ���IP����λ����Ϣ
            $this->pos = $findip;
            $location['beginip'] = long2ip($this->getLong());   // �û�IP���ڷ�Χ�Ŀ�ʼ��ַ
            $this->pos = $offset = $this->getLong3();
            $location['endip'] = long2ip($this->getLong());     // �û�IP���ڷ�Χ�Ľ�����ַ
            $byte = shmop_read($this->shm_id, $this->pos++, 1); // ��־�ֽ�
            switch (ord($byte)) {
                case 1:                     // ��־�ֽ�Ϊ1����ʾ���Һ�������Ϣ����ͬʱ�ض���
                $this->pos = $countryOffset = $this->getLong3();           // �ض����ַ
                $byte = shmop_read($this->shm_id, $this->pos++, 1);        // ��־�ֽ�
                switch (ord($byte)) {
                    case 2:             // ��־�ֽ�Ϊ2����ʾ������Ϣ�ֱ��ض���
                    $this->pos = $this->getLong3();
                    $location['country'] = $this->getString();
                    $this->pos = $countryOffset + 4;
                    $location['area'] = $this->getArea();
                    break;
                    default:            // ���򣬱�ʾ������Ϣû�б��ض���

                    $location['country'] = $this->getString($byte);
                    $location['area'] = $this->getArea();
                    break;
                }
                break;
                case 2:                     // ��־�ֽ�Ϊ2����ʾ������Ϣ���ض���
                $this->pos = $this->getLong3();
                $location['country'] = $this->getString();
                $this->pos = $offset + 8;
                $location['area'] = $this->getArea();
                break;
                default:                    // ���򣬱�ʾ������Ϣû�б��ض���

                $location['country'] = $this->getString($byte);
                $location['area'] = $this->getArea();
                break;
            }
            if ($location['country'] == " CZ88.NET") {  //  CZ88.NET��ʾû����Ч��Ϣ
                $location['country'] = "δ֪";
            }
            if ($location['area'] == " CZ88.NET") {
                $location['area'] = "";
            }
            return $location;
        }

        /**
         * ���캯��
         *
         * @param string $filename
         * @return IPLocation
         */
        function IPLocation($filename) {

            $shm_key = ftok($filename, 'R');
            if (!($this->shm_id = shmop_open($shm_key, "a", 0, 0))) {  // ���û�н��������ڴ��
                $content = file_get_contents($filename);                // ���ȡ�ļ�����
                $this->shm_id = shmop_open($shm_key, "c", 0644, strlen($content));
                shmop_write($this->shm_id, $content, 0);                // ������д���½��Ĺ����ڴ��
            }
            $this->pos = 0;
            $this->firstip = $this->getLong();
            $this->lastip = $this->getLong();
            $this->totalip = ($this->lastip - $this->firstip) / 7;
            //ע������������ʹ���ڳ���ִ�н���ʱִ��
            register_shutdown_function(array(&$this, '_IPLocation'));
        }

        /**
         * ����������������ҳ��ִ�н������Զ��رմ򿪵��ļ���
         *
         */
        function _IPLocation() {
            shmop_close($this->shm_id);
        }

        /**
         * ����Ϊһ�� Singleton �࣬����������ĺ���������ʵ��
         *
         * @param string $filename
         * @return IPLocation
         */
        function &getInstance($filename = "QQWry.Dat") {
            static $instance = null;
            if (is_null($instance)) {
                $instance = new IPLocation($filename);
            }
            return $instance;
        }
    }

} else {

    class IPLocation {
        /**
         * QQWry.Dat�ļ�ָ��
         *
         * @var resource
         */
        var $fp;

        /**
         * ��һ��IP��¼��ƫ�Ƶ�ַ
         *
         * @var int
         */
        var $firstip;

        /**
         * ���һ��IP��¼��ƫ�Ƶ�ַ
         *
         * @var int
         */
        var $lastip;

        /**
         * IP��¼�����������������汾��Ϣ��¼��
         *
         * @var int
         */
        var $totalip;

        /**
         * ���ض�ȡ�ĳ�������
         *
         * @access private
         * @return int
         */
        function getLong() {
            //����ȡ��little-endian�����4���ֽ�ת��Ϊ��������
            $result = unpack('Vlong', fread($this->fp, 4));
            return $result['long'];
        }

        /**
     * ���ض�ȡ��3���ֽڵĳ�������
     *
     * @access private
     * @return int
     */
        function getLong3() {
            //����ȡ��little-endian�����3���ֽ�ת��Ϊ��������
            $result = unpack('Vlong', fread($this->fp, 3).chr(0));
            return $result['long'];
        }

        /**
         * ����ѹ����ɽ��бȽϵ�IP��ַ
         *
         * @access private
         * @param string $ip
         * @return string
         */
        function packIp($ip) {
            // ��IP��ַת��Ϊ���������������PHP5�У�IP��ַ�����򷵻�False��

            // ��ʱintval��Flaseת��Ϊ����-1��֮��ѹ����big-endian������ַ���

            return pack('N', intval(ip2long($ip)));
        }

        /**
         * ���ض�ȡ���ַ���
         *
         * @access private
         * @param string $data
         * @return string
         */
        function getString($data = "") {
            $char = fread($this->fp, 1);
            while (ord($char) > 0) {        // �ַ�������C��ʽ���棬��\0����
                $data .= $char;             // ����ȡ���ַ����ӵ������ַ���֮��
                $char = fread($this->fp, 1);
            }
            return $data;
        }

        /**
         * ���ص�����Ϣ
         *
         * @access private
         * @return string
         */
        function getArea() {
            $byte = fread($this->fp, 1);    // ��־�ֽ�
            switch (ord($byte)) {
                case 0:                     // û��������Ϣ
                $area = "";
                break;
                case 1:
                case 2:                     // ��־�ֽ�Ϊ1��2����ʾ������Ϣ���ض���
                fseek($this->fp, $this->getLong3());
                $area = $this->getString();
                break;
                default:                    // ���򣬱�ʾ������Ϣû�б��ض���

                $area = $this->getString($byte);
                break;
            }
            return $area;
        }

        /**
         * �������� IP ��ַ�������������ڵ�����Ϣ
         *
         * @access public
         * @param string $ip
         * @return array
         */
        function getLocation($ip) {
            if (!$this->fp) return null;            // ��������ļ�û�б���ȷ�򿪣���ֱ�ӷ��ؿ�
            $location['ip'] = gethostbyname($ip);   // �����������ת��ΪIP��ַ
            $ip = $this->packIp($location['ip']);   // �������IP��ַת��Ϊ�ɱȽϵ�IP��ַ
            // ���Ϸ���IP��ַ�ᱻת��Ϊ255.255.255.255
            // �Է�����
            $l = 0;                         // �������±߽�
            $u = $this->totalip;            // �������ϱ߽�
            $findip = $this->lastip;        // ���û���ҵ��ͷ������һ��IP��¼��QQWry.Dat�İ汾��Ϣ��
            while ($l <= $u) {              // ���ϱ߽�С���±߽�ʱ������ʧ��

                $i = floor(($l + $u) / 2);  // ��������м��¼
                fseek($this->fp, $this->firstip + $i * 7);
                $beginip = strrev(fread($this->fp, 4));     // ��ȡ�м��¼�Ŀ�ʼIP��ַ
                // strrev����������������ǽ�little-endian��ѹ��IP��ַת��Ϊbig-endian�ĸ�ʽ
                // �Ա����ڱȽϣ�������ͬ��
                if ($ip < $beginip) {       // �û���IPС���м��¼�Ŀ�ʼIP��ַʱ
                    $u = $i - 1;            // ���������ϱ߽��޸�Ϊ�м��¼��һ
                }
                else {
                    fseek($this->fp, $this->getLong3());
                    $endip = strrev(fread($this->fp, 4));   // ��ȡ�м��¼�Ľ���IP��ַ
                    if ($ip > $endip) {     // �û���IP�����м��¼�Ľ���IP��ַʱ
                        $l = $i + 1;        // ���������±߽��޸�Ϊ�м��¼��һ
                    }
                    else {                  // �û���IP���м��¼��IP��Χ��ʱ

                        $findip = $this->firstip + $i * 7;
                        break;              // ���ʾ�ҵ�������˳�ѭ��
                    }
                }
            }

            //��ȡ���ҵ���IP����λ����Ϣ
            fseek($this->fp, $findip);
            $location['beginip'] = long2ip($this->getLong());   // �û�IP���ڷ�Χ�Ŀ�ʼ��ַ
            $offset = $this->getLong3();
            fseek($this->fp, $offset);
            $location['endip'] = long2ip($this->getLong());     // �û�IP���ڷ�Χ�Ľ�����ַ
            $byte = fread($this->fp, 1);    // ��־�ֽ�
            switch (ord($byte)) {
                case 1:                     // ��־�ֽ�Ϊ1����ʾ���Һ�������Ϣ����ͬʱ�ض���
                $countryOffset = $this->getLong3();         // �ض����ַ
                fseek($this->fp, $countryOffset);
                $byte = fread($this->fp, 1);    // ��־�ֽ�
                switch (ord($byte)) {
                    case 2:             // ��־�ֽ�Ϊ2����ʾ������Ϣ�ֱ��ض���
                    fseek($this->fp, $this->getLong3());
                    $location['country'] = $this->getString();
                    fseek($this->fp, $countryOffset + 4);
                    $location['area'] = $this->getArea();
                    break;
                    default:            // ���򣬱�ʾ������Ϣû�б��ض���
                    $location['country'] = $this->getString($byte);
                    $location['area'] = $this->getArea();
                    break;
                }
                break;
                case 2:                     // ��־�ֽ�Ϊ2����ʾ������Ϣ���ض���
                fseek($this->fp, $this->getLong3());
                $location['country'] = $this->getString();
                fseek($this->fp, $offset + 8);
                $location['area'] = $this->getArea();
                break;
                default:                    // ���򣬱�ʾ������Ϣû�б��ض���

                $location['country'] = $this->getString($byte);
                $location['area'] = $this->getArea();
                break;
            }
            if ($location['country'] == " CZ88.NET") {  // CZ88.NET��ʾû����Ч��Ϣ
                $location['country'] = "unknow";
            }
            if ($location['area'] == " CZ88.NET") {
                $location['area'] = "";
            }
            return $location;
        }

        /**
         * ���캯������ QQWry.Dat �ļ�����ʼ�����е���Ϣ
         *
         * @param string $filename
         * @return IPLocation
         */
        function IPLocation($filename = "QQWry.Dat") {
            $this->fp = 0;
            if (($this->fp = @fopen($filename, 'rb')) !== false) {
                $this->firstip = $this->getLong();
                $this->lastip = $this->getLong();
                $this->totalip = ($this->lastip - $this->firstip) / 7;
                //ע������������ʹ���ڳ���ִ�н���ʱִ��
                register_shutdown_function(array(&$this, '_IPLocation'));
            }
        }

        /**
         * ����������������ҳ��ִ�н������Զ��رմ򿪵��ļ���
         *
         */
        function _IPLocation() {
            if ($this->fp) {
                fclose($this->fp);
            }
            $this->fp = 0;
        }
        
        /**
         * ����Ϊһ�� Singleton �࣬����������ĺ���������ʵ��
         *
         * @param string $filename
         * @return IPLocation
         */
        function &getInstance($filename = "QQWry.Dat") {
            static $instance = null;
            if (is_null($instance)) {
                $instance = new IPLocation($filename);
            }
            return $instance;
        }
    }
}
/*
$a = IPLocation::getInstance();
$b = $a->getLocation('127.0.0.1');
var_dump($b);
*/