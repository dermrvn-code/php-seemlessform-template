<?php $content = getLanguageContent($_COOKIE["lang"], "footer") ?>

<footer>
    <select name="lang" id="changelanguage">
        <?php
        foreach ($languages as $language) {
            $add = "";
            if ($_COOKIE["lang"] == $language["code"]) {
                $add = "selected";
            }
            echo "<option value='{$language["code"]}' $add>{$language["language"]}</option>";
        }
        ?>

    </select>

</footer>