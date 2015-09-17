(function(gb,doc,indexOf) {
    var _atchesSelector = "atchesSelector",
        html = doc.documentElement,
        prefixes = [
            "webkitM",
            "mozM",
            "msM",
            "oM",
            "m"
        ],
        i = prefixes.length,
        _matchesSelector;

    // feature detect .matchesSelector
    while ( i-- ) {
        if ( ( prefixes[i] + _atchesSelector ) in html ) {
            _matchesSelector = prefixes[i] + _atchesSelector;
            break;
        }
    }
    gb.matchesSelector =
        // use .matchesSelector if available
        _matchesSelector ?
            function( elem, selector ) {
                return elem[ _matchesSelector ]( selector );
            } :
            // use qSA + indexOf, if possible
            indexOf ?
                function( elem, selector ) {
                    return indexOf.call(
                            // execute the query on the parentNode to reduce the NodeList
                            // doc.documentElement doesn't have a parent, though
                            ( elem.parentNode || doc ).querySelectorAll( selector ) || [],
                            elem
                        ) !== -1;
                } :
                // use qSA + a loop otherwise (IE8)
                function( elem, selector ) {
                    var nodeList = ( elem.parentNode || doc ).querySelectorAll( selector ) || [],
                        i = nodeList.length;

                    while ( i-- ) {
                        if ( nodeList[i] == elem ) { return true; }
                    }
                    return false;
                };
})(global,document,Array.prototype.indexOf);