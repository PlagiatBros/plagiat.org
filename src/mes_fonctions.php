<?php

    function filtre_minify_css($css) {
        $css = preg_replace('/\n/', '', $css);
        $css = preg_replace('/\s+/', ' ', $css);
        $css = preg_replace('/\/\*.*\*\//', '', $css);
        $css = preg_replace('/;?\}/', "}", $css);
        $css = preg_replace('/\s*\{\s*/', "{", $css);
        $css = preg_replace('/\s*,\s*/', ",", $css);
        $css = preg_replace('/\s*;\s*/', ";", $css);
        $css = preg_replace('/:\s+/', ":", $css);
        return $css;
    }

    function filtre_twitter_urls($texte, $entities) {

        $texte = str_replace('<br class=\'autobr\' />', '', $texte);


        $mentions = $entities['user_mentions'];
        for ($i=0; $i < sizeof($mentions); $i++) {

            $texte = str_replace('@' . $mentions[$i]['screen_name'], '<a class="tag" href="https://twitter.com/' . $mentions[$i]['screen_name'] . '">' . '@' . $mentions[$i]['screen_name'] . '</a>', $texte);

        }


        $tags = $entities['hashtags'];
        for ($i=0; $i < sizeof($tags); $i++) {

            $texte = str_replace('#' . $tags[$i]['text'], '<a class="tag" href="https://twitter.com/hashtag/' . $tags[$i]['text'] . '">' . '#' . $tags[$i]['text'] . '</a>', $texte);

        }


        $media = $entities['media'];
        for ($i=0; $i < sizeof($media); $i++) {

            $texte = str_replace($media[$i]['url'], '', $texte);
            $texte .= '<a target="_blank" class="media" href="' . $media[$i]['expanded_url'] . '"><img src="' . $media[$i]['media_url_https'] . '"/></a>';

        }


        $urls = $entities['urls'];
        for ($i=0; $i < sizeof($urls); $i++) {

            $texte = str_replace('>' . $urls[$i]['url'] . '<', '>' . $urls[$i]['display_url'] . '<', $texte);
            $texte = str_replace($urls[$i]['url'], $urls[$i]['expanded_url'], $texte);

        }

        $media = $entities['media'];
        for ($i=0; $i < sizeof($media); $i++) {


        }


        return $texte;

    }

    function twitter_video($a, $entities) {

        $ret = "";
        $urls = $entities['urls'];
        for ($i=0; $i < sizeof($urls); $i++) {

            if (preg_match("/(youtube\.com|youtu\.be|vimeo\.com)/", $urls[$i]['display_url'])) {

                $ret = $urls[$i]['expanded_url'];

            }

        }

        return $ret;

    }

    function filtre_rfc2iso($rfc) {
        $d = new DateTime($rfc);
        return $d->format('Y-m-d\TH:i:sO');

    }

    function video_id($url) {
        if (strpos($url,'vimeo.com') !== false) {
            return end(explode('.com/',$url));
        }
        else if (strpos($url,'dailymotion.com') !== false) {
            return reset(explode('_',end(explode('/video/',$url))));
        }
        else if (strpos($url,'youtube.com') !== false) {
            return  end(explode('?v=',$url));
        }
        else if (strpos($url,'youtu.be') !== false) {
            return end(explode('.be/',$url));
        }
        else {
            return false;
        }
    }

    // bandcamp album id retreiver
    function bandcamp_album_id($url) {

        $content = file_get_contents($url, false, null, -1);

        if (preg_match('/<!-- album id ([0-9]*) -->/UimsS', $content, $match)) {

            if (isset($match[1])) {
                return $match[1];
            } else {
                return false;
            }

        } else {

            return false;

        }

    }

    require "api_keys.php";


    function balise_VIMEO_PROXY_KEY($p) {
        $p->code = $GLOBALS['vimeo_proxy_key'];
        return $p;
    }
    function balise_YOUTUBE_API_KEY($p) {
        $p->code = $GLOBALS['youtube_api_key'];
        return $p;
    }
    function balise_SOUNDCLOUD_API_KEY($p) {
        $p->code = 'nocrash_' . $GLOBALS['soundcloud_api_key'];
        return $p;
    }

?>
