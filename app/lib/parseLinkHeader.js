// parse a Link header
//
// Link:<https://example.org/.meta>; rel=meta
//
// var r = parseLinkHeader(xhr.getResponseHeader('Link');
// r['meta'] outputs https://example.org/.meta
//
const parseLinkHeader = (link) => {
    let linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
    let paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

    let matches = link.match(linkexp);
    let rels = {};
    for (let i = 0; i < matches.length; i++) {
        let split = matches[i].split('>');
        let href = split[0].substring(1);
        let ps = split[1];
        let s = ps.match(paramexp);
        for (let j = 0; j < s.length; j++) {
            let p = s[j];
            let paramsplit = p.split('=');
            let name = paramsplit[0];
            let rel = paramsplit[1].replace(/["']/g, '');
            rels[rel] = href;
        }
    }
    return rels;
}
export default parseLinkHeader