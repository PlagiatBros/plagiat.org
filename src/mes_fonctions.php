<?php

    $GLOBALS['flag_preserver'] = true;
    $GLOBALS['puce'] = '-';
    $GLOBALS['class_spip_plus'] = '';
    $GLOBALS['ligne_horizontale'] = '<hr/>';
    $GLOBALS['debut_intertitre'] = '<h3>';
    $GLOBALS['fin_intertitre'] = '</h3>';

    function filtre_minify_css($css) {
        $css = preg_replace('/\n/', '', $css);
        $css = preg_replace('/\s+/', ' ', $css);
        // $css = preg_replace('/\/\*.*\*/', '', $css);
        $css = preg_replace('/;?\}/', "}", $css);
        $css = preg_replace('/\s*\{\s*/', "{", $css);
        $css = preg_replace('/\s*,\s*/', ",", $css);
        $css = preg_replace('/\s*;\s*/', ";", $css);
        $css = preg_replace('/:\s+/', ":", $css);
        return $css;
    }

    function filtre_rfc2iso($rfc) {
        $d = new DateTime($rfc);
        return $d->format('Y-m-d\TH:i:sO');
    }

?>
