/*
Used as a tagged template
ordinal`78` = '78th'
*/
export function ordinal(s) {
    const plural = new Intl.PluralRules(navigator.language,{type:'ordinal'});
    const v = parseInt([...s].join(''));
    return v+({'other':'th','one':'st','two':'nd','few':'rd'}[plural.select(v)]);
}

/*
    unit values: 
        bit, byte, 
        gigabit, gigabyte, 
        kilobit, kilobyte,
        megabit, megabyte,
        petabyte, 
        terabit, terabyte
    unitDisplay: short, long, narrow
*/
export function bytes(s,f,u) {
    return new Intl.NumberFormat(navigator.language, {style:'unit', unit: f||'byte', unitDisplay: u||'long'}).format([...s].join(''));   
}

export function abbrev(s) {
    return [...s].join('');
}

export function percent(s) {
    return new Intl.NumberFormat(navigator.language, {style:'percent'}).format([...s].join(''));
}

export function enotation(s) {
    return new Intl.NumberFormat(navigator.language, {notation:'scientific'}).format(parseFloat([...s].join('')));   
}

export function thousands(s) {
    return [...s].join('');
}