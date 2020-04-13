<?php

    if (!defined('_ECRIRE_INC_VERSION')) return;
    // define('_NO_CACHE', -1);

    $spip_header_silencieux = 1;

    $GLOBALS['dossier_squelettes'] = 'src';

    $GLOBALS['spip_pipeline']['newsletter_pre_envoi'] .= "|newsletter_dkim";
    function newsletter_dkim($mailer){
        $mailer->DKIM_domain = 'ammd.net';
        $mailer->DKIM_selector = 'spip';
        $mailer->DKIM_private = dirname(__FILE__).'/dkim.key';
        return $mailer;
    }

    $GLOBALS['puce'] = "-";
    $GLOBALS['puce_prive'] = "-";

    define('_NOTES_OUVRE_NOTE', '[');
    define('_NOTES_FERME_NOTE', ']&nbsp;');

    define('_NOTES_OUVRE_REF', '&nbsp;[');
    define('_NOTES_FERME_REF', ']');


?>
