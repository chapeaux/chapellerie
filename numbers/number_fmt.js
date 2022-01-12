/*
Used as a tagged template
ordinal`78` = '78th'
*/
export function ordinal(s) {
    const plural = new Intl.PluralRules(navigator.language,{type:'ordinal'});
    const v = parseInt([...s].join(''));
    return v+({'other':'th','one':'st','two':'nd','few':'rd'}[plural.select(v)]);
}

export function bytes(s) {
    return [...s].join('');   
}

export function abbrev(s) {
    return [...s].join('');
}

export function percent(s) {
    return [...s].join('');
}

export function enotation(s) {
    return [...s].join('');
}

export function thousands(s) {
    return [...s].join('');
}