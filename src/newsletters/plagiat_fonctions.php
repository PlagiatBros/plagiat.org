<?php

require 'inlinestyle/autoload.php';
use \InlineStyle\InlineStyle;
libxml_use_internal_errors(true);

	function inline($texte) {

		$texte = preg_replace('/__(.*)__/','<span class="small">$1</span>', $texte);
		$texte = preg_replace('/\^\^(.*)\^\^/','<span class="big">$1</span>', $texte);
		$texte = preg_replace('/====/',"<p> <br/> \n</p>", $texte);

		$htmldoc = new InlineStyle($texte);
		$htmldoc->applyStylesheet($htmldoc->extractStylesheets());
		$html = $htmldoc->getHTML();

		$html = str_replace('noscript','style',$html);

		return $html;
	}
?>
